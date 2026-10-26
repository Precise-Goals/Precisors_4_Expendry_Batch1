import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

function getFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL,
  };

  // Environment variable safety guard
  for (const envKey of requiredEnvVars) {
    const fallbackKey = envKey.replace("NEXT_PUBLIC_", "");
    if (!process.env[envKey] && !process.env[fallbackKey]) {
      throw new Error(
        `Firebase Initialization Error: Missing required environment variable '${envKey}' (or '${fallbackKey}'). ` +
        `Please check your .env configuration.`
      );
    }
  }

  return config;
}

let app;
let auth;
let db;

try {
  const config = getFirebaseConfig();
  app = getApps().length === 0 ? initializeApp(config) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  // Graceful handling during static pre-rendering builds if env vars aren't present
  if (process.env.NODE_ENV !== "production") {
    console.warn("Firebase client initialization warning:", error.message);
  }
}

export { app, auth, db, getFirebaseConfig };
