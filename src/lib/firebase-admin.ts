
import type * as admin from 'firebase-admin';

// We will store the initialized services in this variable.
let adminServices: {
  db: admin.firestore.Firestore;
  storage: admin.storage.Storage;
  auth: admin.auth.Auth;
} | null = null;

/**
 * A singleton function to get the initialized Firebase Admin SDK services.
 * It initializes the app on the first call and returns the existing services
 * on subsequent calls. This function is async because it uses a dynamic import
 * to prevent the Next.js bundler from breaking the admin SDK.
 */
export async function getFirebaseAdmin() {
  // If the services are already initialized, return them immediately.
  if (adminServices) {
    return adminServices;
  }
  
  // Use a dynamic import to prevent the Next.js bundler from breaking the SDK
  const admin = (await import('firebase-admin')).default;

  // If not initialized, proceed with initialization.
  if (!admin.apps.length) {
    try {
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
      if (!storageBucket) {
        throw new Error("FIREBASE_STORAGE_BUCKET environment variable is not set.");
      }
      
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: storageBucket,
      });
      console.log("Firebase Admin SDK initialized successfully.");

    } catch (error: any) {
      // If initialization fails, log the detailed error and stop everything.
      console.error("CRITICAL: Firebase Admin SDK initialization failed.", error.stack);
      // This throw is important to prevent the app from continuing in a broken state.
      throw new Error("Could not initialize Firebase Admin SDK. See server logs for details.");
    }
  }

  // Once initialized, create the service instances and store them.
  adminServices = {
    db: admin.firestore(),
    storage: admin.storage(),
    auth: admin.auth(),
  };

  return adminServices;
}
