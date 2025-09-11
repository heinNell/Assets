Import GeoJSON Data into Maps

bookmark_border

Overview
Learn how to import GeoJSON data from either a local or remote source, and display it on your map. This tutorial uses the map below to illustrate various techniques to import data into maps.

Current Information:
This section provides an overview of importing GeoJSON data into Google Maps. GeoJSON is a format for encoding geographic data structures using JavaScript Object Notation (JSON). The tutorial demonstrates how to visualize this data on maps using different techniques.

Real-time Implementation Plan:
To implement this in real-time, you would:
1. Set up a Google Maps API key in your project
2. Create an HTML file with a map container div
3. Include the Google Maps JavaScript API script
4. Initialize the map with appropriate zoom and center coordinates
5. Load GeoJSON data either locally or from a remote source
6. Add the data to the map using either map.data.loadGeoJson() or map.data.addGeoJson()

The section below displays the entire code you need to create the map in this tutorial.

Tip: Check out the store location solutions to see another example of using GeoJSON data with maps.

Current Information:
The code examples show how to create a basic map and load GeoJSON data using JSONP callback method. The TypeScript and JavaScript examples demonstrate creating a map object, loading external GeoJSON data via script tag injection, and placing markers for each data point.

Real-time Implementation Plan:
To implement this in real-time:
1. Create an HTML file with a map div element
2. Add CSS styling to make the map fill the screen
3. Include the Google Maps JavaScript API with your API key
4. Implement the initMap function to initialize the map
5. Create a script element dynamically to load GeoJSON data
6. Append the script to the document head
7. Define the eqfeed_callback function to process the returned data
8. Loop through features in the GeoJSON data and create markers for each coordinate

TypeScript
JavaScript
CSS
HTML

let map: google.maps.Map;

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 2,
    center: new google.maps.LatLng(2.8, -187.3),
    mapTypeId: "terrain",
  });

  // Create a <script> tag and set the USGS URL as the source.
  const script = document.createElement("script");

  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src =
    "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Loop through the results array and place a marker for each
// set of coordinates.
const eqfeed_callback = function (results: any) {
  for (let i = 0; i < results.features.length; i++) {
    const coords = results.features[i].geometry.coordinates;
    const latLng = new google.maps.LatLng(coords[1], coords[0]);

    new google.maps.Marker({
      position: latLng,
      map: map,
    });
  }
};

declare global {
  interface Window {
    initMap: () => void;
    eqfeed_callback: (results: any) => void;
  }
}
window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;
Note: Read the guide on using TypeScript and Google Maps.
Try Sample 
JSFiddle.net
Google Cloud Shell

Loading data
This section shows you how to load data from either the same domain as your Maps JavaScript API application, or from a different one.

Current Information:
The tutorial explains different methods for loading GeoJSON data depending on where it's hosted. It covers loading from the same domain, across domains with CORS support, and using JSONP for cross-domain requests.

Real-time Implementation Plan:
To implement data loading in real-time:
1. Determine where your GeoJSON data is hosted (local or remote)
2. If local, use map.data.loadGeoJson() with the relative file path
3. If remote with CORS enabled, use map.data.loadGeoJson() with the full URL
4. If remote without CORS, implement JSONP by dynamically creating script tags
5. Ensure proper error handling for network requests
6. Validate GeoJSON data structure before processing
7. Handle large datasets by implementing pagination or clustering

Loading data from the same domain
The Google Maps Data Layer provides a container for arbitrary geospatial data (including GeoJSON). If your data is in a file hosted on the same domain as your Maps JavaScript API application, you can load it using the map.data.loadGeoJson() method. The file must be on the same domain, but you can host it in a different subdomain. For example, you can make a request to files.example.com from www.example.com.

Current Information:
This section explains that when GeoJSON data is hosted on the same domain as your application, you can use the map.data.loadGeoJson() method directly. This is the simplest approach as it doesn't require special cross-domain permissions.

Real-time Implementation Plan:
To implement same-domain data loading in real-time:
1. Place your GeoJSON file in your project directory
2. Use a relative path to reference the file in map.data.loadGeoJson()
3. Implement error handling to catch malformed GeoJSON
4. Add loading indicators to improve user experience
5. Cache the data locally to reduce repeated requests
6. Validate the GeoJSON structure before adding to map
7. Consider implementing data refresh mechanisms for dynamic data

map.data.loadGeoJson('data.json');

Loading data across domains
You can also request data from a domain other than your own, if the domain's configuration allows such a request. The standard for this permission is called Cross-origin resource sharing (CORS). If a domain has allowed cross-domain requests, its response header should include the following declaration:

Current Information:
This section explains cross-domain data loading using CORS (Cross-Origin Resource Sharing). For this to work, the remote server must include the Access-Control-Allow-Origin header in its response.

