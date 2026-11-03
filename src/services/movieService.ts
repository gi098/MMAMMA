import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Movie, MovieFormData, Genre, Status } from '../types';

export function normalizeString(str: string): string {
  return (str || '').trim().toLowerCase();
}

/**
 * Deterministically generates a unique document ID for a movie based on userId, title, and director.
 * Guarantees no two movies with identical (case-insensitive) title + director can exist for the same user,
 * even with concurrent requests.
 */
export function generateMovieId(userId: string, title: string, director: string): string {
  const normTitle = normalizeString(title);
  const normDirector = normalizeString(director);
  const combined = `${normTitle}:::${normDirector}`;

  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash) + combined.charCodeAt(i);
    hash |= 0;
  }

  const safePrefix = `${normTitle.replace(/[^a-z0-9]/g, '_').slice(0, 20)}_${normDirector.replace(/[^a-z0-9]/g, '_').slice(0, 15)}`;
  const hashHex = (hash >>> 0).toString(16);

  return `${userId}_${safePrefix}_${hashHex}`;
}

/**
 * Sorts movies alphabetically by Title (case-insensitive).
 * If Titles match, sorts alphabetically by Director (case-insensitive).
 */
export function sortMovies(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => {
    const titleComparison = a.title.localeCompare(b.title, undefined, {
      sensitivity: 'base',
      numeric: true,
    });
    if (titleComparison !== 0) {
      return titleComparison;
    }
    return a.director.localeCompare(b.director, undefined, {
      sensitivity: 'base',
      numeric: true,
    });
  });
}

/**
 * Checks if a movie with the same title and director already exists for this user.
 */
export function isDuplicateMovie(
  movies: Movie[],
  title: string,
  director: string,
  excludeMovieId?: string
): boolean {
  const normTitle = normalizeString(title);
  const normDirector = normalizeString(director);

  return movies.some((m) => {
    if (excludeMovieId && m.id === excludeMovieId) return false;
    return (
      normalizeString(m.title) === normTitle &&
      normalizeString(m.director) === normDirector
    );
  });
}

/**
 * Subscribes to real-time updates for movies owned by current user.
 */
export function subscribeUserMovies(
  userId: string,
  onUpdate: (movies: Movie[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    return () => {};
  }

  const q = query(collection(db, 'movies'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const movies: Movie[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        movies.push({
          id: docSnap.id,
          userId: data.userId,
          title: data.title,
          director: data.director,
          genre: data.genre as Genre,
          status: data.status as Status,
          rating: data.rating !== undefined ? data.rating : null,
          favorite: Boolean(data.favorite),
          notes: data.notes || '',
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      onUpdate(sortMovies(movies));
    },
    (err) => {
      onError(err);
    }
  );
}

/**
 * Adds a new movie to Firestore.
 */
export async function addMovie(
  userId: string,
  formData: MovieFormData,
  existingMovies: Movie[] = []
): Promise<Movie> {
  const title = formData.title.trim();
  const director = formData.director.trim();

  // In-memory duplicate check
  if (isDuplicateMovie(existingMovies, title, director)) {
    throw new Error('A movie with this title and director already exists in your list.');
  }

  const movieId = generateMovieId(userId, title, director);

  const ratingVal =
    formData.rating && formData.rating.trim() !== ''
      ? parseInt(formData.rating.trim(), 10)
      : null;

  const newMovie: Movie = {
    id: movieId,
    userId,
    title,
    director,
    genre: formData.genre as Genre,
    status: formData.status as Status,
    rating: ratingVal,
    favorite: false,
    notes: (formData.notes || '').trim(),
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured()) {
    const movieDocRef = doc(db, 'movies', movieId);
    const existingDoc = await getDoc(movieDocRef);
    if (existingDoc.exists()) {
      throw new Error('A movie with this title and director already exists in your list.');
    }
    await setDoc(movieDocRef, newMovie);
  }

  return newMovie;
}

/**
 * Updates an existing movie in Firestore.
 */
export async function updateMovie(
  userId: string,
  currentMovie: Movie,
  formData: MovieFormData,
  existingMovies: Movie[] = []
): Promise<Movie> {
  const title = formData.title.trim();
  const director = formData.director.trim();

  // Check duplicate excluding current movie
  if (isDuplicateMovie(existingMovies, title, director, currentMovie.id)) {
    throw new Error('A movie with this title and director already exists in your list.');
  }

  const ratingVal =
    formData.rating && formData.rating.trim() !== ''
      ? parseInt(formData.rating.trim(), 10)
      : null;

  const newMovieId = generateMovieId(userId, title, director);
  const isKeyChanged = newMovieId !== currentMovie.id;

  const updatedMovie: Movie = {
    ...currentMovie,
    id: newMovieId,
    title,
    director,
    genre: formData.genre as Genre,
    status: formData.status as Status,
    rating: ratingVal,
    notes: (formData.notes || '').trim(),
  };

  if (isFirebaseConfigured()) {
    if (isKeyChanged) {
      const newDocRef = doc(db, 'movies', newMovieId);
      const existingDoc = await getDoc(newDocRef);
      if (existingDoc.exists()) {
        throw new Error('A movie with this title and director already exists in your list.');
      }
      await setDoc(newDocRef, updatedMovie);
      await deleteDoc(doc(db, 'movies', currentMovie.id));
    } else {
      const movieDocRef = doc(db, 'movies', currentMovie.id);
      await updateDoc(movieDocRef, {
        title: updatedMovie.title,
        director: updatedMovie.director,
        genre: updatedMovie.genre,
        status: updatedMovie.status,
        rating: updatedMovie.rating,
        notes: updatedMovie.notes,
      });
    }
  }

  return updatedMovie;
}

/**
 * Toggles the favorite status of a movie.
 */
export async function toggleFavorite(movie: Movie): Promise<boolean> {
  const newFavorite = !movie.favorite;
  if (isFirebaseConfigured()) {
    const movieDocRef = doc(db, 'movies', movie.id);
    await updateDoc(movieDocRef, { favorite: newFavorite });
  }
  return newFavorite;
}

/**
 * Deletes a movie from Firestore.
 */
export async function deleteMovie(movieId: string): Promise<void> {
  if (isFirebaseConfigured()) {
    const movieDocRef = doc(db, 'movies', movieId);
    await deleteDoc(movieDocRef);
  }
}
