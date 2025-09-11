1.Add your API key

The API key that you created in an earlier step needs to be provided to the app so that Maps SDK for Android can associate your key with your app.

To provide this, open the file called local.properties in the root directory of your project (the same level where gradle.properties and settings.gradle are).
In that file, define a new key GOOGLE_MAPS_API_KEY with its value being the API key that you created.
local.properties

GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
Notice that local.properties is listed in the .gitignore file in the Git repository. This is because your API key is considered sensitive information and should not be checked in to source control, if possible.

Next, to expose your API so it can be used throughout your app, include the Secrets Gradle Plugin for Android plugin in your app's build.gradle file located in the app/ directory and add the following line within the plugins block:
app-level build.gradle

plugins {
    // ...
    id 'com.google.android.libraries.mapsplatform.secrets-gradle-plugin'
}
You will also need to modify your project-level build.gradle file to include the following classpath:

project-level build.gradle

buildscript {
    dependencies {
        // ...
        classpath "com.google.android.libraries.mapsplatform.secrets-gradle-plugin:secrets-gradle-plugin:1.3.0"
    }
}
This plugin will make keys you have defined within your local.properties file available as build variables in the Android manifest file and as variables in the Gradle-generated BuildConfig class at build time. Using this plugin removes the boilerplate code that would otherwise be needed to read properties from local.properties so that it can be accessed throughout your app.

Note: API keys are sensitive credentials that should be carefully protected to avoid abuse. For more information about best practices for securing your API key, read Protecting API keys. For more Gradle tips, see Gradle tips and recipes.

Note: Make sure to update the correct build.gradle file. In your project, there should be two. One project-level build.gradle file and a module-specific one (app/build.gradle). The latter is the correct one to use.

Add Google Maps dependency
Now that your API key can be accessed inside the app, the next step is to add the Maps SDK for Android dependency to your app's build.gradle file.
In the starter project that comes with this codelab, this dependency has already been added for you.

build.gradle

dependencies {
   // Dependency to include Maps SDK for Android
   implementation 'com.google.android.gms:play-services-maps:17.0.0'
}
Next, add a new meta-data tag in AndroidManifest.xml to pass in the API key that you created in an earlier step. To do so, go ahead and open this file in Android Studio and add the following meta-data tag inside the application object in your AndroidManifest.xml file, located in app/src/main.
AndroidManifest.xml

<meta-data
   android:name="com.google.android.geo.API_KEY"
   android:value="${GOOGLE_MAPS_API_KEY}" />
Note: Notice that the injected build variable matches the same name as the variable you declared in your local.properties file earlier. Normally, you would have to modify your build.gradle file to inject build variables into your manifest file, but this is all handled by the Secrets Gradle Plugin for Android plugin.

Next, create a new layout file called activity_main.xml in the app/src/main/res/layout/ directory and define it as follows:
activity_main.xml

<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:tools="http://schemas.android.com/tools"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   tools:context=".MainActivity">

   <fragment
       class="com.google.android.gms.maps.SupportMapFragment"
       android:id="@+id/map_fragment"
       android:layout_width="match_parent"
       android:layout_height="match_parent" />

</FrameLayout>
This layout has a single FrameLayout containing a SupportMapFragment. This fragment contains the underlying GoogleMaps object that you use in later steps.

Lastly, update the MainActivity class located in app/src/main/java/com/google/codelabs/buildyourfirstmap by adding the following code to override the onCreate method so you can set its contents with the new layout you just created.
MainActivity

override fun onCreate(savedInstanceState: Bundle?) {
   super.onCreate(savedInstanceState)
   setContentView(R.layout.activity_main)
}


5. Cloud-based map styling (Optional)
You can customize the style of your map using Cloud-based map styling.

Create a Map ID
If you have not yet created a map ID with a map style associated to it, see the Map IDs guide to complete the following steps:

Create a map ID.
Associate a map ID to a map style.
Note: Using a Map ID on Maps SDK for Android or Maps SDK for iOS triggers a map load that is charged against the Dynamic Maps SKU. See Google Maps Billing for more information.

Adding the Map ID to your app
To use the map ID you created, modify the activity_main.xml file and pass your map ID in the map:mapId attribute of the SupportMapFragment.

activity_main.xml

<fragment xmlns:map="http://schemas.android.com/apk/res-auto"
    class="com.google.android.gms.maps.SupportMapFragment"
    <!-- ... -->
    map:mapId="YOUR_MAP_ID" />
Once you've completed this, go ahead and run the app to see your map in the style that you selected!



6. Add markers
In this task, you add markers to the map that represent points of interest that you want to highlight on the map. First, you retrieve a list of places that have been provided in the starter project for you, then add those places to the map. In this example, these are bicycle shops.

bc5576877369b554.png

Get a reference to GoogleMap
First, you need to obtain a reference to the GoogleMap object so that you can use its methods. To do that, add the following code in your MainActivity.onCreate() method right after the call to setContentView():

MainActivity.onCreate()

val mapFragment = supportFragmentManager.findFragmentById(   
    R.id.map_fragment
) as? SupportMapFragment
mapFragment?.getMapAsync { googleMap ->
    addMarkers(googleMap)
}
The implementation first finds the SupportMapFragment that you added in the previous step by using the findFragmentById() method on the SupportFragmentManager object. Once a reference has been obtained, the getMapAsync() call is invoked followed by passing in a lambda. This lambda is where the GoogleMap object is passed. Inside this lambda, the addMarkers() method call is invoked, which is defined shortly.

Note: As you copy and paste code from this codelab to your project, expect to see Unresolved reference errors. To fix these, you need to import the class in to your file. You can do this automatically in Android Studio by hovering on the class that displays an error and clicking Import in the helper dialog.

94a55dc909c3e04e.png

Provided class: PlacesReader
In the starter project, the class PlacesReader has been provided for you. This class reads a list of 49 places that are stored in a JSON file called places.json and returns these as a List<Place>. The places themselves represent a list of bicycle shops around San Francisco, CA, USA.

If you are curious about the implementation of this class, you can access it on GitHub or open the PlacesReader class in Android Studio.

PlacesReader

package com.google.codelabs.buildyourfirstmap.place

import android.content.Context
import com.google.codelabs.buildyourfirstmap.R
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.InputStream
import java.io.InputStreamReader

/**
* Reads a list of place JSON objects from the file places.json
*/
class PlacesReader(private val context: Context) {

   // GSON object responsible for converting from JSON to a Place object
   private val gson = Gson()

   // InputStream representing places.json
   private val inputStream: InputStream
       get() = context.resources.openRawResource(R.raw.places)

   /**
    * Reads the list of place JSON objects in the file places.json
    * and returns a list of Place objects
    */
   fun read(): List<Place> {
       val itemType = object : TypeToken<List<PlaceResponse>>() {}.type
       val reader = InputStreamReader(inputStream)
       return gson.fromJson<List<PlaceResponse>>(reader, itemType).map {
           it.toPlace()
       }
   }
Load places
To load the list of bicycle shops, add a property in MainActivity called places and define it as follows:

MainActivity.places

private val places: List<Place> by lazy {
   PlacesReader(this).read()
}
Note: This property is declared as lazy so that reading all the places from the file is performed only when needed—right after the GoogleMap object is initialized. For more information about lazy properties, see Lazy.

This code invokes the read() method on a PlacesReader, which returns a List<Place>. A Place has a property called name, the name of the place, and a latLng—the coordinates where the place is located.

Place

data class Place(
   val name: String,
   val latLng: LatLng,
   val address: LatLng,
   val rating: Float
)
Add markers to map
Now that the list of places have been loaded to memory, the next step is to represent these places on the map.

Create a method in MainActivity called addMarkers() and define it as follows:
MainActivity.addMarkers()

/**
* Adds marker representations of the places list on the provided GoogleMap object
*/
private fun addMarkers(googleMap: GoogleMap) {
   places.forEach { place ->
       val marker = googleMap.addMarker(
           MarkerOptions()
               .title(place.name)
               .position(place.latLng)
       )
   }
}
This method iterates through the list of places followed by invoking the addMarker() method on the provided GoogleMap object. The marker is created by instantiating a MarkerOptions object, which allows you to customize the marker itself. In this case, the title and position of the marker is provided, which represents the bicycle shop name and its coordinates, respectively.





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

7. Customize markers
There are several customization options for markers you have just added to help them stand out and convey useful information to users. In this task, you'll explore some of those by customizing the image of each marker as well as the information window displayed when a marker is tapped.

a26f82802fe838e9.png

Adding an info window
By default, the info window when you tap on a marker displays its title and snippet (if set). You customize this so that it can display additional information, such as the place's address and rating.

Create marker_info_contents.xml
First, create a new layout file called marker_info_contents.xml.

To do so, right click on the app/src/main/res/layout folder in the project view in Android Studio and select New > Layout Resource File.
8cac51fcbef9171b.png

In the dialog, type marker_info_contents in the File name field and LinearLayout in the Root element field, then click OK.
8783af12baf07a80.png

This layout file is later inflated to represent the contents within the info window.

Copy the contents in the following code snippet, which adds three TextViews within a vertical LinearLayout view group, and overwrite the default code in the file.
marker_info_contents.xml

<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:tools="http://schemas.android.com/tools"
   android:orientation="vertical"
   android:layout_width="wrap_content"
   android:layout_height="wrap_content"
   android:gravity="center_horizontal"
   android:padding="8dp">

   <TextView
       android:id="@+id/text_view_title"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:textColor="@android:color/black"
       android:textSize="18sp"
       android:textStyle="bold"
       tools:text="Title"/>