Real-time Implementation Plan:
To implement cross-domain data loading in real-time:
1. Verify the remote server supports CORS by checking response headers
2. Use browser developer tools to confirm Access-Control-Allow-Origin is present
3. Implement map.data.loadGeoJson() with the remote URL
4. Add error handling for CORS-related failures
5. Consider fallback methods if CORS is not supported
6. Implement timeout handling for slow network requests
7. Add proper authentication if required by the remote server

Access-Control-Allow-Origin: *
Use the Chrome Developer Tools (DevTools) to find out if a domain has enabled CORS.

Loading data from such a domain is the same as loading JSON from the same domain:

map.data.loadGeoJson('http://www.CORS-ENABLED-SITE.com/data.json');

Requesting JSONP
The target domain must support requests for JSONP in order to use this technique.

Current Information:
This section explains JSONP as an alternative to CORS for cross-domain requests. JSONP works by injecting a script tag into the document head, which loads JavaScript code from the remote domain.

Real-time Implementation Plan:
To implement JSONP data loading in real-time:
1. Verify the target domain supports JSONP (check documentation or test URLs)
2. Create a script element dynamically using document.createElement('script')
3. Set the src attribute to the JSONP endpoint URL
4. Append the script to document head to initiate the request
5. Define a global callback function to handle the returned data
6. Implement security checks since JSONP executes remote code
7. Add error handling for failed script loading
8. Clean up script elements after use to prevent memory leaks

Requesting JSONP from domains outside of your control is very risky.

Since your browser loads any code that returns as a script, you should only request JSONP from a domain that you trust. In general, JSONP is replaced by CORS; the latter is much safer and should be your preferred choice if both are available.

To request JSONP, use createElement() to add a script tag to the head of your document.

var script = document.createElement('script');
script.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp';
document.getElementsByTagName('head')[0].appendChild(script);

When the script runs, the target domain passes the data as an argument to another script, usually named callback(). The target domain defines the callback script name, which is the first name on the page when you load the target URL in a browser.

For example, load http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp in your browser window to reveal the callback name as eqfeed_callback.

You must define the callback script in your code:

function eqfeed_callback(response) {
  map.data.addGeoJson(response);
}

Use the addGeoJson() method to place the parsed GeoJSON data on the map.

Styling the data
You can change the appearance of your data by adding GeoJSON data to a Map object. Read the developer's guide for more information on styling your data.

Current Information:
This section introduces the concept of styling GeoJSON data on Google Maps. It mentions that you can customize the appearance of your geospatial data using styling options.

Real-time Implementation Plan:
To implement data styling in real-time:
1. Define styling rules based on properties in your GeoJSON features
2. Use map.data.setStyle() to apply styling functions
3. Implement dynamic styling that changes based on data values
4. Add hover effects and interactivity to styled features
5. Consider performance implications of complex styling
6. Implement responsive styling that adapts to different zoom levels
7. Add legend or controls to explain the styling to users

Data Visualization: Mapping Earthquakes

bookmark_border

Overview
This tutorial shows you how to visualize data on Google maps. As an example, the maps in this tutorial visualize data about the location of earthquakes and their magnitude. Learn techniques to use with your own data source, and create powerful stories on Google maps like the ones below.

Current Information:
This section provides an overview of data visualization techniques using earthquake data as an example. It demonstrates how to create compelling visual stories on maps using real-world data.

Real-time Implementation Plan:
To implement earthquake data visualization in real-time:
1. Set up a connection to a real-time earthquake data API
2. Parse incoming GeoJSON data to extract earthquake features
3. Implement different visualization modes (markers, circles, heatmaps)
4. Add controls to switch between visualization types
5. Implement data filtering based on magnitude, time, or location
6. Add real-time data refresh capabilities
7. Include user controls for customizing the visualization

The first 2 frames seen above (from left to right) display maps with basic markers, and sized circles. The last frame displays a heatmap.

Import your data
This tutorial uses real-time earthquake data from the United States Geological Survey (USGS). The USGS website provides their data in a number of formats, which you can copy to your domain for local access by your application. This tutorial requests JSONP directly from the USGS servers by appending a script tag to the head of the document.

Current Information:
This section explains how to import earthquake data from the USGS. It mentions that USGS provides data in multiple formats and shows how to use JSONP to request data directly from their servers.

Real-time Implementation Plan:
To implement real-time earthquake data import:
1. Identify the appropriate USGS API endpoint for your needs
2. Implement JSONP request mechanism as shown in the examples
3. Set up periodic data refresh using setInterval
4. Handle API rate limits and implement proper error handling
5. Cache recent data to reduce redundant requests
6. Implement data filtering to only show relevant earthquakes
7. Add loading states to indicate when new data is being fetched

Note: You should only request data from servers you trust completely, because of potential security risks with loading cross-domain content.

// Create a script tag and set the USGS URL as the source.
        var script = document.createElement('script');

        script.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp';
        document.getElementsByTagName('head')[0].appendChild(script);

