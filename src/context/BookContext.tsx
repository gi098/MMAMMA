import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  Book,
  BookFormData,
  BookFilters,
  BookSummary,
  Status,
  StatusCountItem,
} from '../types';
import {
  subscribeUserBooks,
  addBook as apiAddBook,
  updateBook as apiUpdateBook,
  deleteBook as apiDeleteBook,
  toggleFavorite as apiToggleFavorite,
  sortBooks,
} from '../services/bookService';
import { useAuth } from './AuthContext';

interface BookContextType {
  books: Book[];
  filteredBooks: Book[];
  filters: BookFilters;
  summary: BookSummary;
  loading: boolean;
  bookError: string | null;
  bookSuccess: string | null;
  setGenreFilter: (genre: BookFilters['genre']) => void;
  setStatusFilter: (status: BookFilters['status']) => void;
  setFavoritesOnly: (favOnly: boolean) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  addBook: (formData: BookFormData) => Promise<{ success: boolean; error: string | null }>;
  updateBook: (bookId: string, formData: BookFormData) => Promise<{ success: boolean; error: string | null }>;
  deleteBook: (bookId: string) => Promise<{ success: boolean; error: string | null }>;
  toggleFavorite: (bookId: string) => Promise<void>;
  clearMessages: () => void;
  getBookById: (bookId: string) => Book | undefined;
}

const initialFilters: BookFilters = {
  genre: 'All',
  status: 'All',
  favoritesOnly: false,
  search: '',
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<BookFilters>(initialFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookSuccess, setBookSuccess] = useState<string | null>(null);

  // Clear books when currentUser logs out or changes
  useEffect(() => {
    if (!currentUser) {
      setBooks([]);
      setFilters(initialFilters);
      setBookError(null);
      setBookSuccess(null);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserBooks(
      currentUser.uid,
      (updatedBooks) => {
        setBooks(sortBooks(updatedBooks));
        setLoading(false);
      },
      (err) => {
        setBookError(err.message || 'Failed to sync books from Firestore');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // 1. Genre filter
    if (filters.genre !== 'All') {
      result = result.filter((b) => b.genre === filters.genre);
    }

    // 2. Status filter
    if (filters.status !== 'All') {
      result = result.filter((b) => b.status === filters.status);
    }

    // 3. Favorites only switch
    if (filters.favoritesOnly) {
      result = result.filter((b) => b.favorite);
    }

    // 4. Search box (searches Title or Author, case-insensitive, trimmed)
    const trimmedQuery = filters.search.trim().toLowerCase();
    if (trimmedQuery.length > 0) {
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(trimmedQuery) ||
          b.author.toLowerCase().includes(trimmedQuery)
      );
    }

    return sortBooks(result);
  }, [books, filters]);

  // Summary statistics
  const summary: BookSummary = useMemo(() => {
    const bookCount = filteredBooks.length;
    const favoriteCount = filteredBooks.filter((b) => b.favorite).length;

    const toReadCount = filteredBooks.filter((b) => b.status === 'To Read').length;
    const readingCount = filteredBooks.filter((b) => b.status === 'Reading').length;
    const finishedCount = filteredBooks.filter((b) => b.status === 'Finished').length;

    const baseStatusCounts: StatusCountItem[] = [
      { status: 'To Read', count: toReadCount },
      { status: 'Reading', count: readingCount },
      { status: 'Finished', count: finishedCount },
    ];

    const statusPriority: Record<Status, number> = {
      'To Read': 1,
      'Reading': 2,
      'Finished': 3,
    };

    // Sorted by count descending; if counts are equal, keep natural order: 1. To Read, 2. Reading, 3. Finished
    const sortedStatusCounts = [...baseStatusCounts].sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return statusPriority[a.status] - statusPriority[b.status];
    });

    return {
      bookCount,
      favoriteCount,
      statusCounts: sortedStatusCounts,
    };
  }, [filteredBooks]);

  const clearMessages = () => {
    setBookError(null);
    setBookSuccess(null);
  };

  const setGenreFilter = (genre: BookFilters['genre']) => {
    setFilters((prev) => ({ ...prev, genre }));
  };

  const setStatusFilter = (status: BookFilters['status']) => {
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

  const getBookById = (bookId: string): Book | undefined => {
    return books.find((b) => b.id === bookId);
  };

  const addBook = async (
    formData: BookFormData
  ): Promise<{ success: boolean; error: string | null }> => {
    if (!currentUser) {
      const err = 'User is not authenticated';
      setBookError(err);
      return { success: false, error: err };
    }

    clearMessages();
    try {
      const newBook = await apiAddBook(currentUser.uid, formData, books);
      // Immediately update local state
      setBooks((prev) => {
        const next = [...prev.filter((b) => b.id !== newBook.id), newBook];
        return sortBooks(next);
      });
      setBookSuccess('Book added');
      return { success: true, error: null };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add book';
      setBookError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateBook = async (
    bookId: string,
    formData: BookFormData
  ): Promise<{ success: boolean; error: string | null }> => {
    if (!currentUser) {
      const err = 'User is not authenticated';
      setBookError(err);
      return { success: false, error: err };
    }

    const currentBook = books.find((b) => b.id === bookId);
    if (!currentBook) {
      const err = 'Book not found';
      setBookError(err);
      return { success: false, error: err };
    }

    clearMessages();
    try {
      const updated = await apiUpdateBook(currentUser.uid, currentBook, formData, books);
      // Immediately update local state
      setBooks((prev) => {
        const next = prev.map((b) => (b.id === currentBook.id ? updated : b));
        return sortBooks(next);
      });
      return { success: true, error: null };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update book';
      setBookError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const deleteBook = async (
    bookId: string
  ): Promise<{ success: boolean; error: string | null }> => {
    clearMessages();
    try {
      await apiDeleteBook(bookId);
      // Immediately update local state
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      return { success: true, error: null };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete book';
      setBookError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const toggleFavorite = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    // Immediately toggle locally for responsive UX
    const updatedFavorite = !book.favorite;
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, favorite: updatedFavorite } : b))
    );

    try {
      await apiToggleFavorite(book);
    } catch (err: any) {
      // Revert if API fails
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, favorite: book.favorite } : b))
      );
      setBookError(err.message || 'Failed to update favorite status');
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        filteredBooks,
        filters,
        summary,
        loading,
        bookError,
        bookSuccess,
        setGenreFilter,
        setStatusFilter,
        setFavoritesOnly,
        setSearchQuery,
        clearFilters,
        addBook,
        updateBook,
        deleteBook,
        toggleFavorite,
        clearMessages,
        getBookById,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

