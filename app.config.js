/* eslint-env node */
export default () => ({
  expo: {
    name: "Fleet Tracker",
    slug: "fleet-tracker-mobile",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    scheme: "fleettracker",
    icon: "./assets/icon.png",
    splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#ffffff" },
    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.fleettracker", // TODO: set your real bundle ID
      config: { googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY },
      infoPlist: {
        NSCameraUsageDescription:
          "This app uses the camera to capture vehicle photos and scan barcodes for vehicle identification.",
        NSLocationWhenInUseUsageDescription:
          "This app uses location services to track vehicle routes and verify check-in/check-out locations.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app uses location services to continuously track vehicle movement during trips.",
        NSMicrophoneUsageDescription:
          "This app uses the microphone to record voice notes for trip documentation.",
        NSPhotoLibraryUsageDescription:
          "This app accesses your photo library to save vehicle documentation photos.",
        NSMotionUsageDescription:
          "This app uses motion data to enhance location accuracy during vehicle tracking."
      }
    },

    android: {
      package: "com.yourcompany.fleettracker", // TODO: set your real reverse-DNS, lowercase
      adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#FFFFFF" },
      googleServicesFile: "./google-services.json",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.POST_NOTIFICATIONS"
      ],
      config: { googleMaps: { apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY } }
    },

    web: { bundler: "metro", favicon: "./assets/favicon.png" },

    plugins: [
      ["expo-location", {
        locationAlwaysAndWhenInUsePermission:
          "Allow Fleet Tracker to use your location to track vehicle routes and verify locations.",
        locationWhenInUsePermission:
          "Allow Fleet Tracker to use your location to track vehicle routes and verify locations.",
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true
      }],
      ["expo-sensors", { motionPermission: "Allow $(PRODUCT_NAME) to access your device motion." }],
      ["expo-notifications", {
        // icon: "./assets/notification_icon.png", // ensure file exists before uncommenting
        color: "#ffffff",
        defaultChannel: "default",
        enableBackgroundRemoteNotifications: false
      }],
      ["expo-camera", { cameraPermission:
        "Allow Fleet Tracker to access your camera to capture vehicle photos and scan barcodes." }],
      ["expo-media-library", {
        photosPermission: "Allow Fleet Tracker to access your photo library to save vehicle documentation.",
        savePhotosPermission: "Allow Fleet Tracker to save vehicle photos to your device."
      }],
      ["expo-av", { microphonePermission:
        "Allow Fleet Tracker to access your microphone to record voice notes." }],
      ["expo-barcode-scanner", { cameraPermission:
        "Allow Fleet Tracker to access your camera to scan vehicle barcodes and QR codes." }],
      ["expo-document-picker", { iCloudContainerEnvironment: "Production" }],
      [
        "react-native-maps",
        {
          androidApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          iosApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      ]
    ],

    extra: {
      eas: { projectId: "your-eas-project-id" }, // set this to use Expo push tokens
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        // Only include databaseURL if you actually set EXPO_PUBLIC_FIREBASE_DATABASE_URL
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
      }
    },

    owner: "your-expo-username"
  }
});
