# AI Coding Agent Instructions for Fleet Tracker Mobile App

## Project Overview

This is a comprehensive mobile vehicle fleet management system built with **Expo + React Native + TypeScript + Firebase**. The app enables drivers to check-in/check-out vehicles using QR codes, track GPS locations, capture documentation photos, and manage maintenance schedules.

## Architecture & Technology Stack

### Core Technologies

- **Frontend**: Expo SDK (~50.0.0), React Native 0.73.4, TypeScript 5.1.3
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Maps**: Google Maps Platform (Maps SDK, Places API, Geocoding API)
- **Navigation**: React Navigation v6 (Stack, Bottom Tabs, Drawer)
- **State Management**: React Context + Firebase real-time listeners

### Key Dependencies

```json
{
  "firebase": "^11.10.0",
  "@dataconnect/generated": "file:src/dataconnect-generated",
  "expo": "~50.0.0",
  "expo-camera": "~14.0.5",
  "expo-barcode-scanner": "~12.9.3",
  "expo-location": "~16.5.5",
  "expo-maps": "~0.1.0",
  "expo-av": "~13.10.4",
  "react-native-maps": "1.10.0",
  "@react-navigation/native": "^6.1.9",
  "react-hook-form": "^7.48.2",
  "date-fns": "^2.30.0"
}
```

## Project Structure & Conventions

## Project Structure & Conventions

### Directory Structure

```
src/
├── components/          # Reusable UI components (Camera, MapView, etc.)
├── contexts/           # React contexts (AuthContext, FirebaseContext, LocationContext)
├── navigation/         # Navigation configuration & types
├── screens/           # Screen components by feature
│   ├── auth/          # Login, Register, Profile
│   ├── vehicle/       # Vehicle list, details, QR scanner
│   ├── checkin/       # Check-in/check-out flow
│   ├── dashboard/     # Main dashboard and barcode scanner
│   ├── maintenance/   # Service records, scheduling
│   ├── maps/          # Map testing and visualization
│   ├── profile/       # User profile management
│   ├── TripTrackingScreen.tsx    # Real-time trip monitoring
│   ├── TripDetailsScreen.tsx     # Trip history details
│   └── TripHistoryScreen.tsx     # Trip history list
├── services/          # API services & business logic
│   ├── api/           # Firebase API services (locationApi, locationTrackingService)
│   ├── firebase/      # Firebase service classes
│   ├── AuthService.ts # Authentication service
│   ├── BarcodeService.ts # QR code management
│   ├── LocationService.ts # Location utilities
│   └── VehicleService.ts # Vehicle operations
├── types/             # TypeScript interfaces & enums
├── utils/             # Helper functions & constants
├── constants/         # App constants and configuration
├── hooks/             # Custom React hooks
├── dataconnect-generated/ # Firebase Data Connect generated code
└── config/            # Firebase config, app constants
```

### Naming Conventions

- **Files**: PascalCase for components (`VehicleCard.tsx`), camelCase for utilities (`firebaseUtils.ts`)
- **Components**: PascalCase with descriptive names (`CheckInForm`, `VehicleScanner`)
- **Firebase Collections**: camelCase (`users`, `vehicles`, `checkIns`)
- **TypeScript**: Strict typing required, use interfaces over types for complex objects

## Critical Developer Workflows

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Run on specific platform
npm run android  # Android emulator
npm run ios      # iOS simulator
npm run web      # Web browser
```

### Critical Developer Workflows

#### Expo Development Setup

```bash
# Clear Metro bundler cache (essential for resolving build issues)
npx expo start --clear

# Install native dependencies after package.json changes
npx expo install --fix

# Run on specific platforms
npx expo run:ios --device  # Physical iOS device
npx expo run:android --device  # Physical Android device
```

#### Firebase Development Workflow

```bash
# Enable Firebase emulators for local development
firebase emulators:start

# Deploy Firestore security rules
firebase deploy --only firestore:rules

# View Firestore data in Firebase console
# Visit: https://console.firebase.google.com/project/lmvs-86b43/firestore
```

#### QR Code Generation Workflow

```typescript
// Generate QR codes for all vehicles in a company
const generatedCount = await BarcodeService.generateMissingBarcodes(
  companyId,
  currentUserId
);

// Print QR code labels
const labelData = BarcodeService.generatePrintableLabelData(vehicle, barcode);
```

#### Location Tracking Setup

```typescript
// Request permissions in correct order
const foreground = await Location.requestForegroundPermissionsAsync();
if (foreground.status === 'granted') {
  const background = await Location.requestBackgroundPermissionsAsync();
}

