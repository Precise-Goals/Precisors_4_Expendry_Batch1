import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

function initAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "expendry";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  return initializeApp({
    projectId,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

let adminApp;
let adminAuth;
let adminDb;

try {
  adminApp = initAdminApp();
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} catch (error) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("Firebase Admin SDK initialization warning:", error.message);
  }
}

export { adminApp, adminAuth, adminDb, initAdminApp };
