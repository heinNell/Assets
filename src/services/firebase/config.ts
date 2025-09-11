// src/services/firebase/config.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBZ7F6hiGERA-f0Q_LL3KQ91HuXU2G8yqo",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "matanuska-9cf44.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "matanuska-9cf44",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "matanuska-9cf44.firebasestorage.app",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "937563757873",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    "1:937563757873:android:1bc6098a39101157f7e410",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Firebase Auth persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Failed to set auth persistence:", error);
});

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    console.warn(
      "Multiple tabs open, persistence can only be enabled in one tab at a time."
    );
  } else if (err.code == "unimplemented") {
    console.warn(
      "The current browser does not support all of the features required to enable persistence"
    );
  }
});

export default app;