Place basic markers
Now that you have pulled data about the location of earthquakes from the USGS feed into your application, you can display it on the map. This section shows you how to create a map that uses imported data to place a basic marker at the epicenter of every earthquake location.

Current Information:
This section demonstrates how to place basic markers on the map for each earthquake location. It shows how to extract coordinates from GeoJSON features and create Google Maps Marker objects.

Real-time Implementation Plan:
To implement basic markers in real-time:
1. Parse GeoJSON features to extract coordinate data
2. Convert coordinates to google.maps.LatLng objects
3. Create google.maps.Marker instances for each location
4. Add markers to the map with appropriate positioning
5. Implement marker clustering for large datasets
6. Add info windows to display earthquake details when markers are clicked
7. Implement marker cleanup when refreshing data
8. Consider performance optimizations for marker rendering

The section below displays the entire code you need to create the map in this tutorial.

TypeScript
JavaScript
CSS
HTML

let map: google.maps.Map;

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 2,
    center: new google.maps.LatLng(2.8, -187.3),
    mapTypeId: "terrain",
  });

  // Create a <script> tag and set the USGS URL as the source.
  const script = document.createElement("script");

  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src =
    "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Loop through the results array and place a marker for each
// set of coordinates.
const eqfeed_callback = function (results: any) {
  for (let i = 0; i < results.features.length; i++) {
    const coords = results.features[i].geometry.coordinates;
    const latLng = new google.maps.LatLng(coords[1], coords[0]);

    new google.maps.Marker({
      position: latLng,
      map: map,
    });
  }
};

declare global {
  interface Window {
    initMap: () => void;
    eqfeed_callback: (results: any) => void;
  }
}
window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;
Note: Read the guide on using TypeScript and Google Maps.
Try Sample 
JSFiddle.net
Google Cloud Shell

Use shapes and heatmaps to customize maps
This section shows you other ways to customize rich datasets on a map. Consider the map created in the previous section of this tutorial which shows markers on every earthquake location. You can customize the markers to visualize additional data, like locations that have the most earthquakes, and their magnitude or depth.

Current Information:
This section introduces advanced visualization techniques beyond basic markers. It explains that you can customize markers to represent additional data attributes like magnitude or depth.

Real-time Implementation Plan:
To implement customized shapes and heatmaps in real-time:
1. Extract additional properties from GeoJSON features (magnitude, depth, etc.)
2. Implement dynamic styling based on these properties
3. Create symbol-based markers for visualizing magnitude through size
4. Implement heatmap layers for density visualization
5. Add user controls to switch between visualization modes
6. Handle performance considerations for large datasets
7. Implement proper cleanup when switching visualization types

Here are some options to customize the basic marker:

Using circle size:
You can draw circles (or any other shape) with sizes that are relative to the magnitude of an earthquake by using symbols. In this way, powerful earthquakes are represented as the largest circles on the map.

Current Information:
This section explains how to use symbols to draw circles with sizes relative to earthquake magnitude. It shows how to use google.maps.SymbolPath.CIRCLE to create scalable markers.

Real-time Implementation Plan:
To implement circle size visualization in real-time:
1. Create a styling function that reads magnitude properties from features
2. Calculate circle scale based on magnitude values
3. Define color schemes and opacity settings for visual clarity
4. Implement the styling using map.data.setStyle()
5. Add a legend to explain circle size meaning to users
6. Handle edge cases like missing magnitude data
7. Optimize rendering performance for many circles

Using heatmaps:
The Heatmap Layer in the visualization library offers a simple yet powerful way of displaying the distribution of earthquakes. Heatmaps use colors to represent the density of points, making it easier to pick out areas of high activity. Heatmaps can also use WeightedLocations so that, for example, bigger earthquakes are displayed more prominently in the heatmap.

Current Information:
This section introduces heatmap visualization as an alternative to markers. It explains that heatmaps use colors to represent point density and can weight locations based on properties like earthquake magnitude.

Real-time Implementation Plan:
To implement heatmaps in real-time:
1. Extract coordinate data from GeoJSON features
2. Convert coordinates to google.maps.LatLng objects
3. Create a HeatmapLayer instance with the coordinate data
4. Configure heatmap properties (dissipating, opacity, radius)
5. Implement weighted heatmaps based on magnitude data
6. Add controls to toggle between markers and heatmaps
7. Handle heatmap performance with large datasets
8. Implement proper cleanup when switching visualization modes

Circle size
The map below displays customized markers using circles. The circle size increases with the magnitude of an earthquake at that particular location.

Current Information:
This section demonstrates a practical implementation of circle markers sized by earthquake magnitude. It shows how to create a getCircle function that returns symbol definitions with scaled sizes.

