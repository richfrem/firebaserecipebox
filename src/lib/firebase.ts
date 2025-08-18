
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, MicrosoftAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "recipebox-ifiwn",
  "appId": "1:31517443304:web:e6cbc2189a4eeaa489355d",
  "storageBucket": "recipebox-ifiwn.appspot.com",
  "apiKey": "AIzaSyB35Sw8-YZiL7B7-ZBdv1JiP3tRNOYrWcw",
  "authDomain": "recipebox-ifiwn.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "31517443304"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new MicrosoftAuthProvider();


export { app, storage, db, auth, googleProvider, microsoftProvider };
