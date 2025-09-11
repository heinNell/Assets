export default {
    expo: {
      name: "Fleet Tracker",
      slug: "fleet-tracker-mobile",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.yourcompany.fleettracker",
        infoPlist: {
          NSCameraUsageDescription: "This app uses the camera to capture vehicle photos and scan barcodes for vehicle identification.",
          NSLocationWhenInUseUsageDescription: "This app uses location services to track vehicle routes and verify check-in/check-out locations.",
          NSLocationAlwaysAndWhenInUseUsageDescription: "This app uses location services to continuously track vehicle movement during trips.",
          NSMicrophoneUsageDescription: "This app uses the microphone to record voice notes for trip documentation.",
          NSPhotoLibraryUsageDescription: "This app accesses your photo library to save vehicle documentation photos.",
          NSMotionUsageDescription: "This app uses motion data to enhance location accuracy during vehicle tracking."
        },
        config: {
          googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAhoyKz_MWD2hoesNvhP1ofEP4SZl3dxtg"
        }
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#FFFFFF"
        },
        package: "MatLMVs.com",
        permissions: [
          "CAMERA",
          "RECORD_AUDIO",
          "ACCESS_FINE_LOCATION",
          "ACCESS_COARSE_LOCATION",
          "ACCESS_BACKGROUND_LOCATION",
          "READ_EXTERNAL_STORAGE",
          "WRITE_EXTERNAL_STORAGE"
        ],
        // Firebase configuration for Android
        googleServicesFile: "./google-services.json",
        config: {
          googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAhoyKz_MWD2hoesNvhP1ofEP4SZl3dxtg"
          }
        }
      },
      web: {
        favicon: "./assets/favicon.png",
        bundler: "metro"
      },
      plugins: [
        "expo-maps",
        [
          "expo-camera",
          {
            cameraPermission: "Allow Fleet Tracker to access your camera to capture vehicle photos and scan barcodes."
          }
        ],
        [
          "expo-location",
          {
            locationAlwaysAndWhenInUsePermission: "Allow Fleet Tracker to use your location to track vehicle routes and verify locations.",
            locationWhenInUsePermission: "Allow Fleet Tracker to use your location to track vehicle routes and verify locations.",
            isIosBackgroundLocationEnabled: true,
            isAndroidBackgroundLocationEnabled: true
          }
        ],
        [
          "expo-media-library",
          {
            photosPermission: "Allow Fleet Tracker to access your photo library to save vehicle documentation.",
            savePhotosPermission: "Allow Fleet Tracker to save vehicle photos to your device."
          }
        ],
        [
          "expo-av",
          {
            microphonePermission: "Allow Fleet Tracker to access your microphone to record voice notes."
          }
        ],
        [
          "expo-barcode-scanner",
          {
            cameraPermission: "Allow Fleet Tracker to access your camera to scan vehicle barcodes and QR codes."
          }
        ]
      ],
      extra: {
        eas: {
          projectId: "your-eas-project-id"
        }
      },
      owner: "your-expo-username"
    }
  };