Real-time Implementation Plan:
To implement circle size visualization in real-time:
1. Define a getCircle function that calculates symbol properties based on magnitude
2. Use exponential scaling (Math.pow) to make magnitude differences more visible
3. Set appropriate fill and stroke colors for clarity
4. Implement the styling function with map.data.setStyle()
5. Add error handling for features without magnitude properties
6. Optimize the styling function for performance
7. Implement responsive adjustments for different zoom levels

The section below displays the entire code you need to create a map with customized circle markers.

TypeScript
JavaScript
CSS
HTML

let map: google.maps.Map;

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 2,
    center: { lat: -33.865427, lng: 151.196123 },
    mapTypeId: "terrain",
  });

  // Create a <script> tag and set the USGS URL as the source.
  const script = document.createElement("script");

  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src =
    "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";
  document.getElementsByTagName("head")[0].appendChild(script);

  map.data.setStyle((feature) => {
    const magnitude = feature.getProperty("mag") as number;
    return {
      icon: getCircle(magnitude),
    };
  });
}

function getCircle(magnitude: number) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "red",
    fillOpacity: 0.2,
    scale: Math.pow(2, magnitude) / 2,
    strokeColor: "white",
    strokeWeight: 0.5,
  };
}

function eqfeed_callback(results: any) {
  map.data.addGeoJson(results);
}

declare global {
  interface Window {
    initMap: () => void;
    eqfeed_callback: (results: any) => void;
  }
}
window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;
Note: Read the guide on using TypeScript and Google Maps.
Try Sample 
JSFiddle.net
Google Cloud Shell

Heatmaps
Heatmaps make it easy for viewers to understand the distribution of earthquakes, reported by USGS. Rather than placing a marker on each epicenter, heatmaps use color and shape to represent the distribution of the data. In this example, red represents areas of high earthquake activity.

Current Information:
This section demonstrates heatmap implementation for earthquake data visualization. It shows how to convert GeoJSON features to LatLng objects and create a HeatmapLayer.

Real-time Implementation Plan:
To implement heatmaps in real-time:
1. Parse GeoJSON features to extract coordinate data
2. Convert coordinates to google.maps.LatLng objects
3. Create an array of heatmap data points
4. Initialize a HeatmapLayer with the data array
5. Configure heatmap properties for optimal visualization
6. Add the heatmap layer to the map
7. Implement controls to adjust heatmap parameters (radius, opacity, etc.)
8. Handle data refresh and heatmap updates

Tip: You can set your own colors for the heatmap, using the gradient property.
The section below displays the entire code you need to create this map.

TypeScript
JavaScript
CSS
HTML

let map: google.maps.Map;

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 2,
    center: { lat: -33.865427, lng: 151.196123 },
    mapTypeId: "terrain",
  });

  // Create a <script> tag and set the USGS URL as the source.
  const script = document.createElement("script");

  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src =
    "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";
  document.getElementsByTagName("head")[0].appendChild(script);
}

function eqfeed_callback(results: any) {
  const heatmapData: google.maps.LatLng[] = [];

  for (let i = 0; i < results.features.length; i++) {
    const coords = results.features[i].geometry.coordinates;
    const latLng = new google.maps.LatLng(coords[1], coords[0]);

    heatmapData.push(latLng);
  }

  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    dissipating: false,
    map: map,
  });
}

declare global {
  interface Window {
    initMap: () => void;
    eqfeed_callback: (results: any) => void;
  }
}
window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;

Combine and Visualize Multiple Data Sources

bookmark_border

Overview
This tutorial shows you how to display data from multiple sources on a Google map. As an example, the choropleth map below uses two different sources to highlight various US states, and display state-specific data.

Current Information:
This section introduces combining multiple data sources in a single map visualization. It demonstrates a choropleth map that uses GeoJSON for state boundaries and separate data for state-specific information.

Real-time Implementation Plan:
To implement multiple data source visualization in real-time:
1. Load primary geographic data (state boundaries) from GeoJSON
2. Set up API connections for secondary data sources (census data)
3. Implement data mapping between different sources using common identifiers
4. Create dynamic styling functions that update based on combined data
5. Add UI controls for switching between different data variables
6. Implement hover effects to display detailed information
7. Handle asynchronous data loading and synchronization
8. Add proper error handling for failed data requests

The map uses data from a GeoJSON file to display polygons that define US state boundaries. It can also present data on the map corresponding to each state, which comes from a simulated query to the US Census API.

Select a category of data from the control dropdown menu to update the polygons on the map. You can also hover over a state polygon to view state-specific information in a data box control on the map.

Current Information:
This section explains the specific implementation of a choropleth map showing US state data. It describes using GeoJSON for boundaries and Census API data for coloring states based on different variables.

