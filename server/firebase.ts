import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import admin from "firebase-admin";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: "https://ecommerce-backend-c8553-default-rtdb.firebaseio.com/",
  projectId: "ecommerce-backend-c8553",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// For server-side operations with Admin SDK (optional - will be used for advanced operations)
let adminApp: admin.app.App | null = null;

// Only initialize admin if not already initialized
try {
  if (!admin.apps.length) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: firebaseConfig.projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
      databaseURL: firebaseConfig.databaseURL,
    });
  } else {
    adminApp = admin.app();
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

export { database, ref, adminApp };