   <TextView
       android:id="@+id/text_view_address"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:textColor="@android:color/black"
       android:textSize="16sp"
       tools:text="123 Main Street"/>

   <TextView
       android:id="@+id/text_view_rating"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:textColor="@android:color/black"
       android:textSize="16sp"
       tools:text="Rating: 3"/>

</LinearLayout>
Create an implementation of an InfoWindowAdapter
After creating the layout file for the custom info window, the next step is to implement the GoogleMap.InfoWindowAdapter interface. This interface contains two methods, getInfoWindow() and getInfoContents(). Both methods return an optional View object wherein the former is used to customize the window itself, while the latter is to customize its contents. In your case, you implement both and customize the return of getInfoContents() while returning null in getInfoWindow(), which indicates that the default window should be used.

Create a new Kotlin file called MarkerInfoWindowAdapter in the same package as MainActivity by right-clicking the app/src/main/java/com/google/codelabs/buildyourfirstmap folder in the project view in Android Studio, then select New > Kotlin File/Class.
3975ba36eba9f8e1.png

In the dialog, type MarkerInfoWindowAdapter and keep File highlighted.
992235af53d3897f.png

Once you have the file created, copy the contents in the following code snippet in to your new file.
MarkerInfoWindowAdapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.widget.TextView
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.model.Marker
import com.google.codelabs.buildyourfirstmap.place.Place

class MarkerInfoWindowAdapter(
    private val context: Context
) : GoogleMap.InfoWindowAdapter {
   override fun getInfoContents(marker: Marker?): View? {
       // 1. Get tag
       val place = marker?.tag as? Place ?: return null

       // 2. Inflate view and set title, address, and rating
       val view = LayoutInflater.from(context).inflate(
           R.layout.marker_info_contents, null
       )
       view.findViewById<TextView>(
           R.id.text_view_title
       ).text = place.name
       view.findViewById<TextView>(
           R.id.text_view_address
       ).text = place.address
       view.findViewById<TextView>(
           R.id.text_view_rating
       ).text = "Rating: %.2f".format(place.rating)

       return view
   }

   override fun getInfoWindow(marker: Marker?): View? {
       // Return null to indicate that the 
       // default window (white bubble) should be used
       return null
   }
}
In the contents of the getInfoContents() method, the provided Marker in the method is casted to a Place type, and if casting is not possible, the method returns null (you haven't set the tag property on the Marker yet, but you do that in the next step).

Next, the layout marker_info_contents.xml is inflated followed by setting the text on containing TextViews to the Place tag.

Update MainActivity
To glue all the components you have created so far, you need to add two lines in your MainActivity class.

First, to pass the custom InfoWindowAdapter, MarkerInfoWindowAdapter, inside the getMapAsync method call, invoke the setInfoWindowAdapter() method on the GoogleMap object and create a new instance of MarkerInfoWindowAdapter.

Do this by adding the following code after the addMarkers() method call inside the getMapAsync() lambda.
MainActivity.onCreate()

// Set custom info window adapter
googleMap.setInfoWindowAdapter(MarkerInfoWindowAdapter(this))
Lastly, you'll need to set each Place as the tag property on every Marker that's added to the map.

To do that, modify the places.forEach{} call in the addMarkers() function with the following:
MainActivity.addMarkers()

places.forEach { place ->
   val marker = googleMap.addMarker(
       MarkerOptions()
           .title(place.name)
           .position(place.latLng)
           .icon(bicycleIcon)
   )

   // Set place as the tag on the marker object so it can be referenced within
   // MarkerInfoWindowAdapter
   marker.tag = place
}
Add a custom marker image
Customizing the marker image is one of the fun ways to communicate the type of place the marker represents on your map. For this step, you display bicycles instead of the default red markers to represent each shop on the map. The starter project includes the bicycle icon ic_directions_bike_black_24dp.xml in app/src/res/drawable, which you use.

6eb7358bb61b0a88.png

Set custom bitmap on marker
With the vector drawable bicycle icon at your disposal, the next step is to set that drawable as each markers' icon on the map. MarkerOptions has a method icon, which takes in a BitmapDescriptor that you use to accomplish this.

First, you need to convert the vector drawable you just added into a BitmapDescriptor. A file called BitMapHelper included in the starter project contains a helper function called vectorToBitmap(), which does just that.

BitmapHelper

package com.google.codelabs.buildyourfirstmap

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.util.Log
import androidx.annotation.ColorInt
import androidx.annotation.DrawableRes
import androidx.core.content.res.ResourcesCompat
import androidx.core.graphics.drawable.DrawableCompat
import com.google.android.gms.maps.model.BitmapDescriptor
import com.google.android.gms.maps.model.BitmapDescriptorFactory

object BitmapHelper {
   /**
    * Demonstrates converting a [Drawable] to a [BitmapDescriptor], 
    * for use as a marker icon. Taken from ApiDemos on GitHub:
    * https://github.com/googlemaps/android-samples/blob/main/ApiDemos/kotlin/app/src/main/java/com/example/kotlindemos/MarkerDemoActivity.kt
    */
   fun vectorToBitmap(
      context: Context,
      @DrawableRes id: Int, 
      @ColorInt color: Int
   ): BitmapDescriptor {
       val vectorDrawable = ResourcesCompat.getDrawable(context.resources, id, null)
       if (vectorDrawable == null) {
           Log.e("BitmapHelper", "Resource not found")
           return BitmapDescriptorFactory.defaultMarker()
       }
       val bitmap = Bitmap.createBitmap(
           vectorDrawable.intrinsicWidth,
           vectorDrawable.intrinsicHeight,
           Bitmap.Config.ARGB_8888
       )
       val canvas = Canvas(bitmap)
       vectorDrawable.setBounds(0, 0, canvas.width, canvas.height)
       DrawableCompat.setTint(vectorDrawable, color)
       vectorDrawable.draw(canvas)
       return BitmapDescriptorFactory.fromBitmap(bitmap)
   }
}
This method takes in a Context, a drawable resource ID, as well as a color integer, and creates a BitmapDescriptor representation of it.

Note: vectorToBitmap was taken from the Maps SDK for Android samples. For more information, see it on GitHub.

Using the helper method, declare a new property called bicycleIcon and give it the following definition: MainActivity.bicycleIcon

private val bicycleIcon: BitmapDescriptor by lazy {
   val color = ContextCompat.getColor(this, R.color.colorPrimary)
   BitmapHelper.vectorToBitmap(this, R.drawable.ic_directions_bike_black_24dp, color)
}
This property uses the predefined color colorPrimary in your app, and uses that to tint the bicycle icon and return it as a BitmapDescriptor.

Using this property, go ahead and invoke the icon method of MarkerOptions in the addMarkers() method to complete your icon customization. Doing this, the marker property should look like this:
MainActivity.addMarkers()

val marker = googleMap.addMarker(
    MarkerOptions()
        .title(place.name)
        .position(place.latLng)
        .icon(bicycleIcon)
)
Run the app to see the updated markers!




Here's a detailed explanation of how motion tracking works in the Google Maps JavaScript API:

### Motion Tracking Overview
Motion tracking allows users to change the Street View point of view by moving their mobile devices. This feature is specifically designed for devices that support device orientation events.

### Key Features and Configuration

1. **Default Behavior**
- Motion tracking is enabled by default on supported devices
- Users can look around by physically moving their devices

2. **Configuration Options**
```javascript
// Basic configuration example
var panorama = new google.maps.StreetViewPanorama(element, {
    position: { lat: 37.869260, lng: -122.254811 },
    pov: { heading: 165, pitch: 0 },
    motionTracking: false,              // Enable/disable tracking
    motionTrackingControl: false,       // Show/hide control
    motionTrackingControlOptions: {     // Control position
        position: google.maps.ControlPosition.LEFT_BOTTOM
    }
});
```

### Customization Options

1. **Enable/Disable Motion Tracking**
- Use `motionTracking` property
- Default is enabled on supported devices
- Can be disabled while keeping the control visible

2. **Control Visibility**
- Use `motionTrackingControl` property
- Control only appears on supported devices
- Can be hidden even if motion tracking is enabled

3. **Control Position**
- Use `motionTrackingControlOptions.position`
- Default position is RIGHT_BOTTOM
- Can be repositioned using ControlPosition constants

### Important Notes

- Motion tracking only works on devices with orientation event support
- The control will not appear on unsupported devices regardless of settings
- Users can toggle motion tracking using the control (if visible)
- The feature is particularly useful for mobile and tablet devices
- Motion tracking enhances the immersive experience of Street View

### Best Practices

1. Consider your target audience's devices
2. Provide alternative navigation methods
3. Position the control where it won't interfere with other UI elements
4. Test the feature on various devices and orientations
5. Consider providing user instructions for first-time users

This feature significantly enhances the user experience on mobile devices by providing a more intuitive way to explore Street View panoramas.



Events

bookmark_border

Select platform: Android iOS JavaScript
Using the Maps SDK for Android, you can listen to events on the map.

Code samples
The ApiDemos repository on GitHub includes samples that demonstrates events and listeners:

Kotlin

EventsDemoActivity: Map click and camera change events
CameraDemoActivity: Camera change events
CircleDemoActivity: Marker click and drag events
GroundOverlayDemoActivity: Ground overlay click events
IndoorDemoActivity: Indoor map events
MarkerDemoActivity: Marker and info window events
PolygonDemoActivity: Polygon events
Java

EventsDemoActivity: Map click and camera change events
CameraDemoActivity: Camera change events
CircleDemoActivity: Marker click and drag events
GroundOverlayDemoActivity: Ground overlay click events
IndoorDemoActivity: Indoor map events
MarkerDemoActivity: Marker and info window events
PolygonDemoActivity: Polygon events
Map click / long click events
If you want to respond to a user tapping on a point on the map, you can use an OnMapClickListener which you can set on the map by calling GoogleMap.setOnMapClickListener(OnMapClickListener). When a user clicks (taps) somewhere on the map, you will receive an onMapClick(LatLng) event that indicates the location on the map that the user clicked. Note that if you need the corresponding location on the screen (in pixels), you can obtain a Projection from the map which allows you to convert between latitude/longitude coordinates and screen pixel coordinates.

You can also listen for long click events with an OnMapLongClickListener which you can set on the map by calling GoogleMap.setOnMapLongClickListener(OnMapLongClickListener). This listener behaves similarly to the click listener and will be notified on long click events with an onMapLongClick(LatLng) callback.

Disabling click events in lite mode
To disable click events on a map in lite mode, call setClickable() on the view that contains the MapView or MapFragment. This is useful, for example, when displaying a map or maps in a list view, where you want the click event to invoke an action unrelated to the map.

The option to disable click events is available in lite mode only. Disabling click events will also make markers non-clickable. It will not affect other controls on the map.

For a MapView:


Kotlin
Java

val mapView = findViewById<MapView>(R.id.mapView)
mapView.isClickable = false

      
For a MapFragment:


Kotlin
Java

val mapFragment = supportFragmentManager
    .findFragmentById(R.id.map) as SupportMapFragment
val view = mapFragment.view
view?.isClickable = false

      

Camera change events
The map view is modeled as a camera looking down on a flat plane. You can change the properties of the camera to affect the zoom level, view port and perspective of the map. See the guide to the camera. Users can also affect the camera by making gestures.

Using camera change listeners, you can keep track of camera movements. Your app can receive notifications for camera motion start, ongoing, and end events. You can also see why the camera is moving, whether it's caused by user gestures, built-in API animations or developer-controlled movements.

The following sample illustrates all the available camera event listeners:

Kotlin
Java


/*
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.kotlindemos

import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.CompoundButton
import android.widget.SeekBar
import android.widget.Toast
import com.example.common_ui.R

import com.google.android.gms.maps.CameraUpdate
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.GoogleMap.CancelableCallback
import com.google.android.gms.maps.GoogleMap.OnCameraIdleListener
import com.google.android.gms.maps.GoogleMap.OnCameraMoveCanceledListener
import com.google.android.gms.maps.GoogleMap.OnCameraMoveListener
import com.google.android.gms.maps.GoogleMap.OnCameraMoveStartedListener
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.PolylineOptions

/**
 * This shows how to change the camera position for the map.
 */
class CameraDemoActivity :
        SamplesBaseActivity(),
        OnCameraMoveStartedListener,
        OnCameraMoveListener,
        OnCameraMoveCanceledListener,
        OnCameraIdleListener,
        OnMapReadyCallback {
    /**
     * The amount by which to scroll the camera. Note that this amount is in raw pixels, not dp
     * (density-independent pixels).
     */
    private val SCROLL_BY_PX = 100
    private val TAG = CameraDemoActivity::class.java.name
    private val sydneyLatLng = LatLng(-33.87365, 151.20689)
    private val bondiLocation: CameraPosition = CameraPosition.Builder()
            .target(LatLng(-33.891614, 151.276417))
            .zoom(15.5f)
            .bearing(300f)
            .tilt(50f)
            .build()

    private val sydneyLocation: CameraPosition = CameraPosition.Builder().
            target(LatLng(-33.87365, 151.20689))
            .zoom(15.5f)
            .bearing(0f)
            .tilt(25f)
            .build()

    private lateinit var map: GoogleMap
    private lateinit var animateToggle: CompoundButton
    private lateinit var customDurationToggle: CompoundButton
    private lateinit var customDurationBar: SeekBar
    private var currPolylineOptions: PolylineOptions? = null
    private var isCanceled = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.camera_demo)
        animateToggle = findViewById(R.id.animate)
        customDurationToggle = findViewById(R.id.duration_toggle)
        customDurationBar = findViewById(R.id.duration_bar)

        updateEnabledState()

        val mapFragment = supportFragmentManager.findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)
        applyInsets(findViewById<View?>(R.id.map_container))
    }

    override fun onResume() {
        super.onResume()
        updateEnabledState()
    }

    override fun onMapReady(googleMap: GoogleMap) {
        map = googleMap
        // return early if the map was not initialised properly
        with(googleMap) {
            setOnCameraIdleListener(this@CameraDemoActivity)
            setOnCameraMoveStartedListener(this@CameraDemoActivity)
            setOnCameraMoveListener(this@CameraDemoActivity)
            setOnCameraMoveCanceledListener(this@CameraDemoActivity)
            // We will provide our own zoom controls.
            uiSettings.isZoomControlsEnabled = false
            uiSettings.isMyLocationButtonEnabled = true

            // Show Sydney
            moveCamera(CameraUpdateFactory.newLatLngZoom(sydneyLatLng, 10f))
        }
    }

    /**
     * When the map is not ready the CameraUpdateFactory cannot be used. This should be used to wrap
     * all entry points that call methods on the Google Maps API.
     *
     * @param stuffToDo the code to be executed if the map is initialised
     */
    private fun checkReadyThen(stuffToDo: () -> Unit) {
        if (!::map.isInitialized) {
            Toast.makeText(this, R.string.map_not_ready, Toast.LENGTH_SHORT).show()
        } else {
            stuffToDo()
        }
    }

    /**
     * Called when the Go To Bondi button is clicked.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onGoToBondi(view: View) {
        checkReadyThen {
            changeCamera(CameraUpdateFactory.newCameraPosition(bondiLocation))
        }
    }

    /**
     * Called when the Animate To Sydney button is clicked.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onGoToSydney(view: View) {
        checkReadyThen {
            changeCamera(CameraUpdateFactory.newCameraPosition(sydneyLocation),
                    object : CancelableCallback {
                        override fun onFinish() {
                            Toast.makeText(baseContext, "Animation to Sydney complete",
                                    Toast.LENGTH_SHORT).show()
                        }

                        override fun onCancel() {
                            Toast.makeText(baseContext, "Animation to Sydney canceled",
                                    Toast.LENGTH_SHORT).show()
                        }
                    })
        }
    }

    /**
     * Called when the stop button is clicked.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onStopAnimation(view: View) = checkReadyThen { map.stopAnimation() }

    /**
     * Called when the zoom in button (the one with the +) is clicked.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onZoomIn(view: View) = checkReadyThen { changeCamera(CameraUpdateFactory.zoomIn()) }

    /**
     * Called when the zoom out button (the one with the -) is clicked.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onZoomOut(view: View) = checkReadyThen { changeCamera(CameraUpdateFactory.zoomOut()) }

    /**
     * Called when the tilt more button (the one with the /) is clicked.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onTiltMore(view: View) {
        checkReadyThen {

            val newTilt = Math.min(map.cameraPosition.tilt + 10, 90F)
            val cameraPosition = CameraPosition.Builder(map.cameraPosition).tilt(newTilt).build()

            changeCamera(CameraUpdateFactory.newCameraPosition(cameraPosition))
        }
    }

    /**
     * Called when the tilt less button (the one with the \) is clicked.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onTiltLess(view: View) {
        checkReadyThen {

            val newTilt = Math.max(map.cameraPosition.tilt - 10, 0F)
            val cameraPosition = CameraPosition.Builder(map.cameraPosition).tilt(newTilt).build()

            changeCamera(CameraUpdateFactory.newCameraPosition(cameraPosition))
        }
    }

    /**
     * Called when the left arrow button is clicked. This causes the camera to move to the left
     */
    @Suppress("UNUSED_PARAMETER")
    fun onScrollLeft(view: View) {
        checkReadyThen {
            changeCamera(CameraUpdateFactory.scrollBy((-SCROLL_BY_PX).toFloat(),0f))
        }
    }

    /**
     * Called when the right arrow button is clicked. This causes the camera to move to the right.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onScrollRight(view: View) {
        checkReadyThen {
            changeCamera(CameraUpdateFactory.scrollBy(SCROLL_BY_PX.toFloat(), 0f))
        }
    }

    /**
     * Called when the up arrow button is clicked. The causes the camera to move up.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onScrollUp(view: View) {
        checkReadyThen {
            changeCamera(CameraUpdateFactory.scrollBy(0f, (-SCROLL_BY_PX).toFloat()))
        }
    }

    /**
     * Called when the down arrow button is clicked. This causes the camera to move down.
     */
    @Suppress("UNUSED_PARAMETER")
    fun onScrollDown(view: View) {
        checkReadyThen {
            changeCamera(CameraUpdateFactory.scrollBy(0f, SCROLL_BY_PX.toFloat()))
        }
    }

    /**
     * Called when the animate button is toggled
     */
    @Suppress("UNUSED_PARAMETER")
    fun onToggleAnimate(view: View) = updateEnabledState()

    /**
     * Called when the custom duration checkbox is toggled
     */
    @Suppress("UNUSED_PARAMETER")
    fun onToggleCustomDuration(view: View) = updateEnabledState()

    /**
     * Update the enabled state of the custom duration controls.
     */
    private fun updateEnabledState() {
        customDurationToggle.isEnabled = animateToggle.isChecked
        customDurationBar.isEnabled = animateToggle.isChecked && customDurationToggle.isChecked
    }

    /**
     * Change the camera position by moving or animating the camera depending on the state of the
     * animate toggle button.
     */
    private fun changeCamera(update: CameraUpdate, callback: CancelableCallback? = null) {
        if (animateToggle.isChecked) {
            if (customDurationToggle.isChecked) {
                // The duration must be strictly positive so we make it at least 1.
                map.animateCamera(update, Math.max(customDurationBar.progress, 1), callback)
            } else {
                map.animateCamera(update, callback)
            }
        } else {
            map.moveCamera(update)
        }
    }

    override fun onCameraMoveStarted(reason: Int) {
        if (!isCanceled) map.clear()

        var reasonText = "UNKNOWN_REASON"
        currPolylineOptions = PolylineOptions().width(5f)
        when (reason) {
            OnCameraMoveStartedListener.REASON_GESTURE -> {
                currPolylineOptions?.color(Color.BLUE)
                reasonText = "GESTURE"
            }
            OnCameraMoveStartedListener.REASON_API_ANIMATION -> {
                currPolylineOptions?.color(Color.RED)
                reasonText = "API_ANIMATION"
            }
            OnCameraMoveStartedListener.REASON_DEVELOPER_ANIMATION -> {
                currPolylineOptions?.color(Color.GREEN)
                reasonText = "DEVELOPER_ANIMATION"
            }
        }
        Log.d(TAG, "onCameraMoveStarted($reasonText)")
        addCameraTargetToPath()
    }

    /**
     * Ensures that currPolyLine options is not null before accessing it
     *
     * @param stuffToDo the code to be executed if currPolylineOptions is not null
     */
    private fun checkPolylineThen(stuffToDo: () -> Unit) {
        if (currPolylineOptions != null) stuffToDo()
    }

    override fun onCameraMove() {
        Log.d(TAG, "onCameraMove")
        // When the camera is moving, add its target to the current path we'll draw on the map.
        checkPolylineThen { addCameraTargetToPath() }
    }

    override fun onCameraMoveCanceled() {
        // When the camera stops moving, add its target to the current path, and draw it on the map.
        checkPolylineThen {
            addCameraTargetToPath()
            map.addPolyline(currPolylineOptions!!)
        }

        isCanceled = true  // Set to clear the map when dragging starts again.
        currPolylineOptions = null
        Log.d(TAG, "onCameraMoveCancelled")
    }

    override fun onCameraIdle() {
        checkPolylineThen {
            addCameraTargetToPath()
            map.addPolyline(currPolylineOptions!!)
        }

        currPolylineOptions = null
        isCanceled = false  // Set to *not* clear the map when dragging starts again.
        Log.d(TAG, "onCameraIdle")
    }
    private fun addCameraTargetToPath() {
        currPolylineOptions?.add(map.cameraPosition.target)
    }
}
The following camera listeners are available:

