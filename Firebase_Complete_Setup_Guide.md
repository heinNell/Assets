# Firebase Setup Guide - Expo vs Native Android

## Current Project Status

Your project is currently set up as an **Expo managed React Native app** with Firebase JavaScript SDK. You have two paths forward:

## Option 1: Keep Expo Managed Workflow (Recommended)

### ✅ Advantages:

- Cross-platform (iOS, Android, Web)
- Automatic updates via Expo
- Simplified development
- No native build configuration
- Firebase works through JavaScript SDK

### 📋 Current Firebase Setup:

```javascript
// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, getFirestore, getStorage } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZ7F6hiGERA-f0Q_LL3KQ91HuXU2G8yqo",
  authDomain: "matanuska-9cf44.firebaseapp.com",
  projectId: "matanuska-9cf44",
  storageBucket: "matanuska-9cf44.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 🚀 Usage:

```javascript
import { auth, db } from "./firebase-config";

// Authentication
import { signInWithEmailAndPassword } from "firebase/auth";

// Firestore
import { collection, addDoc, getDocs } from "firebase/firestore";

// Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
```

## Option 2: Eject to Bare Workflow + Native Android

### ⚠️ Requirements:

- Android Studio installed
- JDK 11+
- Physical device or emulator
- Google Play Services on device

### 📁 Android Project Structure Created:

```
android/
├── build.gradle (Project-level)
├── app/
│   ├── build.gradle (App-level)
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/yourcompany/fleettracker/
│   │   │   └── MainActivity.kt
│   │   └── res/
│   │       ├── layout/activity_main.xml
│   │       └── values/strings.xml
│   └── google-services.json
├── gradle/wrapper/
│   └── gradle-wrapper.properties
├── settings.gradle.kts
└── gradle.properties
```

### 🔧 Gradle Configuration:

**Project-level build.gradle:**

```gradle
plugins {
    id 'com.android.application' version '7.3.0' apply false
    id 'com.android.library' version '7.3.0' apply false
    id 'org.jetbrains.kotlin.android' version '1.8.0' apply false

    // Add the dependency for the Google services Gradle plugin
    id 'com.google.gms.google-services' version '4.4.3' apply false
}
```

**App-level build.gradle:**

```gradle
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'

    // Add the Google services Gradle plugin
    id 'com.google.gms.google-services'
}

dependencies {
    // Import the Firebase BoM
    implementation platform('com.google.firebase:firebase-bom:34.2.0')

    // Firebase SDKs
    implementation 'com.google.firebase:firebase-analytics'
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-firestore'
    implementation 'com.google.firebase:firebase-storage'
}
```

### 📱 Android Manifest:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
        <!-- Google Maps API Key -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="${GOOGLE_MAPS_API_KEY}" />
    </application>
</manifest>
```

## Migration Steps (If Choosing Native Android):

### Step 1: Eject from Expo

```bash
npx expo eject
# Choose "Bare" workflow
```

### Step 2: Copy Android Configuration

The Android project structure has been created in the `android/` directory.

### Step 3: Update Environment Variables

Add to your `.env` file:

```
GOOGLE_MAPS_API_KEY=your_maps_api_key_here
```

### Step 4: Build and Run

```bash
# In android directory
./gradlew build
./gradlew installDebug

# Or open in Android Studio
# File > Open > Select android folder
```

## Firebase Usage in Native Android:

### Initialize Firebase:

```kotlin
// MainActivity.kt
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class MainActivity : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize Firebase (automatic with google-services plugin)
        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()
    }
}
```

### Authentication:

```kotlin
auth.signInWithEmailAndPassword(email, password)
    .addOnCompleteListener { task ->
        if (task.isSuccessful) {
            // Sign in success
            val user = auth.currentUser
        } else {
            // Sign in failed
        }
    }
```

### Firestore Operations:

```kotlin
// Add document
val vehicle = hashMapOf(
    "licensePlate" to "ABC123",
    "make" to "Toyota",
    "model" to "Camry"
)

db.collection("vehicles")
    .add(vehicle)
    .addOnSuccessListener { documentReference ->
        Log.d(TAG, "DocumentSnapshot added with ID: ${documentReference.id}")
    }
    .addOnFailureListener { e ->
        Log.w(TAG, "Error adding document", e)
    }
```

## Recommendation

### For Most Projects: Stay with Expo Managed Workflow

- ✅ Easier development
- ✅ Cross-platform compatibility
- ✅ Automatic updates
- ✅ Firebase works perfectly

### Only Eject to Bare If You Need:

- Custom native modules
- Advanced native Android features
- Direct access to Android APIs
- Performance-critical features

## Next Steps

1. **For Expo**: Continue using the existing Firebase setup
2. **For Native**: Run `npx expo eject` and use the Android configuration provided
3. **Test**: Verify Firebase connection works in your chosen environment

Both setups are fully configured and ready to use!
