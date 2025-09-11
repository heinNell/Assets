Upgrading Your Maps JavaScript API Application from V2 to V3

bookmark_border

The Maps JavaScript API v2 is no longer available as of May 26, 2021. As a result, your site's v2 maps will stop working, and will return JavaScript errors. To continue using maps on your site, migrate to the Maps JavaScript API v3. This guide will help you through the process.

Overview
Every application will have a slightly different migration process; however, there are some steps that are common to all projects:

Get a new key. The Maps JavaScript API now uses the Google Cloud console to manage keys. If you are still using a v2 key, be sure to get your new API key before you begin your migration.
Update your API Bootstrap. Most applications will load the Maps JavaScript API v3 with the following code:

<script src="//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
Update your code. The amount of change required will depend a lot on your application. Common changes include:
Always reference the google.maps namespace. In v3, all Maps JavaScript API code is stored in the google.maps.* namespace instead of the global namespace. Most objects have also been renamed as part of this process. For example, instead of GMap2, you will now load google.maps.Map.
Remove any references to obsolete methods. A number of general purpose utility methods have been removed, such as GDownloadURL and GLog. Either replace this functionality with third party utility libraries, or remove these references from your code.
(Optional) Add libraries to your code. Many features have been externalized into utility libraries so that each app will only have to load the parts of the API that will be used.
(Optional) Configure your project to use the v3 externs. The v3 externs can be used to help validate your code with the Closure Compiler, or to trigger autocomplete in your IDE. Learn more about Advanced Compilation and Externs.
Test and iterate. At this point you will still have some work to do, but the good news is that you will be well on your way to your new v3 maps application!
Changes in V3 of the Maps JavaScript API
Before planning your migration, you should take time to understand the differences between the Maps JavaScript API v2 and the Maps JavaScript API v3. The newest version of the Maps JavaScript API has been written from the ground up, with a focus on modern JavaScript programming techniques, increased use of libraries, and a simplified API. Many new features have been added to the API, and several familiar features have been changed or even removed. This section highlights some of the key differences between the two releases.

Some of the changes in the v3 API include:

A streamlined core library. Many of the supplementary functions have been moved into libraries, helping to reduce the load and parsing times for the Core API which lets your map load quickly on any device.
Improved performance of several features, such as polygon rendering and marker placement.
A new approach to client-side usage limits to better accommodate shared addresses used by mobile proxies and corporate firewalls.
Added support for several modern browsers and mobile browsers. Support for Internet Explorer 6 has been removed.
Removed many of the general-purpose helper classes ( GLog or GDownloadUrl). Today, many excellent JavaScript libraries exist that provide similar functionality, such as Closure or jQuery.
An HTML5 Street View implementation that will load on any mobile device.
Custom Street View panoramas with your own photos, allowing you to share panoramas of ski slopes, houses for sale or other interesting places.
Styled Maps customizations let you change the display of elements on the base map to match your unique visual style.
Support for several new services, such as the ElevationService and Distance Matrix.
An improved directions services provides alternative routes, route optimization (approximate solutions to the traveling salesperson problem), bicycling directions (with bicycling layer), transit directions, and draggable directions.
An updated Geocoding format that provides more accurate type information than the accuracy value from the Geocoding API v2.
Support for multiple Info Windows on a single Map
Upgrade your application
Your New Key
The Maps JavaScript API v3 uses a new key system from v2. You may already be using a v3 key with your application, in which case no change is needed. To verify, check the the URL from which you load the Maps JavaScript API for its key parameter. If the key value starts with 'ABQIAA', you are using a v2 key. If you have a v2 key, you must upgrade to a v3 key as a part of the migration, which will:

Allow you to monitor your API usage in the Google Cloud console.
Allow you to purchase additional quota when required.
Give Google a way to contact you about your application.
The key is passed when loading the Maps JavaScript API v3. Learn more about generating API keys.

Note that if you are a Google Maps APIs for Work customer, you may be using a client ID with the client parameter instead of using the key parameter. Client IDs are still supported in Maps JavaScript API v3 and don't need to go through the key upgrade process.

Load the API
The first modification that you'll need to make to your code involves how you load the API. In v2, you load the Maps JavaScript API through a request to http://maps.google.com/maps. If you are loading the Maps JavaScript API v3, you will need to make the following changes:

Load the API from //maps.googleapis.com/maps/api/js
Remove the file parameter.
Update the key parameter with your new v3 key. Google Maps APIs for Work customers should use a client parameter.
(Google Maps Platform Premium Plan only) Verify that the client parameter is supplied as explained in the Google Maps Platform Premium Plan Developer's Guide.
Remove the v parameter to request the latest released version or change its value accordingly to the v3 versioning scheme.
(Optional) Replace the hl parameter with language and preserve its value.
(Optional) Add a libraries parameter to load optional libraries.
In the simplest case, the v3 bootstrap will specify only your API key parameter:


<script src="//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
The example below requests the latest version of the Maps JavaScript API v2 in German:


<script src="//maps.google.com/maps?file=api&v=2.x&key=YOUR_API_KEY&hl=de"></script>
The example below is an equivalent request for v3.


<script src="//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&language=de"></script>
The google.maps namespace
Probably the most noticeable change in the Maps JavaScript API v3 is the introduction of the google.maps namespace. The v2 API places all objects in the Global namespace by default, which can result in naming collisions. Within v3, all objects are located within the google.maps namespace.

When migrating your application to v3 you will have to change your code to make use of the new namespace. Unfortunately, searching for "G" and replacing with "google.maps." won't completely work; but, it is a good rule of thumb to apply when reviewing your code. Below are some examples of the equivalent classes in v2 and v3.

v2	v3
GMap2	google.maps.Map
GLatLng	google.maps.LatLng
GInfoWindow	google.maps.InfoWindow
GMapOptions	google.map.MapOptions
G_API_VERSION	google.maps.version
GPolyStyleOptions	google.maps.PolygonOptions
or google.maps.PolylineOptions
Remove Obsolete Code
The Maps JavaScript API v3 has parallels for most of the functionality in v2; however, there are some classes that are no longer supported. As part of your migration, you should either replace these classes with third party utility libraries, or remove these references from your code. Many excellent JavaScript libraries exist that provide similar functionality, such as Closure or jQuery.

The following classes have no parallel in the Maps JavaScript API v3:

GBounds	GLanguage
GBrowserIsCompatible	GLayer
GControl	GLog
GControlAnchor	GMercatorProjection
GControlImpl	GNavLabelControl
GControlPosition	GObliqueMercator
GCopyright	GOverlay
GCopyrightCollection	GPhotoSpec
GDownloadUrl	GPolyEditingOptions
GDraggableObject	GScreenOverlay
GDraggableObjectOptions	GStreetviewFeatures
GFactualGeocodeCache	GStreetviewLocation
GGeoAddressAccuracy	GStreetviewOverlay
GGeocodeCache	GStreetviewUserPhotosOptions
GGoogleBar	GTileLayerOptions
GGoogleBarAdsOptions	GTileLayerOverlayOptions
GGoogleBarLinkTarget	GTrafficOverlayOptions
GGoogleBarListingTypes	GUnload
GGoogleBarOptions	GXml
GGoogleBarResultList	GXmlHttp
GInfoWindowTab	GXslt
GKeyboardHandler	
Compare Code
Here's a comparison of two applications that have been written with the v2 and the v3 APIs.


<!DOCTYPE html>
<html>
  <head>
    <script src="//maps.google.com/maps?file=api&v=2&key=YOUR_API_KEY"></script>
    <style>
      html, body, #map { height: 100%; margin: 0; }
    </style>
    <script>
    function initialize() {
      if (GBrowserIsCompatible()) {
        var map = new GMap2(
            document.getElementById('map'));
        map.setCenter(new GLatLng(37.4419, -122.1419), 13);
        map.setUIToDefault();

        map.addOverlay(new GMarker(new GLatLng(37.4419, -122.1419)));

      }
    }
    </script>
  </head>
  <body onload="initialize()" onunload="GUnload()">
    <div id="map"></div>
  </body>
</html>
    