The onCameraMoveStarted() callback of the OnCameraMoveStartedListener is invoked when the camera starts moving. The callback method receives a reason for the camera motion. The reason can be one of the following:

REASON_GESTURE indicates that the camera moved in response to a user's gesture on the map, such as panning, tilting, pinching to zoom, or rotating the map.
REASON_API_ANIMATION indicates that the API has moved the camera in response to a non-gesture user action, such as tapping the zoom button, tapping the My Location button, or clicking a marker.
REASON_DEVELOPER_ANIMATION indicates that your app has initiated the camera movement.
The onCameraMove() callback of the OnCameraMoveListener is invoked multiple times while the camera is moving or the user is interacting with the touch screen. As a guide to how often the callback is invoked, it's useful to know that the API invokes the callback once per frame. Note, however, that this callback is invoked asynchronously and is therefore out of synch with what is visible on the screen. Also note that it's possible for the camera position to remain unchanged between one onCameraMove() callback and the next.

The OnCameraIdle() callback of the OnCameraIdleListener is invoked when the camera stops moving and the user has stopped interacting with the map.

The OnCameraMoveCanceled() callback of the OnCameraMoveCanceledListener is invoked when the current camera movement has been interrupted. Immediately after the OnCameraMoveCanceled() callback, the onCameraMoveStarted() callback is invoked with the new reason.

