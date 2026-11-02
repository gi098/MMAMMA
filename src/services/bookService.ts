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
import { Book, BookFormData, Genre, Status } from '../types';

export function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Deterministically generates a unique document ID for a book based on userId, title, and author.
 * Guarantees no two books with identical (case-insensitive) title + author can exist for the same user,
 * even with concurrent requests.
 */
export function generateBookId(userId: string, title: string, author: string): string {
  const normTitle = normalizeString(title);
  const normAuthor = normalizeString(author);
  const combined = `${normTitle}:::${normAuthor}`;

  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash) + combined.charCodeAt(i);
    hash |= 0;
  }

  const safePrefix = `${normTitle.replace(/[^a-z0-9]/g, '_').slice(0, 20)}_${normAuthor.replace(/[^a-z0-9]/g, '_').slice(0, 15)}`;
  const hashHex = (hash >>> 0).toString(16);

  return `${userId}_${safePrefix}_${hashHex}`;
}

/**
 * Sorts books alphabetically by Title (case-insensitive).
 * If Titles match, sorts alphabetically by Author (case-insensitive).
 */
export function sortBooks(books: Book[]): Book[] {
  return [...books].sort((a, b) => {
    const titleComparison = a.title.localeCompare(b.title, undefined, {
      sensitivity: 'base',
      numeric: true,
    });
    if (titleComparison !== 0) {
      return titleComparison;
    }
    return a.author.localeCompare(b.author, undefined, {
      sensitivity: 'base',
      numeric: true,
    });
  });
}

/**
 * Checks if a book with the same title and author already exists for this user.
 */
export function isDuplicateBook(
  books: Book[],
  title: string,
  author: string,
  excludeBookId?: string
): boolean {
  const normTitle = normalizeString(title);
  const normAuthor = normalizeString(author);

  return books.some((b) => {
    if (excludeBookId && b.id === excludeBookId) return false;
    return (
      normalizeString(b.title) === normTitle &&
      normalizeString(b.author) === normAuthor
    );
  });
}

/**
 * Subscribes to real-time updates for books owned by current user.
 */
export function subscribeUserBooks(
  userId: string,
  onUpdate: (books: Book[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    // If Firebase is not configured, return an empty no-op unsubscribe
    return () => {};
  }

  const q = query(collection(db, 'books'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const books: Book[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        books.push({
          id: docSnap.id,
          userId: data.userId,
          title: data.title,
          author: data.author,
          genre: data.genre as Genre,
          status: data.status as Status,
          rating: data.rating !== undefined ? data.rating : null,
          favorite: Boolean(data.favorite),
          notes: data.notes || '',
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      onUpdate(sortBooks(books));
    },
    (err) => {
      onError(err);
    }
  );
}

/**
 * Adds a new book to Firestore.
 */
export async function addBook(
  userId: string,
  formData: BookFormData,
  existingBooks: Book[] = []
): Promise<Book> {
  const title = formData.title.trim();
  const author = formData.author.trim();

  // In-memory duplicate check
  if (isDuplicateBook(existingBooks, title, author)) {
    throw new Error('A book with this title and author already exists in your bookshelf.');
  }

  const bookId = generateBookId(userId, title, author);

  const ratingVal =
    formData.rating && formData.rating.trim() !== ''
      ? parseInt(formData.rating.trim(), 10)
      : null;

  const newBook: Book = {
    id: bookId,
    userId,
    title,
    author,
    genre: formData.genre as Genre,
    status: formData.status as Status,
    rating: ratingVal,
    favorite: false,
    notes: (formData.notes || '').trim(),
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured()) {
    const bookDocRef = doc(db, 'books', bookId);
    const existingDoc = await getDoc(bookDocRef);
    if (existingDoc.exists()) {
      throw new Error('A book with this title and author already exists in your bookshelf.');
    }
    await setDoc(bookDocRef, newBook);
  }

  return newBook;
}

/**
 * Updates an existing book in Firestore.
 */
export async function updateBook(
  userId: string,
  currentBook: Book,
  formData: BookFormData,
  existingBooks: Book[] = []
): Promise<Book> {
  const title = formData.title.trim();
  const author = formData.author.trim();

  // Check duplicate excluding this book
  if (isDuplicateBook(existingBooks, title, author, currentBook.id)) {
    throw new Error('A book with this title and author already exists in your bookshelf.');
  }

  const ratingVal =
    formData.rating && formData.rating.trim() !== ''
      ? parseInt(formData.rating.trim(), 10)
      : null;

  const newBookId = generateBookId(userId, title, author);
  const isKeyChanged = newBookId !== currentBook.id;

  const updatedBook: Book = {
    ...currentBook,
    id: newBookId,
    title,
    author,
    genre: formData.genre as Genre,
    status: formData.status as Status,
    rating: ratingVal,
    notes: (formData.notes || '').trim(),
  };

  if (isFirebaseConfigured()) {
    if (isKeyChanged) {
      // If title or author changed, check if target doc already exists
      const newDocRef = doc(db, 'books', newBookId);
      const existingDoc = await getDoc(newDocRef);
      if (existingDoc.exists()) {
        throw new Error('A book with this title and author already exists in your bookshelf.');
      }
      // Create new document then delete old document
      await setDoc(newDocRef, updatedBook);
      await deleteDoc(doc(db, 'books', currentBook.id));
    } else {
      const bookDocRef = doc(db, 'books', currentBook.id);
      await updateDoc(bookDocRef, {
        title: updatedBook.title,
        author: updatedBook.author,
        genre: updatedBook.genre,
        status: updatedBook.status,
        rating: updatedBook.rating,
        notes: updatedBook.notes,
      });
    }
  }

  return updatedBook;
}

/**
 * Toggles the favorite status of a book.
 */
export async function toggleFavorite(book: Book): Promise<boolean> {
  const newFavorite = !book.favorite;
  if (isFirebaseConfigured()) {
    const bookDocRef = doc(db, 'books', book.id);
    await updateDoc(bookDocRef, { favorite: newFavorite });
  }
  return newFavorite;
}

/**
 * Deletes a book from Firestore.
 */
export async function deleteBook(bookId: string): Promise<void> {
  if (isFirebaseConfigured()) {
    const bookDocRef = doc(db, 'books', bookId);
    await deleteDoc(bookDocRef);
  }
}

