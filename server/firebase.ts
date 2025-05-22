import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: "https://ecommerce-backend-c8553-default-rtdb.firebaseio.com/",
  projectId: "ecommerce-backend-c8553",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log("Firebase initialized with database URL:", firebaseConfig.databaseURL);

export { database, ref };