If your app explicitly calls GoogleMap.stopAnimation(), the OnCameraMoveCanceled() callback is invoked, but the onCameraMoveStarted() callback is not invoked.

To set a listener on the map, call the relevant set-listener method. For example, to request a callback from the OnCameraMoveStartedListener, call GoogleMap.setOnCameraMoveStartedListener().

You can get the camera's target (latitude/longitude), zoom, bearing and tilt from the CameraPosition. See the guide to camera position for details about these properties.

Deprecation notice: The OnCameraChangeListener is deprecated in favour of the listeners described above - that is, OnCameraMoveStartedListener, OnCameraMoveListener, OnCameraMoveCanceledListener and OnCameraIdleListener.
Events on businesses and other points of interest
By default, points of interest (POIs) appear on the base map along with their corresponding icons. POIs include parks, schools, government buildings, and more, as well as business POIs such as shops, restaurants, and hotels.

You can respond to click events on a POI. See the guide to businesses and other points of interest.

Indoor map events
You can use events to find and customize the active level of an indoor map. Use the OnIndoorStateChangeListener interface to set a listener to be called when either a new building is focused or a new level is activated in a building.

Get the building that is currently in focus by calling GoogleMap.getFocusedBuilding(). Centering the map on a specific lat/long will generally give you the building at that lat/long, but this is not guaranteed.

You can then find the currently active level by calling IndoorBuilding.getActiveLevelIndex().


Kotlin
Java

map.focusedBuilding?.let { building: IndoorBuilding ->
    val activeLevelIndex = building.activeLevelIndex
    val activeLevel = building.levels[activeLevelIndex]
}

      
This is useful if you want to show custom markup for the active level, such as markers, ground overlays, tile overlays, polygons, polylines, and other shapes.

Hint: To go back to street level, get the default level via IndoorBuilding.getDefaultLevelIndex(), and set it as the active level via IndoorLevel.activate().

Marker and info window events
You can listen and respond to marker events, including marker click and drag events, by setting the corresponding listener on the GoogleMap object to which the marker belongs. See the guide to marker events.

You can also listen to events on info windows.

Shape and overlay events
You can listen and respond to click events on polylines, polygons, circles, and ground overlays.

Note: If multiple overlays or shapes (markers, polylines, polygons, circles and/or ground overlays) are overlaid on top of each other, the click event is cycled through the cluster of markers first, then triggered for other clickable overlays or shapes based on their z-index values. At most one event is triggered per click. In other words, the click is not passed down to the overlays or shapes with lower z-index values. Read more about marker z-index and click events.
Location events
Your app can respond to the following events related to the My Location layer:

If the user clicks the My Location button, your app receives an onMyLocationButtonClick() callback from the GoogleMap.OnMyLocationButtonClickListener.
If the user clicks the My Location blue dot, your app receives an onMyLocationClick() callback from the GoogleMap.OnMyLocationClickListener.
For details, see the guide to the My Location layer.


9. Draw on the map
While you have already explored one way to draw on the map (by adding markers), the Maps SDK for Android supports numerous other ways you can draw to display useful information on the map.

For example, if you wanted to represent routes and areas on the map, you can use polylines and polygons to display these on the map. Or, if you wanted to fix an image to the ground's surface, you can use ground overlays.

In this task, you learn how to draw shapes, specifically a circle, around a marker whenever it is tapped.

f98ce13055430352.png

Add click listener
Typically, the way you would add a click listener to a marker is by passing in a click listener directly on the GoogleMap object via setOnMarkerClickListener(). However, because you're using clustering, the click listener needs to be provided to ClusterManager instead.

In the addClusteredMarkers() method in MainActivity, go ahead and add the following line right after the invocation to cluster().
MainActivity.addClusteredMarkers()

// Show polygon
clusterManager.setOnClusterItemClickListener { item ->
   addCircle(googleMap, item)
   return@setOnClusterItemClickListener false
}
This method adds a listener and invokes the method addCircle(), which you define next. Lastly, false is returned from this method to indicate that this method has not consumed this event.

Note: It's important to return false from setOnClusterItemClickListener() so that your custom info window is still displayed.

Next, you need to define the property circle and the method addCircle() in MainActivity.
MainActivity.addCircle()

private var circle: Circle? = null

/**
* Adds a [Circle] around the provided [item]
*/
private fun addCircle(googleMap: GoogleMap, item: Place) {
   circle?.remove()
   circle = googleMap.addCircle(
       CircleOptions()
           .center(item.latLng)
           .radius(1000.0)
           .fillColor(ContextCompat.getColor(this, R.color.colorPrimaryTranslucent))
           .strokeColor(ContextCompat.getColor(this, R.color.colorPrimary))
   )
}
The circle property is set so that whenever a new marker is tapped, the previous circle is removed and a new one is added. Notice that the API for adding a circle is quite similar to adding a marker.

10. Camera Control
As your last task, you look at some camera controls so that you can focus the view around a certain region.

Camera and view
If you noticed when you run the app, the camera displays the continent of Africa, and you have to painstakingly pan and zoom to San Francisco to find the markers you added. While it can be a fun way to explore the world, it's not useful if you want to display the markers right away.

To help with that, you can set the camera's position programmatically so that the view is centered where you want it.

Go ahead and add the following code to the getMapAsync() call to adjust the camera view so that it is initialized to San Francisco when the app is launched.
MainActivity.onCreate()

mapFragment?.getMapAsync { googleMap ->
   // Ensure all places are visible in the map.
   googleMap.setOnMapLoadedCallback {
       val bounds = LatLngBounds.builder()
       places.forEach { bounds.include(it.latLng) }
       googleMap.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds.build(), 20))
   }
}
First, the setOnMapLoadedCallback() is called so that the camera update is only performed after the map is loaded. This step is necessary because the map properties, such as dimensions, need to be computed before making a camera update call.

