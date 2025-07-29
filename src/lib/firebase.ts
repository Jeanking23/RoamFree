// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  "projectId": "roamfree-t03lp",
  "appId": "1:140284138887:web:25eccd73bfc2eba786af22",
  "storageBucket": "roamfree-t03lp.appspot.com",
  "apiKey": "AIzaSyBC5dXUuJS1x_lL8ooozQUycBXkv89FqPw",
  "authDomain": "roamfree-t03lp.firebaseapp.com",
  "messagingSenderId": "140284138887"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
