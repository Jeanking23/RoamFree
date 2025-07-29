
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  type AuthError,
} from 'firebase/auth';
import { auth } from './firebase';

export { createUser, signIn, signOut, changePassword };

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

async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean } | { error: string }> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    return { error: 'No user is signed in.' };
  }

  try {
    // Re-authenticate the user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // If re-authentication is successful, update the password
    await updatePassword(user, newPassword);
    
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    // Provide more user-friendly error messages
    if (authError.code === 'auth/wrong-password') {
      return { error: 'The current password you entered is incorrect.' };
    }
     if (authError.code === 'auth/weak-password') {
      return { error: 'The new password is too weak. Please choose a stronger one.' };
    }
    return { error: authError.message };
  }
}
