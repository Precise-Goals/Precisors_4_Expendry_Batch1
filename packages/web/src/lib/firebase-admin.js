import admin from "firebase-admin";

function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

function initAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "expendry";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  // Fallback for development / serverless environment where credentials may be injected by Google Cloud
  return admin.initializeApp({
    projectId,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const adminApp = initAdminApp();
const adminAuth = admin.auth(adminApp);
const adminDb = admin.firestore(adminApp);

export { admin, adminApp, adminAuth, adminDb, initAdminApp };