In the lambda, a new LatLngBounds object is constructed, which defines a rectangular region on the map. This is incrementally built by including all the place LatLng values in it to ensure all places are inside the bounds. Once this object has been built, the moveCamera() method on GoogleMap is invoked and a CameraUpdate is provided to it through CameraUpdateFactory.newLatLngBounds(bounds.build(), 20).

Run the app and notice that the camera is now initialized in San Francisco.
Listening to camera changes
In addition to modifying the camera position, you can also listen to camera updates as the user moves around the map. This could be useful if you wanted to modify the UI as the camera moves around.

Just for fun, you modify the code to make the markers translucent whenever the camera is moved.

In the addClusteredMarkers() method, go ahead and add the following lines toward the bottom of the method:
MainActivity.addClusteredMarkers()

// When the camera starts moving, change the alpha value of the marker to translucent.
googleMap.setOnCameraMoveStartedListener {
   clusterManager.markerCollection.markers.forEach { it.alpha = 0.3f }
   clusterManager.clusterMarkerCollection.markers.forEach { it.alpha = 0.3f }
}

This adds an OnCameraMoveStartedListener so that, whenever the camera starts moving, all the markers' (both clusters and markers) alpha values are modified to 0.3f so that the markers appear translucent.

Lastly, to modify the translucent markers back to opaque when the camera stops, modify the contents of the setOnCameraIdleListener in the addClusteredMarkers() method to the following:
MainActivity.addClusteredMarkers()

googleMap.setOnCameraIdleListener {
   // When the camera stops moving, change the alpha value back to opaque.
   clusterManager.markerCollection.markers.forEach { it.alpha = 1.0f }
   clusterManager.clusterMarkerCollection.markers.forEach { it.alpha = 1.0f }

   // Call clusterManager.onCameraIdle() when the camera stops moving so that reclustering
   // can be performed when the camera stops moving.
   clusterManager.onCameraIdle()
}
Go ahead and run the app to see the results!


Add the map ID to your app
Android
iOS
JavaScript
Maps Static
Add your map ID through a <fragment> element in the activity's layout file, by using the MapView class, or programmatically using the GoogleMapOptions class.

For example, assume you created a map ID that is stored as a string value named map_id in res/values/strings.xml:


<?xml version="1.0" encoding="utf-8"?>
<resources>
<string name="map_id">MAP_ID</string>
</resources>
For maps added through a <fragment> element in the activity's layout file, all map fragments that should have the custom style must specify the map ID in the map:mapId attribute:


<fragment xmlns:map="http://schemas.android.com/apk/res-auto"
    map:name="com.google.android.gms.maps.SupportMapFragment"
    …
    map:mapId="@string/map_id" />
You can also use the map:mapId attribute of the MapView class to specify a map ID:


<com.google.android.gms.maps.MapView
    xmlns:map="http://schemas.android.com/apk/res-auto"
    ....
    map:mapId="@string/map_id" />
To specify a map ID programmatically, pass it to a MapFragment instance using the GoogleMapOptions class:

Java
Kotlin

 MapFragment mapFragment = MapFragment.newInstance(
     new GoogleMapOptions()
         .mapId(getResources().getString(R.string.map_id)));
In Android Studio, build and run your app as you normally would. Custom styles configured in the first step are applied to all maps with the specified map ID.

Add a Styled Map

bookmark_border
Select platform: Android iOS JavaScript
This tutorial shows you how to add a map with custom styling to your Android app. The tutorial uses night mode as an example of custom styling.

With style options you can customize the presentation of the standard Google map styles, changing the visual display of features like roads, parks, businesses, and other points of interest. This means that you can emphasize particular components of the map or make the map complement the style of your app.

Styling works only on the normal map type. Styling does not affect indoor maps.

If you want to update the same style across multiple apps, look into cloud customization, which is available in the Google Cloud console and requires a map ID. To avoid potential conflicts, do not combine cloud customization and hardcoded styling in the same app.
Experimental: For a richer styling experience, you can use JSON styling with cloud-based map styling which has a more extensive list of map features with more options to customize their appearance.
Get the code
Clone or download the Google Maps Android API v2 Samples repository from GitHub.

Set up your development project


Follow these steps to create the tutorial project in Android Studio.

Download and install Android Studio.
Add the Google Play services package to Android Studio.
Clone or download the Google Maps Android API v2 Samples repository if you didn't do that when you started reading this tutorial.
Import the tutorial project:

In Android Studio, select File > New > Import Project.
Go to the location where you saved the Google Maps Android API v2 Samples repository after downloading it.
Find the StyledMap project at this location:
PATH-TO-SAVED-REPO/android-samples/tutorials/StyledMap
Select the project directory, then click OK. Android Studio now builds your project, using the Gradle build tool.

Get an API key and enable the necessary APIs
To complete this tutorial, you need a Google API key that's authorized to use the Maps SDK for Android.

Click the button below to get a key and activate the API.

Get a Key

For more details, see the Get an API Key guide.

Add the API key to your app
Edit your project's gradle.properties file.
Paste your API key into the value of the GOOGLE_MAPS_API_KEY property. When you build your app, Gradle copies the API key into the app's Android manifest.


GOOGLE_MAPS_API_KEY=PASTE-YOUR-API-KEY-HERE
Build and run your app
Connect an Android device to your computer. Follow the instructions to enable developer options on your Android device and configure your system to detect the device. (Alternatively, you can use the Android Virtual Device (AVD) Manager to configure a virtual device. When choosing an emulator, make sure you pick an image that includes the Google APIs. For more details, see the getting started guide.)
In Android Studio, click the Run menu option (or the play button icon). Choose a device as prompted.
Android Studio invokes Gradle to build the app, and then runs the app on the device or on the emulator. You should see a map with dark (night mode) styling, similar to the image on this page.

Troubleshooting:

If you don't see a map, check that you've obtained an API key and added it to the app, as described above. Check the sign in on Android Studio's Android Monitor for error messages about the API key.
Use the Android Studio debugging tools to view logs and debug the app.
Understand the code
This part of the tutorial explains the most significant parts of the StyledMap app, to help you understand how to build a similar app.

Add a resource containing a JSON style object
Add a resource to your development project, containing your style declarations in JSON format. You can use a raw resource or a string, as shown in the examples below.

Note: The sample app that you downloaded from GitHub uses a raw resource.
Raw resource
String resource
Define a raw resource in /res/raw/style_json.json, containing the JSON style declaration for night-mode styling:

Show/Hide the JSON.


[
  {
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "lightness": -80
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2b3544"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "lightness": -20
      }
    ]
  }
]
Pass a JSON style object to your map
To style your map, call GoogleMap.setMapStyle() passing a MapStyleOptions object that contains your style declarations in JSON format.

Raw resource
String resource
The following code sample assumes your project contains a raw resource named style_json:


// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.example.styledmap;

import android.content.res.Resources;
import android.os.Bundle;
import android.util.Log;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MapStyleOptions;

/**
 * A styled map using JSON styles from a raw resource.
 */