<!DOCTYPE html>
<html>
  <head>
    <script src="//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
    <style>
      html, body, #map { height: 100%; margin: 0; }
    </style>
    <script>
    function initialize() {
      var map = new google.maps.Map(
        document.getElementById('map'), {
          center: new google.maps.LatLng(37.4419, -122.1419),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var marker = new google.maps.Marker({
            position: new google.maps.LatLng(37.4419, -122.1419),
            map: map
      });

    }
    google.maps.event.addDomListener(window, 'load', initialize);
    </script>
  </head>
  <body>
    <div id="map"></div>
  </body>
</html>
    
As you can see, there are several differences between the two applications. Notable changes include:

The address from which the API is loaded has changed.
The GBrowserIsCompatible() and GUnload() methods are no longer required in v3, and have been removed from the API.
The GMap2 object is replaced by google.maps.Map as the central object in the API.
Properties are now loaded through Options classes. In the above example, we set the three properties required to load a map — center, zoom and mapTypeId — using an inlined MapOptions object.
The default UI is on by default in v3. You can disable this by setting the disableDefaultUI property to true in the MapOptions object.
Summary
At this point you'll have gotten a taste for some of the key points involved in your migration from v2 to v3 of the Maps JavaScript API. There is more information that you may need to know, but it will depend upon your application. In the following sections, we have included migration instructions for specific cases that you may encounter. Additionally, there are several resources that you might find helpful during the upgrade process.

The Maps JavaScript API v3 Developers Documentation is the best place to learn more about the API and how it works.
The Maps JavaScript API v3 Reference will help you learn more about the new classes and methods in the v3 API.
The Stack Overflow community is a great place to ask your code related questions. On the site, questions and answers relating to the Maps JavaScript API use the 'google-maps' or 'google-maps-api-3' tags.
Google Maps Platform Premium Plan customers will want to read through the Google Maps Platform Premium Plan Documentation.
The Google Geo Developers Blog is a great way to find out about the latest changes to the API.
Should you have any issues or questions about this document, use the SEND FEEDBACK link at the top of this page.

Detailed Reference
This section provides a detailed comparison of the most popular features for both v2 and v3 of the Maps JavaScript API. Each section of the reference is designed to be read individually. We recommend that you don't read this reference in its entirety; instead, use this material to aid your migration on a case-by-case basis.

Events - registering and handling events.
Controls - manipulating the navigational controls that appear on the map.
Overlays - adding and editing objects on the map.
Map Types - the tiles that make up the basemap.
Layers - adding and editing content as a group, such as KML or Traffic layers.
Services - working with Google's geocoding, directions or Street View services.
Events
The event model for the Maps JavaScript API v3 is similar to that used in v2, though much has changed under the hood.

New Event for MVC Support
The v3 API adds a new type of event to reflect MVC state changes. There are now two types of events:

User events (such as "click" mouse events) are propagated from the DOM to the Maps JavaScript API. These events are separate and distinct from standard DOM events.
MVC state change notifications reflect changes in Maps API objects and are named using a property_changed convention.
Each Maps API object exports a number of named events. Applications interested in specific events should register event listeners for those events and execute code when those events are received. This event-driven mechanism is the same in both the Maps JavaScript API v2 and v3, except that the namespace has changed from GEvent to google.maps.event:


GEvent.addListener(map, 'click', function() {
  alert('You clicked the map.');
});

google.maps.event.addListener(map, 'click', function() {
  alert('You clicked the map.');
});
Remove Event Listeners
For performance reasons, it's best to remove an event listener when it is no longer needed. Removing an event listener works the same way in v2 and v3:

When you create an event listener, an opaque object (GEventListener in v2, MapsEventListener in v3) is returned.
When you want to remove the event listener, pass this object to the removeListener() method (GEvent.removeListener() in v2 or google.maps.event.removeListener() in v3) to remove the event listener.
Listen to DOM Events
If you want to capture and respond to DOM (Document Object Model) events, v3 provides the google.maps.event.addDomListener() static method, equivalent to the GEvent.addDomListener() method in v2.

Use Passed Arguments in Events
UI events often pass an event argument which can then be accessed by the event listener. Most event arguments in v3 have been simplified to be more consistent over objects in the API. (Consult the v3 Reference for details.)

No overlay argument exists in v3 event listeners. If you register a click event on a v3 map the callback will only occur when the user clicks on the base map. You can register additional callbacks on clickable overlays if you need to react to those clicks.


// Passes an overlay argument when clicking on a map

var map = new GMap2(document.getElementById('map'));
map.setCenter(new GLatLng(-25.363882, 131.044922), 4);
map.setUIToDefault();

GEvent.addListener(map,'click', function(overlay, latlng) {
  if (latlng) {
    var marker = new GMarker(latlng);
    map.addOverlay(marker);
  }
});

// Passes only an event argument

var myOptions = {
    center: new google.maps.LatLng(-25.363882, 131.044922),
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map = new google.maps.Map(document.getElementById('map'),
    myOptions);

google.maps.event.addListener(map, 'click', function(event) {
  var marker = new google.maps.Marker({
      position: event.latLng,
      map: map
  });
});
Controls
The Maps JavaScript API displays UI controls that allow users to interact with your map. You can use the API to customize how these controls appear.

Changes in Control Types
Some changes to control types have been introduced with the v3 API.

The v3 API supports additional map types including terrain maps and the ability to add custom map types.
The v2 hierarchical control, GHierarchicalMapTypeControl, is no longer available. You can achieve a similar effect by using the google.maps.MapTypeControlStyle.HORIZONTAL_BAR control.
The horizontal layout provided by GMapTypeControl in v2 is not available in v3.
Add Controls to the Map
With the Maps JavaScript API v2 you would add controls to your map through the addControl() method of your map object. In v3, instead of accessing or modifying controls directly, you modify the associated MapOptions object. The below sample shows how to customize the map to add the following controls:

buttons that let the user toggle between available map types
a map scale

var map = new GMap2(document.getElementById('map'));
map.setCenter(new GLatLng(-25.363882, 131.044922), 4);

// Add controls
map.addControl(new GMapTypeControl());
map.addControl(new GScaleControl());

var myOptions = {
    center: new google.maps.LatLng(-25.363882, 131.044922),
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP,

    // Add controls
    mapTypeControl: true,
    scaleControl: true
};

var map = new google.maps.Map(document.getElementById('map'),
    myOptions);
Position Controls on the Map
Positioning controls has changed a great deal in v3. In v2, the addControl() method takes an optional second parameter that lets you specify the position of the control relative to the corners of the map.

In v3, you set the position of a control through the position property of the control options. Positioning of these controls is not absolute; instead, the API lays out the controls intelligently by "flowing" them around existing map elements within given constraints (such as the map size). This layout makes sure that default controls are compatible with your controls. See Control Positioning in v3 for more information.

The following code re-positions controls from the above samples:


var map = new GMap2(document.getElementById('map'));
map.setCenter(new GLatLng(-25.363882, 131.044922), 4);

// Add map type control
map.addControl(new GMapTypeControl(), new GControlPosition(
    G_ANCHOR_TOP_LEFT, new GSize(10, 10)));

// Add scale
map.addControl(new GScaleControl(), new GControlPosition(
    G_ANCHOR_BOTTOM_RIGHT, new GSize(20, 20)));

var myOptions = {
  center: new google.maps.LatLng(-25.363882, 131.044922),
  zoom: 4,
  mapTypeId: google.maps.MapTypeId.ROADMAP,

  // Add map type control
  mapTypeControl: true,
  mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_LEFT
  },

  // Add scale
  scaleControl: true,
  scaleControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_RIGHT
  }
};

var map = new google.maps.Map(document.getElementById('map'),
    myOptions);
Custom Controls
Use the Maps JavaScript API to create custom navigational controls. To customize controls with the v2 API, you would subclass the GControl class and define handlers for the initialize() and getDefaultPosition() methods. There is no equivalent to the GControl class in v3. Instead, controls are represented as DOM elements. To add a custom control with the v3 API, create a DOM structure for the control in a constructor as a child of a Node (e.g. a <div> element) and add event listeners to handle any DOM events. Push the Node into the maps' controls[position] array to add an instance of the custom control to your map.

Given a HomeControl class implementation that adheres to the interface requirements noted above (see Custom Controls documentation for details), the following code samples show how to add a custom control to a map.


map.addControl(new HomeControl(),
    GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(10, 10)));