// Start background tracking
await LocationTrackingService.startTracking(tripId);
```

#### Firebase Configuration

1. **Environment Variables** (`.env`):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=lmvs-86b43
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

2. **Security Rules Pattern**:

```javascript
// Firestore Rules - Company-scoped data access
match /vehicles/{vehicleId} {
  allow read, write: if request.auth != null &&
    resource.data.companyId == getUserCompanyId(request.auth.uid);
}

// Storage Rules - User-scoped file access
match /users/{userId}/{allPaths=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### Building & Deployment

```bash
# Configure EAS Build
npx expo install expo-dev-client
eas build:configure

# Build for platforms
eas build --platform android
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## Key Implementation Patterns

### 1. Firebase Integration Pattern

```typescript
// src/services/firebaseService.ts
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const getCompanyVehicles = async (companyId: string) => {
  const q = query(
    collection(db, "vehicles"),
    where("companyId", "==", companyId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
```

### 2. QR Code Vehicle Scanning

```typescript
// src/services/BarcodeService.ts
export const scanVehicleQR = async (qrData: string) => {
  // Format: FLEET_{REGISTRATION}_{FLEETNO}_{TIMESTAMP}_{RANDOM}
  const parts = qrData.split("_");
  if (parts[0] !== "FLEET") throw new Error("Invalid QR format");

  const vehicle = await getVehicleByRegistration(parts[1]);
  return vehicle;
};
```

### 3. Location Services Integration

```typescript
// src/services/LocationService.ts
import * as Location from "expo-location";

export const getCurrentLocation = async (): Promise<LocationData> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("Location permission denied");

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: new Date(),
  };
};
```

### 4. Camera & Media Handling

```typescript
// src/components/VehicleCamera.tsx
import { Camera } from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const captureVehiclePhoto = async () => {
  const photo = await cameraRef.current.takePictureAsync();

  // Compress and resize for storage
  const compressed = await manipulateAsync(
    photo.uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.7, format: SaveFormat.JPEG }
  );

  return compressed.uri;
};
```

### 6. Real-time Trip Tracking with Firebase

```typescript
// src/services/api/locationApi.ts
export class LocationApiService {
  static async startTrip(
    driverId: string,
    vehicleId: string,
    initialLocation: LocationData
  ): Promise<string> {
    const tripData: TripData = {
      id: tripId,
      driverId,
      vehicleId,
      startTime: Timestamp.now(),
      status: "active",
      startLocation: initialLocation,
      locations: [initialLocation],
      totalDistance: 0,
      averageSpeed: 0,
      fuelConsumption: 0,
    };

    const docRef = doc(db, this.TRIPS_COLLECTION, tripId);
    await setDoc(docRef, tripData);
    return tripId;
  }
}
```

### 7. Background Location Tracking

```typescript
// src/services/api/locationTrackingService.ts
export class LocationTrackingService {
  static async startTracking(tripId: string): Promise<void> {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted")
      throw new Error("Background location permission denied");

    await Location.startLocationUpdatesAsync(this.LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 30000, // 30 seconds
      distanceInterval: 100, // 100 meters
      showsBackgroundLocationIndicator: true,
    });
  }
}
```

### 8. Firebase Real-time Subscriptions

```typescript
// src/hooks/useLocationTracking.ts
export const useLocationTracking = (tripId: string) => {
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "trips", tripId), (doc) => {
      if (doc.exists()) {
        const tripData = doc.data() as TripData;
        setTripData(tripData);
      }
    });

    return unsubscribe;
  }, [tripId]);
};
```

## Data Models & Firestore Structure

### Core Collections

```typescript
// users/{userId}
interface User {
  uid: string;
  email: string;
  role: "driver" | "manager" | "admin";
  companyId: string;
  firstName: string;
  lastName: string;
  driverLicense?: string;
  emergencyContact?: Contact;
}

// vehicles/{vehicleId}
interface Vehicle {
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  status: "available" | "in-use" | "maintenance";
  currentDriverId?: string;
  companyId: string;
  currentMileage: number;
  qrCode?: string;
}

// trips/{tripId} - NEW: Real-time trip tracking
interface TripData {
  id: string;
  driverId: string;
  vehicleId: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  status: "active" | "completed" | "cancelled";
  startLocation: LocationData;
  endLocation?: LocationData;
  locations: LocationData[];
  totalDistance: number;
  averageSpeed: number;
  fuelConsumption: number;
  duration: number; // in milliseconds
}

// checkIns/{checkInId}
interface CheckIn {
  vehicleId: string;
  driverId: string;
  checkInTime: Timestamp;
  startingKilometers: number;
  fuelLevel: number;
  dashboardPhoto: string;
  vehicleCondition: VehicleCondition;
  status: "active" | "completed";
}
```

## Common Patterns & Best Practices

### 1. Error Handling

```typescript
// src/utils/errorHandling.ts
export const handleFirebaseError = (error: any) => {
  if (error.code === "permission-denied") {
    return "Access denied. Please check your permissions.";
  }
  if (error.code === "unavailable") {
    return "Service temporarily unavailable. Check connection.";
  }
  return "An unexpected error occurred.";
};
```

### 2. Offline Support

```typescript
// src/services/OfflineService.ts
import NetInfo from "@react-native-community/netinfo";

