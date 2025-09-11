# Firebase Setup for Expo React Native Project

## Overview

This Expo managed project uses Firebase for backend services. Since this is a managed Expo workflow (not bare React Native), we use the standard Firebase JavaScript SDK instead of React Native Firebase.

## Current Firebase Configuration

### ✅ What's Already Configured:

- Firebase JavaScript SDK installed (`firebase: ^10.7.1`)
- `google-services.json` file present for Android configuration
- Firebase config file created (`firebase-config.js`)
- App config updated with Firebase settings

### 📁 Files Modified/Created:

1. `firebase-config.js` - Firebase initialization and service exports
2. `app.config.js` - Added Firebase configuration for Android
3. `package.json` - Cleaned up Firebase dependencies

## Firebase Services Available

```javascript
import { auth, db, storage } from "./firebase-config";

// Authentication
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// Firestore
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
```

## Usage Examples

### Authentication

```javascript
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in:", userCredential.user);
  } catch (error) {
    console.error("Sign in error:", error);
  }
};
```

### Firestore Operations

```javascript
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase-config";

const addVehicle = async (vehicleData) => {
  try {
    const docRef = await addDoc(collection(db, "vehicles"), vehicleData);
    console.log("Vehicle added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding vehicle:", error);
  }
};
```

### File Storage

```javascript
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase-config";

const uploadImage = async (uri, path) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Upload error:", error);
  }
};
```

## Important Notes

### Why No Gradle Configuration?

- **Managed Expo Workflow**: This project uses Expo's managed workflow, which handles native configuration automatically
- **No Direct Native Access**: You don't have access to Android/iOS native files or Gradle configuration
- **Firebase JS SDK**: For managed Expo apps, use the standard Firebase JavaScript SDK

### If You Need Native Features:

If you need React Native Firebase features that require native modules, you'll need to:

1. Eject from Expo managed workflow to bare workflow
2. Add the Gradle configuration you mentioned
3. Use `@react-native-firebase/*` packages

### Current Setup Benefits:

- ✅ Works with Expo managed workflow
- ✅ Cross-platform (iOS, Android, Web)
- ✅ Automatic updates via Expo
- ✅ Simplified development workflow
- ✅ No native build configuration needed

## Next Steps

1. **Install Dependencies**: Run `npm install` to ensure all packages are installed
2. **Test Firebase Connection**: Create a simple test to verify Firebase connection
3. **Implement Authentication**: Add login/signup functionality
4. **Set up Firestore**: Create your data models and CRUD operations
5. **Configure Storage**: Set up file upload/download functionality

## Troubleshooting

### Common Issues:

- **Firebase not initializing**: Check `firebase-config.js` for correct configuration
- **Permissions errors**: Verify Firebase security rules
- **Expo build issues**: Ensure you're using compatible Expo SDK version

### Firebase Console:

- Access your Firebase project: https://console.firebase.google.com/project/matanuska-9cf44
- Check authentication settings
- Review Firestore security rules
- Monitor storage permissions

## Security Rules Reminder

Remember to set up proper Firestore security rules and Storage permissions in your Firebase Console to protect your data.

This setup provides a solid foundation for Firebase integration in your Expo React Native Fleet Tracker app.
