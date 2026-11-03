import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  Movie,
  MovieFormData,
  MovieFilters,
  MovieSummary,
  Status,
  StatusCountItem,
} from '../types';
import {
  subscribeUserMovies,
  addMovie as apiAddMovie,
  updateMovie as apiUpdateMovie,
  deleteMovie as apiDeleteMovie,
  toggleFavorite as apiToggleFavorite,
  sortMovies,
} from '../services/movieService';
import { useAuth } from './AuthContext';

interface MovieContextType {
  movies: Movie[];
  filteredMovies: Movie[];
  filters: MovieFilters;
  summary: MovieSummary;
  loading: boolean;
  movieError: string | null;
  movieSuccess: string | null;
  setGenreFilter: (genre: MovieFilters['genre']) => void;
  setStatusFilter: (status: MovieFilters['status']) => void;
  setFavoritesOnly: (favOnly: boolean) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  addMovie: (formData: MovieFormData) => Promise<{ success: boolean; error: string | null }>;
  updateMovie: (movieId: string, formData: MovieFormData) => Promise<{ success: boolean; error: string | null }>;
  deleteMovie: (movieId: string) => Promise<{ success: boolean; error: string | null }>;
  toggleFavorite: (movieId: string) => Promise<void>;
  clearMessages: () => void;
  getMovieById: (movieId: string) => Movie | undefined;
}

const initialFilters: MovieFilters = {
  genre: 'All',
  status: 'All',
  favoritesOnly: false,
  search: '',
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState<MovieFilters>(initialFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [movieError, setMovieError] = useState<string | null>(null);
  const [movieSuccess, setMovieSuccess] = useState<string | null>(null);

  // Clear movies when currentUser logs out or changes
  useEffect(() => {
    if (!currentUser) {
      setMovies([]);
      setFilters(initialFilters);
      setMovieError(null);
      setMovieSuccess(null);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserMovies(
      currentUser.uid,
      (updatedMovies) => {
        setMovies(sortMovies(updatedMovies));
        setLoading(false);
      },
      (err) => {
        setMovieError(err.message || 'Failed to sync movies from Firestore');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  // Filtered movies
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    // 1. Genre filter
    if (filters.genre !== 'All') {
      result = result.filter((m) => m.genre === filters.genre);
    }

    // 2. Status filter
    if (filters.status !== 'All') {
      result = result.filter((m) => m.status === filters.status);
    }

    // 3. Favorites only switch
    if (filters.favoritesOnly) {
      result = result.filter((m) => m.favorite);
    }

    // 4. Search box (searches Title or Director, case-insensitive, trimmed)
    const trimmedQuery = filters.search.trim().toLowerCase();
    if (trimmedQuery.length > 0) {
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(trimmedQuery) ||
          m.director.toLowerCase().includes(trimmedQuery)
      );
    }

    return sortMovies(result);
  }, [movies, filters]);

  // Summary statistics
  const summary: MovieSummary = useMemo(() => {
    const movieCount = filteredMovies.length;
    const favoriteCount = filteredMovies.filter((m) => m.favorite).length;

    const toWatchCount = filteredMovies.filter((m) => m.status === 'To Watch').length;
    const watchingCount = filteredMovies.filter((m) => m.status === 'Watching').length;
    const finishedCount = filteredMovies.filter((m) => m.status === 'Finished').length;

    const baseStatusCounts: StatusCountItem[] = [
      { status: 'To Watch', count: toWatchCount },
      { status: 'Watching', count: watchingCount },
      { status: 'Finished', count: finishedCount },
    ];

    const statusPriority: Record<Status, number> = {
      'To Watch': 1,
      'Watching': 2,
      'Finished': 3,
    };

    const sortedStatusCounts = [...baseStatusCounts].sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return statusPriority[a.status] - statusPriority[b.status];
    });

    return {
      movieCount,
      favoriteCount,
      statusCounts: sortedStatusCounts,
    };
  }, [filteredMovies]);

  const clearMessages = () => {
    setMovieError(null);
    setMovieSuccess(null);
  };

  const setGenreFilter = (genre: MovieFilters['genre']) => {
    setFilters((prev) => ({ ...prev, genre }));
  };

  const setStatusFilter = (status: MovieFilters['status']) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setFavoritesOnly = (favoritesOnly: boolean) => {
    setFilters((prev) => ({ ...prev, favoritesOnly }));
  };

  const setSearchQuery = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const getMovieById = (movieId: string): Movie | undefined => {
    return movies.find((m) => m.id === movieId);
  };

  const addMovie = async (
    formData: MovieFormData
  ): Promise<{ success: boolean; error: string | null }> => {
    if (!currentUser) {
      const err = 'User is not authenticated';
      setMovieError(err);
      return { success: false, error: err };
    }

    clearMessages();
    try {
      const newMovie = await apiAddMovie(currentUser.uid, formData, movies);
      setMovies((prev) => {
        const next = [...prev.filter((m) => m.id !== newMovie.id), newMovie];
        return sortMovies(next);
      });
      setMovieSuccess('Movie added');
      return { success: true, error: null };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add movie';
      setMovieError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateMovie = async (
    movieId: string,
    formData: MovieFormData
  ): Promise<{ success: boolean; error: string | null }> => {
    if (!currentUser) {
      const err = 'User is not authenticated';
      setMovieError(err);
      return { success: false, error: err };
    }

    const currentMovie = movies.find((m) => m.id === movieId);
    if (!currentMovie) {
      const err = 'Movie not found';
      setMovieError(err);
      return { success: false, error: err };
    }

    clearMessages();
    try {
      const updated = await apiUpdateMovie(currentUser.uid, currentMovie, formData, movies);
      setMovies((prev) => {
        const next = prev.map((m) => (m.id === currentMovie.id ? updated : m));
        return sortMovies(next);
      });
      return { success: true, error: null };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update movie';
      setMovieError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const deleteMovie = async (
    movieId: string
  ): Promise<{ success: boolean; error: string | null }> => {
    clearMessages();
    try {
      await apiDeleteMovie(movieId);
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
      return { success: true, error: null };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete movie';
      setMovieError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const toggleFavorite = async (movieId: string) => {
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) return;

    const updatedFavorite = !movie.favorite;
    setMovies((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, favorite: updatedFavorite } : m))
    );

    try {
      await apiToggleFavorite(movie);
    } catch (err: any) {
      // Revert if API fails
      setMovies((prev) =>
        prev.map((m) => (m.id === movieId ? { ...m, favorite: movie.favorite } : m))
      );
      setMovieError(err.message || 'Failed to update favorite status');
    }
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        filteredMovies,
        filters,
        summary,
        loading,
        movieError,
        movieSuccess,
        setGenreFilter,
        setStatusFilter,
        setFavoritesOnly,
        setSearchQuery,
        clearFilters,
        addMovie,
        updateMovie,
        deleteMovie,
        toggleFavorite,
        clearMessages,
        getMovieById,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = (): MovieContextType => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
