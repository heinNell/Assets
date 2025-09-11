# 1. Assumptions & Filled Placeholders

```typescript
APP_NAME: GeoLookup
APP_PURPOSE: "Convert addresses to coordinates and vice versa using Google Maps Geocoding API"
INPUT_DESCRIPTION: "address string or lat/lng coordinates"
OUTPUT_DESCRIPTION: "detailed location information including formatted address, coordinates, and nearby landmarks"
INPUT_ENTITY_NAME: GeocodeSubmission
INPUT_FIELDS_LIST: 
  - query: string (1-500 chars)
  - type: enum ('address' | 'coordinates')
  - coordinates?: { lat: number, lng: number }
PROCESSING_MODE: "client-side (using Google Maps JavaScript API)"
MAIN_COLLECTION_NAME: "geocode_submissions"
PAGE_SIZE: 10
```

# 2. High-Level Architecture

```
┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  React UI    │────▶│ Google Maps   │────▶│  Firestore  │
│  - Form      │     │ Geocoding API │     │  - History  │
│  - Map       │     │               │     │  - Results  │
└──────────────┘     └───────────────┘     └─────────────┘
       ▲                                          ▲
       │                                          │
       └──────────────── Firebase Auth ──────────┘
```

# 3. Data Model & Firestore Schema

```typescript
// Collection: geocode_submissions
interface GeocodeSubmission {
  id: string;
  userId: string;
  query: string;
  type: 'address' | 'coordinates';
  coordinates?: {
    lat: number;
    lng: number;
  };
  result: {
    formattedAddress: string;
    location: {
      lat: number;
      lng: number;
    };
    placeId: string;
    addressComponents: Array<{
      longName: string;
      shortName: string;
      types: string[];
    }>;
    landmarks?: Array<{
      name: string;
      distance: number;
      type: string;
    }>;
  };
  createdAt: Timestamp;
}
```

Here's a comprehensive step-by-step guide to integrate Google Maps SDK into your Android app, based on the information provided and general best practices:

### 1. **Obtain a Google Maps API Key**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Enable the "Maps SDK for Android" API for your project.
   - Create an API key in the "Credentials" section. This key will be used to authenticate requests from your app.
   - Restrict the API key to Android apps by adding your app's package name and SHA-1 fingerprint (optional but recommended for security).

### 2. **Add the Secrets Gradle Plugin**
   To securely manage your API key, use the Secrets Gradle Plugin. Add it to your project-level `build.gradle` file:
   ```groovy
   // In project-level build.gradle
   buildscript {
       dependencies {
           classpath "com.google.android.libraries.mapsplatform.secrets-gradle-plugin:secrets-gradle-plugin:1.3.0"
       }
   }
   ```

### 3. **Configure the App-level Gradle File**
   Apply the Secrets Gradle Plugin in your app-level `build.gradle` file (located in the `app/` directory):
   ```groovy
   // In app/build.gradle
   plugins {
       id 'com.google.android.libraries.mapsplatform.secrets-gradle-plugin'
   }
   ```

### 4. **Store the API Key Securely**
   - Open or create a file named `local.properties` in the root directory of your project (at the same level as `gradle.properties` and `settings.gradle`).
   - Add your Google Maps API key to this file:
     ```properties
     GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
     ```
   - Replace `YOUR_KEY_HERE` with the actual API key you created in the Google Cloud Console.
   - Ensure `local.properties` is listed in your `.gitignore` file to prevent the API key from being committed to source control, as it is sensitive information.

### 5. **Add Google Maps SDK Dependency**
   In your app-level `build.gradle` file, add the dependency for the Google Maps SDK for Android:
   ```groovy
   // In app/build.gradle
   dependencies {
       implementation 'com.google.android.gms:play-services-maps:18.2.0' // Use the latest version
   }
   ```

### 6. **Update AndroidManifest.xml**
   Add the necessary permissions and meta-data for Google Maps in your `AndroidManifest.xml` file (located in `app/src/main/`):
   ```xml
   <manifest ... >
       <!-- Required permissions for Google Maps -->
       <uses-permission android:name="android.permission.INTERNET" />
       <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
       <!-- Optional: For coarse location -->
       <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

       <application ... >
           <!-- Add meta-data for API key (handled by Secrets Gradle Plugin) -->
           <meta-data
               android:name="com.google.android.geo.API_KEY"
               android:value="${GOOGLE_MAPS_API_KEY}" />
       </application>
   </manifest>
   ```

### 7. **Request Location Permissions (if needed)**
   If your app uses location features, request runtime permissions for `ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION` in your activity or fragment. For Android 6.0 (API level 23) and above, permissions must be requested at runtime.

   Example in Kotlin:
   ```kotlin
   if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
       != PackageManager.PERMISSION_GRANTED) {
       ActivityCompat.requestPermissions(
           this,
           arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
           LOCATION_PERMISSION_REQUEST_CODE
       )
   }
   ```

### 8. **Add a Map Fragment or View to Your Layout**
   In your layout XML file (e.g., `activity_main.xml`), add a `SupportMapFragment` to display the map:
   ```xml
   <fragment
       android:id="@+id/map"
       android:name="com.google.android.gms.maps.SupportMapFragment"
       android:layout_width="match_parent"
       android:layout_height="match_parent" />
   ```

### 9. **Initialize the Map in Your Activity or Fragment**
   In your activity or fragment, initialize the map using `SupportMapFragment` and set up a callback to interact with the map:
   ```kotlin
   // In your Activity or Fragment (Kotlin)
   class MainActivity : AppCompatActivity(), OnMapReadyCallback {

       private lateinit var googleMap: GoogleMap

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           setContentView(R.layout.activity_main)

           // Initialize the map fragment
           val mapFragment = supportFragmentManager
               .findFragmentById(R.id.map) as SupportMapFragment
           mapFragment.getMapAsync(this)
       }

       override fun onMapReady(map: GoogleMap) {
           googleMap = map
           // Customize the map (e.g., set location, markers, etc.)
           googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(LatLng(37.7749, -122.4194), 10f))
       }
   }
   ```

### 10. **Sync and Build Your Project**
   - Sync your project with Gradle to ensure all dependencies and plugins are resolved.
   - Build and run your app on an emulator or physical device to verify that the map displays correctly.

### Security Reminder:
- Never hardcode API keys in your code or commit them to source control.
- Use the Secrets Gradle Plugin to manage sensitive information like API keys.
- Restrict your API key usage to specific Android apps in the Google Cloud Console for added security.

By following these steps, you should successfully integrate the Google Maps SDK into your Android app and be able to display and interact with maps. If you encounter issues, ensure your API key is correctly configured and that the necessary permissions are granted.


