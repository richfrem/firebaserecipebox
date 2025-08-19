
import * as admin from 'firebase-admin';

// This is the correct way to initialize the Admin SDK in a server-side
// environment like Next.js. We check if it's already initialized, otherwise
// we initialize it. This prevents errors during hot-reloads in development.

if (!admin.apps.length) {
  // In a managed environment like Firebase Studio or Cloud Run, the SDK
  // will be automatically configured by Application Default Credentials.
  // For local development, you would set the FIREBASE_SERVICE_ACCOUNT_KEY
  // environment variable.
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
     admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
  } else {
      admin.initializeApp({
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
  }
}

const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminDb, adminStorage };
