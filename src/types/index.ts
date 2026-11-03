export type Genre =
  | 'Action'
  | 'Comedy'
  | 'Drama'
  | 'Sci-Fi'
  | 'Animation'
  | 'Romance'
  | 'Documentary'
  | 'Other';

export type Status = 'To Watch' | 'Watching' | 'Finished';

export const GENRE_OPTIONS: Genre[] = [
  'Action',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Animation',
  'Romance',
  'Documentary',
  'Other',
];

export const STATUS_OPTIONS: Status[] = ['To Watch', 'Watching', 'Finished'];

export interface Movie {
  id: string;
  userId: string;
  title: string;
  director: string;
  genre: Genre;
  status: Status;
  rating: number | null;
  favorite: boolean;
  notes: string;
  createdAt: string | number;
}

export interface MovieFormData {
  title: string;
  director: string;
  genre: Genre | '';
  status: Status | '';
  rating: string;
  notes: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export type GenreFilter = 'All' | Genre;
export type StatusFilter = 'All' | Status;

export interface MovieFilters {
  genre: GenreFilter;
  status: StatusFilter;
  favoritesOnly: boolean;
  search: string;
}

export interface StatusCountItem {
  status: Status;
  count: number;
}

export interface MovieSummary {
  movieCount: number;
  favoriteCount: number;
  statusCounts: StatusCountItem[];
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  List: undefined;
  Detail: { movieId: string };
};