public class MapsActivityRaw extends AppCompatActivity
        implements OnMapReadyCallback {

    private static final String TAG = MapsActivityRaw.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Retrieve the content view that renders the map.
        setContentView(R.layout.activity_maps_raw);

        // Get the SupportMapFragment and register for the callback
        // when the map is ready for use.
        SupportMapFragment mapFragment =
                (SupportMapFragment) getSupportFragmentManager()
                        .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }

    /**
     * Manipulates the map when it's available.
     * The API invokes this callback when the map is ready for use.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {

        try {
            // Customise the styling of the base map using a JSON object defined
            // in a raw resource file.
            boolean success = googleMap.setMapStyle(
                    MapStyleOptions.loadRawResourceStyle(
                            this, R.raw.style_json));

            if (!success) {
                Log.e(TAG, "Style parsing failed.");
            }
        } catch (Resources.NotFoundException e) {
            Log.e(TAG, "Can't find style. Error: ", e);
        }
        // Position the map's camera near Sydney, Australia.
        googleMap.moveCamera(CameraUpdateFactory.newLatLng(new LatLng(-34, 151)));
    }
}
The layout (activity_maps_raw.xml) looks like this:

Show/Hide the layout file.

More about JSON style declarations
Styled maps use two concepts to apply colors and other style changes to a map:

Selectors specify the geographic components that you can style on the map. These include roads, parks, bodies of water, and more, as well as their labels. The selectors include features and elements, specified as featureType and elementType properties.
Stylers are color and visibility properties that you can apply to map elements. They define the displayed color through a combination of hue, color, and lightness and gamma values.
See the style reference for a detailed description of the JSON styling options.


Style Reference for Maps JavaScript API

bookmark_border

Select platform: Android iOS JavaScript
With style options you can customize the presentation of the standard Google map styles, changing the visual display of features like roads, parks, businesses, and other points of interest. As well as changing the style of these features, you can hide features entirely. This means that you can emphasize particular components of the map or make the map complement the style of the surrounding page.

If you want to update the same style across multiple apps, look into cloud customization, which is available in the Google Cloud console and requires a map ID. To avoid potential conflicts, do not combine cloud customization and hardcoded styling in the same app.
Experimental: For a richer styling experience, you can use JSON styling with cloud-based map styling which has a more extensive list of map features with more options to customize their appearance.
Examples
The following JSON style declaration turns all map features to gray, then colors arterial road geometry in blue, and hides landscape labels completely:


[
  {
    "featureType": "all",
    "stylers": [
      { "color": "#C0C0C0" }
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#CCFFFF" }
    ]
  },{
    "featureType": "landscape",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  }
]
The JSON object
A JSON style declaration consists of the following elements:

featureType (optional) - the features to select for this style modification. Features are geographic characteristics on the map, including roads, parks, bodies of water, and more. If you don't specify a feature, all features are selected.
elementType (optional) - the property of the specified feature to select. Elements are sub-parts of a feature, including labels and geometry. If you don't specify an element, all elements of the feature are selected.
stylers - the rules to apply to the selected features and elements. Stylers indicate the color, visibility, and weight of the feature. You can apply one or more stylers to a feature.
To specify a style, you must combine a set of featureType and elementType selectors and your stylers into a style array. You can target any combination of features in a single array. However, the number of styles that you can apply at once is limited. If your style array exceeds the maximum number of characters then no style is applied.

The rest of this page has more information about features, elements and stylers.

featureType
The following JSON snippet selects all roads on the map:


{
  "featureType": "road"
}
Features, or feature types, are geographic characteristics on the map, including roads, parks, bodies of water, businesses, and more.

The features form a category tree, with all as the root. If you don't specify a feature, all features are selected. Specifying a feature of all has the same effect.

Some features contain child features you specify using a dot notation. For example, landscape.natural or road.local. If you specify only the parent feature, such as road, the styles you specify for the parent apply to all its children, such as road.local and road.highway.

Note that parent features may include some elements that are not included in all of their child features.

The following features are available:

all (default) selects all features.
administrative selects all administrative areas. Styling affects only the labels of administrative areas, not the geographical borders or fill.
administrative.country selects countries.
administrative.land_parcel selects land parcels.
administrative.locality selects localities.
administrative.neighborhood selects neighborhoods.
administrative.province selects provinces.
landscape selects all landscapes.
landscape.man_made selects man-made features, such as buildings and other structures.
landscape.natural selects natural features, such as mountains, rivers, deserts, and glaciers.
landscape.natural.landcover selects land cover features, the physical material that covers the earth's surface, such as forests, grasslands, wetlands, and bare ground.
landscape.natural.terrain selects terrain features of a land surface, such as elevation, slope, and orientation.
poi selects all points of interest.
poi.attraction selects tourist attractions.
poi.business selects businesses.
poi.government selects government buildings.
poi.medical selects emergency services, including hospitals, pharmacies, police, doctors, and others.
poi.park selects parks.
poi.place_of_worship selects places of worship, including churches, temples, mosques, and others.
poi.school selects schools.
poi.sports_complex selects sports complexes.
road selects all roads.
road.arterial selects arterial roads.
road.highway selects highways.
road.highway.controlled_access selects highways with controlled access.
road.local selects local roads.
transit selects all transit stations and lines.
transit.line selects transit lines.
transit.station selects all transit stations.
transit.station.airport selects airports.
transit.station.bus selects bus stops.
transit.station.rail selects rail stations.
water selects bodies of water.
elementType
The following JSON snippet selects the labels for all local roads:


{
  "featureType": "road.local",
  "elementType": "labels"
}
Elements are subdivisions of a feature. A road, for example, consists of the graphical line (the geometry) on the map, and also the text denoting its name (a label).

The following elements are available, but note that a specific feature may support none, some, or all, of the elements:

Label text fill and stroke colors change based on the zoom level. To make the experience consistenent across zoom levels, always define both fill and stroke.

all (default) selects all elements of the specified feature.
geometry selects all geometric elements of the specified feature.
geometry.fill selects only the fill of the feature's geometry.
geometry.stroke selects only the stroke of the feature's geometry.
labels selects the textual labels associated with the specified feature.
labels.icon selects only the icon displayed within the feature's label.
labels.text selects only the text of the label.
labels.text.fill selects only the fill of the label. The fill of a label is typically rendered as a colored outline that surrounds the label text.
labels.text.stroke selects only the stroke of the label's text.
stylers
Stylers are formatting options that you can apply to map features and elements.

The following JSON snippet displays a feature as bright green, using an RGB value:


"stylers": [
  { "color": "#99FF33" }
]
This snippet removes all intensity from the color of a feature, regardless of its starting color. The effect is to render the feature grayscale:


"stylers": [
  { "saturation": -100 }
]
This snippet hides a feature completely:


    "stylers": [
      { "visibility": "off" }
    ]
The following style options are supported:

hue (an RGB hex string of format #RRGGBB) indicates the basic color.
Note: This option sets the hue while keeping the saturation and lightness specified in the default Google style (or in other style options you define on the map). The resulting color is relative to the style of the base map. If Google makes any changes to the base map style, the changes affect your map's features styled with hue. It's better to use the absolute color styler if you can.

lightness (a floating point value between -100 and 100) indicates the percentage change in brightness of the element. Negative values increase darkness (where -100 specifies black) while positive values increase brightness (where +100 specifies white).
Note: This option sets the lightness while keeping the saturation and hue specified in the default Google style (or in other style options you define on the map). The resulting color is relative to the style of the base map. If Google makes any changes to the base map style, the changes affect your map's features styled with lightness. It's better to use the absolute color styler if you can.

saturation (a floating point value between -100 and 100) indicates the percentage change in intensity of the basic color to apply to the element.
Note: This option sets the saturation while keeping the hue and lightness specified in the default Google style (or in other style options you define on the map). The resulting color is relative to the style of the base map. If Google makes any changes to the base map style, the changes affect your map's features styled with saturation. It's better to use the absolute color styler if you can.

gamma (a floating point value between 0.01 and 10.0, where 1.0 applies no correction) indicates the amount of gamma correction to apply to the element. Gamma corrections modify the lightness of colors in a non-linear fashion, while not affecting white or black values. Gamma correction is typically used to modify the contrast of multiple elements. For example, you can modify the gamma to increase or decrease the contrast between the edges and interiors of elements.
Note: This option adjusts the lightness relative to the default Google style, using a gamma curve. If Google makes any changes to the base map style, the changes affect your map's features styled with gamma. It's better to use the absolute color styler if you can.

invert_lightness (if true) inverts the existing lightness. This is useful, for example, for quickly switching to a darker map with white text.
Note: This option simply inverts the default Google style. If Google makes any changes to the base map style, the changes affect your map's features styled with invert_lightness. It's better to use the absolute color styler if you can.

visibility (on, off, or simplified) indicates whether and how the element appears on the map. A simplified visibility removes some style features from the affected features; roads, for example, are simplified into thinner lines without outlines, while parks lose their label text but retain the label icon.
color (an RGB hex string of format #RRGGBB) sets the color of the feature.
weight (an integer value, greater than or equal to zero) sets the weight of the feature, in pixels. Setting the weight to a high value may result in clipping near tile borders.
Style rules are applied in the order that you specify. Do not combine multiple operations into a single style operation. Instead, define each operation as a separate entry in the style array.

Note: Order is important, as some operations are not commutative. Features and/or elements that are modified through style operations (usually) already have existing styles. The operations act on those existing styles, if present.

The hue, saturation, lightness model
Note: The effect of the hue, saturation, lightness, and gamma settings is relative to the style of the base map. If Google makes any changes to the base map style, the changes affect your map's features styled with these options. It's better to use the absolute color styler if you can.
Styled maps use the hue, saturation, lightness (HSL) model to denote color within the styler operations. Hue indicates the basic color, saturation indicates the intensity of that color, and lightness indicates the relative amount of white or black in the constituent color.

Gamma correction modifies the lightness over the color space, generally to increase or decrease contrast. Additionally, the HSL model defines color within a coordinate space where hue indicates the orientation within a color wheel, while saturation and lightness indicate amplitudes along different axes. Hues are measured within an RGB color space, which is similar to most RGB color spaces, except that shades of white and black are absent.

Hue, saturation, lightness model

While hue takes an HTML hex color value, it only uses this value to determine the basic color - that is, its orientation around the color wheel, not its saturation or lightness, which are indicated separately as percentage changes.

For example, you can define the hue for pure green as hue:0x00ff00 or hue:0x000100. Both hues are identical. Both values point to pure green in the HSL color model.



An RGB Color Wheel

RGB hue values which consist of equal parts red, green and blue do not indicate a hue, because none of those values indicate an orientation in the HSL coordinate space. Examples are "#000000" (black), "#FFFFFF" (white), and all the pure shades of gray. To indicate black, white or gray, you must remove all saturation (set the value to -100) and adjust lightness instead.

Additionally, when modifying existing features which already have a color scheme, changing a value such as hue does not change its existing saturation or lightness.


11. Maps KTX
For Kotlin apps using one or more Google Maps Platform Android SDKs, Kotlin extension or KTX libraries are available to enable you to take advantage of Kotlin language features such as coroutines, extension properties/functions, and more. Each Google Maps SDK has a corresponding KTX library as shown below:

Google Maps Platform KTX Diagram

In this task, you will use the Maps KTX and Maps Utils KTX libraries to your app and refactor previous tasks' implementations so that you can use Kotlin-specific language features in your app.

Note: The Google Maps Platform KTX libraries are all open sourced on GitHub. See android-maps-ktx and android-places-ktx to learn more.

Include KTX dependencies in your app-level build.gradle file
Since the app uses both the Maps SDK for Android and the Maps SDK for Android Utility Library, you will need to include the corresponding KTX libraries for these libraries. You will also be using a feature found in the AndroidX Lifecycle KTX library in this task so include that dependency as well in your app-level build.gradle file as well.

build.gradle

dependencies {
    // ...

    // Maps SDK for Android KTX Library
    implementation 'com.google.maps.android:maps-ktx:3.0.0'

    // Maps SDK for Android Utility Library KTX Library
    implementation 'com.google.maps.android:maps-utils-ktx:3.0.0'

    // Lifecycle Runtime KTX Library
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.3.1'
}
Use GoogleMap.addMarker() and GoogleMap.addCircle() extension functions
The Maps KTX library provides a DSL-style API alternative for the GoogleMap.addMarker(MarkerOptions) and GoogleMap.addCircle(CircleOptions) used in previous steps. To use the aforementioned APIs, construction of a class containing options for a marker or circle is necessary whereas with the KTX alternatives you are able to set the marker or circle options in the lambda you provide.

To use these APIs, update the MainActivity.addMarkers(GoogleMap) and MainActivity.addCircle(GoogleMap) methods:

MainActivity.addMarkers(GoogleMap)

/**
 * Adds markers to the map. These markers won't be clustered.
 */
