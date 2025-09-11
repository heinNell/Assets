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
  "firebase": "^10.7.1",
  "@react-native-firebase/app": "^18.7.3",
  "react-native-maps": "1.10.0",
  "expo-camera": "~14.0.5",
  "expo-barcode-scanner": "~12.9.3",
  "expo-location": "~16.5.5"
}
```

## Project Structure & Conventions

### Directory Structure

```
src/
├── components/          # Reusable UI components (Camera, MapView, etc.)
├── contexts/           # React contexts (AuthContext, FirebaseContext)
├── navigation/         # Navigation configuration & types
├── screens/           # Screen components by feature
│   ├── auth/          # Login, Register, Profile
│   ├── vehicle/       # Vehicle list, details, QR scanner
│   ├── checkin/       # Check-in/check-out flow
│   └── maintenance/   # Service records, scheduling
├── services/          # API services & business logic
├── types/             # TypeScript interfaces & enums
├── utils/             # Helper functions & constants
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

### Firebase Configuration

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

### 5. Form Validation with React Hook Form

```typescript
// src/screens/CheckInScreen.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const checkInSchema = z.object({
  startingKilometers: z.number().min(0),
  fuelLevel: z.number().min(0).max(100),
  vehicleCondition: z.string().min(10),
});

export const CheckInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkInSchema),
  });

  // Form implementation
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

### 3. Permission Management

```typescript
// src/hooks/usePermissions.ts
export const useCameraPermission = () => {
  const [status, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    if (status?.granted === false) {
      Alert.alert(
        "Camera Permission Required",
        "Camera access is needed to scan QR codes and capture photos.",
        [{ text: "Grant Permission", onPress: requestPermission }]
      );
    }
  }, [status]);

  return status?.granted ?? false;
};
```

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
- `Firebase Setup Guide - Your Project Configuration.md` - Firebase setup details
- `BarcodeActivationSystemImplementationGuid.md` - QR code system details
- `firestore.indexes.json` - Database query optimization
- `.env` - Environment variables template

This guide covers the essential knowledge for productive development. Focus on Firebase security patterns, Expo development workflow, and the QR code vehicle activation system when implementing new features.
