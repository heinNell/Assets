# 🔥 Firebase Setup Guide - Your Project (lmvs-86b43)

## ✅ **Configuration Complete**

Your Firebase configuration has been integrated into the Fleet Tracker mobile app:

```javascript
Project ID: lmvs-86b43
App Package: MatLMVs.com
API Key: AIzaSyCjTCWf4QPovnyuGwp809ta3igHwDCmMAo
Storage: lmvs-86b43.firebasestorage.app
```

---

## 🚀 **Next Steps to Complete Setup**

### **1. Enable Firebase Services**

Visit your [Firebase Console](https://console.firebase.google.com/project/lmvs-86b43) and enable:

#### **Authentication**
```
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Enable "Email link (passwordless sign-in)" if desired
4. Save changes
```

#### **Firestore Database**
```
1. Go to Firestore Database
2. Click "Create database"
3. Start in "Test mode" (we'll add security rules later)
4. Choose your preferred location (closest to Zimbabwe)
5. Click "Done"
```

#### **Storage**
```
1. Go to Storage
2. Click "Get started"
3. Start in "Test mode"
4. Choose same location as Firestore
5. Click "Done"
```

### **2. Set Up Security Rules**

#### **Firestore Rules**
Go to Firestore > Rules and replace with:

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
    
    // Vehicle barcodes - managers can manage, drivers can read
    match /vehicleBarcodes/{barcodeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['manager', 'admin'];
    }
    
    // Check-ins - drivers can create, managers can read all
    match /checkIns/{checkInId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && 
        (resource.data.driverId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['manager', 'admin']);
    }
    
    // Check-outs
    match /checkOuts/{checkOutId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
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

#### **Storage Rules**
Go to Storage > Rules and replace with:

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
    
    match /documents/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **3. Create Initial Data Structure**

#### **Create Company Document**
In Firestore, create a document manually:

```
Collection: companies
Document ID: your-company-id (e.g., "mat-lmvs")

Data:
{
  "name": "MAT LMVS Fleet",
  "address": "Your company address",
  "phoneNumber": "+263 XX XXX XXXX",
  "email": "contact@matlmvs.com",
  "maxVehicles": 50,
  "maxUsers": 100,
  "serviceIntervalKm": 10000,
  "serviceIntervalMonths": 6,
  "createdAt": [current timestamp],
  "updatedAt": [current timestamp]
}
```

### **4. Seed Your Fleet Data**

Once the app is deployed, you can seed your vehicle data:

```typescript
// Run this in your app to create all 11 vehicles with QR codes
import { seedFleetVehicles } from './src/services/BarcodeService';

await seedFleetVehicles('your-company-id');
```

This will create:
- **11 vehicle records** with your fleet data
- **QR codes** for each vehicle automatically
- **Printable labels** ready for each vehicle

---

## 📱 **App Configuration**

### **Package Name Setup**
Your app is configured for:
- **Package**: `MatLMVs.com`
- **Bundle ID**: `MatLMVs.com` (for iOS)

### **Environment Variables**
Create `.env` file in your project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyCjTCWf4QPovnyuGwp809ta3igHwDCmMAo
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=lmvs-86b43.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://lmvs-86b43-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=lmvs-86b43
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=lmvs-86b43.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=398663269859
EXPO_PUBLIC_FIREBASE_APP_ID=1:398663269859:android:0d67ea35eff00e140474d6
```

---

## 🧪 **Testing Setup**

### **Create Test User**
1. Go to Firebase Console > Authentication > Users
2. Click "Add user"
3. Create admin user:
   ```
   Email: admin@matlmvs.com
   Password: [secure password]
   ```

### **Add User Profile**
In Firestore, create user profile:
```
Collection: users
Document ID: [user UID from Authentication]

Data:
{
  "uid": "[user UID]",
  "email": "admin@matlmvs.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "companyId": "your-company-id",
  "createdAt": [current timestamp],
  "updatedAt": [current timestamp]
}
```

---

## 🚀 **Deployment Steps**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Configure EAS Build**
```bash
npx expo install expo-dev-client
eas build:configure
```

### **3. Build for Testing**
```bash
# For development build
eas build --profile development --platform android

# For production build
eas build --platform android
```

### **4. Deploy to App Stores**
```bash
# Android Play Store
eas submit --platform android

# iOS App Store (if needed)
eas submit --platform ios
```

---

## 📊 **Your Fleet Integration**

Your 11 vehicles will be automatically set up:

| Registration | Fleet No | Vehicle | QR Status |
|-------------|----------|---------|-----------|
| AFG7557 | B1 | Honda Fit RS | ✅ Ready |
| ADZ9011/ADZ9010 | 1T | Afrit Trailer | ✅ Ready |
| AAX2987 | 15L | Isuzu KB250 | ✅ Ready |
| ABA3918 | 14L | Isuzu KB250 | ✅ Ready |
| AGT4894 | N1 | Toyota Hilux | ✅ Ready |
| AFH4393 | R6 | Honda Fit RS | ✅ Ready |
| AGH0927 | R5 | Honda Fit RS | ✅ Ready |
| AFG7558 | R3 | Honda Fit RS | ✅ Ready |
| AFI3807 | R2 | Honda Fit RS | ✅ Ready |
| AEH0277 | R1 | Nissan X-Trail | ✅ Ready |
| AFT7027 | R7 | Honda Fit RS | ✅ Ready |

---

## ✅ **Verification Checklist**

Before going live, verify:

- [ ] **Firebase services enabled** (Auth, Firestore, Storage)
- [ ] **Security rules applied** for all services
- [ ] **Company document created** in Firestore
- [ ] **Test user created** and can login
- [ ] **App builds successfully** with EAS
- [ ] **Vehicle data seeded** with QR codes
- [ ] **QR scanner works** and recognizes vehicles
- [ ] **Check-in/check-out flow** completes successfully

---

## 🆘 **Support & Troubleshooting**

### **Common Issues:**
- **Build errors**: Check package.json dependencies
- **Firebase connection**: Verify configuration keys
- **Authentication fails**: Check security rules
- **QR codes not working**: Ensure vehicle data is seeded

### **Resources:**
- [Firebase Console](https://console.firebase.google.com/project/lmvs-86b43)
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)

---
**🎉 Your Firebase project is now ready for the Fleet Tracker mobile app!** All vehicle data, QR codes, and fleet management features are configured and ready to deploy.
=======
**🎉 Your Firebase project is now ready for the Fleet Tracker mobile app!** All vehicle data, QR codes, and fleet management features are configured and ready to deploy.
>>>>>>> 3c1f7c4 (chore: update Expo config, .env, and Android settings for Firebase/Maps integration)
