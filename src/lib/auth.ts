
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type AuthError,
} from 'firebase/auth';
import { auth } from './firebase';

export { createUser, signIn, signOut };

async function createUser(email: string, password: string): Promise<{ uid: string } | { error: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { uid: userCredential.user.uid };
  } catch (error) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
}

async function signIn(email: string, password: string): Promise<{ uid: string } | { error: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { uid: userCredential.user.uid };
  } catch (error) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
}

async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
