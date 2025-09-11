Import GeoJSON Data into Maps

bookmark_border

Overview
Learn how to import GeoJSON data from either a local or remote source, and display it on your map. This tutorial uses the map below to illustrate various techniques to import data into maps.



The section below displays the entire code you need to create the map in this tutorial.

Tip: Check out the store location solutions to see another example of using GeoJSON data with maps.

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


Loading data from the same domain
The Google Maps Data Layer provides a container for arbitrary geospatial data (including GeoJSON). If your data is in a file hosted on the same domain as your Maps JavaScript API application, you can load it using the map.data.loadGeoJson() method. The file must be on the same domain, but you can host it in a different subdomain. For example, you can make a request to files.example.com from www.example.com.


map.data.loadGeoJson('data.json');
Loading data across domains
You can also request data from a domain other than your own, if the domain's configuration allows such a request. The standard for this permission is called Cross-origin resource sharing (CORS). If a domain has allowed cross-domain requests, its response header should include the following declaration:


Access-Control-Allow-Origin: *
Use the Chrome Developer Tools (DevTools) to find out if a domain has enabled CORS.



Loading data from such a domain is the same as loading JSON from the same domain:


map.data.loadGeoJson('http://www.CORS-ENABLED-SITE.com/data.json');
Requesting JSONP
The target domain must support requests for JSONP in order to use this technique.

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


Data Visualization: Mapping Earthquakes

bookmark_border

Overview
This tutorial shows you how to visualize data on Google maps. As an example, the maps in this tutorial visualize data about the location of earthquakes and their magnitude. Learn techniques to use with your own data source, and create powerful stories on Google maps like the ones below.




The first 2 frames seen above (from left to right) display maps with basic markers, and sized circles. The last frame displays a heatmap.

Import your data
This tutorial uses real-time earthquake data from the United States Geological Survey (USGS). The USGS website provides their data in a number of formats, which you can copy to your domain for local access by your application. This tutorial requests JSONP directly from the USGS servers by appending a script tag to the head of the document.

Note: You should only request data from servers you trust completely, because of potential security risks with loading cross-domain content.

// Create a script tag and set the USGS URL as the source.
        var script = document.createElement('script');

        script.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp';
        document.getElementsByTagName('head')[0].appendChild(script);
Place basic markers
Now that you have pulled data about the location of earthquakes from the USGS feed into your application, you can display it on the map. This section shows you how to create a map that uses imported data to place a basic marker at the epicenter of every earthquake location.



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

Here are some options to customize the basic marker:

Using circle size:
You can draw circles (or any other shape) with sizes that are relative to the magnitude of an earthquake by using symbols. In this way, powerful earthquakes are represented as the largest circles on the map.

Using heatmaps:
The Heatmap Layer in the visualization library offers a simple yet powerful way of displaying the distribution of earthquakes. Heatmaps use colors to represent the density of points, making it easier to pick out areas of high activity. Heatmaps can also use WeightedLocations so that, for example, bigger earthquakes are displayed more prominently in the heatmap.

Circle size
The map below displays customized markers using circles. The circle size increases with the magnitude of an earthquake at that particular location.



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

The map uses data from a GeoJSON file to display polygons that define US state boundaries. It can also present data on the map corresponding to each state, which comes from a simulated query to the US Census API.

Select a category of data from the control dropdown menu to update the polygons on the map. You can also hover over a state polygon to view state-specific information in a data box control on the map.


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

Read the sections that follow to understand the code that you can add to this file.

Creating a basic map
This section explains the code that sets up a basic map. This may be similar to how you've created maps when getting started with the Maps JavaScript API.

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


/** Loads the state boundary polygons from a GeoJSON source. */
function loadMapShapes() {
  // load US state outline polygons from a GeoJSON file
  map.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/states.js', { idPropertyName: 'STATE' });
Add the line below to the end of the initMap function.


  // state polygons only need to be loaded once, do them now
  loadMapShapes();
On selecting a data source option from the map control dropdown menu, the map queries the US Census Data API for the specified variable. To connect the census data with the shape data, the code sets the idPropertyName to 'STATE', which is a common key in both the Census data and in the GeoJson properties.