# Fleet Tracker Mobile - Expo Setup Guide

A comprehensive mobile vehicle fleet management system built with Expo, React Native, TypeScript, and Firebase.

## 🚀 Features

- **Authentication & User Management**
  - Email/password authentication
  - Role-based access (driver, manager, admin)
  - User profiles with emergency contacts

- **Vehicle Management**
  - Vehicle fleet overview
  - Real-time vehicle status tracking
  - Barcode/QR code scanning for vehicle identification

- **Check-in/Check-out System**
  - Digital vehicle handover process
  - Photo documentation (dashboard, damage)
  - Digital signature capture
  - Voice notes recording
  - Vehicle condition checklist

- **GPS Tracking & Navigation**
  - Real-time location tracking
  - Route optimization with Google Maps
  - Geofencing capabilities
  - Trip history and analytics

- **Maintenance Management**
  - Service scheduling and alerts
  - Maintenance history tracking
  - Document management

- **Offline Capabilities**
  - Offline data synchronization
  - Queue pending operations

## 🛠 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Firebase project setup
- Google Maps API key (for maps integration)

## 📱 Installation

### 1. Initialize Expo Project

```bash
npx create-expo-app fleet-tracker-mobile --template blank-typescript
cd fleet-tracker-mobile
```

### 2. Install Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler

# Firebase
npm install firebase

# Camera & Media
npx expo install expo-camera expo-media-library expo-image-picker expo-av

# Location Services
npx expo install expo-location

# Barcode Scanner
npx expo install expo-barcode-scanner

# Document Picker
npx expo install expo-document-picker

# Maps
npm install react-native-maps

# UI Components
npm install react-native-paper react-native-vector-icons react-native-svg
npm install react-native-signature-canvas

# Forms & Utilities
npm install react-hook-form date-fns react-native-uuid

# Icons
npx expo install @expo/vector-icons
```

### 3. Configure Firebase

You already have a Firebase project set up! Your configuration is:

**Project Details:**
- **Project ID**: `lmvs-86b43`
- **Package Name**: `MatLMVs.com`
- **API Key**: `AIzaSyCjTCWf4QPovnyuGwp809ta3igHwDCmMAo`
- **Storage Bucket**: `lmvs-86b43.firebasestorage.app`

The Firebase configuration in `src/config/firebase.ts` has been updated with your project details.

**Enable Required Services:**

1. Visit [Firebase Console](https://console.firebase.google.com/project/lmvs-86b43)

2. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database** 
   - **Storage**

3. Apply the security rules provided in the Firebase Setup Guide

### 4. Google Maps Setup

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com)

2. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API

3. Add the API key to your `app.config.js`:

```javascript
export default {
  expo: {
    // ... other config
    android: {
      config: {
        googleMaps: {
          apiKey: "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    },
    ios: {
      config: {
        googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY"
      }
    }
  }
};
```

### 5. Project Structure

Create the following folder structure:

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Firebase, Location, Theme)
├── navigation/         # Navigation configuration
├── screens/           # Screen components
│   ├── auth/          # Authentication screens
│   ├── main/          # Main app screens
│   ├── vehicle/       # Vehicle-related screens
│   ├── camera/        # Camera functionality
│   ├── scanner/       # Barcode scanner
│   ├── forms/         # Form screens
│   ├── profile/       # User profile screens
│   └── maintenance/   # Maintenance screens
├── services/          # API services and utilities
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── config/            # Configuration files
```

### 6. Firestore Database Structure

Set up your Firestore collections:

```
users/
├── {userId}/
│   ├── uid: string
│   ├── email: string
│   ├── firstName: string
│   ├── lastName: string
│   ├── role: 'driver' | 'manager' | 'admin'
│   ├── companyId: string
│   ├── driverLicense?: string
│   ├── emergencyContact?: object
│   └── createdAt: timestamp

vehicles/
├── {vehicleId}/
│   ├── licensePlate: string
│   ├── make: string
│   ├── model: string
│   ├── year: number
│   ├── status: 'available' | 'in-use' | 'maintenance'
│   ├── currentDriverId?: string
│   ├── companyId: string
│   └── currentMileage: number

checkIns/
├── {checkInId}/
│   ├── vehicleId: string
│   ├── driverId: string
│   ├── checkInTime: timestamp
│   ├── startingKilometers: number
│   ├── fuelLevel: number
│   ├── dashboardPhoto: string
│   ├── vehicleCondition: object
│   └── status: 'active' | 'completed'

checkOuts/
├── {checkOutId}/
│   ├── checkInId: string
│   ├── vehicleId: string
│   ├── driverId: string
│   ├── checkOutTime: timestamp
│   ├── endingKilometers: number
│   └── totalDistance: number

maintenanceRecords/
├── {recordId}/
│   ├── vehicleId: string
│   ├── type: string
│   ├── description: string
│   ├── serviceDate: timestamp
│   ├── cost: number
│   └── mileage: number
```

### 7. Firebase Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Company vehicles - users can only access vehicles from their company
    match /vehicles/{vehicleId} {
      allow read, write: if request.auth != null && 
        resource.data.companyId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.companyId;
    }
    
    // Check-ins - drivers can create, managers can read all
    match /checkIns/{checkInId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && 
        (resource.data.driverId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['manager', 'admin']);
    }
    
    // Maintenance records - managers and admins only
    match /maintenanceRecords/{recordId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['manager', 'admin'];
    }
  }
}
```

### 8. Storage Security Rules

Set up Firebase Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /vehicles/{vehicleId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /maintenance/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🏃‍♂️ Running the App

### Development

```bash
# Start the development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run on web
npx expo start --web
```

### Building for Production

1. **Configure EAS Build**

```bash
npm install -g eas-cli
eas login
eas build:configure
```

2. **Build for iOS**

```bash
eas build --platform ios
```

3. **Build for Android**

```bash
eas build --platform android
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (not included in repository):

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Push Notifications (Optional)

```bash
npx expo install expo-notifications
```

Configure push notifications in `app.config.js`:

```javascript
{
  "notification": {
    "icon": "./assets/notification-icon.png",
    "color": "#000000",
    "androidMode": "default",
    "androidCollapsedTitle": "Fleet Tracker"
  }
}
```

## 📱 Testing

### Physical Device Testing

1. Install Expo Go app on your device
2. Scan QR code from `npx expo start`
3. Test all camera, location, and barcode scanning features

### Key Testing Scenarios

- [ ] User registration and authentication
- [ ] Vehicle scanning with barcode/QR codes
- [ ] Photo capture for dashboard and damage documentation
- [ ] GPS location tracking during trips
- [ ] Digital signature capture
- [ ] Voice note recording
- [ ] Offline functionality
- [ ] Real-time data synchronization

## 🚀 Deployment

### App Store (iOS)

1. Build with EAS: `eas build --platform ios`
2. Download .ipa file
3. Upload to App Store Connect
4. Submit for review

### Google Play Store (Android)

1. Build with EAS: `eas build --platform android`
2. Download .aab file
3. Upload to Google Play Console
4. Submit for review

## 🔐 Security Considerations

- Enable App Check for Firebase
- Implement certificate pinning
- Use secure storage for sensitive data
- Regular security audits
- Proper API key management

## 📊 Analytics & Monitoring

- Firebase Analytics
- Crashlytics for error tracking
- Performance monitoring
- Usage analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact: support@yourcompany.com
- Documentation: https://docs.yourcompany.com/fleet-tracker

---

**Note**: Remember to replace placeholder values (API keys, project IDs, etc.) with your actual configuration values before deployment.