import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjTCWf4QPovnyuGwp809ta3igHwDCmMAo",
  authDomain: "lmvs-86b43.firebaseapp.com",
  databaseURL: "https://lmvs-86b43-default-rtdb.firebaseio.com",
  projectId: "lmvs-86b43",
  storageBucket: "lmvs-86b43.firebasestorage.app",
  messagingSenderId: "398663269859",
  appId: "1:398663269859:android:0d67ea35eff00e140474d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