private fun addMarkers(googleMap: GoogleMap) {
    places.forEach { place ->
        val marker = googleMap.addMarker {
            title(place.name)
            position(place.latLng)
            icon(bicycleIcon)
        }
        // Set place as the tag on the marker object so it can be referenced within
        // MarkerInfoWindowAdapter
        marker.tag = place
    }
}
MainActivity.addCircle(GoogleMap)

/**
 * Adds a [Circle] around the provided [item]
 */
private fun addCircle(googleMap: GoogleMap, item: Place) {
    circle?.remove()
    circle = googleMap.addCircle {
        center(item.latLng)
        radius(1000.0)
        fillColor(ContextCompat.getColor(this@MainActivity, R.color.colorPrimaryTranslucent))
        strokeColor(ContextCompat.getColor(this@MainActivity, R.color.colorPrimary))
    }
}
Rewriting the above methods in this way is a lot more concise to read which is made possible using Kotlin's function literal with receiver.

Note: other DSL-style methods are also available for adding other shapes to the map—polygons, polylines, and so on. Refer to the android-maps-ktx reference documents to learn more.

Use SupportMapFragment.awaitMap() and GoogleMap.awaitMapLoad() extension suspending functions
The Maps KTX library also provides suspending function extensions to be used within coroutines. Specifically, there are suspending function alternatives for SupportMapFragment.getMapAsync(OnMapReadyCallback) and GoogleMap.setOnMapLoadedCallback(OnMapLoadedCallback). Using these alternative APIs removes the need for passing callbacks and instead allows you to receive the response of these methods in a serial and synchronous way.

Since these methods are suspending functions, their usage will need to occur within a coroutine. The Lifecycle Runtime KTX library offers an extension to provide lifecycle-aware coroutine scopes so that coroutines are run and stopped at the appropriate lifecycle event.

Combining these concepts, update the MainActivity.onCreate(Bundle) method:

MainActivity.onCreate(Bundle)

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    val mapFragment =
        supportFragmentManager.findFragmentById(R.id.map_fragment) as SupportMapFragment
    lifecycleScope.launchWhenCreated {
        // Get map
        val googleMap = mapFragment.awaitMap()

        // Wait for map to finish loading
        googleMap.awaitMapLoad()

        // Ensure all places are visible in the map
        val bounds = LatLngBounds.builder()
        places.forEach { bounds.include(it.latLng) }
        googleMap.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds.build(), 20))

        addClusteredMarkers(googleMap)
    }
}
The lifecycleScope.launchWhenCreated coroutine scope will execute the block when the activity is at least in the created state. Also notice that the calls to retrieve the GoogleMap object, and to wait for the map to finish loading, have been replaced with SupportMapFragment.awaitMap() and GoogleMap.awaitMapLoad(), respectively. Refactoring code using these suspending functions enable you to write the equivalent callback-based code in a sequential manner.

Go ahead and re-build the app with your refactored changes!


Location Data

bookmark_border

One of the unique features of mobile applications is location awareness. Mobile users bring their devices with them everywhere, and adding location awareness to your app offers users a more contextual experience.

Code samples
The ApiDemos repository on GitHub includes samples that demonstrate the use of location on a map:

Kotlin

MyLocationDemoActivity: Using the My Location layer, including runtime permissions
LocationSourceDemoActivity: Using a custom LocationSource
CurrentPlaceDetailsOnMap: Finding the current location of an Android device and displaying details of the place (business or other point of interest) at that location. See the tutorial on showing current place details on a map.
Java

MyLocationDemoActivity: Using the My Location layer, including runtime permissions
LocationSourceDemoActivity: Using a custom LocationSource
CurrentPlaceDetailsOnMap: Finding the current location of an Android device and displaying details of the place (business or other point of interest) at that location. See the tutorial on showing current place details on a map.
Working with location data
The location data available to an Android device includes the current location of the device — pinpointed using a combination of technologies — the direction and method of movement, and whether the device has moved across a predefined geographical boundary, or geofence. Depending upon the needs of your application, you can choose between several ways of working with location data:

The My Location layer provides a simple way to display a device's location on the map. It does not provide data.
The Google Play services Location API is recommended for all programmatic requests for location data.
The LocationSource interface allows you to provide a custom location provider.
Location permissions
If your app needs to access the user's location, you must request permission by adding the relevant Android location permissions to your app.

Android offers two location permissions: ACCESS_COARSE_LOCATION and ACCESS_FINE_LOCATION. The permission you choose determines the accuracy of the location returned by the API.

android.permission.ACCESS_COARSE_LOCATION – Allows the API to return the device's approximate location. The permission provides a device location estimate from location services, as described in the documentation about approximate location accuracy.
android.permission.ACCESS_FINE_LOCATION – Allows the API to determine as precise a location as possible from the available location providers, including the Global Positioning System (GPS) as well as WiFi and mobile cell data.
Note: On Android 12 (API level 31) or higher, users can request that your app retrieve only approximate location information even when your app requests the ACCESS_FINE_LOCATION runtime permission. To handle this, both ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION permissions should be requested in a single runtime request. See User can grant only approxmate location.
Add the permissions to the app manifest
If approximate location is only needed for your app to function, then add the ACCESS_COARSE_LOCATION permission to your app's manifest file:


<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp" >
  ...
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
  ...
</manifest>
However, if precise location is needed, then add both ACCESS_COARSE_LOCATION and ACCESS_FINE_LOCATION permissions to your app's manifest file:


<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp" >
  ...
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
  ...
</manifest>

Request runtime permissions
Android 6.0 (Marshmallow) introduces a new model for handling permissions, which streamlines the process for users when they install and upgrade apps. If your app targets API level 23 or later, you can use the new permissions model.

If your app supports the new permissions model and the device is running Android 6.0 (Marshmallow) or later, the user does not have to grant any permissions when they install or upgrade the app. The app must check to see if it has the necessary permission at runtime, and request the permission if it does not have it. The system displays a dialog to the user asking for the permission.

For best user experience, it's important to request the permission in context. If location is essential to the functioning of your app, then you should request the location permission at app startup. A good way to do this is with a warm welcome screen or wizard that educates users about why the permission is required.

If the app requires the permission for only part of its functionality, then you should request the location permission at the time when the app performs the action that requires the permission.

The app must gracefully handle the case where the user does not grant permission. For example, if the permission is needed for a specific feature, the app can disable that feature. If the permission is essential for the app to function, the app can disable all its functionality and inform the user that they need to grant the permission.

The following code sample checks for permission using the AndroidX library before enabling the My Location layer. It then handles the result of the permission request by implementing the ActivityCompat.OnRequestPermissionsResultCallback from the Support library:

Kotlin
Java


// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
package com.example.kotlindemos

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.view.View
import android.widget.Toast

import androidx.core.app.ActivityCompat
import androidx.core.app.ActivityCompat.OnRequestPermissionsResultCallback
import androidx.core.content.ContextCompat
import com.example.common_ui.R
import com.example.kotlindemos.PermissionUtils.PermissionDeniedDialog.Companion.newInstance
import com.example.kotlindemos.PermissionUtils.isPermissionGranted
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.GoogleMap.OnMyLocationButtonClickListener
import com.google.android.gms.maps.GoogleMap.OnMyLocationClickListener
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment

/**
 * This demo shows how GMS Location can be used to check for changes to the users location.  The
 * "My Location" button uses GMS Location to set the blue dot representing the users location.
 * Permission for [Manifest.permission.ACCESS_FINE_LOCATION] and [Manifest.permission.ACCESS_COARSE_LOCATION]
 * are requested at run time. If either permission is not granted, the Activity is finished with an error message.
 */