export const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

export const syncPendingOperations = async () => {
  if (!(await isOnline())) return;

  // Sync queued operations to Firebase
  const pending = await getPendingOperations();
  for (const op of pending) {
    await executeOperation(op);
  }
};
```

### Firebase Data Connect Integration

The app uses Firebase Data Connect for type-safe database operations:

```typescript
// src/dataconnect-generated/ - Auto-generated types and queries
// Use this for type-safe Firebase operations instead of manual Firestore calls
import { executeQuery } from "@dataconnect/generated";

// Type-safe query execution
const vehicles = await executeQuery(getVehiclesQuery, { companyId });
```

**Pattern**: Prefer Firebase Data Connect for new database operations when available, falling back to direct Firestore calls for complex real-time operations.

### 4. Comprehensive Permission Management

```typescript
// app.config.js - Expo permission configuration
{
  ios: {
    infoPlist: {
      NSCameraUsageDescription: "Camera access for QR scanning and photo capture",
      NSLocationWhenInUseUsageDescription: "Location tracking for vehicle routes",
      NSLocationAlwaysAndWhenInUseUsageDescription: "Background location for trip tracking",
      NSMicrophoneUsageDescription: "Voice notes for trip documentation",
      NSPhotoLibraryUsageDescription: "Save vehicle documentation photos"
    }
  },
  android: {
    permissions: [
      "CAMERA", "ACCESS_FINE_LOCATION", "ACCESS_BACKGROUND_LOCATION",
      "RECORD_AUDIO", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"
    ]
  }
}
```

**Permission Strategy**: Configure all required permissions in `app.config.js` with clear user-facing descriptions. Request foreground permissions first, then background permissions for trip tracking.

### 5. Service Layer Architecture

```typescript
// src/services/api/locationApi.ts - API service pattern
export class LocationApiService {
  private static readonly TRIPS_COLLECTION = 'trips';

  static async startTrip(driverId: string, vehicleId: string, initialLocation: LocationData): Promise<string> {
    const tripId = `trip_${Date.now()}_${driverId}`;
    const tripData: TripData = {
      id: tripId,
      driverId,
      vehicleId,
      startTime: Timestamp.now(),
      status: 'active',
      startLocation: initialLocation,
      locations: [initialLocation],
      totalDistance: 0,
      averageSpeed: 0,
      fuelConsumption: 0,
    };

    const docRef = doc(db, this.TRIPS_COLLECTION, tripId);
    await setDoc(docRef, tripData);
    return tripId;
  }
}

// src/services/BarcodeService.ts - Business logic service pattern
export class BarcodeService {
  static async scanVehicleQR(barcodeData: string, scannedBy: string): Promise<BarcodeScanResult> {
    // Validation, parsing, and Firebase operations
    const vehicle = await this.findVehicleByRegistration(parsedData.registrationNo);
    // ... business logic
    return { success: true, vehicle, barcode };
  }
}
```

**Service Pattern**: Separate API services (Firebase operations) from business logic services. Use static methods for stateless operations, class instances for stateful services.

## Testing & Quality Assurance

### Unit Testing Pattern

```typescript
// src/__tests__/services/BarcodeService.test.ts
import { scanVehicleQR } from "../services/BarcodeService";

