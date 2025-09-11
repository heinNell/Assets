// Firebase configuration for Expo/React Native
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBZ7F6hiGERA-f0Q_LL3KQ91HuXU2G8yqo",
  authDomain: "matanuska-9cf44.firebaseapp.com",
  databaseURL: "https://matanuska-9cf44-default-rtdb.firebaseio.com",
  projectId: "matanuska-9cf44",
  storageBucket: "matanuska-9cf44.firebasestorage.app",
  messagingSenderId: "937563757873",
  appId: "1:937563757873:android:1bc6098a39101157f7e410",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