class MyLocationDemoActivity : SamplesBaseActivity(),
    OnMyLocationButtonClickListener,
    OnMyLocationClickListener, OnMapReadyCallback,
    OnRequestPermissionsResultCallback {
    /**
     * Flag indicating whether a requested permission has been denied after returning in
     * [.onRequestPermissionsResult].
     */
    private var permissionDenied = false
    private lateinit var map: GoogleMap
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.my_location_demo)
        val mapFragment =
            supportFragmentManager.findFragmentById(R.id.map) as SupportMapFragment?
        mapFragment?.getMapAsync(this)
        applyInsets(findViewById<View?>(R.id.map_container))
    }

    override fun onMapReady(googleMap: GoogleMap) {
        map = googleMap
        googleMap.setOnMyLocationButtonClickListener(this)
        googleMap.setOnMyLocationClickListener(this)
        enableMyLocation()
    }

    /**
     * Enables the My Location layer if the fine location permission has been granted.
     */
    @SuppressLint("MissingPermission")
    private fun enableMyLocation() {

        // 1. Check if permissions are granted, if so, enable the my location layer
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED || ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            map.isMyLocationEnabled = true
            return
        }

        // 2. If if a permission rationale dialog should be shown
        if (ActivityCompat.shouldShowRequestPermissionRationale(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) || ActivityCompat.shouldShowRequestPermissionRationale(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )
        ) {
            PermissionUtils.RationaleDialog.newInstance(
                LOCATION_PERMISSION_REQUEST_CODE, true
            ).show(supportFragmentManager, "dialog")
            return
        }

        // 3. Otherwise, request permission
        ActivityCompat.requestPermissions(
            this,
            arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ),
            LOCATION_PERMISSION_REQUEST_CODE
        )
    }

    override fun onMyLocationButtonClick(): Boolean {
        Toast.makeText(this, "MyLocation button clicked", Toast.LENGTH_SHORT)
            .show()
        // Return false so that we don't consume the event and the default behavior still occurs
        // (the camera animates to the user's current position).
        return false
    }

    override fun onMyLocationClick(location: Location) {
        Toast.makeText(this, "Current location:\n$location", Toast.LENGTH_LONG)
            .show()
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        if (requestCode != LOCATION_PERMISSION_REQUEST_CODE) {
            super.onRequestPermissionsResult(
                requestCode,
                permissions,
                grantResults
            )
            return
        }

        if (isPermissionGranted(
                permissions,
                grantResults,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) || isPermissionGranted(
                permissions,
                grantResults,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )
        ) {
            // Enable the my location layer if the permission has been granted.
            enableMyLocation()
        } else {
            // Permission was denied. Display an error message
            // Display the missing permission error dialog when the fragments resume.
            permissionDenied = true
        }
    }

    override fun onResumeFragments() {
        super.onResumeFragments()
        if (permissionDenied) {
            // Permission was not granted, display error dialog.
            showMissingPermissionError()
            permissionDenied = false
        }
    }

    /**
     * Displays a dialog with error message explaining that the location permission is missing.
     */
    private fun showMissingPermissionError() {
        newInstance(true).show(supportFragmentManager, "dialog")
    }

    companion object {
        /**
         * Request code for location permission request.
         *
         * @see .onRequestPermissionsResult
         */
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1
    }
}

The My Location layer
You can use the My Location layer and the My Location button to show your user their current position on the map. Call mMap.setMyLocationEnabled() to enable the My Location layer on the map.

Note: Before enabling the My Location layer, you must ensure that you have the required runtime location permission.
The following sample shows a simple usage of the My Location layer:


Kotlin
Java

// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.maps.example.kotlin

import android.annotation.SuppressLint
import android.location.Location
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.GoogleMap.OnMyLocationButtonClickListener
import com.google.android.gms.maps.GoogleMap.OnMyLocationClickListener
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.maps.example.R

internal class MyLocationLayerActivity : AppCompatActivity(),
    OnMyLocationButtonClickListener,
    OnMyLocationClickListener,
    OnMapReadyCallback {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_my_location)
        val mapFragment =
            supportFragmentManager.findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    @SuppressLint("MissingPermission")
    override fun onMapReady(map: GoogleMap) {
        // TODO: Before enabling the My Location layer, you must request
        // location permission from the user. This sample does not include
        // a request for location permission.
        map.isMyLocationEnabled = true
        map.setOnMyLocationButtonClickListener(this)
        map.setOnMyLocationClickListener(this)
    }

    override fun onMyLocationClick(location: Location) {
        Toast.makeText(this, "Current location:\n$location", Toast.LENGTH_LONG)
            .show()
    }

    override fun onMyLocationButtonClick(): Boolean {
        Toast.makeText(this, "MyLocation button clicked", Toast.LENGTH_SHORT)
            .show()
        // Return false so that we don't consume the event and the default behavior still occurs
        // (the camera animates to the user's current position).
        return false
    }
}


      
When the My Location layer is enabled, the My Location button appears in the top right corner of the map. When a user clicks the button, the camera centers the map on the current location of the device, if it is known. The location is indicated on the map by a small blue dot if the device is stationary, or as a chevron if the device is moving.

The following screenshot shows the My Location button at top right and the My Location blue dot in the center of the map:



You can prevent the My Location button from appearing by calling UiSettings.setMyLocationButtonEnabled(false).

Your app can respond to the following events:

If the user clicks the My Location button, your app receives an onMyLocationButtonClick() callback from the GoogleMap.OnMyLocationButtonClickListener.
If the user clicks the My Location blue dot, your app receives an onMyLocationClick() callback from the GoogleMap.OnMyLocationClickListener.
The Google Play services Location API
The Google Play services Location API is the preferred method for adding location awareness to your Android application. It includes functionality that lets you:

Determine the device location.
Listen for location changes.
Determine the mode of transportation, if the device is moving.
Create and monitor predefined geographical regions, known as geofences.
The location APIs make it easy for you to build power efficient, location-aware applications. Like the Maps SDK for Android, the Location API is distributed as part of the Google Play services SDK. For more information on the Location API, please refer to the Android training class Making Your App Location Aware or the Location API Reference. Code examples are included as part of the Google Play services SDK.



Maps Android KTX

bookmark_border


Maps Android Kotlin extensions (KTX) are a collection of Kotlin extensions for the Maps SDK for Android and the Maps SDK for Android Utility Library. These extensions provide Kotlin language features that enable you to write concise and idiomatic Kotlin when developing for the Maps SDK for Android. Maps KTX is open-sourced and available on GitHub along with examples.

Installation
To install KTX for the Maps SDK for Android, and optionally for the Maps SDK for Android Utility Library, add the following dependencies to your build.gradle.kts file.


dependencies {

    // KTX for the Maps SDK for Android library
    implementation("com.google.maps.android:maps-ktx:5.2.0")
}
Example Usages
With the KTX library, you can take advantage of several Kotlin language features such as extension functions, named parameters and default arguments, destructuring declarations, and coroutines.

Retrieving a GoogleMap using coroutines
Accessing a GoogleMap can be retrieved using coroutines.


lifecycleScope.launch {
  lifecycle.repeatOnLifecycle(Lifecycle.State.CREATED) {
    val mapFragment: SupportMapFragment? =
      supportFragmentManager.findFragmentById(R.id.map) as? SupportMapFragment
    val googleMap: GoogleMap? = mapFragment?.awaitMap()
  }
}
Adding a marker
Adding a marker can be done using the DSL-style method addMarker().


val sydney = LatLng(-33.852, 151.211)
val marker = googleMap.addMarker {
  position(sydney)
  title("Marker in Sydney")
}
Collecting camera events
Events, such as camera moves, can be collected via Kotlin Flow.


lifecycleScope.launch {
  lifecycle.repeatOnLifecycle(Lifecycle.State.CREATED) {
    googleMap.cameraMoveEvents().collect {
      print("Received camera move event")
    }
  }
}
You can see a full list of supported features by reading the reference documentation.

Try the sample application
The GitHub repository for this library also contains a demo application that shows how you can use the Maps KTX library in your own app.

To try the demo application, follow these steps:

From GitHub, clone the or download the ZIP file.
In Android Studio, choose File -> Open and navigate to the directory and open the folder that you just cloned or downloaded.
Add an API key to the demo app.
Get a Maps SDK for Android key.
In the root directory, create a file called secrets.properties. This file should NOT be under version control to protect your API key.
Add this single line to secrets.properties

MAPS_API_KEY="YOUR_API_KEY"
where YOUR_API_KEY is the actual API key you obtained in the first step. You can look at the secrets.defaults.properties as an example.
Under the run configuration, select the module app-ktx.
Select Run 'app-ktx'.


Migration: Maps Module in google.load

bookmark_border

On October 13, 2021, we will turn off the service that provides the "Maps" module for google.load. This means that after October 13, 2021, if you try to use the "Maps" module in google.load you will receive an error (module "maps" is not supported), and no map will load. To help you avoid potential breakage, you must switch to one of the alternatives.

What do I need to do?
First, remove the <script> tag that loads the google.load loader, then remove calls to google.load. If you're using Google Loader for other things, it's okay to leave the loader <script> tag in place.

Next, implement a new way to load the Maps JavaScript API (select one of the following options):

Inline loading using the <script> tag
Dynamic loading from another JavaScript file

Current example using the Google Loader
The following example shows how the Google Loader is currently used to load the Maps JavaScript API (there are two <script> blocks):

Before

<script type='text/javascript' src='https://www.google.com/jsapi'></script>
<script type='text/javascript'>
google.load("maps", "3.exp", {
    "callback": initMap,
    "key": "YOUR_KEY",
    "libraries": "places,visualization"
});
function initMap() {
  // Google Maps JS API is loaded and available
}
</script>

Inline loading using the <script> tag (recommended)
When this approach is used, the Maps JavaScript API loads at the same time the page loads. To implement inline loading, first replace the <script> tag that loads www.google.com/jsapi ("before") with the <script> tag shown in the following example:


<script async src="https://maps.googleapis.com/maps/api/js?libraries=places,visualization&key=YOUR_API_KEY&v=weekly&callback=initMap">
</script>
Then in your javascript code, remove the google.load function call, since it's no longer needed. The following example shows a blank initMap() function, which is called when the Maps library has loaded successfully:


<script type='text/javascript'>
function initMap() {
  // Google Maps JS API is loaded and available
}
</script>
See the documentation


Dynamic loading from another JavaScript file
Dynamic loading lets you control when the Maps JavaScript API is loaded. For example, you can wait to load the Maps JavaScript API until the user clicks a button or performs another action. To implement dynamic loading, first replace the <script> tag that loads www.google.com/jsapi ("before") with code to programmatically add the <script> tag, as shown in the following example:


var script = document.createElement('script');
script.src =
'https://maps.googleapis.com/maps/api/js?libraries=places,visualization&key=YOUR_API_KEY&v=weekly&callback=initMap';
script.async=true;
Then attach your callback function to the window object like this:


window.initMap = function() {
  // Google Maps JS API is loaded and available
};
Finally, add the <script> tag to the header of the page like this: