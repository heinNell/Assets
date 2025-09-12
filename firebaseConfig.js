import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import Constants from 'expo-constants';

// Get Firebase configuration from Expo Constants
const firebaseConfig = Constants.expoConfig?.extra?.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const rtdb = getDatabase(app); // Realtime Database

export { app, auth, db, storage, rtdb };
