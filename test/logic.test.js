// Automated test suite for CineList business logic, validations, duplicate detection, and sorting
const assert = require('assert');

// 1. Validation Logic
const GENRE_OPTIONS = [
  'Action',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Animation',
  'Romance',
  'Documentary',
  'Other',
];
const STATUS_OPTIONS = ['To Watch', 'Watching', 'Finished'];

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test((email || '').trim());
}

function validateRegisterForm(email, password, confirmPassword) {
  const errors = {};
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

  const keys = Object.keys(errors);
  return {
    isValid: keys.length === 0,
    errors,
    firstError: keys.length > 0 ? errors[keys[0]] : null,
  };
}

function validateLoginForm(email, password) {
  const errors = {};
  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  const keys = Object.keys(errors);
  return {
    isValid: keys.length === 0,
    errors,
    firstError: keys.length > 0 ? errors[keys[0]] : null,
  };
}

function validateMovieForm(formData) {
  const errors = {};
  const titleTrimmed = (formData.title || '').trim();
  if (!titleTrimmed) {
    errors.title = 'Title is required';
  } else if (formData.title.length > 100) {
    errors.title = 'Title must be at most 100 characters';
  }

  const directorTrimmed = (formData.director || '').trim();
  if (!directorTrimmed) {
    errors.director = 'Director is required';
  } else if (formData.director.length > 60) {
    errors.director = 'Director must be at most 60 characters';
  }

  if (!formData.genre || !GENRE_OPTIONS.includes(formData.genre)) {
    errors.genre = 'Please choose a genre';
  }

  if (!formData.status || !STATUS_OPTIONS.includes(formData.status)) {
    errors.status = 'Please choose a status';
  }

  const ratingTrimmed = (formData.rating || '').toString().trim();
  if (ratingTrimmed !== '') {
    const isWholeNumber = /^(0|[1-5])$/.test(ratingTrimmed);
    if (!isWholeNumber) {
      errors.rating = 'Rating must be a whole number from 0 to 5';
    }
  }

  if (formData.notes && formData.notes.length > 300) {
    errors.notes = 'Notes must be at most 300 characters';
  }

  const keys = Object.keys(errors);
  return {
    isValid: keys.length === 0,
    errors,
    firstError: keys.length > 0 ? errors[keys[0]] : null,
  };
}

function isDuplicateMovie(movies, title, director, excludeMovieId) {
  const targetTitle = (title || '').trim().toLowerCase();
  const targetDirector = (director || '').trim().toLowerCase();
  return movies.some((m) => {
    if (excludeMovieId && m.id === excludeMovieId) return false;
    return (
      (m.title || '').trim().toLowerCase() === targetTitle &&
      (m.director || '').trim().toLowerCase() === targetDirector
    );
  });
}

function sortMovies(movies) {
  return [...movies].sort((a, b) =>
    (a.title || '').trim().localeCompare((b.title || '').trim(), undefined, {
      sensitivity: 'base',
    })
  );
}

// ----------------- TEST RUNNER -----------------
let passedCount = 0;
let failedCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
    failedCount++;
  }
}

console.log('--- RUNNING CINELIST TEST SUITE ---');

// Authentication validations
console.log('\n[1] Auth Validation Tests');
runTest('Register: missing email', () => {
  const r = validateRegisterForm('', '123456', '123456');
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.email, 'Email is required');
});

runTest('Register: invalid email format', () => {
  const r = validateRegisterForm('invalid-email', '123456', '123456');
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.email, 'Please enter a valid email address');
});

runTest('Register: missing password', () => {
  const r = validateRegisterForm('user@example.com', '', '');
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.password, 'Password is required');
});

runTest('Register: password shorter than 6 characters', () => {
  const r = validateRegisterForm('user@example.com', '12345', '12345');
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.password, 'Password must be at least 6 characters');
});

runTest('Register: missing confirm password', () => {
  const r = validateRegisterForm('user@example.com', '123456', '');
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.confirmPassword, 'Confirm password is required');
});

runTest('Register: password mismatch', () => {
  const r = validateRegisterForm('user@example.com', '123456', '654321');
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.confirmPassword, 'Passwords do not match');
});

runTest('Register: valid data', () => {
  const r = validateRegisterForm('test@cinelist.app', 'Secret123', 'Secret123');
  assert.strictEqual(r.isValid, true);
});

runTest('Login: empty password', () => {
  const r = validateLoginForm('test@cinelist.app', '');
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.password, 'Password is required');
});

// Movie Form validations
console.log('\n[2] Movie Form Validation Tests');
runTest('Movie: empty title', () => {
  const r = validateMovieForm({
    title: '   ',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    status: 'Finished',
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.title, 'Title is required');
});

runTest('Movie: title > 100 chars', () => {
  const r = validateMovieForm({
    title: 'A'.repeat(101),
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    status: 'Finished',
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.title, 'Title must be at most 100 characters');
});

runTest('Movie: empty director', () => {
  const r = validateMovieForm({
    title: 'Inception',
    director: '   ',
    genre: 'Sci-Fi',
    status: 'Finished',
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.director, 'Director is required');
});

runTest('Movie: director > 60 chars', () => {
  const r = validateMovieForm({
    title: 'Inception',
    director: 'A'.repeat(61),
    genre: 'Sci-Fi',
    status: 'Finished',
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.director, 'Director must be at most 60 characters');
});

runTest('Movie: missing genre', () => {
  const r = validateMovieForm({
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: '',
    status: 'Finished',
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.genre, 'Please choose a genre');
});

runTest('Movie: missing status', () => {
  const r = validateMovieForm({
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    status: '',
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.status, 'Please choose a status');
});

runTest('Movie: invalid rating (not 0..5)', () => {
  const r = validateMovieForm({
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    status: 'Finished',
    rating: '6',
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.rating, 'Rating must be a whole number from 0 to 5');
});

runTest('Movie: non-integer rating', () => {
  const r = validateMovieForm({
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    status: 'Finished',
    rating: '4.5',
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.rating, 'Rating must be a whole number from 0 to 5');
});

runTest('Movie: notes > 300 chars', () => {
  const r = validateMovieForm({
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    status: 'Finished',
    rating: '5',
    notes: 'A'.repeat(301),
  });
  assert.strictEqual(r.isValid, false);
  assert.strictEqual(r.errors.notes, 'Notes must be at most 300 characters');
});

runTest('Movie: valid movie form', () => {
  const r = validateMovieForm({
    title: 'Oppenheimer',
    director: 'Christopher Nolan',
    genre: 'Drama',
    status: 'Finished',
    rating: '5',
    notes: 'Masterpiece biopic',
  });
  assert.strictEqual(r.isValid, true);
});

// Duplicate Detection & Sorting
console.log('\n[3] Duplicate & Sort Tests');
runTest('Duplicate: detect same title and director (case insensitive)', () => {
  const list = [
    { id: '1', title: 'Inception', director: 'Christopher Nolan' },
    { id: '2', title: 'Interstellar', director: 'Christopher Nolan' },
  ];
  assert.strictEqual(isDuplicateMovie(list, '  inception  ', 'christopher nolan'), true);
  assert.strictEqual(isDuplicateMovie(list, 'Tenet', 'Christopher Nolan'), false);
  assert.strictEqual(isDuplicateMovie(list, 'Inception', 'Other Director'), false);
});

runTest('Duplicate: exclude own movie ID when updating', () => {
  const list = [
    { id: '1', title: 'Inception', director: 'Christopher Nolan' },
    { id: '2', title: 'Interstellar', director: 'Christopher Nolan' },
  ];
  assert.strictEqual(isDuplicateMovie(list, 'Inception', 'Christopher Nolan', '1'), false);
  assert.strictEqual(isDuplicateMovie(list, 'Interstellar', 'Christopher Nolan', '1'), true);
});

runTest('Alphabetical Sorting by Title', () => {
  const list = [
    { title: 'Zootopia' },
    { title: 'Avatar' },
    { title: 'inception' },
    { title: 'Interstellar' },
  ];
  const sorted = sortMovies(list);
  assert.strictEqual(sorted[0].title, 'Avatar');
  assert.strictEqual(sorted[1].title, 'inception');
  assert.strictEqual(sorted[2].title, 'Interstellar');
  assert.strictEqual(sorted[3].title, 'Zootopia');
});

console.log(`\nResults: ${passedCount} passed, ${failedCount} failed.`);
if (failedCount > 0) process.exit(1);