Real-time Implementation Plan:
To implement choropleth visualization with multiple data sources in real-time:
1. Load GeoJSON state boundary data using map.data.loadGeoJson()
2. Set up Census API requests with proper authentication
3. Parse Census API responses and map data to state identifiers
4. Implement dynamic styling that updates when different census variables are selected
5. Create UI controls (dropdown) for variable selection
6. Add hover interactions to display state-specific data
7. Implement legend updates to reflect current data range
8. Handle data refresh and UI state synchronization

The sample below shows the entire code you need to create this map.

TypeScript
JavaScript
CSS
HTML

const mapStyle: google.maps.MapTypeStyle[] = [
  {
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#fcfcfc" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#bfd4ff" }],
  },
];
let map: google.maps.Map;

let censusMin = Number.MAX_VALUE,
  censusMax = -Number.MAX_VALUE;

function initMap(): void {
  // load the map
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 40, lng: -100 },
    zoom: 4,
    styles: mapStyle,
  });

  // set up the style rules and events for google.maps.Data
  map.data.setStyle(styleFeature);
  map.data.addListener("mouseover", mouseInToRegion);
  map.data.addListener("mouseout", mouseOutOfRegion);

  // wire up the button
  const selectBox = document.getElementById(
    "census-variable"
  ) as HTMLSelectElement;

  google.maps.event.addDomListener(selectBox, "change", () => {
    clearCensusData();
    loadCensusData(selectBox.options[selectBox.selectedIndex].value);
  });

  // state polygons only need to be loaded once, do them now
  loadMapShapes();
}

/** Loads the state boundary polygons from a GeoJSON source. */
function loadMapShapes() {
  // load US state outline polygons from a GeoJson file
  map.data.loadGeoJson(
    "https://storage.googleapis.com/mapsdevsite/json/states.js",
    { idPropertyName: "STATE" }
  );

  // wait for the request to complete by listening for the first feature to be
  // added
  google.maps.event.addListenerOnce(map.data, "addfeature", () => {
    google.maps.event.trigger(
      document.getElementById("census-variable") as HTMLElement,
      "change"
    );
  });
}

/**
 * Loads the census data from a simulated API call to the US Census API.
 *
 * @param {string} variable
 */
function loadCensusData(variable: string) {
  // load the requested variable from the census API (using local copies)
  const xhr = new XMLHttpRequest();

  xhr.open("GET", variable + ".json");

  xhr.onload = function () {
    const censusData = JSON.parse(xhr.responseText) as any;

    censusData.shift(); // the first row contains column names
    censusData.forEach((row: string) => {
      const censusVariable = parseFloat(row[0]);
      const stateId = row[1];

      // keep track of min and max values
      if (censusVariable < censusMin) {
        censusMin = censusVariable;
      }

      if (censusVariable > censusMax) {
        censusMax = censusVariable;
      }

      const state = map.data.getFeatureById(stateId);

      // update the existing row with the new data
      if (state) {
        state.setProperty("census_variable", censusVariable);
      }
    });

    // update and display the legend
    (document.getElementById("census-min") as HTMLElement).textContent =
      censusMin.toLocaleString();
    (document.getElementById("census-max") as HTMLElement).textContent =
      censusMax.toLocaleString();
  };

  xhr.send();
}

/** Removes census data from each shape on the map and resets the UI. */
function clearCensusData() {
  censusMin = Number.MAX_VALUE;
  censusMax = -Number.MAX_VALUE;
  map.data.forEach((row) => {
    row.setProperty("census_variable", undefined);
  });
  (document.getElementById("data-box") as HTMLElement).style.display = "none";
  (document.getElementById("data-caret") as HTMLElement).style.display = "none";
}

/**
 * Applies a gradient style based on the 'census_variable' column.
 * This is the callback passed to data.setStyle() and is called for each row in
 * the data set.  Check out the docs for Data.StylingFunction.
 *
 * @param {google.maps.Data.Feature} feature
 */
function styleFeature(feature: google.maps.Data.Feature) {
  const low = [5, 69, 54]; // color of smallest datum
  const high = [151, 83, 34]; // color of largest datum

  let censusVariable = feature.getProperty("census_variable") as number;

  // delta represents where the value sits between the min and max
  const delta =
    (censusVariable - censusMin) /
    (censusMax - censusMin);

  const color: number[] = [];

  for (let i = 0; i < 3; i++) {
    // calculate an integer color based on the delta
    color.push((high[i] - low[i]) * delta + low[i]);
  }

  // determine whether to show this shape or not
  let showRow = true;

  if (
    censusVariable == null ||
    isNaN(censusVariable)
  ) {
    showRow = false;
  }

  let outlineWeight = 0.5,
    zIndex = 1;

  if (feature.getProperty("state") === "hover") {
    outlineWeight = zIndex = 2;
  }

  return {
    strokeWeight: outlineWeight,
    strokeColor: "#fff",
    zIndex: zIndex,
    fillColor: "hsl(" + color[0] + "," + color[1] + "%," + color[2] + "%)",
    fillOpacity: 0.75,
    visible: showRow,
  };
}

/**
 * Responds to the mouse-in event on a map shape (state).
 *
 * @param {?google.maps.MapMouseEvent} e
 */
function mouseInToRegion(e: any) {
  // set the hover state so the setStyle function can change the border
  e.feature.setProperty("state", "hover");

  const percent =
    ((e.feature.getProperty("census_variable") - censusMin) /
      (censusMax - censusMin)) *
    100;

  // update the label
  (document.getElementById("data-label") as HTMLElement).textContent =
    e.feature.getProperty("NAME");
  (document.getElementById("data-value") as HTMLElement).textContent = e.feature
    .getProperty("census_variable")
    .toLocaleString();
  (document.getElementById("data-box") as HTMLElement).style.display = "block";
  (document.getElementById("data-caret") as HTMLElement).style.display =
    "block";
  (document.getElementById("data-caret") as HTMLElement).style.paddingLeft =
    percent + "%";
}

/**
 * Responds to the mouse-out event on a map shape (state).
 *
 */
function mouseOutOfRegion(e: any) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty("state", "normal");
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
Try Sample 
JSFiddle.net
Google Cloud Shell

Getting started
You can develop your own version of this choropleth map by using the code in this tutorial. To begin doing this, create a new file in a text editor and save it as index.html.

Current Information:
This section provides getting started instructions for implementing the choropleth map example. It suggests creating an index.html file and building upon the provided code samples.

Real-time Implementation Plan:
To implement this choropleth map in real-time:
1. Create a new HTML file with proper document structure
2. Include the Google Maps JavaScript API with your API key
3. Add CSS styling for map controls and data display elements
4. Implement the JavaScript code for map initialization and data loading
5. Set up event listeners for UI interactions
6. Test the implementation with different census variables
7. Add error handling for API requests and data parsing
8. Optimize performance for smooth interactions

Read the sections that follow to understand the code that you can add to this file.

Creating a basic map
This section explains the code that sets up a basic map. This may be similar to how you've created maps when getting started with the Maps JavaScript API.

Current Information:
This section shows the basic map initialization code, including setting center coordinates, zoom level, and map styles to hide default features and show only landscape and water.

Real-time Implementation Plan:
To create a basic map in real-time:
1. Create a div element with an ID for the map container
2. Set appropriate CSS styles to make the map fill the desired space
3. Initialize the google.maps.Map object with configuration options
4. Apply custom map styles to control what features are visible
5. Set up the map in the initMap function to ensure proper loading sequence
6. Handle map resize events for responsive design
7. Implement map type controls for user customization

Copy the code below into your index.html file. This code loads the Maps JavaScript API, and makes the map fullscreen.

<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      <title>Mashups with google.maps.Data</title>
      <style>
        #map {
          height: 100%;
        }
        /* Optional: Makes the sample page fill the window. */
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      function initMap() {

        // load the map
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40, lng: -100},
          zoom: 4,
          styles: mapStyle
        });

        var mapStyle = [{
          'featureType': 'all',
          'elementType': 'all',
          'stylers': [{'visibility': 'off'}]
        }, {
          'featureType': 'landscape',
          'elementType': 'geometry',
          'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
        }, {
          'featureType': 'water',
          'elementType': 'labels',
          'stylers': [{'visibility': 'off'}]
        }, {
          'featureType': 'water',
          'elementType': 'geometry',
          'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
        }];
      }

    </script>
    <script defer
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
    </script>
  </body>
</html>

The code within the first script tag is the starting point that runs the program by creating a function called initMap that initializes the map object.

The stylers in the code above turn off the visibility of all featureTypes on the map like roads, points of interest, landscape, administrative areas, and all their elementTypes. For a list of all available values for featureType and elementType, see the JSON style reference.

Click YOUR_API_KEY in the code sample, or follow the instructions to get an API key. Replace YOUR_API_KEY with your application's API key. After the API is completely loaded, the callback parameter in the script tag below executes the initMap() function in the HTML file.

<script> defer
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
</script>

Creating and styling the map control
The code below creates the following controls on the map:

A control with a dropdown menu that has 5 different data options.
A map legend.
A data box displaying state-specific data which appears when you hover over a polygon.

Current Information:
This section shows HTML code for creating map controls including a dropdown selector for census variables, a color gradient legend, and a data display box that appears on hover.

Real-time Implementation Plan:
To implement map controls in real-time:
1. Create HTML elements for the controls with appropriate IDs and classes
2. Style controls with CSS to position them on the map
3. Populate the dropdown with census variable options
4. Implement the color gradient legend with dynamic min/max values
5. Create the hover data box with proper styling
6. Add event listeners to handle user interactions with controls
7. Implement responsive positioning for different screen sizes
8. Add accessibility features for screen readers

<div id="controls" class="nicebox">
  <div>
  <select id="census-variable">
    <option value="https://storage.googleapis.com/mapsdevsite/json/DP02_0066PE">Percent of population over 25 that completed high
    school</option>
    <option value="https://storage.googleapis.com/mapsdevsite/json/DP05_0017E">Median age</option>
    <option value="https://storage.googleapis.com/mapsdevsite/json/DP05_0001E">Total population</option>
    <option value="https://storage.googleapis.com/mapsdevsite/json/DP02_0016E">Average family size</option>
    <option value="https://storage.googleapis.com/mapsdevsite/json/DP03_0088E">Per-capita income</option>
  </select>
  </div>
  <div id="legend">
    <div id="census-min">min</div>
    <div class="color-key"><span id="data-caret">◆</span></div>
    <div id="census-max">max</div>
  </div>
</div>
<div id="data-box" class="nicebox">
  <label id="data-label" for="data-value"></label>
  <span id="data-value"></span>
</div>

Use the code below within the style tags to style the map controls.

<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; overflow: hidden; }
    .nicebox {
      position: absolute;
      text-align: center;
      font-family: "Roboto", "Arial", sans-serif;
      font-size: 13px;
      z-index: 5;
      box-shadow: 0 4px 6px -4px #333;
      padding: 5px 10px;
      background: rgb(255,255,255);
      background: linear-gradient(to bottom,rgba(255,255,255,1) 0%,rgba(245,245,245,1) 100%);
      border: rgb(229, 229, 229) 1px solid;
    }
    #controls {
      top: 10px;
      left: 110px;
      width: 360px;
      height: 45px;
    }
    #data-box {
      top: 10px;
      left: 500px;
      height: 45px;
      line-height: 45px;
      display: none;
    }
    #census-variable {
      width: 360px;
      height: 20px;
    }
    #legend { display: flex; display: -webkit-box; padding-top: 7px }
    .color-key {
      background: linear-gradient(to right,
        hsl(5, 69%, 54%) 0%,
        hsl(29, 71%, 51%) 17%,
        hsl(54, 74%, 47%) 33%,
        hsl(78, 76%, 44%) 50%,
        hsl(102, 78%, 41%) 67%,
        hsl(127, 81%, 37%) 83%,
        hsl(151, 83%, 34%) 100%);
      flex: 1;
      -webkit-box-flex: 1;
      margin: 0 5px;
      text-align: left;
      font-size: 1.0em;
      line-height: 1.0em;
    }
    #data-value { font-size: 2.0em; font-weight: bold }
    #data-label { font-size: 2.0em; font-weight: normal; padding-right: 10px; }
    #data-label:after { content: ':' }
    #data-caret { margin-left: -5px; display: none; font-size: 14px; width: 14px}
</style>

Importing data from the US Census API
The code below queries the US Census Bureau for the most recent census data of all US states, which it receives in JSON format.

Current Information:
This section shows how to query the US Census API using XMLHttpRequest. It demonstrates parsing the returned JSON data and mapping it to state features on the map.

Real-time Implementation Plan:
To implement Census API data import in real-time:
1. Register for a Census API key and replace YOUR_API_KEY in the code
2. Implement XMLHttpRequest or fetch API to query Census data
3. Parse JSON responses and extract relevant data values
4. Map Census data to state features using common identifiers
5. Track min/max values for proper data visualization
6. Update map features with new property values
7. Handle API errors and rate limiting
8. Implement caching to reduce repeated API calls

function loadCensusData(variable) {
// load the requested variable from the census API
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://api.census.gov/data/2012/acs5/profile?get=' +
  variable + '&for=state:*&key=YOUR_API_KEY');
        xhr.onload = function() {
          var censusData = JSON.parse(xhr.responseText);
          censusData.shift(); // the first row contains column names
          censusData.forEach(function(row) {
            var censusVariable = parseFloat(row[0]);
            var stateId = row[1];

            // keep track of min and max values
            if (censusVariable < censusMin) {
              censusMin = censusVariable;
            }
            if (censusVariable > censusMax) {
              censusMax = censusVariable;
            }

            // update the existing row with the new data
            map.data
              .getFeatureById(stateId)
              .setProperty('census_variable', censusVariable);
          });

          // update and display the legend
          document.getElementById('census-min').textContent =
              censusMin.toLocaleString();
          document.getElementById('census-max').textContent =
              censusMax.toLocaleString();
        };
        xhr.send();
}

Styling the data
The code below creates the choropleth map by applying a gradient to each polygon in the dataset, based on the census data value. You can style data using a Data.StyleOptions object, or a function that returns a Data.StyleOptions object.

Current Information:
This section demonstrates how to create a choropleth map by styling polygons based on data values. It shows calculating colors along a gradient spectrum based on where each data point falls between min and max values.

