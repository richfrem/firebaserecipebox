// This is a no-op dynamic import that serves as a hint to the Next.js bundler.
// It forces the bundler to treat this module as a dynamic boundary, which is
// essential for preventing the 'INTERNAL' error when using 'firebase-admin'.
import('firebase-admin');

import * as admin from 'firebase-admin';

// Initialize the app if it's not already initialized.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error:", error);
    // You might want to throw the error or handle it in a way that
    // your application can gracefully fail.
  }
}

const adminDb = admin.firestore();
const adminStorage = admin.storage();
const adminAuth = admin.auth();

export { admin, adminDb, adminStorage, adminAuth };

    