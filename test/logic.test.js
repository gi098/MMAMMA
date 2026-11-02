// Automated test suite for BookShelf business logic, validations, duplicate detection, and sorting
const assert = require('assert');

// 1. Validation Logic
const GENRE_OPTIONS = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];
const STATUS_OPTIONS = ['To Read', 'Reading', 'Finished'];

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

function validateBookForm(formData) {
  const errors = {};
  const titleTrimmed = (formData.title || '').trim();
  if (!titleTrimmed) {
    errors.title = 'Title is required';
  } else if (formData.title.length > 100) {
    errors.title = 'Title must be at most 100 characters';
  }

  const authorTrimmed = (formData.author || '').trim();
  if (!authorTrimmed) {
    errors.author = 'Author is required';
  } else if (formData.author.length > 60) {
    errors.author = 'Author must be at most 60 characters';
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

// 2. Duplicate Detection
function normalizeString(str) {
  return (str || '').trim().toLowerCase();
}

function isDuplicateBook(books, title, author, excludeBookId) {
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

// 3. Sorting
function sortBooks(books) {
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

// --- RUN TESTS ---

console.log('--- TEST 1: Register Form Validations ---');
assert.strictEqual(validateRegisterForm('', '123456', '123456').errors.email, 'Email is required');
assert.strictEqual(validateRegisterForm('invalid-email', '123456', '123456').errors.email, 'Please enter a valid email address');
assert.strictEqual(validateRegisterForm('test@example.com', '', '').errors.password, 'Password is required');
assert.strictEqual(validateRegisterForm('test@example.com', '12345', '12345').errors.password, 'Password must be at least 6 characters');
assert.strictEqual(validateRegisterForm('test@example.com', '123456', '').errors.confirmPassword, 'Confirm password is required');
assert.strictEqual(validateRegisterForm('test@example.com', '123456', '654321').errors.confirmPassword, 'Passwords do not match');
assert.strictEqual(validateRegisterForm('test@example.com', '123456', '123456').isValid, true);
console.log('✅ Passed Register Form Validations');

console.log('--- TEST 2: Book Form Validations ---');
// Title
assert.strictEqual(validateBookForm({ title: '', author: 'Author', genre: 'Fiction', status: 'To Read' }).errors.title, 'Title is required');
assert.strictEqual(validateBookForm({ title: '   ', author: 'Author', genre: 'Fiction', status: 'To Read' }).errors.title, 'Title is required');
assert.strictEqual(validateBookForm({ title: 'a'.repeat(101), author: 'Author', genre: 'Fiction', status: 'To Read' }).errors.title, 'Title must be at most 100 characters');

// Author
assert.strictEqual(validateBookForm({ title: 'Title', author: '', genre: 'Fiction', status: 'To Read' }).errors.author, 'Author is required');
assert.strictEqual(validateBookForm({ title: 'Title', author: '   ', genre: 'Fiction', status: 'To Read' }).errors.author, 'Author is required');
assert.strictEqual(validateBookForm({ title: 'Title', author: 'b'.repeat(61), genre: 'Fiction', status: 'To Read' }).errors.author, 'Author must be at most 60 characters');

// Genre
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: '', status: 'To Read' }).errors.genre, 'Please choose a genre');
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'InvalidGenre', status: 'To Read' }).errors.genre, 'Please choose a genre');

// Status
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: '' }).errors.status, 'Please choose a status');
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'InvalidStatus' }).errors.status, 'Please choose a status');

// Rating
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', rating: '6' }).errors.rating, 'Rating must be a whole number from 0 to 5');
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', rating: '-1' }).errors.rating, 'Rating must be a whole number from 0 to 5');
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', rating: '3.5' }).errors.rating, 'Rating must be a whole number from 0 to 5');
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', rating: 'abc' }).errors.rating, 'Rating must be a whole number from 0 to 5');
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', rating: '0' }).isValid, true);
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', rating: '5' }).isValid, true);
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', rating: '' }).isValid, true);

// Notes
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', notes: 'n'.repeat(301) }).errors.notes, 'Notes must be at most 300 characters');
assert.strictEqual(validateBookForm({ title: 'Title', author: 'Author', genre: 'Fiction', status: 'To Read', notes: 'n'.repeat(300) }).isValid, true);
console.log('✅ Passed Book Form Validations');

console.log('--- TEST 3: Duplicate Book Detection ---');
const existingBooks = [
  { id: '1', title: 'Clean Code', author: 'Robert C. Martin' },
  { id: '2', title: 'Design Patterns', author: 'Gang of Four' },
];

// Exact match
assert.strictEqual(isDuplicateBook(existingBooks, 'Clean Code', 'Robert C. Martin'), true);
// Case-insensitive & trimmed match
assert.strictEqual(isDuplicateBook(existingBooks, '  clean code  ', '  robert c. martin  '), true);
assert.strictEqual(isDuplicateBook(existingBooks, 'CLEAN CODE', 'ROBERT C. MARTIN'), true);
// Same title different author -> allowed
assert.strictEqual(isDuplicateBook(existingBooks, 'Clean Code', 'Another Author'), false);
// Same author different title -> allowed
assert.strictEqual(isDuplicateBook(existingBooks, 'Clean Architecture', 'Robert C. Martin'), false);
// When editing the same book (excludeBookId) -> allowed
assert.strictEqual(isDuplicateBook(existingBooks, 'Clean Code', 'Robert C. Martin', '1'), false);
console.log('✅ Passed Duplicate Book Detection');

console.log('--- TEST 4: Sorting by Title, then Author ---');
const unsorted = [
  { id: '1', title: 'The Hobbit', author: 'J.R.R. Tolkien' },
  { id: '2', title: 'Animal Farm', author: 'George Orwell' },
  { id: '3', title: 'dune', author: 'Frank Herbert' }, // lowercase 'd'
  { id: '4', title: 'Animal Farm', author: 'Arthur Smith' }, // Same title, earlier author
  { id: '5', title: '1984', author: 'George Orwell' },
];

const sorted = sortBooks(unsorted);
const sortedTitlesAndAuthors = sorted.map(b => `${b.title} by ${b.author}`);

console.log('Sorted output:', sortedTitlesAndAuthors);
assert.strictEqual(sorted[0].title, '1984');
assert.strictEqual(sorted[1].title, 'Animal Farm');
assert.strictEqual(sorted[1].author, 'Arthur Smith');
assert.strictEqual(sorted[2].title, 'Animal Farm');
assert.strictEqual(sorted[2].author, 'George Orwell');
assert.strictEqual(sorted[3].title, 'dune');
assert.strictEqual(sorted[4].title, 'The Hobbit');
console.log('✅ Passed Sorting Alphabetically & Case-Insensitive');

console.log('--- TEST 5: Status Breakdown Ordering ---');
const booksSample = [
  { status: 'Reading' },
  { status: 'Reading' },
  { status: 'To Read' },
  { status: 'Finished' },
  { status: 'Finished' },
];

const toReadCount = booksSample.filter(b => b.status === 'To Read').length; // 1
const readingCount = booksSample.filter(b => b.status === 'Reading').length; // 2
const finishedCount = booksSample.filter(b => b.status === 'Finished').length; // 2

const baseStatusCounts = [
  { status: 'To Read', count: toReadCount },
  { status: 'Reading', count: readingCount },
  { status: 'Finished', count: finishedCount },
];

const priority = { 'To Read': 1, 'Reading': 2, 'Finished': 3 };
const sortedStatusCounts = [...baseStatusCounts].sort((a, b) => {
  if (b.count !== a.count) return b.count - a.count;
  return priority[a.status] - priority[b.status];
});

console.log('Status breakdown:', sortedStatusCounts);
assert.strictEqual(sortedStatusCounts[0].status, 'Reading'); // 2
assert.strictEqual(sortedStatusCounts[1].status, 'Finished'); // 2 (tie-breaker: Reading before Finished)
assert.strictEqual(sortedStatusCounts[2].status, 'To Read'); // 1
console.log('✅ Passed Status Breakdown Priority Ordering');

console.log('\n🎉 ALL LOGIC AND VALIDATION TESTS PASSED PERFECTLY!');

