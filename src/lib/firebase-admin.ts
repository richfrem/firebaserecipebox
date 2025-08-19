import type * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

// This function lazily initializes the Firebase Admin SDK.
// It ensures that the SDK is only imported and initialized when it's first needed,
// preventing Next.js bundling issues.
export function getFirebaseAdmin() {
  if (app) {
    return {
      db: app.firestore(),
      storage: app.storage(),
      admin,
    };
  }

  // We are doing a dynamic import of firebase-admin here to prevent
  // the tree-shaking that was causing the 'INTERNAL' error.
  const admin_dynamic: typeof admin = require('firebase-admin');

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!admin_dynamic.apps.length) {
    app = admin_dynamic.initializeApp({
      credential: admin_dynamic.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else {
    app = admin_dynamic.app();
  }

  return {
    db: app.firestore(),
    storage: app.storage(),
    admin: admin_dynamic,
  };
}