var homeControlDiv = document.createElement('DIV');
var homeControl = new HomeControl(homeControlDiv, map);

map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
    homeControlDiv);
Overlays
Overlays reflect objects that you "add" to the map to designate points, lines, areas, or collections of objects.

Add and remove overlays
The types of objects represented by an Overlay are the same between v2 and v3, however, they are handled differently.

Overlays in the v2 API were added to and removed from the map using the addOverlay() and removeOverlay() methods of the GMap2 object. In v3, you assign a map to an Overlay using the map property of the associated overlay options class. You may also add or remove an overlay directly by calling the setMap() method of the overlay object, and specifying the map you want. Set the map property to null to remove the overlay.

No clearOverlays() method exists in v3. If you want to manage a set of overlays, you should create an array to hold the overlays. Using this array, you can then call setMap() on each overlay in the array (passing null if you need to remove them).

Draggable Markers
By default, markers are clickable but not draggable. The following two samples add a draggable marker:


var myLatLng = new GLatLng(-25.363882, 131.044922);
var map = new GMap2(document.getElementById('map'));
map.setCenter(myLatLng, 4);

var marker = new GMarker(latLng, {
  draggable: true
});
map.addOverlay(marker);

var myLatLng = new google.maps.LatLng(-25.363882, 131.044922);
var map = new google.maps.Map(
  document.getElementById('map'), {
  center: myLatLng,
  zoom: 4,
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

var marker = new google.maps.Marker({
    position: myLatLng,
    draggable: true,
    map: map
});
Icons
You can define a custom icon to show in place of the default marker. To use a custom image in v2, you can create a GIcon instance from the G_DEFAULT_ICON type, and modify it. If your image is larger or smaller than the default icon, you must specify it with a GSize instance. The v3 API simplifies this process slightly. Simply set the marker's icon property to the URL of your custom image, and the API will size the icon automatically.

The Maps JavaScript API also provides support for complex icons. A complex icon may include multiple tiles, complex shapes, or specify the "stack order" of how the images should display relative to other overlays. To add a shape to a marker in v2, you need to specify the additional property in each GIcon instance and pass this as an option to a GMarker constructor. In v3, icons specified in this manner should set their icon properties to an object of type Icon. Marker shadows are not supported in v3.

The following examples display a beach flag at Bondi Beach in Australia, with the transparent part of the icon not clickable:


var map = new GMap2(document.getElementById('map'));
map.setCenter(new GLatLng(-25.363882, 131.044922), 4);
map.setUIToDefault();

var flagIcon = new GIcon(G_DEFAULT_ICON);
flagIcon.image = '/images/beachflag.png';
flagIcon.imageMap = [1, 1, 1, 20, 18, 20, 18 , 1];
var bbLatLng = new GLatLng(-33.890542, 151.274856);

map.addOverlay(new GMarker(bbLatLng, {
  icon: flagIcon
}));

var map = new google.maps.Map(
  document.getElementById('map'), {
  center: new google.maps.LatLng(-25.363882, 131.044922),
  zoom: 4,
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

var shape = {
    coord: [1, 1, 1, 20, 18, 20, 18 , 1],
    type: 'poly'
};
var bbLatLng = new google.maps.LatLng(-33.890542, 151.274856);

var bbMarker = new google.maps.Marker({
    icon: '/images/beachflag.png'
    shape: shape,
    position: bbLatLng,
    map: map
});
Polylines
A polyline consists of an array of LatLngs, plus a series of line segments that connect those locations in an ordered sequence. Creating and displaying a Polyline object in v3 is similar to using a GPolyline object in v2. The following samples draw a semi-transparent, 3-pixel wide, geodesic polyline from Zurich to Sydney through Singapore:


var polyline = new GPolyline(
  [
    new GLatLng(47.3690239, 8.5380326),
    new GLatLng(1.352083, 103.819836),
    new GLatLng(-33.867139, 151.207114)
  ],
  '#FF0000', 3, 0.5, {
  geodesic: true
});

map.addOverlay(polyline);

var polyline = new google.maps.Polyline({
  path: [
    new google.maps.LatLng(47.3690239, 8.5380326),
    new google.maps.LatLng(1.352083, 103.819836),
    new google.maps.LatLng(-33.867139, 151.207114)
  ],
  strokeColor: '#FF0000',
  strokeOpacity: 0.5,
  strokeWeight: 3,
  geodesic: true
});

polyline.setMap(map);
Encoded Polylines
No support exists in v3 for creating Polyline objects directly from encoded polylines. Instead, the The Geometry Library provides methods to encode and decode polylines. See Libraries in the v3 Maps API for more information on how to load this library.

The examples below draw the same encoded polyline; the v3 code uses the decodePath() method from the google.maps.geometry.encoding namespace.


var polyline = new GPolyline.fromEncoded({
  points: 'kwb`Huqbs@ztzwGgvpdQbw}uEoif`H',
  levels: 'PPP',
  zoomFactor: 2,
  numLevels: 18,
  color: '#ff0000',
  opacity: 0.8,
  weight: 3
});

map.addOverlay(polyline);

var polyline = new google.maps.Polyline({
  path: google.maps.geometry.encoding.decodePath(
    'kwb`Huqbs@ztzwGgvpdQbw}uEoif`H'),
  strokeColor: '#FF0000',
  strokeOpacity: 0.5,
  strokeWeight: 3,
});

polyline.setMap(map);
Polygons
User-Editable Shapes
Polylines and polygons can be made user-editable. The following code snippets are equivalent:


map.addOverlay(polyline);
polyline.enableEditing();

polyline.setMap(map);
polyline.setEditable(true);
For more advanced drawing capabilities, see the Drawing Library in the v3 documentation.

Info Windows
An InfoWindow displays content in a floating window above the map. There are a few key differences between v2 and v3 info windows:

The v2 API supports only GInfoWindow per map, whereas the v3 API supports multiple, concurrent InfoWindows on each map.
The v3 InfoWindow will remain open when you click the map. The v2 GInfoWindow closes automatically when you click the map. You can emulate the v2 behavior by adding a click listener on the Map object.
The v3 API does not provide built-in support for a tabbed InfoWindow.
Ground Overlays
To place an image on a map, you should use a GroundOverlay object. The constructor for a GroundOverlay is essentially the same in v2 and v3: it specifies a URL of an image and the boundaries of the image as parameters.

The following example places an antique map of Newark, NJ on the map as an overlay:


var bounds = new GLatLngBounds(
    new GLatLng(40.716216, -74.213393),
    new GLatLng(40.765641, -74.139235));

var overlay = new GGroundOverlay(
    'http://lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    bounds);

map.addOverlay(overlay);

var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(40.716216, -74.213393),
    new google.maps.LatLng(40.765641, -74.139235));

var overlay = new google.maps.GroundOverlay(
    'http://lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    bounds);

overlay.setMap(map);
Map Types
The types of maps available in v2 and v3 are slightly different, but all basic map types are available in both versions of the API. By default, v2 uses standard "painted" road map tiles. However, v3 requires a specific map type to be given when creating a google.maps.Map object.

Common Map Types
The four basic map types are available in both v2 and v3:

MapTypeId.ROADMAP (replaces G_NORMAL_MAP) displays the road map view.
MapTypeId.SATELLITE (replaces G_SATELLITE_MAP) display Google Earth satellite images.
MapTypeId.HYBRID (replaces G_HYBRID_MAP) displays a mixture of normal and satellite views.
MapTypeId.TERRAIN (replaces G_PHYSICAL_MAP) displays a physical map based on terrain information.
Below is an example of v2 and v3 setting the map to terrain view:


map.setMapType(G_PHYSICAL_MAP);
    

map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    
The Maps JavaScript API v3 made a few changes to the less common map types as well:

Map tiles for celestial bodies other than Earth are not available as map types in the v3 API, but can be accessed as custom map types. For an example, see this custome map types example.
There is no special map type in v3 that replaces the G_SATELLITE_3D_MAP type from v2. Instead, you can integrate the Google Earth plugin in your v3 maps using this library.
Maximum Zoom Imagery
Satellite imagery is not always available at high zoom levels. If you may want to know the highest zoom level available before setting the zoom level, use the google.maps.MaxZoomService class. This class replaces the GMapType.getMaxZoomAtLatLng() method from v2.


var point = new GLatLng(
    180 * Math.random() - 90, 360 * Math.random() - 180);
var map = new GMap2(document.getElementById("map"));
map.setUIToDefault();
map.setCenter(point);
map.setMapType(G_HYBRID_MAP);

map.getCurrentMapType().getMaxZoomAtLatLng(point,
  function(response) {
    if (response.status) {
      map.setZoom(response.zoom);
    } else {
      alert("Error in Max Zoom Service.");
    }
});

var myLatlng = new google.maps.LatLng(
    180 * Math.random() - 90, 360 * Math.random() - 180);
var map = new google.maps.Map(
  document.getElementById("map"),{
    zoom: 0,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.HYBRID
});
var maxZoomService = new google.maps.MaxZoomService();
maxZoomService.getMaxZoomAtLatLng(
  myLatlng,
  function(response) {
    if (response.status == google.maps.MaxZoomStatus.OK) {
      map.setZoom(response.zoom);
    } else {
      alert("Error in Max Zoom Service.");
    }
});
Aerial Perspective Imagery
When enabling Aerial imagery in v3, controls are similar to the v2 GLargeZoomControl3D control, with an additional interstitial Rotate control to rotate through supported directions.

You can track the cities where 45° imagery is available on the supported cities map. When 45° imagery is available, a submenu option is added to the Maps API Satellite button.

Layers
Layers are objects on the map that consist of one or more overlays. They can be manipulated as a single unit and generally reflect collections of objects.

Supported Layers
The v3 API provides access to several different layers. These layers overlap with v2 GLayer class in the following areas:

The KmlLayer object renders KML and GeoRSS elements into v3 overlays, providing the equivalent for v2 GeoXml layer.
The TrafficLayer object renders a layer depicting traffic conditions, similar to the v2 GTrafficOverlay overlay.
These layers are different from v2. The differences are described below. They can be added to a map by calling setMap(), passing it the Map object on which to display the layer.

More information about supported layers is available in the Layers documentation.

KML and GeoRSS Layers
The Maps JavaScript API supports the KML and GeoRSS data formats for displaying geographic information. The KML or GeoRSS files must be publicly accessible if you want to include them in a map. In v3, these data formats are displayed using an instance of KmlLayer, which replaces the GGeoXml object from v2.

The v3 API is more flexible when rendering KML, letting you suppress InfoWindows and modify the click response. See the v3 KML and GeoRSS Layers documentation for more detail.

When rendering a KmlLayer, size and complexity restrictions apply; see the KmlLayer documentation for details.

The following samples compare how to load a KML file.


geoXml = new GGeoXml(
  'https://googlearchive.github.io/js-v2-samples/ggeoxml/cta.kml');

map.addOverlay(geoXml);

var layer = new google.maps.KmlLayer(
  'https://googlearchive.github.io/js-v2-samples/ggeoxml/cta.kml', {
    preserveViewport: true
});
layer.setMap(map);
The Traffic Layer
In v3, you can add real-time traffic information (where supported) to your maps using the TrafficLayer object. Traffic information is provided for the time that the request is made. These examples show the traffic information for Los Angeles:


var map = new GMap2(document.getElementById('map'));
map.setCenter(new GLatLng(34.0492459, -118.241043), 13);
map.setUIToDefault();

var trafficOptions = {incidents:false};
trafficInfo = new GTrafficOverlay(trafficOptions);
map.addOverlay(trafficInfo);

var map = new google.maps.Map(
    document.getElementById('map'), {
  center: new google.maps.LatLng(34.0492459, -118.241043),
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  zoom: 13
});

var trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setMap(map);
Unlike v2, no options exist for the TrafficLayer constructor in v3. Incidents are not available in v3.

Services
Geocoding
The Maps JavaScript API provides a geocoder object for geocoding addresses dynamically from user input. If you want to geocode static, known addresses, see the Geocoding API documentation.

The Geocoding API has been significantly upgraded and enhanced, adding new features and changing how data is represented.

GClientGeocoder in the v2 API provided two different methods for forward and reverse geocoding as well as additional methods to influence how geocoding was performed. In contrast, the v3 Geocoder object provides only a geocode() method, which takes an object literal containing the input terms (in the form of a Geocoding Requests object) and a callback method. Depending on whether the request contains a textual address attribute or a LatLng object, the Geocoding API will return a forward or reverse geocoding response. You can influence how the geocoding is performed by passing additional fields to the geocoding request:

Including a textual address triggers forward geocoding, equivalent to calling the getLatLng() method.
Including a latLng object triggers reverse geocoding, equivalent to calling the getLocations() method.
Including the bounds attribute enables Viewport Biasing, equivalent to calling the setViewport() method.
Including the region attribute enables Region Code Biasing, equivalent to calling the setBaseCountryCode() method.
Geocoding Responses in v3 are very different from the v2 responses. The v3 API replaces the nested structure that v2 uses with a flatter structure that is easier to parse. Additionally, v3 responses are more detailed: each result has a several address components that help give a better idea of the resolution of each result.

The following code takes a textual address and shows the first result from geocoding it:


var geocoder = new GClientGeocoder();
var infoPanel;
var map;
var AccuracyDescription = [
  'Unknown accuracy', 'country level accuracy',
  'region level accuracy', 'sub-region level accuracy',
  'town level accuracy', 'post code level accuracy',
  'street level accuracy', 'intersection level accuracy',
  'address level accuracy', 'premise level accuracy',
];

function geocode_result_handler(response) {
  if (!response || response.Status.code != 200) {
    alert('Geocoding failed. ' + response.Status.code);
  } else {
    var bounds = new GLatLngBounds(new GLatLng(
        response.Placemark[0].ExtendedData.LatLonBox.south,
        response.Placemark[0].ExtendedData.LatLonBox.west
    ), new GLatLng(
        response.Placemark[0].ExtendedData.LatLonBox.north,
        response.Placemark[0].ExtendedData.LatLonBox.east
    ));
    map.setCenter(bounds.getCenter(),
        map.getBoundsZoomLevel(bounds));
    var latlng = new GLatLng(
        response.Placemark[0].Point.coordinates[1],
        response.Placemark[0].Point.coordinates[0]);
    infoPanel.innerHTML += '<p>1st result is <em>' +
        // No info about location type
        response.Placemark[0].address +
        '</em> of <em>' +
        AccuracyDescription[response.Placemark[0].
            AddressDetails.Accuracy] +
        '</em> at <tt>' + latlng + '</tt></p>';
    var marker_title = response.Placemark[0].address +
        ' at ' + latlng;
    map.clearOverlays();

    var marker = marker = new GMarker(
        latlng,
        {'title': marker_title}
    );
    map.addOverlay(marker);
  }
}

function geocode_address() {
  var address = document.getElementById('input-text').value;
  infoPanel.innerHTML = '<p>Original address: ' + address + '</p>';
  geocoder.getLocations(address, geocode_result_handler);
}

function initialize() {
  map = new GMap2(document.getElementById('map'));
  map.setCenter(new GLatLng(38, 15), 2);
  map.setUIToDefault();

  infoPanel = document.getElementById('info-panel');
}

var geocoder = new google.maps.Geocoder();
var infoPanel;
var map;
var marker;

function geocode_result_handler(result, status) {
  if (status != google.maps.GeocoderStatus.OK) {
    alert('Geocoding failed. ' + status);
  } else {
    map.fitBounds(result[0].geometry.viewport);
    infoPanel.innerHTML += '<p>1st result for geocoding is <em>' +
        result[0].geometry.location_type.toLowerCase() +
        '</em> to <em>' +
        result[0].formatted_address + '</em> of types <em>' +
        result[0].types.join('</em>, <em>').replace(/_/, ' ') +
        '</em> at <tt>' + result[0].geometry.location +
        '</tt></p>';
    var marker_title = result[0].formatted_address +
        ' at ' + latlng;
    if (marker) {
      marker.setPosition(result[0].geometry.location);
      marker.setTitle(marker_title);
    } else {
      marker = new google.maps.Marker({
        position: result[0].geometry.location,
        title: marker_title,
        map: map
      });
    }
  }
}

function geocode_address() {
  var address = document.getElementById('input-text').value;
  infoPanel.innerHTML = '<p>Original address: ' + address + '</p>';
  geocoder.geocode({'address': address}, geocode_result_handler);
}

function initialize() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(38, 15),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
  infoPanel = document.getElementById('info-panel');
}
Directions
The Maps JavaScript API v3 replaces the GDirections class from v2 with the DirectionsService class for calculating directions.

The route() method in v3 replaces both the load() and loadFromWaypoints() methods from the v2 API. This method takes a single DirectionsRequest object literal containing the input terms and a callback method to execute upon receipt of the response. Options may be given in this object literal, similar to the GDirectionsOptions object literal in v2.

In the Maps JavaScript API v3, the task of submitting direction requests has been separated from the task of rendering requests, which is now handled with the DirectionsRenderer class. You can tie a DirectionsRenderer object to any map or DirectionsResult object through its setMap() and setDirections() methods. Because the renderer is an MVCObject, it will detect any changes to its properties and update the map when the associated directions have changed.

The following code demonstrates how to request walking directions to a specific location using pedestrian paths from an address. Note that only v3 is able to provide walking directions in the pedestrian path at Dublin's Zoo.


var map;
var directions;
var directionsPanel;

function initialize() {
  var origin = new google.maps.LatLng(53.348172, -6.297285);
  var destination = new google.maps.LatLng(53.355502, -6.30557);
  directionsPanel = document.getElementById("route");

  map = new GMap2(document.getElementById('map'));
  map.setCenter(origin, 10);
  map.setUIToDefault();

  directions = new GDirections(map, directionsPanel);

  directions.loadFromWaypoints(
      [origin, destination], {
        travelMode: 'G_TRAVEL_MODE_WALKING',
  });
}

var map;
var directionsRenderer;
var directionsService = new google.maps.DirectionsService();

function initialize() {
  var origin = new google.maps.LatLng(53.348172, -6.297285);
  var destination = new google.maps.LatLng(53.355502, -6.30557);
  directionsRenderer = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(
      document.getElementById('map'), {
        center: origin,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  directionsRenderer.setPanel(document.getElementById("route"));
  directionsRenderer.setMap(map);
  directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: google.maps.DirectionsTravelMode.WALKING
  }, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
    }
  });
}
Street View
Google Street View provides interactive, 360° views from designated locations within its coverage area. The v3 API supports Street View natively within the browser, unlike v2 which required the Flash® plugin to display Street View imagery.

Street View images are supported through use of the StreetViewPanorama object in v3, or the GStreetviewPanorama object in v2. These classes have different interfaces, but they play the same role: connecting the div container with the Street View imagery and letting you specify the location and POV (point of view) of the Street View panorama.


function initialize() {
  var fenwayPark = new GLatLng(42.345573, -71.098326);
  panoramaOptions = {
    latlng: fenwayPark,
    pov: {
      heading: 35,
      pitch: 5,
      zoom: 1
    }
  };

  var panorama = new GStreetviewPanorama(
      document.getElementById('pano'),
      panoramaOptions);

  GEvent.addListener(myPano, "error", handleNoFlash);
}

function handleNoFlash(errorCode) {
  if (errorCode == FLASH_UNAVAILABLE) {
    alert('Error: Your browser does not support Flash');
    return;
  }
}

function initialize() {
  var fenway = new google.maps.LatLng(42.345573, -71.098326);
  var panoramaOptions = {
    position: fenway,
    pov: {
      heading: 35,
      pitch: 5,
      zoom: 1
    }
  };

  var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'),
      panoramaOptions);
}
Direct access to Street View data is possible through the StreetViewService object in v3 or the similar GStreetviewClient object in v2. Both provide similar interfaces to retrieve or check availability of Street View data, and allowing search by location or panorama ID.

In v3, Street View is enabled by default. The map will appear with a Street View Pegman control and the API will reuse the map div to display StreetView panoramas. The following code illustrates how to emulate the v2 behavior by separating the Street View panoramas into a separate div.


var marker;
var panoClient = new GStreetviewClient();

function initialize() {
  if (GBrowserIsCompatible()) {
    var myPano = new GStreetviewPanorama(
        document.getElementById('pano'));
    GEvent.addListener(myPano, 'error', handleNoFlash);
    var map = new GMap2(document.getElementById('map'));
    map.setCenter(new GLatLng(42.345573, -71.098326), 16);
    map.setUIToDefault();

    GEvent.addListener(map, 'click', function(overlay, latlng) {
      if (marker) {
        marker.setLatLng(latlng);
      } else {
        marker = new GMarker(latlng);
        map.addOverlay(marker);
      }
      var nearestPano = panoClient.getNearestPanorama(
          latlng, processSVData);
    });

    function processSVData(panoData) {
      if (panoData.code != 200) {
        alert("Panorama data not found for this location.");
      }
      var latlng = marker.getLatLng();
      var dLat = latlng.latRadians()
          - panoData.location.latlng.latRadians();
      var dLon = latlng.lngRadians()
          - panoData.location.latlng.lngRadians();
      var y = Math.sin(dLon) * Math.cos(latlng.latRadians());
      var x = Math.cos(panoData.location.latlng.latRadians()) *
              Math.sin(latlng.latRadians()) -
              Math.sin(panoData.location.latlng.latRadians()) *
              Math.cos(latlng.latRadians()) * Math.cos(dLon);
      var bearing = Math.atan2(y, x) * 180 / Math.PI;

      myPano.setLocationAndPOV(panoData.location.latlng, {
        yaw: bearing
      });
    }

    function handleNoFlash(errorCode) {
      if (errorCode == FLASH_UNAVAILABLE) {
        alert('Error: Your browser does not support Flash');
        return;
      }
    }
  }
}

// Load the API with libraries=geometry
var map;
var marker;
var panorama;
var sv = new google.maps.StreetViewService();

function radians(degrees) { return Math.PI * degrees / 180.0 };

function initialize() {

  panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"));

  map = new google.maps.Map(
      document.getElementById('map'), {
    center: new google.maps.LatLng(42.345573, -71.098326),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 16
  });

  google.maps.event.addListener(map, 'click', function(event) {
    if (!marker) {
      marker = new google.maps.Marker({
          position: event.latLng,
          map: map
      });
    } else {
      marker.setPosition(event.latLng);
    }
    sv.getPanoramaByLocation(event.latLng, 50, processSVData);
  });
}

function processSVData(panoData, status) {
  if (status == google.maps.StreetViewStatus.OK) {
    alert("Panorama data not found for this location.");
  }
  var bearing = google.maps.geometry.spherical.computeHeading(
      panoData.location.latLng, marker.getPosition());

  panorama.setPano(panoData.location.pano);

  panorama.setPov({
    heading: bearing,
    pitch: 0,
    zoom: 1
  });

  panorama.setVisible(true);
  marker.setMap(panorama);
}
