export type Genre = 'Fiction' | 'Non-Fiction' | 'Academic' | 'Other';

export type Status = 'To Read' | 'Reading' | 'Finished';

export const GENRE_OPTIONS: Genre[] = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];

export const STATUS_OPTIONS: Status[] = ['To Read', 'Reading', 'Finished'];

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  genre: Genre;
  status: Status;
  rating: number | null;
  favorite: boolean;
  notes: string;
  createdAt: string | number;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: Genre | '';
  status: Status | '';
  rating: string;
  notes: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
}

export type GenreFilter = 'All' | Genre;
export type StatusFilter = 'All' | Status;

export interface BookFilters {
  genre: GenreFilter;
  status: StatusFilter;
  favoritesOnly: boolean;
  search: string;
}

export interface StatusCountItem {
  status: Status;
  count: number;
}

export interface BookSummary {
  bookCount: number;
  favoriteCount: number;
  statusCounts: StatusCountItem[];
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  List: undefined;
  Detail: { bookId: string };
};
