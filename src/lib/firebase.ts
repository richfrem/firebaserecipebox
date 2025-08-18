
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "apiKey": "AIzaSyB35Sw8-YZiL7B7-ZBdv1JiP3tRNOYrWcw",
  "authDomain": "recipebox-ifiwn.firebaseapp.com",
  "projectId": "recipebox-ifiwn",
  "storageBucket": "recipebox-ifiwn.appspot.com",
  "messagingSenderId": "31517443304",
  "appId": "1:31517443304:web:e6cbc2189a4eeaa489355d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  'authDomain': 'recipebox-ifiwn.firebaseapp.com'
});

const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  // Use the v2.0 endpoint for Microsoft accounts (personal & work/school)
  tenant: 'common',
});


export { app, storage, db, auth, googleProvider, microsoftProvider };
