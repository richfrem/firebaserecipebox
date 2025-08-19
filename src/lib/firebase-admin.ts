
import * as admin from 'firebase-admin';

// This is the key: a "no-op" dynamic import.
// It forces the bundler to treat firebase-admin as a dynamic module,
// preventing the tree-shaking that causes the 'INTERNAL' error.
import('firebase-admin');

// Your existing service account logic remains the same.
// Ensure this environment variable is available in your deployment environment.
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  admin.initializeApp({
    // Use applicationDefault() if the service account key isn't provided.
    // This is useful for managed environments like Cloud Run, App Engine, etc.
    credential: serviceAccountKey
      ? admin.credential.cert(JSON.parse(serviceAccountKey))
      : admin.credential.applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminDb, adminStorage };
