
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, OAuthProvider, type Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "apiKey": "AIzaSyB35Sw8-YZiL7B7-ZBdv1JiP3tRNOYrWcw",
  "authDomain": "recipebox-ifiwn.firebaseapp.com",
  "projectId": "recipebox-ifiwn",
  "storageBucket": "recipebox-ifiwn.appspot.com",
  "messagingSenderId": "31517443304",
  "appId": "1:31517443304:web:e6cbc2189a4eeaa489355d"
};

// Singleton pattern to ensure Firebase is initialized only once
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;
let microsoftProvider: OAuthProvider;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  'prompt': 'select_account'
});

microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  tenant: 'common',
});


export { app, storage, db, auth, googleProvider, microsoftProvider };