Real-time Implementation Plan:
To implement choropleth styling in real-time:
1. Define color ranges for min and max data values
2. Create a styling function that calculates gradient colors
3. Implement the styleFeature function to return appropriate styling options
4. Handle cases where data is missing or invalid
5. Add hover effects to highlight selected polygons
6. Update styling when new data is loaded
7. Optimize the styling function for performance
8. Implement responsive styling adjustments

// set up the style rules and events for google.maps.Data
map.data.setStyle(styleFeature);

      function styleFeature(feature) {
        var low = [5, 69, 54];  // color of smallest datum
        var high = [151, 83, 34];   // color of largest datum

        // delta represents where the value sits between the min and max
        var delta = (feature.getProperty('census_variable') - censusMin) /
            (censusMax - censusMin);

        var color = [];
        for (var i = 0; i < 3; i++) {
          // calculate an integer color based on the delta
          color[i] = (high[i] - low[i]) * delta + low[i];
        }

        // determine whether to show this shape or not
        var showRow = true;
        if (feature.getProperty('census_variable') == null ||
            isNaN(feature.getProperty('census_variable'))) {
          showRow = false;
        }

        var outlineWeight = 0.5, zIndex = 1;
        if (feature.getProperty('state') === 'hover') {
          outlineWeight = zIndex = 2;
        }

        return {
          strokeWeight: outlineWeight,
          strokeColor: '#fff',
          zIndex: zIndex,
          fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
          fillOpacity: 0.75,
          visible: showRow
        };
      }

In addition to coloring the polygons, the code below creates an interactive element by adding events that respond to mouse activity. Hovering over a polygon highlights the state border, and simultaneously updates the data box control on the map.

Current Information:
This section shows how to add interactivity to the map with mouse event listeners. It demonstrates highlighting polygons on hover and displaying detailed information in the data box.

Real-time Implementation Plan:
To implement interactive map elements in real-time:
1. Add event listeners for mouseover and mouseout events on map features
2. Implement state property changes to trigger styling updates
3. Create functions to handle hover interactions (mouseInToRegion, mouseOutOfRegion)
4. Update UI elements with feature-specific data on hover
5. Position data display elements appropriately on the map
6. Handle multiple simultaneous hover events gracefully
7. Add keyboard navigation support for accessibility
8. Implement touch events for mobile device support

// set up the style rules and events for google.maps.Data
map.data.addListener('mouseover', mouseInToRegion);
map.data.addListener('mouseout', mouseOutOfRegion);

      /**
       * Responds to the mouse-in event on a map shape (state).
       *
       * @param {?google.maps.MapMouseEvent} e
       */
      function mouseInToRegion(e) {
        // set the hover state so the setStyle function can change the border
        e.feature.setProperty('state', 'hover');

        var percent = (e.feature.getProperty('census_variable') - censusMin) /
            (censusMax - censusMin) * 100;

        // update the label
        document.getElementById('data-label').textContent =
            e.feature.getProperty('NAME');
        document.getElementById('data-value').textContent =
            e.feature.getProperty('census_variable').toLocaleString();
        document.getElementById('data-box').style.display = 'block';
        document.getElementById('data-caret').style.display = 'block';
        document.getElementById('data-caret').style.paddingLeft = percent + '%';
      }

      /**
       * Responds to the mouse-out event on a map shape (state).
       *
       * @param {?google.maps.MapMouseEvent} e
       */
      function mouseOutOfRegion(e) {
        // reset the hover state, returning the border to normal
        e.feature.setProperty('state', 'normal');
      }

Loading the state-boundary polygons
Add the code below after the entire initMap function. The loadMapShapes function loads polygons for US state boundaries from a GeoJSON file, using the loadGeoJson method.

Current Information:
This section shows how to load state boundary polygons from a remote GeoJSON file. It demonstrates using map.data.loadGeoJson with an idPropertyName option to map features to state identifiers.

Real-time Implementation Plan:
To implement state boundary loading in real-time:
1. Host or identify a reliable GeoJSON source for state boundaries
2. Implement map.data.loadGeoJson with the appropriate URL
3. Set idPropertyName to match identifiers in your data source
4. Add error handling for failed GeoJSON loading
5. Implement loading indicators while boundaries are being fetched
6. Handle the addfeature event to trigger initial data loading
7. Validate GeoJSON structure and feature properties
8. Add caching for improved performance on repeated loads

/** Loads the state boundary polygons from a GeoJSON source. */
function loadMapShapes() {
  // load US state outline polygons from a GeoJSON file
  map.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/states.js', { idPropertyName: 'STATE' });

Add the line below to the end of the initMap function.

  // state polygons only need to be loaded once, do them now
  loadMapShapes();

On selecting a data source option from the map control dropdown menu, the map queries the US Census Data API for the specified variable. To connect the census data with the shape data, the code sets the idPropertyName to 'STATE', which is a common key in both the Census data and in the GeoJson properties.