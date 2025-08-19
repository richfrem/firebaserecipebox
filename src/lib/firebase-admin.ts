
import * as admin from 'firebase-admin';

// This is the key: a "no-op" dynamic import.
// It forces the bundler to treat firebase-admin as a dynamic module,
// preventing the tree-shaking that causes the 'INTERNAL' error.
import('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { admin, adminDb, adminStorage };