describe("BarcodeService", () => {
  it("should parse valid QR code format", async () => {
    const qrData = "FLEET_AFG7557_B1_1234567890_ABCDEF";
    const vehicle = await scanVehicleQR(qrData);

    expect(vehicle.licensePlate).toBe("AFG7557");
  });

  it("should reject invalid QR format", async () => {
    const invalidQR = "INVALID_FORMAT";
    await expect(scanVehicleQR(invalidQR)).rejects.toThrow("Invalid QR format");
  });
});
```

### Integration Testing

```typescript
// src/__tests__/CheckInFlow.test.ts
describe("Check-in Flow", () => {
  it("should complete full check-in process", async () => {
    // Mock camera, location, Firebase services
    const checkInData = await completeCheckInFlow(mockVehicle, mockDriver);

    expect(checkInData.status).toBe("completed");
    expect(checkInData.vehicleId).toBe(mockVehicle.id);
  });
});
```

## Performance Considerations

### 1. Image Optimization

- Compress photos before Firebase Storage upload
- Use appropriate image dimensions (1024px max width)
- Implement lazy loading for vehicle lists

### 2. Firebase Query Optimization

- Use composite indexes for complex queries
- Implement pagination for large datasets
- Cache frequently accessed data locally

### 3. Location Tracking

- Use appropriate accuracy levels (High for check-in, Balanced for tracking)
- Implement background location updates efficiently
- Handle location permission changes gracefully

## Security & Privacy

### Firebase Security Rules Priority

1. **Authentication Required**: All data access requires valid auth
2. **Company Scoping**: Users can only access their company's data
3. **Role-Based Access**: Managers/Admins have elevated permissions
4. **Data Validation**: Server-side validation of all inputs

### API Key Management

- Store API keys in environment variables
- Use different keys for development/production
- Implement API key restrictions in Google Cloud Console

## Deployment Checklist

### Pre-Deployment

- [ ] Firebase security rules applied and tested
- [ ] Environment variables configured
- [ ] Google Maps API keys restricted
- [ ] App permissions configured in `app.config.js`
- [ ] Test builds successful on both platforms

### Post-Deployment

- [ ] Firebase services enabled (Auth, Firestore, Storage)
- [ ] Initial company and admin user created
- [ ] Vehicle data seeded with QR codes
- [ ] App store submissions completed

## Troubleshooting Common Issues

### Build Issues

- **Metro bundler errors**: Clear cache with `npx expo start --clear`
- **Native dependencies**: Run `npx expo install --fix`
- **iOS build fails**: Check Xcode version compatibility

### Firebase Issues

- **Permission denied**: Verify security rules and user authentication
- **Data not syncing**: Check Firestore indexes and network connectivity
- **Auth errors**: Confirm Firebase config and API keys

### Maps Integration

- **Maps not loading**: Verify API key and enable required APIs
- **Location permissions**: Check app permissions and device settings
- **QR scanning fails**: Test camera permissions and lighting conditions

## Key Files to Reference

- `app.config.js` - Expo configuration and permissions
- `package.json` - Dependencies and scripts
- `src/navigation/MainNavigator.tsx` - Navigation architecture and routing
- `src/services/api/locationApi.ts` - Trip tracking and location API patterns
- `src/services/api/locationTrackingService.ts` - Background location tracking
- `src/services/BarcodeService.ts` - QR code scanning and validation
- `src/screens/TripTrackingScreen.tsx` - Real-time trip monitoring UI
- `src/dataconnect-generated/` - Firebase Data Connect generated types
- `src/constants/index.ts` - App constants and configuration
- `Firebase Setup Guide - Your Project Configuration.md` - Firebase setup details
- `BarcodeActivationSystemImplementationGuid.md` - QR code system details
- `firestore.indexes.json` - Database query optimization
- `.env` - Environment variables template

This guide covers the essential knowledge for productive development. Focus on Firebase security patterns, Expo development workflow, and the QR code vehicle activation system when implementing new features.

## Project-Specific Conventions & Patterns

### Unique Architectural Decisions

1. **Service Layer Separation**: Unlike typical React Native apps, this project maintains a clear separation between API services (`src/services/api/`) and business logic services (`src/services/`). API services handle Firebase operations, while business logic services handle validation and processing.

2. **QR Code Format Convention**: Uses a specific format `FLEET_{REGISTRATION}_{FLEETNO}_{TIMESTAMP}_{RANDOM}` that differs from standard QR code practices. Always validate this format in barcode scanning operations.

3. **Company-Scoped Data Access**: All Firebase queries include company filtering, which is not typical in simpler apps. Always include `companyId` in data access patterns.

4. **Real-time Trip Tracking**: Implements background location tracking with Firebase real-time subscriptions, requiring careful permission management and battery optimization.

### Integration Points & Dependencies

1. **Firebase Data Connect vs Firestore**: Use Firebase Data Connect for type-safe queries when available, fall back to direct Firestore calls for complex real-time operations.

2. **Expo Location API**: Handles both foreground and background location tracking with specific permission request order (foreground first, then background).

3. **Google Maps Integration**: Requires API key configuration in both `app.config.js` and environment variables, with platform-specific setup.

### Development Workflow Differences

1. **Permission Request Order**: Always request foreground location permissions before background permissions to avoid iOS rejection.

2. **Firebase Security Rules**: Company-scoped access patterns require custom security rules that differ from typical user-scoped applications.

3. **QR Code Generation**: Uses a custom QR code service rather than standard libraries, with specific formatting and validation requirements.

### Common Pitfalls to Avoid

1. **Don't mix Firebase Data Connect and Firestore calls** in the same operation - choose one approach per feature.

2. **Always handle location permission denials gracefully** - don't crash the app when permissions are denied.

3. **Validate QR code format before processing** - the custom format is strict and must be enforced.

4. **Include companyId in all data operations** - forgetting this will break the multi-tenant architecture.

5. **Test on physical devices for location features** - emulators don't accurately simulate GPS behavior.
