
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  type AuthError,
} from 'firebase/auth';
import { auth } from './firebase';

export { createUser, signIn, signOut, changePassword, signInWithGoogle, sendPasswordResetEmail };

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

async function signInWithGoogle(): Promise<{ uid: string } | { error: string } | null> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return { uid: user.uid };
  } catch (error) {
    const authError = error as AuthError;
    if (authError.code === 'auth/popup-closed-by-user') {
        return null; // User closed the popup, not an error to display
    }
    // Provide a more helpful error message for the common unauthorized domain issue.
    if (authError.code === 'auth/unauthorized-domain') {
      return { error: "This domain is not authorized for Google Sign-In. Please add 'localhost' to the authorized domains in your Firebase Authentication settings." };
    }
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

async function sendPasswordResetEmail(email: string): Promise<{ success: boolean } | { error: string }> {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    if (authError.code === 'auth/user-not-found') {
        return { error: 'No account found with this email address.' };
    }
    return { error: authError.message };
  }
}
