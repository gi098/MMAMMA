import { MovieFormData, Genre, Status, GENRE_OPTIONS, STATUS_OPTIONS } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError: string | null;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test((email || '').trim());
}

export function validateRegisterForm(
  email: string,
  password: string,
  confirmPassword: string,
  _displayName?: string
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  const errorKeys = Object.keys(errors);
  return {
    isValid: errorKeys.length === 0,
    errors,
    firstError: errorKeys.length > 0 ? errors[errorKeys[0]] : null,
  };
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  const errorKeys = Object.keys(errors);
  return {
    isValid: errorKeys.length === 0,
    errors,
    firstError: errorKeys.length > 0 ? errors[errorKeys[0]] : null,
  };
}

export function validateMovieForm(formData: MovieFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Title validation
  const titleTrimmed = (formData.title || '').trim();
  if (!titleTrimmed) {
    errors.title = 'Title is required';
  } else if (formData.title.length > 100) {
    errors.title = 'Title must be at most 100 characters';
  }

  // Director validation
  const directorTrimmed = (formData.director || '').trim();
  if (!directorTrimmed) {
    errors.director = 'Director is required';
  } else if (formData.director.length > 60) {
    errors.director = 'Director must be at most 60 characters';
  }

  // Genre validation
  if (!formData.genre || !GENRE_OPTIONS.includes(formData.genre as Genre)) {
    errors.genre = 'Please choose a genre';
  }

  // Status validation
  if (!formData.status || !STATUS_OPTIONS.includes(formData.status as Status)) {
    errors.status = 'Please choose a status';
  }

  // Rating validation (optional)
  const ratingTrimmed = (formData.rating || '').toString().trim();
  if (ratingTrimmed !== '') {
    const isWholeNumber = /^(0|[1-5])$/.test(ratingTrimmed);
    if (!isWholeNumber) {
      errors.rating = 'Rating must be a whole number from 0 to 5';
    }
  }

  // Notes validation (optional)
  if (formData.notes && formData.notes.length > 300) {
    errors.notes = 'Notes must be at most 300 characters';
  }

  const errorKeys = Object.keys(errors);
  return {
    isValid: errorKeys.length === 0,
    errors,
    firstError: errorKeys.length > 0 ? errors[errorKeys[0]] : null,
  };
}
