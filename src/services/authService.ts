import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  AuthError,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export function formatAuthError(error: unknown): string {
  if (!error) return 'An unknown error occurred';
  const err = error as AuthError;
  const code = err.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    default:
      return err.message || 'Authentication failed. Please try again.';
  }
}

export async function registerWithFirebase(
  email: string,
  pass: string,
  displayName?: string
): Promise<AuthResponse> {
  if (!isFirebaseConfigured()) {
    return {
      user: null,
      error: 'Firebase is not configured. Please provide Firebase credentials in .env',
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName && displayName.trim()) {
      try {
        await updateProfile(userCredential.user, { displayName: displayName.trim() });
      } catch (profileErr) {
        // Non-blocking if profile update fails
      }
    }
    // Sign out immediately so registration does not auto-login.
    // This allows the user to see "Registration successful" and log in via Login screen.
    await signOut(auth);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: formatAuthError(error) };
  }
}

export async function loginWithFirebase(
  email: string,
  pass: string
): Promise<AuthResponse> {
  if (!isFirebaseConfigured()) {
    return {
      user: null,
      error: 'Firebase is not configured. Please provide Firebase credentials in .env',
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: formatAuthError(error) };
  }
}

export async function logoutFromFirebase(): Promise<{ success: boolean; error: string | null }> {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: formatAuthError(error) };
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

