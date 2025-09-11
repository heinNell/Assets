Add a Google Map to a Web Page

bookmark_border



You can add a Google map to a web page using HTML, CSS, and JavaScript code. This page shows how to add a map to a web page in two ways: by using the gmp-map custom HTML element, and by using a div element.

Add a map using a gmp-map element
Add a map using a div element and JavaScript
Overview
To load a map, your web page must do the following things:

Load the Maps JavaScript API using a bootstrap loader. This is where your API key is passed, and can be added to either the HTML or JavaScript source files.
Add the map to the HTML page, and add the needed CSS styles.
Load the maps library and initialize the map.
Add a map using a gmp-map element
The gmp-map element is a custom HTML element created using web components. To add a map to a web page using a gmp-map element, take the following steps.

On the HTML page, add a script element containing the bootstrap configured with your API key and any other options. In the following example bootstrap, the callback parameter has been omitted, as it is not needed.



<script
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=maps&v=beta" defer>
</script>
On the HTML page, add a gmp-map element. Specify latitude and longitude coordinates for center, and a zoom value for zoom. In this example the height style attribute is also specified.



<gmp-map
  center="37.4220656,-122.0840897"
  zoom="10"
  map-id="DEMO_MAP_ID"
  style="height: 400px"
></gmp-map>
Complete example code


<html>
  <head>
    <title>Add a Map using HTML</title>

    <link rel="stylesheet" type="text/css" href="./style.css" />
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <gmp-map
      center="37.4220656,-122.0840897"
      zoom="10"
      map-id="DEMO_MAP_ID"
      style="height: 400px"
    ></gmp-map>

    <!-- 
      The `defer` attribute causes the script to execute after the full HTML
      document has been parsed. For non-blocking uses, avoiding race conditions,
      and consistent behavior across browsers, consider loading using Promises. See
      https://developers.google.com/maps/documentation/javascript/load-maps-js-api
      for more information.
      -->
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=maps&v=beta"
      defer
    ></script>
  </body>
</html>
Add a map using a div element and JavaScript
To add a map to a web page using a div element, take the following steps.

On the HTML page, add a script element containing the bootstrap loader configured with your API key and any other options. Alternatively, add the bootstrap loader code directly to a TypeScript or JavaScript file, minus the script tags.


<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "YOUR_API_KEY",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });
</script>
On the HTML page, add a div element to contain the map.


<div id="map"></div>
In the CSS, set the map height to 100%.


#map {
  height: 100%;
}
In the JavaScript file, create a function to load the maps library and initialize the map. Specify latitude and longitude coordinates for center, and the zoom level to use for zoom.



let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

initMap();
Complete example code

TypeScript
JavaScript
CSS
HTML

let map: google.maps.Map;
async function initMap(): Promise<void> {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

initMap();



Events

bookmark_border

Select platform: Android iOS JavaScript
This page describes the user interface events and error events that you can listen for and handle programmatically.

User Interface Events
JavaScript within the browser is event driven, meaning that JavaScript responds to interactions by generating events, and expects a program to listen to interesting events. There are two types of events:

User events (such as "click" mouse events) are propagated from the DOM to the Maps JavaScript API. These events are separate and distinct from standard DOM events.
MVC state change notifications reflect changes in Maps JavaScript API objects and are named using a property_changed convention.
Each Maps JavaScript API object exports a number of named events. Programs interested in certain events will register JavaScript event listeners for those events and execute code when those events are received by calling addListener() to register event handlers on the object.

The following sample will show you which events are triggered by the google.maps.Map as you interact with the map.


For a complete list of events, consult the Maps JavaScript API Reference. Events are listed in a separate section for each object which contains events.

UI Events
Some objects within the Maps JavaScript API are designed to respond to user events such as mouse or keyboard events. For example, these are some of the user events that a google.maps.marker.AdvancedMarkerElement object can listen to:

'click'
'drag'
'dragend'
'dragstart'
'gmp-click'
For the full list, see the AdvancedMarkerElement class. These events may look like standard DOM events, but they are actually part of the Maps JavaScript API. Because different browsers implement different DOM event models, the Maps JavaScript API provides these mechanisms to listen for and respond to DOM events without needing to handle the various cross-browser peculiarities. These events also typically pass arguments within the event noting some UI state (such as the mouse position).

MVC State Changes
MVC objects typically contain state. Whenever an object's property changes, the Maps JavaScript API will fire an event that the property has changed. For example, the API will fire a zoom_changed event on a map when the map's zoom level changes. You can intercept these state changes by calling addListener() to register event handlers on the object as well.

User events and MVC state changes may look similar, but you generally wish to treat them differently in your code. MVC events, for example, do not pass arguments within their event. You will want to inspect the property that changed on an MVC state change by calling the appropriate getProperty method on that object.

Handle Events
To register for event notifications, use the addListener() event handler. That method takes an event to listen for, and a function to call when the specified event occurs.

Example: Map and Marker Events
The following code mixes user events with state change events. We attach an event handler to a marker that zooms the map when clicked. We also add an event handler to the map for changes to the center property and pan the map back to the marker after 3 seconds on receipt of the center_changed event:

TypeScript
JavaScript

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const myLatlng = { lat: -25.363, lng: 131.044 };

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: myLatlng,
      mapId: "DEMO_MAP_ID",
    }
  );

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: myLatlng,
    map,
    title: "Click to zoom",
  });

  map.addListener("center_changed", () => {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(() => {
      map.panTo(marker.position as google.maps.LatLng);
    }, 3000);
  });

  marker.addListener("click", () => {
    map.setZoom(8);
    map.setCenter(marker.position as google.maps.LatLng);
  });
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Tip: If you're trying to detect a change in the viewport, be sure to use the specific bounds_changed event rather than constituent zoom_changed and center_changed events. Because the Maps JavaScript API fires these latter events independently, getBounds() may not report useful results until after the viewport has authoritatively changed. If you wish to getBounds() after such an event, be sure to listen to the bounds_changed event instead.

Example: Shape Editing and Dragging Events
When a shape is edited or dragged, an event is fired upon completion of the action. For a list of the events and some code snippets, see Shapes.

View example (rectangle-event.html)

Access Arguments in UI Events
UI events within the Maps JavaScript API typically pass an event argument, which can be accessed by the event listener, noting the UI state when the event occurred. For example, a UI 'click' event typically passes a MouseEvent containing a latLng property denoting the clicked location on the map. Note that this behavior is unique to UI events; MVC state changes do not pass arguments in their events.

You can access the event's arguments within an event listener the same way you would access an object's properties. The following example adds an event listener for the map, and creates a marker when the user clicks on the map at the clicked location.

TypeScript
JavaScript

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -25.363882, lng: 131.044922 },
      mapId: "DEMO_MAP_ID",
    }
  );

  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });
}

function placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  new google.maps.marker.AdvancedMarkerElement({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Use Closures in Event Listeners
When executing an event listener, it is often advantageous to have both private and persistent data attached to an object. JavaScript does not support "private" instance data, but it does support closures which allows inner functions to access outer variables. Closures are useful within event listeners to access variables not normally attached to the objects on which events occur.

The following example uses a function closure in the event listener to assign a secret message to a set of markers. Clicking on each marker will reveal a portion of the secret message, which is not contained within the marker itself.

TypeScript
JavaScript

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -25.363882, lng: 131.044922 },
      mapId: "DEMO_MAP_ID",
    }
  );

  const bounds: google.maps.LatLngBoundsLiteral = {
    north: -25.363882,
    south: -31.203405,
    east: 131.044922,
    west: 125.244141,
  };

  // Display the area between the location southWest and northEast.
  map.fitBounds(bounds);

  // Add 5 markers to map at random locations.
  // For each of these markers, give them a title with their index, and when
  // they are clicked they should open an infowindow with text from a secret
  // message.
  const secretMessages = ["This", "is", "the", "secret", "message"];
  const lngSpan = bounds.east - bounds.west;
  const latSpan = bounds.north - bounds.south;

  for (let i = 0; i < secretMessages.length; ++i) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: {
        lat: bounds.south + latSpan * Math.random(),
        lng: bounds.west + lngSpan * Math.random(),
      },
      map: map,
    });

    attachSecretMessage(marker, secretMessages[i]);
  }
}

// Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
function attachSecretMessage(
  marker: google.maps.marker.AdvancedMarkerElement,
  secretMessage: string
) {
  const infowindow = new google.maps.InfoWindow({
    content: secretMessage,
  });

  marker.addListener("click", () => {
    infowindow.open(marker.map, marker);
  });
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Get and Set Properties within Event Handlers
None of the MVC state change events in the Maps JavaScript API event system pass arguments when the event is triggered. (User events do pass arguments which can be inspected.) If you need to inspect a property on an MVC state change, you should explicitly call the appropriate getProperty() method on that object. This inspection will always retrieve the current state of the MVC object, which may not be the state when the event was first fired.

Note: Explicitly setting a property within an event handler which responds to a state change of that particular property may produce unpredictable and/or unwanted behavior. Setting such a property will trigger a new event, for example, and if you always set a property within this event handler, you may end up creating an infinite loop.

In the example below, we set up an event handler to respond to zoom events by bringing up an info window displaying that level.

TypeScript
JavaScript

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

  const originalMapCenter = new google.maps.LatLng(-25.363882, 131.044922);
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: originalMapCenter,
    }
  );

  const infowindow = new google.maps.InfoWindow({
    content: "Change the zoom level",
    position: originalMapCenter,
  });

  infowindow.open(map);

  map.addListener("zoom_changed", () => {
    infowindow.setContent("Zoom: " + map.getZoom()!);
  });
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Listen to DOM Events
The Maps JavaScript API event model creates and manages its own custom events. However, the DOM (Document Object Model) within the browser also creates and dispatches its own events, according to the particular browser event model in use. If you wish to capture and respond to these events, the Maps JavaScript API provides the addDomListener() static method to listen to and bind to DOM events.

This convenience method has a signature as shown below:


addDomListener(instance:Object, eventName:string, handler:Function)
where instance may be any DOM element supported by the browser, including:

Hierarchical members of the DOM such as window or document.body.myform
Named elements such as document.getElementById("foo")
Note that addDomListener() passes the indicated event to the browser, which handles it according to the browser's DOM event model; however, almost all modern browsers at least support DOM Level 2. (For more information on DOM level events, see the Mozilla DOM Levels reference.)

TypeScript
JavaScript
HTML

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

  const mapDiv = document.getElementById("map") as HTMLElement;
  const map = new google.maps.Map(mapDiv, {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
  });

  // We add a DOM event here to show an alert if the DIV containing the
  // map is clicked.
  google.maps.event.addDomListener(mapDiv, "click", () => {
    window.alert("Map was clicked!");
  });
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Although the above code is Maps JavaScript API code, the addDomListener() method binds to the window object of the browser and allows the API to communicate with objects outside of the API's normal domain.

Remove Event Listeners
To remove a specific event listener, it must have been assigned to a variable. You can then call removeListener(), passing the variable name to which the listener was assigned.


var listener1 = marker.addListener('click', aFunction);

google.maps.event.removeListener(listener1);
To remove all listeners from a particular instance, call clearInstanceListeners(), passing the instance name.


var listener1 = marker.addListener('click', aFunction);
var listener2 = marker.addListener('mouseover', bFunction);

// Remove listener1 and listener2 from marker instance.
google.maps.event.clearInstanceListeners(marker);
To remove all listeners for a specific event type for a specific instance, call clearListeners(), passing the instance name and the event name.


marker.addListener('click', aFunction);
marker.addListener('click', bFunction);
marker.addListener('click', cFunction);

// Remove all click listeners from marker instance.
google.maps.event.clearListeners(marker, 'click');
For more information, refer to the reference documentation for the google.maps.event namespace.

Listen for authentication errors
If you want to programmatically detect an authentication failure (for example to automatically send a beacon) you can prepare a callback function. If the following global function is defined it will be called when the authentication fails. function gm_authFailure() { /* Code */ };



MapTracker: Location Submission & Analytics Platform
Project Overview
App Name: MapTracker
Purpose: Allow users to submit and track location-based data points with custom metadata on Google Maps
Primary User Action: User submits location coordinates with metadata to visualize and analyze geographical patterns
Example Use Case: Field researchers marking observation points with timestamps and notes
Input Model & Processing Design
Domain Model
Copy
interface LocationSubmission {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  category: 'observation' | 'incident' | 'landmark';
  timestamp: Date;
}
Firestore Schema
Copy
interface StoredSubmission {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
  };
  title: string;
  description: string;
  category: string;
  timestamp: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
Key Components
1. Firebase Configuration
Copy
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
2. Validation Schema
Copy
// src/lib/schemas.ts
import { z } from 'zod';

export const locationSubmissionSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(['observation', 'incident', 'landmark']),
  timestamp: z.date()
});
3. Map Component
Copy
// src/components/MapView.tsx
import { useEffect, useState } from 'react';
import { useSubmissions } from '../hooks/useSubmissions';

export const MapView = () => {
  const { submissions, isLoading } = useSubmissions();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      
      const mapInstance = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapId: import.meta.env.VITE_GOOGLE_MAPS_ID
      });
      
      setMap(mapInstance);
    };

    initMap();
  }, []);

  return (
    <div id="map" className="w-full h-[600px] rounded-lg shadow-lg" />
  );
};
4. Submission Form
Copy
// src/components/SubmissionForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationSubmissionSchema } from '../lib/schemas';
import { useSubmissions } from '../hooks/useSubmissions';

export const SubmissionForm = () => {
  const { createSubmission } = useSubmissions();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(locationSubmissionSchema)
  });

  return (
    <form onSubmit={handleSubmit(createSubmission)} className="space-y-4">
      <input {...register('latitude')} type="number" step="any" />
      <input {...register('longitude')} type="number" step="any" />
      <input {...register('title')} type="text" />
      <textarea {...register('description')} />
      <select {...register('category')}>
        <option value="observation">Observation</option>
        <option value="incident">Incident</option>
        <option value="landmark">Landmark</option>
      </select>
      <button type="submit">Submit Location</button>
    </form>
  );
};
5. Firestore Security Rules
Copy
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{submissionId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
Setup & Environment
.env.example
Copy
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key
VITE_GOOGLE_MAPS_ID=your-maps-id
package.json Scripts
Copy
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "emulators": "firebase emulators:start"
  }
}
Testing Example
Copy
// src/__tests__/submissions.test.ts
import { locationSubmissionSchema } from '../lib/schemas';

describe('Location Submission Validation', () => {
  it('validates correct submission data', () => {
    const validData = {
      latitude: 37.4220656,
      longitude: -122.0840897,
      title: "Google HQ",
      description: "Main campus",
      category: "landmark" as const,
      timestamp: new Date()
    };
    
    const result = locationSubmissionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});



Rendering type (raster and vector)

bookmark_border

The Maps JavaScript API offers two different implementations of the map: raster and vector. The raster map is loaded by default, and loads the map as a grid of pixel-based raster image tiles, which are generated by Google Maps Platform server-side, then served to your web app. The vector map is a composed of vector-based tiles, which are drawn at load time on the client-side using WebGL, a web technology that allows the browser to access the GPU on the user's device to render 2D and 3D graphics. The vector map type is recommended for the best user experience, as it provides improved visual fidelity as well as the ability to control tilt and heading on the map. Learn more about vector map features.

Set the rendering type for a map either by specifying the renderingType map option, or by setting the option on an associated map ID. The renderingType option overrides any rendering type settings made by configuring a map ID.

Specify the renderingType option
Use the renderingType option to specify either the raster or vector rendering type for your map (no map ID required). For maps loaded using a div element and JavaScript, the default rendering type is google.maps.RenderingType.RASTER. Take these steps to set the renderingType option:

Load the RenderingType library; this can be done when loading the Maps library:


const { Map, RenderingType } = await google.maps.importLibrary("maps");
When initializing the map, use the renderingType option to specify either RenderingType.VECTOR or RenderingType.RASTER:


map = new Map(
  document.getElementById('map'),
  {
    zoom: 4,
    center: position,
    renderingType: RenderingType.VECTOR,
  }
);
When the vector map rendering type is set, you must set the options for the needed features.

To enable tilt, set the tiltInteractionEnabled map option to true or call map.setTiltInteractionEnabled(true).
To enable panning, set the headingInteractionEnabled map option to true or call map.setHeadingInteractionEnabled(true).
For maps loaded using the <gmp-map> element, the default rendering type is google.maps.RenderingType.VECTOR, with tilt and heading control enabled. To set the rendering type by using the <gmp-map> element, use the rendering-type attribute.

Use a map ID to set rendering type
You can also specify the rendering type by using a map ID. To create a new map ID, follow the steps in Using Cloud-based Map Styling - Get a map ID. Be sure to set the Map type to JavaScript, and select an option (Vector or Raster). Check Tilt and Rotation to enable tilt and rotation on the map. Doing so will allow you to programmatically adjust these values, and also lets users adjust tilt and heading directly on the map. If the use of tilt or heading will adversely affect your app, leave Tilt and Rotation un- checked so users will not be able to adjust tilt and rotation.

Create Vector Map ID

Next, update your map initialization code with the map ID you created. You can find your map IDs on the Maps Management page. Provide a map ID when you instantiate the map using the mapId property as shown here:


map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: -34.397, lng: 150.644},
  zoom: 8,
  mapId: 'MAP_ID'
});


Load the Maps JavaScript API

bookmark_border

This guide shows you how to load the Maps JavaScript API. There are three ways to do this:

Use dynamic library import
Use the direct script loading tag
Use the NPM js-api-loader package
Use Dynamic Library Import
Dynamic library import provides the capability to load libraries at runtime. This lets you request needed libraries at the point when you need them, rather than all at once at load time. It also protects your page from loading the Maps JavaScript API multiple times.

Load the Maps JavaScript API by adding the inline bootstrap loader to your application code, as shown in the following snippet:


<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "YOUR_API_KEY",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });
</script>
You can also add the bootstrap loader code directly to your JavaScript code.

To load libraries at runtime, use the await operator to call importLibrary() from within an async function. Declaring variables for the needed classes lets you skip using a qualified path (e.g. google.maps.Map), as shown in the following code example:



let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

initMap();
Your function can also load libraries without declaring a variable for the needed classes, which is especially useful if you added a map using the gmp-map element. Without the variable you must use qualified paths, for example google.maps.Map:


let map;
let center =  { lat: -34.397, lng: 150.644 };

async function initMap() {
  await google.maps.importLibrary("maps");
  await google.maps.importLibrary("marker");

  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 8,
    mapId: "DEMO_MAP_ID",
  });

  addMarker();
}

async function addMarker() {
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: center,
  });
}

initMap();
Alternatively, you can load the libraries directly in HTML as shown here:


<script>
google.maps.importLibrary("maps");
google.maps.importLibrary("marker");
</script>
Learn how to migrate to the Dynamic Library Loading API.

Required parameters
key: Your API key. The Maps JavaScript API won't load unless a valid API key is specified.
Optional parameters
v: The version of the Maps JavaScript API to load.

libraries: An array of additional Maps JavaScript API libraries to load. Specifying a fixed set of libraries is not generally recommended, but is available for developers who want to finely tune the caching behavior on their website.

language: The language to use. This affects the names of controls, copyright notices, driving directions, and control labels, and the responses to service requests. See the list of supported languages.

region: The region code to use. This alters the API's behavior based on a given country or territory.

authReferrerPolicy: Maps JS customers can configure HTTP Referrer Restrictions in the Cloud Console to limit which URLs are allowed to use a particular API Key. By default, these restrictions can be configured to allow only certain paths to use an API Key. If any URL on the same domain or origin may use the API Key, you can set authReferrerPolicy: "origin" to limit the amount of data sent when authorizing requests from the Maps JavaScript API. When this parameter is specified and HTTP Referrer Restrictions are enabled on Cloud Console, Maps JavaScript API will only be able to load if there is an HTTP Referrer Restriction that matches the current website's domain without a path specified.

mapIds: An array of map IDs. Causes the configuration for the specified map IDs to be preloaded. Specifying map IDs here is not required for map IDs usage, but is available for developers who want to finely tune network performance.

channel: See Usage tracking per channel.

solutionChannel: Google Maps Platform provides many types of sample code to help you get up and running quickly. To track adoption of our more complex code samples and improve solution quality, Google includes the solutionChannel query parameter in API calls in our sample code.

Use the direct script loading tag
This section shows how to use the direct script loading tag. Because the direct script loads libraries when the map loads, it can simplify maps created using a gmp-map element by removing the need to explicitly request libraries at runtime. Since the direct script loading tag loads all requested libraries at once when the script is loaded, performance may be impacted for some applications. Only include the direct script loading tag once per page load.

Note: You can call importLibrary once the direct script loading tag has finished loading.
Add a script tag
To load the Maps JavaScript API inline in an HTML file, add a script tag as shown below.



<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&callback=initMap">
</script>
Direct script loading URL Parameters
This section discusses all of the parameters you can specify in the query string of the script loading URL when loading the Maps JavaScript API. Certain parameters are required while others are optional. As is standard in URLs, all parameters are separated using the ampersand (&) character.

The following example URL has placeholders for all possible parameters:


https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY
&loading=async
&callback=FUNCTION_NAME
&v=VERSION
&libraries="LIBRARIES"
&language="LANGUAGE"
&region="REGION"
&auth_referrer_policy="AUTH_REFERRER_POLICY"
&map_ids="MAP_IDS"
&channel="CHANNEL"
&solution_channel="SOLUTION_IDENTIFIER"
The URL in the following example script tag loads the Maps JavaScript API:



<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&callback=initMap">
</script>
Required parameters (direct)
The following parameters are required when loading the Maps JavaScript API.

key: Your API key. The Maps JavaScript API won't load unless a valid API key is specified.
Optional parameters (direct)
Use these parameters to request a specific version of the Maps JavaScript API, load additional libraries, localize your map or specify the HTTP referrer check policy

loading: The code loading strategy that the Maps JavaScript API can use. Set to async to indicate that the Maps JavaScript API has not been loaded synchronously and that no JavaScript code is triggered by the script's load event. It is highly recommended to set this to async whenever possible, for improved performance. (Use the callback parameter instead to perform actions when the Maps JavaScript API is available.) Available starting with version 3.55.

callback: The name of a global function to be called once the Maps JavaScript API loads completely.

v: The version of the Maps JavaScript API to use.

libraries: A comma-separated list of additional Maps JavaScript API libraries to load.

language: The language to use. This affects the names of controls, copyright notices, driving directions, and control labels, as well as the responses to service requests. See the list of supported languages.

region: The region code to use. This alters the API's behavior based on a given country or territory.

auth_referrer_policy: Customers can configure HTTP Referrer Restrictions in the Cloud Console to limit which URLs are allowed to use a particular API Key. By default, these restrictions can be configured to allow only certain paths to use an API Key. If any URL on the same domain or origin may use the API Key, you can set auth_referrer_policy=origin to limit the amount of data sent when authorizing requests from the Maps JavaScript API. This is available starting in version 3.46. When this parameter is specified and HTTP Referrer Restrictions are enabled on Cloud Console, Maps JavaScript API will only be able to load if there is an HTTP Referrer Restriction that matches the current website's domain without a path specified.

mapIds: A comma-separated list of map IDs. Causes the configuration for the specified map IDs to be preloaded. Specifying map IDs here is not required for map IDs usage, but is available for developers who want to finely tune network performance.

channel: See Usage tracking per channel.

solution_channel: Google Maps Platform provides many types of sample code to help you get up and running quickly. To track adoption of our more complex code samples and improve solution quality, Google includes the solution_channel query parameter in API calls in our sample code.

Note: This query parameter is for use by Google. See Google Maps Platform solutions parameter for more information.
Use the NPM js-api-loader package
The @googlemaps/js-api-loader package is available, for loading using the NPM package manager. Install it using the following command:


npm install @googlemaps/js-api-loader
This package can be imported into the application with:


import { Loader } from "@googlemaps/js-api-loader"
The loader exposes a Promise and callback interface. The following demonstrates usage of the default Promise method load().


TypeScript
JavaScript

const loader = new Loader({
  apiKey: "YOUR_API_KEY",
  version: "weekly",
  ...additionalOptions,
});

loader.load().then(async () => {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
});
Note: Read the guide on using TypeScript and Google Maps.
See a sample featuring js-api-loader.

The following example shows using loader.importLibrary() to load libraries:


const loader = new Loader({
  apiKey: "YOUR_API_KEY",
  version: "weekly",
  ...additionalOptions,
});

loader
  .importLibrary('maps')
  .then(({Map}) => {
    new Map(document.getElementById("map"), mapOptions);
  })
  .catch((e) => {
    // do something
});
Migrate to the Dynamic Library Import API
This section covers the steps required to migrate your integration to use the Dynamic Library Import API.

Migration steps
First, replace the direct script loading tag with the inline bootstrap loader tag.

Before


<script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=maps&callback=initMap">
</script>
After

<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "YOUR_API_KEY",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });
</script>
Next, update your application code:

Change your initMap() function to be asynchronous.
Call importLibrary() to load and access the libraries you need.
Before

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

window.initMap = initMap;
After

let map;
// initMap is now async
async function initMap() {
    // Request libraries when needed, not in the script tag.
    const { Map } = await google.maps.importLibrary("maps");
    // Short namespaces can be used.
    map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}

initMap();

Controlling Zoom and Pan

bookmark_border



Select platform: Android iOS JavaScript
Overview
The usage of a map on a web page may require specific options to control the way users interact with the map to zoom and pan. These options, such as gestureHandling, minZoom, maxZoom and restriction, are defined within the MapOptions interface.

Default Behavior
The following map demonstrates the default behavior for map interactions with a map instantiated with only the zoom and center options defined.



The code for this map is below.


TypeScript
JavaScript

new google.maps.Map(document.getElementById("map")!, {
  zoom,
  center,
});
Note: Read the guide on using TypeScript and Google Maps.
Controlling Gesture Handling
When a user scrolls a page that contains a map, the scrolling action can unintentionally cause the map to zoom. This behavior can be controlled using the gestureHandling map option.

gestureHandling: cooperative
The map below uses the gestureHandling option set to cooperative, allowing the user to scroll the page normally, without zooming or panning the map. Users can zoom the map by clicking the zoom controls. They can also zoom and pan by using two-finger movements on the map for touchscreen devices.



The code for this map is below.


TypeScript
JavaScript

new google.maps.Map(document.getElementById("map")!, {
  zoom,
  center,
  gestureHandling: "cooperative",
});
Note: Read the guide on using TypeScript and Google Maps.
View Sample

gestureHandling: auto
The map at the top of the page without the gestureHandling option has the same behavior as the preceding map with gestureHandling set to cooperative because all of the maps on this page are within an <iframe>. The default gestureHandling value auto switches between greedy and cooperative based upon whether the map is contained within an <iframe>.

Map contained within <iframe>	Behavior
yes	cooperative
no	greedy
gestureHandling: greedy
A map with gestureHandling set to greedy is below. This map reacts to all touch gestures and scroll events unlike cooperative.



gestureHandling: none
The gestureHandling option can also be set to none to disable gestures on the map.

Note: The gestureHandling option does not apply to the Street View service.
Disabling Pan and Zoom
To entirely disable the ability to pan and zoom the map, two options, gestureHandling and zoomControl, must be included.


TypeScript
JavaScript

new google.maps.Map(document.getElementById("map")!, {
  zoom,
  center,
  gestureHandling: "none",
  zoomControl: false,
});
Note: Read the guide on using TypeScript and Google Maps.
The map below demonstrates the combination of gestureHandling and zoomControl in the code above.



Restricting Map Bounds and Zoom
It may be desireable to allow gestures and zoom controls but restrict the map to a particular bounds or a minimum and maximum zoom. To accomplish this you may set the restriction, minZoom, and maxZoom options. The following code and map demonstrate these options.


TypeScript
JavaScript

new google.maps.Map(document.getElementById("map")!, {
  zoom,
  center,
  minZoom: zoom - 3,
  maxZoom: zoom + 3,
  restriction: {
    latLngBounds: {
      north: -10,
      south: -40,
      east: 160,
      west: 100,
    },
  },
});



# Controls

## Controls Overview
The maps displayed through the Maps JavaScript API contain UI elements to allow user interaction with the map. These elements are known as *controls*, and you can include variations of these controls in your application. Alternatively, you can do nothing and let the Maps JavaScript API handle all control behavior.

Below is a list of the full set of controls you can use in your maps:
- **Zoom Control**: Displays "+" and "-" buttons for changing the zoom level of the map. This control appears by default in the bottom right corner of the map.
- **Camera Control**: Features both zoom and pan controls, and is displayed by default in place of the zoom control when using the beta channel.
- **Map Type Control**: Available in a drop-down or horizontal button bar style, allowing the user to choose a map type (ROADMAP, SATELLITE, HYBRID, or TERRAIN). This control appears by default in the top left corner of the map.
- **Street View Control**: Contains a Pegman icon which can be dragged onto the map to enable Street View. This control appears by default near the bottom right of the map.
- **Rotate Control**: Provides a combination of tilt and rotate options for maps containing oblique imagery. This control appears by default near the bottom right of the map. See [45° imagery](https://developers.google.com/maps/documentation/javascript/examples/aerial-simple) for more information.
- **Scale Control**: Displays a map scale element. This control is disabled by default.
- **Fullscreen Control**: Offers the option to open the map in fullscreen mode. This control is enabled by default on desktop and mobile devices. Note: iOS doesn't support the fullscreen feature. The fullscreen control is therefore not visible on iOS devices.
- **Keyboard Shortcuts Control**: Displays a list of keyboard shortcuts for interacting with the map.

You don't access or modify these map controls directly. Instead, you modify the map's `MapOptions` fields which affect the visibility and presentation of controls. You can adjust control presentation upon instantiating your map (with appropriate `MapOptions`) or modify a map dynamically by calling `setOptions()` to change the map's options.

Not all of these controls are enabled by default. To learn about default UI behavior (and how to modify such behavior), see *The Default UI* below.

## The Default UI
By default, all the controls disappear if the map is too small (200x200px). You can override this behavior by explicitly setting the control to be visible. See *Adding Controls to the Map*.

The behavior and appearance of the controls is the same across mobile and desktop devices, except for the fullscreen control (see the behavior described in the list of controls).

Additionally, keyboard handling is on by default on all devices.

### Disable the Default UI
You may want to turn off the API's default UI buttons entirely. To do so, set the map's `disableDefaultUI` property (within the `MapOptions` object) to `true`. This property disables any UI control buttons from the Maps JavaScript API. It does not, however, affect mouse gestures or keyboard shortcuts on the base map, which are controlled by the `gestureHandling` and `keyboardShortcuts` properties respectively.

The following code disables the UI buttons:

```typescript
function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -33, lng: 151 },
      disableDefaultUI: true,
    }
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
```
*Note*: Read the guide on using TypeScript and Google Maps.

## Add Controls to the Map
You may want to tailor your interface by removing, adding, or modifying UI behavior or controls and ensure that future updates don't alter this behavior. If you want to only add or modify existing behavior, you need to ensure that the control is explicitly added to your application.

Some controls appear on the map by default while others won't appear unless you specifically request them. Adding or removing controls from the map is specified in the following `MapOptions` object's fields, which you set to `true` to make them visible or set to `false` to hide them:

```typescript
{
  zoomControl: boolean,
  cameraControl: boolean,
  mapTypeControl: boolean,
  scaleControl: boolean,
  streetViewControl: boolean,
  rotateControl: boolean,
  fullscreenControl: boolean
}
```

By default, all the controls disappear if the map is smaller than 200x200px. You can override this behavior by explicitly setting the control to be visible. For example, the following table shows whether the zoom control is visible or not, based on the map size and the setting of the `zoomControl` field:

| Map size         | zoomControl | Visible? |
|------------------|-------------|----------|
| Any              | false       | No       |
| Any              | true        | Yes      |
| >= 200x200px     | undefined   | Yes      |
| < 200x200px      | undefined   | No       |

The following example sets the map to hide the Zoom control and display the Scale control. Note that we don't explicitly disable the default UI, so these modifications are additive to the default UI behavior.

```typescript
function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -33, lng: 151 },
      zoomControl: false,
      scaleControl: true,
    }
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
```
*Note*: Read the guide on using TypeScript and Google Maps.

## Control Options
Several controls are configurable, allowing you to alter their behavior or change their appearance. The Map Type control, for example, may appear as a horizontal bar or a drop-down menu.

These controls are modified by altering appropriate control options fields within the `MapOptions` object upon creation of the map.

For example, options for altering the Map Type control are indicated in the `mapTypeControlOptions` field. The Map Type control may appear in one of the following style options:
- `google.maps.MapTypeControlStyle.HORIZONTAL_BAR` displays the array of controls as buttons in a horizontal bar as is shown on Google Maps.
- `google.maps.MapTypeControlStyle.DROPDOWN_MENU` displays a single button control allowing you to select the map type using a drop-down menu.
- `google.maps.MapTypeControlStyle.DEFAULT` displays the default behavior, which depends on screen size and may change in future versions of the API.

Note that if you do modify any control options, you should explicitly enable the control as well by setting the appropriate `MapOptions` value to `true`. For example, to set a Map Type control to exhibit the `DROPDOWN_MENU` style, use the following code within the `MapOptions` object:

```typescript
{
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
  }
}
```

The following example demonstrates how to change the default position and style of controls.

```typescript
function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -33, lng: 151 },
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: ["roadmap", "terrain"],
      },
    }
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
```
*Note*: Read the guide on using TypeScript and Google Maps.

Controls are typically configured upon creation of the map. However, you may alter the presentation of controls dynamically by calling the Map's `setOptions()` method, passing it new control options.

## Modify Controls
You specify a control's presentation when you create your map through fields within the map's `MapOptions` object. These fields are denoted below:
- **`zoomControl`**: Enables/disables the Zoom control. By default, this control is visible and appears near the bottom right of the map. The `zoomControlOptions` field additionally specifies the `ZoomControlOptions` to use for this control.
- **`cameraControl`**: Enables/disables the camera control. This control is visible by default on maps using the beta channel. The `cameraControlOptions` field additionally specifies the `CameraControlOptions` to use for this control.
- **`mapTypeControl`**: Enables/disables the Map Type control that lets the user toggle between map types (such as Map and Satellite). By default, this control is visible and appears in the top left corner of the map. The `mapTypeControlOptions` field additionally specifies the `MapTypeControlOptions` to use for this control.
- **`streetViewControl`**: Enables/disables the Pegman control that lets the user activate a Street View panorama. By default, this control is visible and appears near the bottom right of the map. The `streetViewControlOptions` field additionally specifies the `StreetViewControlOptions` to use for this control.
- **`rotateControl`**: Enables/disables the appearance of a Rotate control for controlling the orientation of 45° imagery. By default, the control's presence is determined by the presence or absence of 45° imagery for the given map type at the current zoom and location. You may alter the control's behavior by setting the map's `rotateControlOptions` to specify the `RotateControlOptions` to use. You cannot make the control appear if no 45° imagery is available.
- **`scaleControl`**: Enables/disables the Scale control that provides a map scale. By default, this control is not visible. When enabled, it will always appear in the bottom right corner of the map. The `scaleControlOptions` additionally specifies the `ScaleControlOptions` to use for this control.
- **`fullscreenControl`**: Enables/disables the control that opens the map in fullscreen mode. By default, this control is enabled by default on desktop and Android devices. When enabled, the control appears near the top right of the map. The `fullscreenControlOptions` additionally specifies the `FullscreenControlOptions` to use for this control.

Note that you may specify options for controls you initially disable.

## Control Positioning
Most of the control options contain a `position` property (of type `ControlPosition`) which indicates where on the map to place the control. Positioning of these controls is not absolute. Instead, the API will lay out the controls intelligently by flowing them around existing map elements, or other controls, within given constraints (such as the map size).

*Note*: No guarantees can be made that controls may not overlap given complicated layouts, though the API will attempt to arrange them intelligently.

The following control positions are supported:
- **`TOP_CENTER`**: Indicates that the control should be placed along the top center of the map.
- **`TOP_LEFT`**: Indicates that the control should be placed along the top left of the map, with any sub-elements of the control "flowing" towards the top center.
- **`TOP_RIGHT`**: Indicates that the control should be placed along the top right of the map, with any sub-elements of the control "flowing" towards the top center.
- **`LEFT_TOP`**: Indicates that the control should be placed along the top left of the map, but below any `TOP_LEFT` elements.
- **`RIGHT_TOP`**: Indicates that the control should be placed along the top right of the map, but below any `TOP_RIGHT` elements.
- **`LEFT_CENTER`**: Indicates that the control should be placed along the left side of the map, centered between the `TOP_LEFT` and `BOTTOM_LEFT` positions.
- **`RIGHT_CENTER`**: Indicates that the control should be placed along the right side of the map, centered between the `TOP_RIGHT` and `BOTTOM_RIGHT` positions.
- **`LEFT_BOTTOM`**: Indicates that the control should be placed along the bottom left of the map, but above any `BOTTOM_LEFT` elements.
- **`RIGHT_BOTTOM`**: Indicates that the control should be placed along the bottom right of the map, but above any `BOTTOM_RIGHT` elements.
- **`BOTTOM_CENTER`**: Indicates that the control should be placed along the bottom center of the map.
- **`BOTTOM_LEFT`**: Indicates that the control should be placed along the bottom left of the map, with any sub-elements of the control "flowing" towards the bottom center.
- **`BOTTOM_RIGHT`**: Indicates that the control should be placed along the bottom right of the map, with any sub-elements of the control "flowing" towards the bottom center.

Note that these positions may coincide with positions of UI elements whose placements you may not modify (such as copyrights and the Google logo). In those cases, the controls will flow according to the logic noted for each position and appear as close as possible to their indicated position.

The following example shows a simple map with all controls enabled, in different positions.

```typescript
function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 12,
      center: { lat: -28.643387, lng: 153.612224 },
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER,
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
      fullscreenControl: true,
    }
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
```
*Note*: Read the guide on using TypeScript and Google Maps.

## Custom Controls
As well as modifying the style and position of existing API controls, you can create your own controls to handle interaction with the user. Controls are stationary widgets which float on top of a map at absolute positions, as opposed to overlays, which move with the underlying map. More fundamentally, a control is a `<div>` element which has an absolute position on the map, displays some UI to the user, and handles interaction with either the user or the map, usually through an event handler.

To create your own custom control, few rules are necessary. However, the following guidelines can act as best practice:
- Define appropriate CSS for the control element(s) to display.
- Handle interaction with the user or the map through event handlers for either map property changes or user events (for example, 'click' events).
- Create a `<div>` element to hold the control and add this element to the Map's `controls` property.

Each of these concerns is discussed below.

### Drawing Custom Controls
How you draw your control is up to you. Generally, we recommend that you place all of your control presentation within a single `<div>` element so that you can manipulate your control as one unit. We will use this design pattern in the samples shown below.

Designing attractive controls requires some knowledge of CSS and DOM structure. The following code shows a function to create a button element that pans the map to be centered on Chicago.

```typescript
function createCenterControl(map) {
  const controlButton = document.createElement("button");

  // Set CSS for the control.
  controlButton.style.backgroundColor = "#fff";
  controlButton.style.border = "2px solid #fff";
  controlButton.style.borderRadius = "3px";
  controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlButton.style.color = "rgb(25,25,25)";
  controlButton.style.cursor = "pointer";
  controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
  controlButton.style.fontSize = "16px";
  controlButton.style.lineHeight = "38px";
  controlButton.style.margin = "8px 0 22px";
  controlButton.style.padding = "0 5px";
  controlButton.style.textAlign = "center";

  controlButton.textContent = "Center Map";
  controlButton.title = "Click to recenter the map";
  controlButton.type = "button";

  // Setup the click event listeners: simply set the map to Chicago.
  controlButton.addEventListener("click", () => {
    map.setCenter(chicago);
  });

  return controlButton;
}
```

### Handling Events from Custom Controls
For a control to be useful, it must actually do something. What the control does is up to you. The control may respond to user input, or it may respond to changes in the Map's state.

For responding to user input, use `addEventListener()`, which handles supported DOM events. The following code snippet adds a listener for the browser's 'click' event. Note that this event is received from the DOM, not from the map.

```typescript
// Setup the click event listener: set the map to center on Chicago
var chicago = {lat: 41.850, lng: -87.650};

controlButton.addEventListener('click', () => {
  map.setCenter(chicago);
});
```

### Making Custom Controls Accessible
To ensure that controls receive keyboard events and appear correctly to screen readers:
- Always use native HTML elements for buttons, form elements, and labels. Only use a `DIV` element as a container to hold native controls; never repurpose a `DIV` as an interactive UI element.
- Use the `label` element, `title` attribute, or `aria-label` attribute where appropriate, to provide information about a UI element.

### Positioning Custom Controls
Custom controls are positioned on the map by placing them at appropriate positions within the Map object's `controls` property. This property contains an array of `google.maps.ControlPositions`. You add a custom control to the map by adding the Node (typically the `<div>`) to an appropriate `ControlPosition`. (For information on these positions, see *Control Positioning* above.)

Each `ControlPosition` stores an `MVCArray` of the controls displayed in that position. As a result, when controls are added or removed from the position, the API will update the controls accordingly.

The API places controls at each position by the order of an `index` property; controls with a lower index are placed first. For example, two custom controls at position `BOTTOM_RIGHT` will be laid out according to this index order, with lower index values taking precedence. By default, all custom controls are placed after placing any API default controls. You can override this behavior by setting a control's `index` property to be a negative value. Custom controls cannot be placed to the left of the logo or to the right of the copyrights.

The following code creates a new custom control (its constructor is not shown) and adds it to the map in the `TOP_RIGHT` position.

```typescript
var map = new google.maps.Map(document.getElementById('map'), mapOptions);

// Create a DIV to attach the control UI to the Map.
const centerControlDiv = document.createElement("div");

// Create the control. This code calls a function that
// creates a new instance of a button control.
const centerControl = createCenterControl(map);

// Append the control to the DIV.
centerControlDiv.appendChild(centerControl);

// Add the control to the map at a designated control position
// by pushing it on the position's array. This code will
// implicitly add the control to the DOM, through the Map
// object. You should not attach the control manually.
map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
```

### A Custom Control Example
The following control is simple (though not particularly useful) and combines the patterns shown above. This control responds to DOM 'click' events by centering the map at a certain default location:

```typescript
let map: google.maps.Map;

const chicago = { lat: 41.85, lng: -87.65 };

/**
 * Creates a control that recenters the map on Chicago.
 */
function createCenterControl(map) {
  const controlButton = document.createElement('button');

  // Set CSS for the control.
  controlButton.style.backgroundColor = '#fff';
  controlButton.style.border = '2px solid #fff';
  controlButton.style.borderRadius = '3px';
  controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlButton.style.color = 'rgb(25,25,25)';
  controlButton.style.cursor = 'pointer';
  controlButton.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlButton.style.fontSize = '16px';
  controlButton.style.lineHeight = '38px';
  controlButton.style.margin = '8px 0 22px';
  controlButton.style.padding = '0 5px';
  controlButton.style.textAlign = 'center';

  controlButton.textContent = 'Center Map';
  controlButton.title = 'Click to recenter the map';
  controlButton.type = 'button';

  // Setup the click event listeners: simply set the map to Chicago.
  controlButton.addEventListener('click', () => {
    map.setCenter(chicago);
  });

  return controlButton;
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    zoom: 12,
    center: chicago,
  });

  // Create the DIV to hold the control.
  const centerControlDiv = document.createElement('div');
  // Create the control.
  const centerControl = createCenterControl(map);
  // Append the control to the DIV.
  centerControlDiv.appendChild(centerControl);

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
```
*Note*: Read the guide on using TypeScript and Google Maps.

## Adding State to Controls
Controls may also store state. The following example is similar to that shown before, but the control contains an additional "Set Home" button which sets the control to exhibit a new home location. We do so by creating a `home_` property within the control to store this state and provide getters and setters for that state.

```typescript
let map: google.maps.Map;

const chicago: google.maps.LatLngLiteral = { lat: 41.85, lng: -87.65 };

/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 */
class CenterControl {
  private map_: google.maps.Map;
  private center_: google.maps.LatLng;
  constructor(
    controlDiv: HTMLElement,
    map: google.maps.Map,
    center: google.maps.LatLngLiteral
  ) {
    this.map_ = map;
    // Set the center property upon construction
    this.center_ = new google.maps.LatLng(center);
    controlDiv.style.clear = "both";

    // Set CSS for the control border
    const goCenterUI = document.createElement("button");

    goCenterUI.id = "goCenterUI";
    goCenterUI.title = "Click to recenter the map";
    controlDiv.appendChild(goCenterUI);

    // Set CSS for the control interior
    const goCenterText = document.createElement("div");

    goCenterText.id = "goCenterText";
    goCenterText.innerHTML = "Center Map";
    goCenterUI.appendChild(goCenterText);

    // Set CSS for the setCenter control border
    const setCenterUI = document.createElement("button");

    setCenterUI.id = "setCenterUI";
    setCenterUI.title = "Click to change the center of the map";
    controlDiv.appendChild(setCenterUI);

    // Set CSS for the control interior
    const setCenterText = document.createElement("div");

    setCenterText.id = "setCenterText";
    setCenterText.innerHTML = "Set Center";
    setCenterUI.appendChild(setCenterText);

    // Set up the click event listener for 'Center Map': Set the center of
    // the map to the current center of the control.
    goCenterUI.addEventListener("click", () => {
      const currentCenter = this.center_;

      this.map_.setCenter(currentCenter);
    });

    // Set up the click event listener for 'Set Center': Set the center of
    // the control to the current center of the map.
    setCenterUI.addEventListener("click", () => {
      const newCenter = this.map_.getCenter()!;

      if (newCenter) {
        this.center_ = newCenter;
      }
    });
  }
}

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 12,
    center: chicago,
  });

  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  const centerControlDiv = document.createElement("div");
  const control = new CenterControl(centerControlDiv, map, chicago);

  // @ts-ignore
  centerControlDiv.index = 1;
  centerControlDiv.style.paddingTop = "10px";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
```


Markers overview

bookmark_border

Select platform: Android iOS JavaScript
Use markers to display single locations on a map. This guide shows you how to use advanced markers. With advanced markers you can create and customize highly performant markers, and make accessible markers that respond to DOM click events and keyboard input. For even deeper customization, advanced markers supports the use of custom HTML and CSS, including the ability to create completely custom markers. For 3D applications you can control the altitude at which a marker appears. Advanced markers are supported on both raster and vector maps (though some features are not available on raster maps). A map ID is required to use Advanced Markers (the DEMO_MAP_ID can be used).

Tip: If your map uses legacy markers, consider migrating to advanced markers.
Get started with advanced markers

Customize color, scale, and icon image
Customize the default marker's background, glyph, and border color, and adjust marker size.

A screenshot showing some customized markers.

Replace the default marker icon with a custom SVG or PNG image.

A screenshot showing custom SVG markers.

Create custom HTML markers
Use custom HTML and CSS to create visually distinctive interactive markers, and create animations.

A screenshot showing a custom HTML marker.

Make markers respond to click and keyboard events
Make a marker respond to clicks and keyboard events by adding a click event listener.


function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.4239163, lng: -122.0947209},
    zoom: 17,
    mapId: 'DEMO_MAP_ID',
  });

  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: {lat: 37.4239163, lng: -122.0947209},
  });

  marker.addListener('click', ({domEvent, latLng}) => {
    const {target} = domEvent;
    // Handle the click event.
    // ...
  });
}


Use App Check to secure your API key

bookmark_border

Firebase App Check provides protection for calls from your app to Google Maps Platform by blocking traffic that comes from sources other than legitimate apps. It does this by checking for a token from an attestation provider like reCAPTCHA Enterprise. Integrating your apps with App Check helps to protect against malicious requests, so you're not charged for unauthorized API calls.

Is App Check right for me?
App Check is recommended in most cases, however App Check is not needed or is not supported in the following cases:

Private or experimental apps. If your app is not publicly accessible, App Check is not needed.
If your app is only used server-to-server, App Check is not needed. However, if the server that communicates with GMP is used by public clients (such as mobile apps), consider using App Check to protect that server instead of GMP.
Overview of implementation steps
At a high level, these are the steps you'll follow to integrate your app with App Check:

Add Firebase to your app.
Add and initialize the App Check library.
Add the token provider to your app.
Initialize the Maps JS and App Check APIs.
Enable debugging.
Monitor your app requests and decide on enforcement.
Once you've integrated with App Check, you'll be able to see backend traffic metrics on the Firebase console. These metrics provide breakdown of requests by whether they are accompanied by a valid App Check token. See the Firebase App Check documentation for more information.

When you're sure that most requests are from legitimate sources and that users have updated to the latest version of your app that includes your implementation of App Check, you can turn on enforcement. Once enforcement is on, App Check will reject all traffic without a valid App Check token.

Note: App check enforcement is not turned on by default.
Considerations when planning an App Check integration
Here are some things to consider as you plan your integration:

One of the attestation providers we recommend, reCAPTCHA Enterprise charges for more than 10,000 assessments per month.
The other attestation provider we recommend, reCAPTCHA v3 has a quota, after which traffic won't be evaluated.

You can choose to use a custom attestation provider, though this is an advanced use case. See the App Check documentation for more information.

Users of your app will experience some latency on startup. However, afterwards, any periodic re-attestation will occur in the background and users should no longer experience any latency. The exact amount of latency at startup depends on the attestation provider you choose.

The amount of time that the App Check token is valid (the time to live, or TTL) determines the frequency of re-attestations. This duration can be configured in the Firebase console. Re-attestation occurs when approximately halkf of the TTL has elapsed. For more information, see the Firebase docs for your attestation provider.

Integrate your app with App Check
Note: Get help faster! For support regarding the Firebase-related portions of this process, see Firebase support. For support regarding the Google Places API, see Google Maps Platform support.
Prerequisites and requirements
An app with the the latest weekly or quarterly version of the Maps JS API and Core libraries loaded.
A Cloud project with the Maps JS API enabled.
You must be the owner of the app in Cloud Console.
You will need the app's project ID from the Cloud Console
Step 1: Add Firebase to your app
Follow the instructions in the Firebase developer documentation to add Firebase to your app.

Step 2: Add the App Check library and initialize App Check
Firebase provides instructions for each default attestation provider. These instructions show you how to set up a Firebase project and add the App Check library to your app. Follow the code samples provided to initialize App Check.

Instructions for reCAPTCHA Enterprise.
Instructions for reCAPTCHA v3.

You must register your site for reCAPTCHA v3 and get your reCAPTCHA v3 site key and secret key using the reCAPTCHA site registration tool before you enable the API on the Cloud Console. See the reCAPTCHA v3 documentation for more information and instructions.
Step 3: Load Maps JS API libraries
Load the core and Maps libraries as shown in the following snippet. For more information and instructions, see the Maps JavaScript API documentation.


async function init() {
  const {Settings} = await google.maps.importLibrary('core');
  const {Map} = await google.maps.importLibrary('maps');
}  
Step 4: Initialize the Maps and App Check APIs
Initialize App Check using the config provided by the Firebase console.
reCAPTCHA v3 instructions.
reCAPTCHA Enterprise instructions.
Ensure that requests to the Maps JS API are accompanied by App Check tokens:

  import {initializeApp} from 'firebase/app';
  import {
    getToken,
    initializeAppCheck,
    ReCaptchaEnterpriseProvider,
  } from 'firebase/app-check';
    
  async function init() {
    const {Settings} = await google.maps.importLibrary('core');
    const {Map} = await google.maps.importLibrary('maps');
  
    const app = initializeApp({
      // Your firebase configuration object
    });
  
    // Pass your reCAPTCHA Enterprise site key to initializeAppCheck().
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        'abcdefghijklmnopqrstuvwxy-1234567890abcd',
      ),
  
      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true,
    });
  
    Settings.getInstance().fetchAppCheckToken = () =>
        getToken(appCheck, /* forceRefresh = */ false);
  
    // Load a map
    map = new Map(document.getElementById("map"), {
      center: { lat: 37.4161493, lng: -122.0812166 },
      zoom: 8,
    });
  }  
  
Step 5: Enable debugging (optional)
If you'd like to develop and test your app locally, or run it in a continuous integration (CI) environment, you can create a debug build of your app that uses a debug secret to obtain valid App Check tokens. This lets you avoid using real attestation providers in your debug build.

To test your app locally:

Activate the debug provider for development purposes.
You will receive an automatically generated random UUID4 (called the _debug token_ in the App Check documentation) from the SDK's debug logs. Add this token to the Firebase console.
For more information and instructions, see the App Check documentation.
To run your app in a CI environment:

Generate a random UUID4 from the Firebase console.
Add the UUID4 as a debug token, and then copy it into a secret store that the CI tests will access per test run.
For more information and instructions, see the App Check documentation.
Step 6: Monitor your app requests and decide on enforcement
Before you begin enforcement, you'll want to make sure that you won't disrupt legitimate users of your app. To do this, visit the App Check metrics screen to see what percentage of your app's traffic is verified, outdated, or illegitimate. Once you see that the majority of your traffic is verified, you can enable enforcement.


Events

bookmark_border

Select platform: Android iOS JavaScript
This page describes the user interface events and error events that you can listen for and handle programmatically.

User Interface Events
JavaScript within the browser is event driven, meaning that JavaScript responds to interactions by generating events, and expects a program to listen to interesting events. There are two types of events:

User events (such as "click" mouse events) are propagated from the DOM to the Maps JavaScript API. These events are separate and distinct from standard DOM events.
MVC state change notifications reflect changes in Maps JavaScript API objects and are named using a property_changed convention.
Each Maps JavaScript API object exports a number of named events. Programs interested in certain events will register JavaScript event listeners for those events and execute code when those events are received by calling addListener() to register event handlers on the object.

The following sample will show you which events are triggered by the google.maps.Map as you interact with the map.


For a complete list of events, consult the Maps JavaScript API Reference. Events are listed in a separate section for each object which contains events.

UI Events
Some objects within the Maps JavaScript API are designed to respond to user events such as mouse or keyboard events. For example, these are some of the user events that a google.maps.marker.AdvancedMarkerElement object can listen to:

'click'
'drag'
'dragend'
'dragstart'
'gmp-click'
For the full list, see the AdvancedMarkerElement class. These events may look like standard DOM events, but they are actually part of the Maps JavaScript API. Because different browsers implement different DOM event models, the Maps JavaScript API provides these mechanisms to listen for and respond to DOM events without needing to handle the various cross-browser peculiarities. These events also typically pass arguments within the event noting some UI state (such as the mouse position).

MVC State Changes
MVC objects typically contain state. Whenever an object's property changes, the Maps JavaScript API will fire an event that the property has changed. For example, the API will fire a zoom_changed event on a map when the map's zoom level changes. You can intercept these state changes by calling addListener() to register event handlers on the object as well.

User events and MVC state changes may look similar, but you generally wish to treat them differently in your code. MVC events, for example, do not pass arguments within their event. You will want to inspect the property that changed on an MVC state change by calling the appropriate getProperty method on that object.

Handle Events
To register for event notifications, use the addListener() event handler. That method takes an event to listen for, and a function to call when the specified event occurs.

Example: Map and Marker Events
The following code mixes user events with state change events. We attach an event handler to a marker that zooms the map when clicked. We also add an event handler to the map for changes to the center property and pan the map back to the marker after 3 seconds on receipt of the center_changed event:

TypeScript
JavaScript

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const myLatlng = { lat: -25.363, lng: 131.044 };

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: myLatlng,
      mapId: "DEMO_MAP_ID",
    }
  );

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: myLatlng,
    map,
    title: "Click to zoom",
  });

  map.addListener("center_changed", () => {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(() => {
      map.panTo(marker.position as google.maps.LatLng);
    }, 3000);
  });

  marker.addListener("click", () => {
    map.setZoom(8);
    map.setCenter(marker.position as google.maps.LatLng);
  });
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Tip: If you're trying to detect a change in the viewport, be sure to use the specific bounds_changed event rather than constituent zoom_changed and center_changed events. Because the Maps JavaScript API fires these latter events independently, getBounds() may not report useful results until after the viewport has authoritatively changed. If you wish to getBounds() after such an event, be sure to listen to the bounds_changed event instead.

Example: Shape Editing and Dragging Events
When a shape is edited or dragged, an event is fired upon completion of the action. For a list of the events and some code snippets, see Shapes.

View example (rectangle-event.html)

Access Arguments in UI Events
UI events within the Maps JavaScript API typically pass an event argument, which can be accessed by the event listener, noting the UI state when the event occurred. For example, a UI 'click' event typically passes a MouseEvent containing a latLng property denoting the clicked location on the map. Note that this behavior is unique to UI events; MVC state changes do not pass arguments in their events.

You can access the event's arguments within an event listener the same way you would access an object's properties. The following example adds an event listener for the map, and creates a marker when the user clicks on the map at the clicked location.

TypeScript
JavaScript

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -25.363882, lng: 131.044922 },
      mapId: "DEMO_MAP_ID",
    }
  );

  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });
}

function placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  new google.maps.marker.AdvancedMarkerElement({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Use Closures in Event Listeners
When executing an event listener, it is often advantageous to have both private and persistent data attached to an object. JavaScript does not support "private" instance data, but it does support closures which allows inner functions to access outer variables. Closures are useful within event listeners to access variables not normally attached to the objects on which events occur.

The following example uses a function closure in the event listener to assign a secret message to a set of markers. Clicking on each marker will reveal a portion of the secret message, which is not contained within the marker itself.

TypeScript
JavaScript

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -25.363882, lng: 131.044922 },
      mapId: "DEMO_MAP_ID",
    }
  );

  const bounds: google.maps.LatLngBoundsLiteral = {
    north: -25.363882,
    south: -31.203405,
    east: 131.044922,
    west: 125.244141,
  };

  // Display the area between the location southWest and northEast.
  map.fitBounds(bounds);

  // Add 5 markers to map at random locations.
  // For each of these markers, give them a title with their index, and when
  // they are clicked they should open an infowindow with text from a secret
  // message.
  const secretMessages = ["This", "is", "the", "secret", "message"];
  const lngSpan = bounds.east - bounds.west;
  const latSpan = bounds.north - bounds.south;

  for (let i = 0; i < secretMessages.length; ++i) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: {
        lat: bounds.south + latSpan * Math.random(),
        lng: bounds.west + lngSpan * Math.random(),
      },
      map: map,
    });

    attachSecretMessage(marker, secretMessages[i]);
  }
}

// Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
function attachSecretMessage(
  marker: google.maps.marker.AdvancedMarkerElement,
  secretMessage: string
) {
  const infowindow = new google.maps.InfoWindow({
    content: secretMessage,
  });

  marker.addListener("click", () => {
    infowindow.open(marker.map, marker);
  });
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Get and Set Properties within Event Handlers
None of the MVC state change events in the Maps JavaScript API event system pass arguments when the event is triggered. (User events do pass arguments which can be inspected.) If you need to inspect a property on an MVC state change, you should explicitly call the appropriate getProperty() method on that object. This inspection will always retrieve the current state of the MVC object, which may not be the state when the event was first fired.

Note: Explicitly setting a property within an event handler which responds to a state change of that particular property may produce unpredictable and/or unwanted behavior. Setting such a property will trigger a new event, for example, and if you always set a property within this event handler, you may end up creating an infinite loop.

In the example below, we set up an event handler to respond to zoom events by bringing up an info window displaying that level.

TypeScript
JavaScript

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

  const originalMapCenter = new google.maps.LatLng(-25.363882, 131.044922);
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: originalMapCenter,
    }
  );

  const infowindow = new google.maps.InfoWindow({
    content: "Change the zoom level",
    position: originalMapCenter,
  });

  infowindow.open(map);

  map.addListener("zoom_changed", () => {
    infowindow.setContent("Zoom: " + map.getZoom()!);
  });
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Listen to DOM Events
The Maps JavaScript API event model creates and manages its own custom events. However, the DOM (Document Object Model) within the browser also creates and dispatches its own events, according to the particular browser event model in use. If you wish to capture and respond to these events, the Maps JavaScript API provides the addDomListener() static method to listen to and bind to DOM events.

This convenience method has a signature as shown below:


addDomListener(instance:Object, eventName:string, handler:Function)
where instance may be any DOM element supported by the browser, including:

Hierarchical members of the DOM such as window or document.body.myform
Named elements such as document.getElementById("foo")
Note that addDomListener() passes the indicated event to the browser, which handles it according to the browser's DOM event model; however, almost all modern browsers at least support DOM Level 2. (For more information on DOM level events, see the Mozilla DOM Levels reference.)

TypeScript
JavaScript
HTML

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

  const mapDiv = document.getElementById("map") as HTMLElement;
  const map = new google.maps.Map(mapDiv, {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
  });

  // We add a DOM event here to show an alert if the DIV containing the
  // map is clicked.
  google.maps.event.addDomListener(mapDiv, "click", () => {
    window.alert("Map was clicked!");
  });
}

initMap();
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Although the above code is Maps JavaScript API code, the addDomListener() method binds to the window object of the browser and allows the API to communicate with objects outside of the API's normal domain.

Remove Event Listeners
To remove a specific event listener, it must have been assigned to a variable. You can then call removeListener(), passing the variable name to which the listener was assigned.


var listener1 = marker.addListener('click', aFunction);

google.maps.event.removeListener(listener1);
To remove all listeners from a particular instance, call clearInstanceListeners(), passing the instance name.


var listener1 = marker.addListener('click', aFunction);
var listener2 = marker.addListener('mouseover', bFunction);

// Remove listener1 and listener2 from marker instance.
google.maps.event.clearInstanceListeners(marker);
To remove all listeners for a specific event type for a specific instance, call clearListeners(), passing the instance name and the event name.


marker.addListener('click', aFunction);
marker.addListener('click', bFunction);
marker.addListener('click', cFunction);

// Remove all click listeners from marker instance.
google.maps.event.clearListeners(marker, 'click');


Map Types

bookmark_border

Select platform: Android iOS JavaScript
This document discusses the types of maps you can display using the Maps JavaScript API. The API uses a MapType object to hold information about these maps. A MapType is an interface that defines the display and usage of map tiles and the translation of coordinate systems from screen coordinates to world coordinates (on the map). Each MapType must contain a few methods to handle retrieval and release of tiles, and properties that define its visual behavior.

The inner workings of map types within the Maps JavaScript API is an advanced topic. Most developers can use the basic map types noted below. However, you can also modify the presentation of existing map types using Styled Maps or define your own map tiles using custom map types. When providing custom map types, you will need to understand how to modify the map's Map Type Registry.

Basic Map Types
There are four types of maps available within the Maps JavaScript API. In addition to the familiar "painted" road map tiles, the Maps JavaScript API also supports other maps types.

The following map types are available in the Maps JavaScript API:

roadmap displays the default road map view. This is the default map type.
satellite displays Google Earth satellite images.
hybrid displays a mixture of normal and satellite views.
terrain displays a physical map based on terrain information.
You modify the map type in use by the Map by setting its mapTypeId property, either within the constructor by setting its Map options object, or by calling the map's setMapTypeId() method. The mapTypeID property defaults to roadmap.

Setting the mapTypeId upon construction:


var myLatlng = new google.maps.LatLng(-34.397, 150.644);
var mapOptions = {
  zoom: 8,
  center: myLatlng,
  mapTypeId: 'satellite'
};
var map = new google.maps.Map(document.getElementById('map'),
    mapOptions);
Modifying the mapTypeId dynamically:


map.setMapTypeId('terrain');
Note that you don't actually set the map's map type directly, but instead set its mapTypeId to reference a MapType using an identifier. The Maps JavaScript API uses a map type registry, explained below, to manage these references.

45° Imagery
Deprecated: As of version 3.62, to be released in August 2025, Maps JavaScript API satellite and hybrid map types will no longer automatically switch to 45° Imagery at higher zoom levels. Where 45° Imagery is available, the map will show the top-down satellite view even as the user zooms in. Calls to map.setTilt(45) will also be ineffective. Customers and applications relying on 45° Imagery for their use-cases will be impacted and will need to switch to using alternatives, for example 3D maps.

The Maps JavaScript API supports special 45° imagery for certain locations. This high-resolution imagery provides perspective views towards each of the cardinal direction (North, South, East, West). These images are available at higher zoom levels for supported map types.

The following image shows a 45° perspective view of New York City:


The satellite and hybrid map types support 45° imagery at high zoom levels (12 and greater) where available. If the user zooms into a location for which such imagery exists, these map types automatically alter their views in the following manner:

The satellite or hybrid imagery is replaced with imagery giving a 45° perspective, centered on the current location. By default, such views are oriented towards north. If the user zooms out, the default satellite or hybrid imagery appears again. The behavior varies depending on zoom level and the value of tilt:
Between zoom levels 12 and 18 the top-down basemap (0°) displays by default unless tilt is set to 45.
At zoom levels of 18 or greater the 45° basemap displays unless tilt is set to 0.
The rotate control becomes visible. The rotate control provides options that enable the user to toggle tilt, and to rotate the view in 90° increments in either direction. To hide the rotate control, set rotateControl to false.
Zooming out from a map type displaying 45° imagery reverts each of these changes, re-establishing the original map types.

Enable and Disable 45° Imagery
You can disable 45° imagery by calling setTilt(0) on the Map object. To enable 45° imagery for supported map types, call setTilt(45). The Map's getTilt() method will always reflect the current tilt being shown on the map; if you set a tilt on a map and then later remove that tilt (by zooming the map out, for example), the map's getTilt() method will return 0.

Important: 45° imagery is only supported on raster maps; this imagery cannot be used with vector maps.

The following example displays a 45° view of New York City:

TypeScript
JavaScript

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 40.76, lng: -73.983 },
      zoom: 15,
      mapTypeId: "satellite",
    }
  );

  map.setTilt(45);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
View example.

Rotate 45° Imagery
The 45° imagery actually consists of a collection of images for each cardinal direction (North, South, East, West). Once your map is displaying 45° imagery, you can orient the imagery towards one of its cardinal directions by calling setHeading() on the Map object, passing a number value expressed as degrees from North.

The following example shows an aerial map and auto-rotates the map every 3 seconds when the button is clicked:

TypeScript
JavaScript

let map: google.maps.Map;

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 40.76, lng: -73.983 },
    zoom: 15,
    mapTypeId: "satellite",
    heading: 90,
    tilt: 45,
  });

  // add listener to button
  document.getElementById("rotate")!.addEventListener("click", autoRotate);
}

function rotate90(): void {
  const heading = map.getHeading() || 0;

  map.setHeading(heading + 90);
}

function autoRotate(): void {
  // Determine if we're showing aerial imagery.
  if (map.getTilt() !== 0) {
    window.setInterval(rotate90, 3000);
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
View example.

Modify the Map Type Registry
A map's mapTypeId is a string identifier that is used to associate a MapType with a unique value. Each Map object maintains a MapTypeRegistry which contains the collection of available MapTypes for that map. This registry is used to select the types of maps which are available in the Map's MapType control, for example.

You don't read directly from the map type registry. Instead, you modify the registry by adding custom map types and associating them with a string identifier of your choosing. You cannot modify or alter the basic map types (though you can remove them from the map by altering the appearance of the map's associated mapTypeControlOptions).

The following code sets the map to show only two map types in the map's mapTypeControlOptions and modifies the registry to add the association with this identifier to the actual implementation of the MapType interface.

Note: In the following code example, the creation of the custom map type itself is intentionally omitted. See Styled Maps or Custom Map Types below for information on constructing a map type.

// Modify the control to only display two maptypes, the
// default ROADMAP and the custom 'mymap'.
// Note that because this is an association, we
// don't need to modify the MapTypeRegistry beforehand.

var MY_MAPTYPE_ID = 'mymaps';

var mapOptions = {
  zoom: 12,
  center: brooklyn,
  mapTypeControlOptions: {
     mapTypeIds: ['roadmap', MY_MAPTYPE_ID]
  },
  mapTypeId: MY_MAPTYPE_ID
};

// Create our map. This creation will implicitly create a
// map type registry.
map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

// Create your custom map type using your own code.
// (See below.)
var myMapType = new MyMapType();

// Set the registry to associate 'mymap' with the
// custom map type we created, and set the map to
// show that map type.
map.mapTypes.set(MY_MAPTYPE_ID, myMapType);
Styled Maps
The StyledMapType lets you customize the presentation of the standard Google base maps, changing the visual display of such elements as roads, parks, and built-up areas to reflect a different style than that used in the default map type. The StyledMapType affects only the default roadmap map type.

For more information about the StyledMapType, see Using embedded JSON style declarations.

If you want to update the same style across multiple apps, look into cloud customization, which is available in the Google Cloud console and requires a map ID. To avoid potential conflicts, do not combine cloud customization and hardcoded styling in the same app.
Custom Map Types
The Maps JavaScript API supports the display and management of custom map types, allowing you to implement your own map imagery or tile overlays.

Several possible map type implementations exist within the Maps JavaScript API:

Standard tile sets consisting of images which collectively constitute full cartographic maps. These tile sets are also known as base map types. These map types act and behave like the existing default map types: roadmap, satellite, hybrid and terrain. You can add your custom map type to a Map's mapTypes array to allow the UI within the Maps JavaScript API to treat your custom map type as a standard map type (by including it in the MapType control, for example).
Image tile overlays which display on top of existing base map types. Generally, these map types are used to augment an existing map type to display additional information and are often constrained to specific locations and/or zoom levels. Note that these tiles may be transparent, allowing you to add features to existing maps.
Non-image map types, which allow you to manipulate the display of map information at its most fundamental level.
Each of these options relies on creating a class that implements the MapType interface. Additionally, the ImageMapType class provides some built-in behavior to simplify the creation of imagery map types.

The MapType Interface
Before you create classes which implement MapType, it is important to understand how Google Maps determines coordinates and decides which parts of the map to show. You need to implement similar logic for any base or overlay map types. Read the guide to map and tile coordinates.

Custom map types must implement the MapType interface. This interface specifies certain properties and methods that allow the API to initiate requests to your map type(s) when the API determines that it needs to display map tiles within the current viewport and zoom level. You handle these requests to decide which tile to load.

Note: You may create your own class to implement this interface. Alternatively, if you have compatible imagery you can use the ImageMapType class which already implements this interface.

Classes implementing the MapType interface require that you define and populate the following properties:

tileSize (required) specifies the size of the tile (of type google.maps.Size). Sizes must be rectangular though they need not be square.
maxZoom (required) specifies the maximum zoom level at which to display tiles of this map type.
minZoom (optional) specifies the minimum zoom level at which to display tile of this map type. By default, this value is 0 indicating that no minimum zoom level exists.
name (optional) specifies the name for this map type. This property is only necessary if you want this map type to be selectable within a MapType control. (See Control Options.)
alt (optional) specifies the alternate text for this map type, exhibited as hover text. This property is only necessary if you want this map type to be selectable within a MapType control. (See Control Options.)
Additionally, classes implementing the MapType interface need to implement the following methods:

getTile() (required) is called whenever the API determines that the map needs to display new tiles for the given viewport. The getTile() method must have the following signature:

getTile(tileCoord:Point,zoom:number,ownerDocument:Document):Node

The API determines whether it needs to call getTile() based on the MapType's tileSize, minZoom, and maxZoom properties and the map's current viewport and zoom level. The handler for this method should return an HTML element given a passed coordinate, zoom level, and DOM element on which to append the tile image.

releaseTile() (optional) is called whenever the API determines that the map needs to remove a tile as it falls out of view. This method must have the following signature:

releaseTile(tile:Node)

You typically should handle removal of any elements that were attached to the map tiles upon addition to the map. For example, if you attached event listeners to map tile overlays, you should remove them here.

The getTile() method acts as the main controller for determining which tiles to load within a given viewport.

Base Map Types
Map types which you construct in this manner may either stand alone or be combined with other map types as overlays. Standalone map types are known as base map types. You may want to have the API treat such custom MapTypes as it would any other existing base map type (ROADMAP, TERRAIN, etc.). To do so, add your custom MapType to the Map's mapTypes property. This property is of type MapTypeRegistry.

The following code creates a base MapType to display a map's tile coordinates and draws an outline of the tiles:

TypeScript
JavaScript

/*
 * This demo demonstrates how to replace default map tiles with custom imagery.
 * In this case, the CoordMapType displays gray tiles annotated with the tile
 * coordinates.
 *
 * Try panning and zooming the map to see how the coordinates change.
 */

class CoordMapType {
  tileSize: google.maps.Size;
  maxZoom = 19;
  name = "Tile #s";
  alt = "Tile Coordinate Map Type";

  constructor(tileSize: google.maps.Size) {
    this.tileSize = tileSize;
  }

  getTile(
    coord: google.maps.Point,
    zoom: number,
    ownerDocument: Document
  ): HTMLElement {
    const div = ownerDocument.createElement("div");

    div.innerHTML = String(coord);
    div.style.width = this.tileSize.width + "px";
    div.style.height = this.tileSize.height + "px";
    div.style.fontSize = "10";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1px";
    div.style.borderColor = "#AAAAAA";
    div.style.backgroundColor = "#E5E3DF";
    return div;
  }

  releaseTile(tile: HTMLElement): void {}
}

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 10,
      center: { lat: 41.85, lng: -87.65 },
      streetViewControl: false,
      mapTypeId: "coordinate",
      mapTypeControlOptions: {
        mapTypeIds: ["coordinate", "roadmap"],
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      },
    }
  );

  map.addListener("maptypeid_changed", () => {
    const showStreetViewControl =
      (map.getMapTypeId() as string) !== "coordinate";

    map.setOptions({
      streetViewControl: showStreetViewControl,
    });
  });

  // Now attach the coordinate map type to the map's registry.
  map.mapTypes.set(
    "coordinate",
    new CoordMapType(new google.maps.Size(256, 256))
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Overlay Map Types
Some map types are designed to work on top of existing map types. Such map types may have transparent layers indicating points of interest, or showing additional data to the user.

In these cases, you do not want the map type treated as a separate entity but as an overlay. You can do this by adding the map type to an existing MapType directly using the Map's overlayMapTypes property. This property contains an MVCArray of MapTypes. All map types (base and overlay) are rendered within the mapPane layer. Overlay map types will display on top of the base map they are attached to, in the order in which they appear in the Map.overlayMapTypes array (overlays with higher index values are displayed in front of overlays with lower index values).

The following example is identical to the previous one except that we've created a tile overlay MapType on top of the ROADMAP map type:

TypeScript
JavaScript

/*
 * This demo illustrates the coordinate system used to display map tiles in the
 * API.
 *
 * Tiles in Google Maps are numbered from the same origin as that for
 * pixels. For Google's implementation of the Mercator projection, the origin
 * tile is always at the northwest corner of the map, with x values increasing
 * from west to east and y values increasing from north to south.
 *
 * Try panning and zooming the map to see how the coordinates change.
 */

class CoordMapType implements google.maps.MapType {
  tileSize: google.maps.Size;
  alt: string|null = null;
  maxZoom: number = 17;
  minZoom: number = 0;
  name: string|null = null;
  projection: google.maps.Projection|null = null;
  radius: number = 6378137;

  constructor(tileSize: google.maps.Size) {
    this.tileSize = tileSize;
  }
  getTile(
    coord: google.maps.Point,
    zoom: number,
    ownerDocument: Document
  ): HTMLElement {
    const div = ownerDocument.createElement("div");

    div.innerHTML = String(coord);
    div.style.width = this.tileSize.width + "px";
    div.style.height = this.tileSize.height + "px";
    div.style.fontSize = "10";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1px";
    div.style.borderColor = "#AAAAAA";
    return div;
  }
  releaseTile(tile: Element): void {}
}

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 10,
      center: { lat: 41.85, lng: -87.65 },
    }
  );

  // Insert this overlay map type as the first overlay map type at
  // position 0. Note that all overlay map types appear on top of
  // their parent base map.
  const coordMapType = new CoordMapType(new google.maps.Size(256, 256))
  map.overlayMapTypes.insertAt(
    0,
    coordMapType
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Image Map Types
Implementing a MapType to act as a base map type can be a time-consuming and laborious task. The API provides a special class that implements the MapType interface for the most common map types: map types that consist of tiles made up of single image files.

This class, the ImageMapType class, is constructed using an ImageMapTypeOptions object specification defining the following required properties:

tileSize (required) specifies the size of the tile (of type google.maps.Size). Sizes must be rectangular though they need not be square.
getTileUrl (required) specifies the function, usually provided as an inline function literal, to handle selection of the proper image tile based on supplied world coordinates and zoom level.
The following code implements a basic ImageMapType using Google's moon tiles. The example makes use of a normalization function to ensure that tiles repeat along the x-axis, but not along the y-axis of your map.

TypeScript
JavaScript

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 0, lng: 0 },
      zoom: 1,
      streetViewControl: false,
      mapTypeControlOptions: {
        mapTypeIds: ["moon"],
      },
    }
  );

  const moonMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom): string {
      const normalizedCoord = getNormalizedCoord(coord, zoom);

      if (!normalizedCoord) {
        return "";
      }

      const bound = Math.pow(2, zoom);
      return (
        "https://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw" +
        "/" +
        zoom +
        "/" +
        normalizedCoord.x +
        "/" +
        (bound - normalizedCoord.y - 1) +
        ".jpg"
      );
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 9,
    minZoom: 0,
    // @ts-ignore TODO 'radius' does not exist in type 'ImageMapTypeOptions'
    radius: 1738000,
    name: "Moon",
  });

  map.mapTypes.set("moon", moonMapType);
  map.setMapTypeId("moon");
}

// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
  const y = coord.y;
  let x = coord.x;

  // tile range in one direction range is dependent on zoom level
  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
  const tileRange = 1 << zoom;

  // don't repeat across y-axis (vertically)
  if (y < 0 || y >= tileRange) {
    return null;
  }

  // repeat across x-axis
  if (x < 0 || x >= tileRange) {
    x = ((x % tileRange) + tileRange) % tileRange;
  }

  return { x: x, y: y };
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Projections
The Earth is a three-dimensional sphere (approximately), while a map is a flat two-dimensional surface. The map that you see within the Maps JavaScript API, like any flat map of the Earth, is a projection of that sphere onto a flat surface. In its simplest terms, a projection can be defined as a mapping of latitude/longitude values into coordinates on the projection's map.

Projections in the Maps JavaScript API must implement the Projection interface. A Projection implementation must provide not only a mapping from one coordinate system to another, but a bi-directional mapping. That is, you must define how to translate from Earth coordinates (LatLng objects) to the Projection class's world coordinate system, and from the world coordinate system back to the Earth coordinates. Google Maps uses the Mercator projection to create its maps from geographic data and convert events on the map into geographic coordinates. You can obtain this projection by calling getProjection() on the Map (or any of the standard base MapType types.) For most uses, this standard Projection will suffice, but you may also define and use your own custom projections.

Implement a Projection
When implementing a custom projection, you will need to define a few things:

The formulae for mapping latitude and longitude coordinates into a Cartesian plane and the corresponding formulae for mapping from a Cartesian plane to latitude and longitude coordinates. (The Projection interface only supports transformations into rectilinear coordinates.)
The base tile size. All tiles must be rectangular.
The "world size" of a map using the base tile set at zoom level 0. Note that for maps consisting of one tile at zoom 0, the world size and base tile size are identical.
Coordinate Transformations in Projections
Each projection provides two methods which translate between these two coordinate systems, allowing you to convert between geographic and world coordinates:

The Projection.fromLatLngToPoint() method converts a LatLng value into a world coordinate. This method is used to position overlays on the map (and to position the map itself).
The Projection.fromPointToLatLng() method converts a world coordinate into a LatLng value. This method is used to convert events such as clicks that happen on the map into geographic coordinates.
Google Maps assumes that projections are rectilinear.

Generally, you may use a projection for two cases: to create a map of the world, or to create a map of a local area. In the former case, you should ensure that your projection is also rectilinear and normal at all longitudes. Some projections (especially conic projections) may be "locally normal" (i.e. point north) but deviate from true north; for example, the further the map is positioned relative to some reference longitude. You may use such a projection locally, but be aware that the projection is necessarily imprecise and transformation errors will become increasingly apparently the further away from the reference longitude you deviate.

Map Tile Selection in Projections
Projections are not only useful for determining the positions of locations or overlays, but for positioning the map tiles themselves. The Maps JavaScript API renders base maps using a MapType interface, which must declare both a projection property for identifying the map's projection and a getTile() method for retrieving map tiles based on tile coordinate values. Tile coordinates are based on both your basic tile size (which must be rectangular) and the "world size" of your map, which is the pixel size of your map world at zoom level 0. (For maps consisting of one tile at zoom 0, the tile size and world size are identical.)

You define the base tile size within your MapType's tileSize property. You define the world size implicitly within your projection's fromLatLngToPoint() and fromPointToLatLng() methods.

Since image selection depends on these passed values, it is useful to name images that can be selected programmatically given those passed values, such as map_zoom_tileX_tileY.png.

The following example defines an ImageMapType using the Gall-Peters projection:

TypeScript
JavaScript

// This example defines an image map type using the Gall-Peters
// projection.
// https://en.wikipedia.org/wiki/Gall%E2%80%93Peters_projection

function initMap(): void {
  // Create a map. Use the Gall-Peters map type.
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 0,
      center: { lat: 0, lng: 0 },
      mapTypeControl: false,
    }
  );

  initGallPeters();
  map.mapTypes.set("gallPeters", gallPetersMapType);
  map.setMapTypeId("gallPeters");

  // Show the lat and lng under the mouse cursor.
  const coordsDiv = document.getElementById("coords") as HTMLElement;

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(coordsDiv);
  map.addListener("mousemove", (event: google.maps.MapMouseEvent) => {
    coordsDiv.textContent =
      "lat: " +
      Math.round(event.latLng!.lat()) +
      ", " +
      "lng: " +
      Math.round(event.latLng!.lng());
  });

  // Add some markers to the map.
  map.data.setStyle((feature) => {
    return {
      title: feature.getProperty("name") as string,
      optimized: false,
    };
  });
  map.data.addGeoJson(cities);
}

let gallPetersMapType;

function initGallPeters() {
  const GALL_PETERS_RANGE_X = 800;
  const GALL_PETERS_RANGE_Y = 512;

  // Fetch Gall-Peters tiles stored locally on our server.
  gallPetersMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      const scale = 1 << zoom;

      // Wrap tiles horizontally.
      const x = ((coord.x % scale) + scale) % scale;

      // Don't wrap tiles vertically.
      const y = coord.y;

      if (y < 0 || y >= scale) return "";

      return (
        "https://developers.google.com/maps/documentation/" +
        "javascript/examples/full/images/gall-peters_" +
        zoom +
        "_" +
        x +
        "_" +
        y +
        ".png"
      );
    },
    tileSize: new google.maps.Size(GALL_PETERS_RANGE_X, GALL_PETERS_RANGE_Y),
    minZoom: 0,
    maxZoom: 1,
    name: "Gall-Peters",
  });

  // Describe the Gall-Peters projection used by these tiles.
  gallPetersMapType.projection = {
    fromLatLngToPoint: function (latLng) {
      const latRadians = (latLng.lat() * Math.PI) / 180;
      return new google.maps.Point(
        GALL_PETERS_RANGE_X * (0.5 + latLng.lng() / 360),
        GALL_PETERS_RANGE_Y * (0.5 - 0.5 * Math.sin(latRadians))
      );
    },
    fromPointToLatLng: function (point, noWrap) {
      const x = point.x / GALL_PETERS_RANGE_X;
      const y = Math.max(0, Math.min(1, point.y / GALL_PETERS_RANGE_Y));

      return new google.maps.LatLng(
        (Math.asin(1 - 2 * y) * 180) / Math.PI,
        -180 + 360 * x,
        noWrap
      );
    },
  };
}

// GeoJSON, describing the locations and names of some cities.
const cities = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-87.65, 41.85] },
      properties: { name: "Chicago" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-149.9, 61.218] },
      properties: { name: "Anchorage" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-99.127, 19.427] },
      properties: { name: "Mexico City" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-0.126, 51.5] },
      properties: { name: "London" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [28.045, -26.201] },
      properties: { name: "Johannesburg" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [15.322, -4.325] },
      properties: { name: "Kinshasa" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [151.207, -33.867] },
      properties: { name: "Sydney" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [0, 0] },
      properties: { name: "0°N 0°E" },
    },
  ],
};

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;



Geocoding Service

bookmark_border

Note: Server-side libraries
European Economic Area (EEA) developers
Overview
Also see the Maps JavaScript API Reference: Geocoder

Geocoding is the process of converting addresses (like "1600 Amphitheatre Parkway, Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739), which you can use to place markers or position the map.

Reverse geocoding is the process of converting geographic coordinates into a human-readable address (see Reverse geocoding (Address Lookup)).

You can also use the geocoder to find the address for a given place ID.

The Maps JavaScript API provides a Geocoder class for geocoding and reverse geocoding dynamically from user input. If instead you want to geocode static, known addresses, see the Geocoding web service.

Get started
Before using the Geocoding service in the Maps JavaScript API, first ensure that the Geocoding API is enabled in the Google Cloud console, in the same project you set up for the Maps JavaScript API.

To view your list of enabled APIs:

Go to the Google Cloud console.
Click the Select a project button, then select the same project you set up for the Maps JavaScript API and click Open.
From the list of APIs on the Dashboard, look for Geocoding API.
If you see the API in the list, you're all set. If the API is not listed, enable it:
At the top of the page, select ENABLE API to display the Library tab. Alternatively, from the left side menu, select Library.
Search for Geocoding API, then select it from the results list.
Select ENABLE. When the process finishes, Geocoding API appears in the list of APIs on the Dashboard.
Pricing and policies
Pricing
To learn about pricing and usage policies for the JavaScript Geocoding service, see Usage and Billing for the Geocoding API.

Policies
Your use of the Geocoding service must be in accordance with the Policies for Geocoding API.

Geocoding Requests
Accessing the Geocoding service is asynchronous, since the Google Maps API needs to make a call to an external server. For that reason, you need to pass a callback method to execute upon completion of the request. This callback method processes the result(s). Note that the geocoder may return more than one result.

You access the Google Maps API geocoding service within your code using the google.maps.Geocoder constructor object. The Geocoder.geocode() method initiates a request to the geocoding service, passing it a GeocoderRequest object literal containing the input terms and a callback method to execute upon receipt of the response.

The GeocoderRequest object literal contains the following fields:


{
 address: string,
 location: LatLng,
 placeId: string,
 bounds: LatLngBounds,
 componentRestrictions: GeocoderComponentRestrictions,
 region: string
}
Required parameters: You must supply one, and only one, of the following fields:

address — The address which you want to geocode.
     or
location — The LatLng (or LatLngLiteral) for which you want to obtain the closest, human-readable address. The geocoder performs a reverse geocode. See Reverse Geocoding for more information.
     or
placeId — The place ID of the place for which you want to obtain the closest, human-readable address. See more about retrieving an address for a place ID.
Optional parameters:

bounds — The LatLngBounds within which to bias geocode results more prominently. The bounds parameter will only influence, not fully restrict, results from the geocoder. See more information about viewport biasing below.
componentRestrictions — Used to restrict results to a specific area. See more information about component filtering below.
region — The region code, specified as a specified as a two-character (non-numeric) Unicode region subtag. In most cases, these tags map directly to familiar ccTLD ("top-level domain") two-character values. The region parameter will only influence, not fully restrict, results from the geocoder. See more information about region code biasing below.
extraComputations — The only allowed value for this parameter is ADDRESS_DESCRIPTORS. See address descriptors for more details.
fulfillOnZeroResults — Fulfill the promise on a ZERO_RESULT status in the response. This may be desired because even with zero geocoding results there may still be additional response level fields returned. See Fulfill on Zero Results for more details.
Geocoding Responses
The Geocoding service requires a callback method to execute upon retrieval of the geocoder's results. This callback should pass two parameters to hold the results and a status code, in that order.

Note: The Geocoding response also contains plus_code and address_descriptor fields at the response level, but these are not accessible through the address_descriptor fields at the response level, but these are not accessible through the callback. Instead, they should be accessed through the promise. See Fulfill on Zero Results for more details.
Geocoding Results
The GeocoderResult object represents a single geocoding result. A geocode request may return multiple result objects:


results[]: {
 types[]: string,
 formatted_address: string,
 address_components[]: {
   short_name: string,
   long_name: string,
   postcode_localities[]: string,
   types[]: string
 },
 partial_match: boolean,
 place_id: string,
 postcode_localities[]: string,
 geometry: {
   location: LatLng,
   location_type: GeocoderLocationType
   viewport: LatLngBounds,
   bounds: LatLngBounds
 }
}
These fields are explained below:

types[] is an array indicating the address type of the returned result. This array contains a set of zero or more tags identifying the type of feature returned in the result. For example, a geocode of "Chicago" returns "locality" which indicates that "Chicago" is a city, and also returns "political" which indicates it is a political entity. See more information about address types and address component types below.
formatted_address is a string containing the human-readable address of this location.
Often this address is equivalent to the postal address. Note that some countries, such as the United Kingdom, do not allow distribution of true postal addresses due to licensing restrictions.

The formatted address is logically composed of one or more address components. For example, the address "111 8th Avenue, New York, NY" consists of the following components: "111" (the street number), "8th Avenue" (the route), "New York" (the city) and "NY" (the US state).

Do not parse the formatted address programmatically. Instead you should use the individual address components, which the API response includes in addition to the formatted address field.

address_components[] is an array containing the separate components applicable to this address.

Each address component typically contains the following fields:

types[] is an array indicating the type of the address component. See the list of supported types.
long_name is the full text description or name of the address component as returned by the Geocoder.
short_name is an abbreviated textual name for the address component, if available. For example, an address component for the state of Alaska may have a long_name of "Alaska" and a short_name of "AK" using the 2-letter postal abbreviation.
Note the following facts about the address_components[] array:

The array of address components may contain more components than the formatted_address.
The array does not necessarily include all the political entities that contain an address, apart from those included in the formatted_address. To retrieve all the political entities that contain a specific address, you should use reverse geocoding, passing the latitude/longitude of the address as a parameter to the request.
The format of the response is not guaranteed to remain the same between requests. In particular, the number of address_components varies based on the address requested and can change over time for the same address. A component can change position in the array. The type of the component can change. A particular component may be missing in a later response.
See more information about address types and address component types below.

partial_match indicates that the geocoder did not return an exact match for the original request, though it was able to match part of the requested address. You may wish to examine the original request for misspellings and/or an incomplete address.

Partial matches most often occur for street addresses that do not exist within the locality you pass in the request. Partial matches may also be returned when a request matches two or more locations in the same locality. For example, "Hillpar St, Bristol, UK" will return a partial match for both Henry Street and Henrietta Street. Note that if a request includes a misspelled address component, the geocoding service may suggest an alternative address. Suggestions triggered in this way will also be marked as a partial match.

place_idis a unique identifier of a place, which can be used with other Google APIs. For example, you can use the place_id with the Google Places API library to get details of a local business, such as phone number, opening hours, user reviews, and more. See the place ID overview.
postcode_localities[] is an array denoting all the localities contained in a postal code, and is only present when the result is a postal code that contains multiple localities.
geometry contains the following information:

location contains the geocoded latitude,longitude value. Note that we return this location as a LatLng object, not as a formatted string.
location_type stores additional data about the specified location. The following values are supported:
ROOFTOP indicates that the returned result reflects a precise geocode.
RANGE_INTERPOLATED indicates that the returned result reflects an approximation (usually on a road) interpolated between two precise points (such as intersections). Interpolated results are generally returned when rooftop geocodes are unavailable for a street address.
GEOMETRIC_CENTER indicates that the returned result is the geometric center of a result such as a polyline (for example, a street) or polygon (region).
APPROXIMATE indicates that the returned result is approximate.

viewport stores the recommended viewport for the returned result.
bounds (optionally returned) stores the LatLngBounds which can fully contain the returned result. Note that these bounds may not match the recommended viewport. (For example, San Francisco includes the Farallon Islands, which are technically part of the city, but shouldn't be returned in the viewport.)
Addresses are returned by the Geocoder using the browser's preferred language setting, or the language specified when loading the API JavaScript using the language parameter. (For more information, see Localization.)

Address types and address component types
The types[] array in the GeocoderResult in the response indicates the address type. Examples of address types include a street address, a country, or a political entity. The types array in the GeocoderAddressComponent indicates the type of each part of the address. Examples include street number or country.

Addresses may have multiple types. The types may be considered 'tags'. For example, many cities are tagged with the political and locality types.

The following types are supported and returned in both the address type and address component type arrays:

Address Type	Description
street_address	A precise street address.
route	A named route (such as "US 101").
intersection	A major intersection, usually of two major roads.
political	A political entity. Usually, this type indicates a polygon of some civil administration.
country	The national political entity, and is typically the highest order type returned by the Geocoder.
administrative_area_level_1	A first-order civil entity below the country level. Within the United States, these administrative levels are states. Not all nations exhibit these administrative levels. In most cases, administrative_area_level_1 short names will closely match ISO 3166-2 subdivisions and other widely circulated lists; however this is not guaranteed as our geocoding results are based on a variety of signals and location data.
administrative_area_level_2	A second-order civil entity below the country level. Within the United States, these administrative levels are counties. Not all nations exhibit these administrative levels.
administrative_area_level_3	A third-order civil entity below the country level. This type indicates a minor civil division. Not all nations exhibit these administrative levels.
administrative_area_level_4	A fourth-order civil entity below the country level. This type indicates a minor civil division. Not all nations exhibit these administrative levels.
administrative_area_level_5	A fifth-order civil entity below the country level. This type indicates a minor civil division. Not all nations exhibit these administrative levels.
administrative_area_level_6	A sixth-order civil entity below the country level. This type indicates a minor civil division. Not all nations exhibit these administrative levels.
administrative_area_level_7	A seventh-order civil entity below the country level. This type indicates a minor civil division. Not all nations exhibit these administrative levels.
colloquial_area	A commonly-used alternative name for the entity.
locality	An incorporated city or town political entity.
sublocality	A first-order civil entity below a locality. For some locations may receive one of the additional types: sublocality_level_1 to sublocality_level_5. Each sublocality level is a civil entity. Larger numbers indicate a smaller geographic area.
neighborhood	A named neighborhood.
premise	A named location, usually a building or collection of buildings with a common name.
subpremise	An addressable entity below the premise level, such as an apartment, unit, or suite.
plus_code	An encoded location reference, derived from latitude and longitude. Plus codes can be used as a replacement for street addresses in places where they do not exist (where buildings are not numbered or streets are not named). See https://plus.codes for details.
postal_code	A postal code as used to address postal mail within the country.
natural_feature	A prominent natural feature.
airport	An airport.
park	A named park.
point_of_interest	A named point of interest. Typically, these "POI"s are prominent local entities that don't easily fit in another category, such as "Empire State Building" or "Eiffel Tower".
An empty list of types indicates there are no known types for the particular address component (for example, Lieu-dit in France).

In addition to the above, address components may include the types below.

Note: This list is not exhaustive, and is subject to change.

In addition to the above, address components may include the types listed below.

Note: This list is not exhaustive, and is subject to change.
Address Component Type	Description
floor	The floor of a building address.
establishment	Typically a place that has not yet been categorized.
landmark	A nearby place that is used as a reference, to aid navigation.
point_of_interest	A named point of interest.
parking	A parking lot or parking structure.
post_box	A specific postal box.
postal_town	A grouping of geographic areas, such as locality and sublocality, used for mailing addresses in some countries.
room	The room of a building address.
street_number	The precise street number.
bus_station, train_station and transit_station	The location of a bus, train or public transit stop.
Status Codes
The status code may return one of the following values:

"OK" indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.
"ZERO_RESULTS" indicates that the geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address.
"OVER_QUERY_LIMIT" indicates that you are over your quota.
"REQUEST_DENIED" indicates that your request was denied. The web page is not allowed to use the geocoder.
"INVALID_REQUEST" generally indicates that the query (address, components or latlng) is missing.
"UNKNOWN_ERROR" indicates that the request couldn't be processed due to a server error. The request may succeed if you try again.
"ERROR" indicates that the request timed out or there was a problem contacting the Google servers. The request may succeed if you try again.
In this example, we geocode an address and place a marker at the returned latitude and longitude values. Note that the handler is passed as an anonymous function literal.


  var geocoder;
  var map;
  function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
      zoom: 8,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

<body onload="initialize()">
 <div id="map" style="width: 320px; height: 480px;"></div>
  <div>
    <input id="address" type="textbox" value="Sydney, NSW">
    <input type="button" value="Encode" onclick="codeAddress()">
  </div>
</body>
View example.

Viewport Biasing
You can instruct the Geocoding Service to prefer results within a given viewport (expressed as a bounding box). You do so by setting the bounds parameter within the GeocoderRequest object literal to define the bounds of this viewport. Note that biasing only prefers results within the bounds; if more relevant results exist outside of these bounds, they may be included.

For example, a geocode for "Winnetka" generally returns this suburb of Chicago:


{
  "types":["locality","political"],
  "formatted_address":"Winnetka, IL, USA",
  "address_components":[{
    "long_name":"Winnetka",
    "short_name":"Winnetka",
    "types":["locality","political"]
  },{
    "long_name":"Illinois",
    "short_name":"IL",
    "types":["administrative_area_level_1","political"]
  },{
    "long_name":"United States",
    "short_name":"US",
    "types":["country","political"]
  }],
  "geometry":{
    "location":[ -87.7417070, 42.1083080],
    "location_type":"APPROXIMATE"
  },
  "place_id": "ChIJW8Va5TnED4gRY91Ng47qy3Q"
}
However, specifying a bounds parameter defining a bounding box for the San Fernando Valley of Los Angeles results in this geocode returning the neighborhood named "Winnetka" in that location:


{
  "types":["sublocality","political"],
  "formatted_address":"Winnetka, California, USA",
  "address_components":[{
    "long_name":"Winnetka",
    "short_name":"Winnetka",
    "types":["sublocality","political"]
  },{
    "long_name":"Los Angeles",
    "short_name":"Los Angeles",
    "types":["administrative_area_level_3","political"]
  },{
    "long_name":"Los Angeles",
    "short_name":"Los Angeles",
    "types":["administrative_area_level_2","political"]
  },{
    "long_name":"California",
    "short_name":"CA",
    "types":["administrative_area_level_1","political"]
  },{
    "long_name":"United States",
    "short_name":"US",
    "types":["country","political"]
  }],
  "geometry":{
    "location": [34.213171,-118.571022],
    "location_type":"APPROXIMATE"
  },
  "place_id": "ChIJ0fd4S_KbwoAR2hRDrsr3HmQ"
}
Region Code Biasing
You can set the Geocoding Service to return results biased to a particular region explicitly using the region parameter. This parameter takes a region code, specified as a two-character (non-numeric) Unicode region subtag. These tags map directly to familiar ccTLD ("top-level domain") two-character values such as "uk" in "co.uk" for example. In some cases, the region tag also supports ISO-3166-1 codes, which sometimes differ from ccTLD values ("GB" for "Great Britain" for example).

When using the region parameter:

Specify only one country or region. Multiple values are ignored, and could result in a failed request.
Use only two-character region subtags (Unicode CLDR format). All other inputs will result in errors.
Only the countries and regions listed in Google Maps Platform Coverage Details are supported.
Geocoding requests can be sent for every domain in which the main Google Maps application offers geocoding. Note that biasing only prefers results for a specific domain; if more relevant results exist outside of this domain, they may be included.

For example, a geocode for "Toledo" returns this result, as the default domain for the Geocoding Service is set to the United States:


{
  "types":["locality","political"],
  "formatted_address":"Toledo, OH, USA",
  "address_components":[{
    "long_name":"Toledo",
    "short_name":"Toledo",
    "types":["locality","political"]
  },{
    "long_name":"Ohio",
    "short_name":"OH",
    "types":["administrative_area_level_1","political"]
  },{
    "long_name":"United States",
    "short_name":"US",
    "types":["country","political"]
  }],
  "place_id": "ChIJeU4e_C2HO4gRRcM6RZ_IPHw"
}
A geocode for "Toledo" with the region field set to 'es' (Spain) will return the Spanish city:


{
  "types":["locality","political"],
  "formatted_address":"Toledo, España",
  "address_components":[{
    "long_name":"Toledo",
    "short_name":"Toledo",
    "types":["locality","political"]
  },{
    "long_name":"Toledo",
    "short_name":"TO",
    "types":["administrative_area_level_2","political"]
  },{
    "long_name":"Castilla-La Mancha",
    "short_name":"CM",
    "types":["administrative_area_level_1","political"]
  },{
    "long_name":"España",
    "short_name":"ES",
    "types":["country","political"]
  }],
  "place_id": "ChIJ8f21C60Lag0R_q11auhbf8Y"
}
Component Filtering
You can set the Geocoding Service to return address results restricted to a specific area, by using a components filter. Specify the filter in the componentRestrictions parameter. Filter values support the same methods of spelling correction and partial matching as other geocoding requests.

The geocoder returns only the results that match all the component filters. That is, it evaluates the filter specifications as an AND, not an OR.

A components filter consists of one or more of the following items:

route matches long or short name of a route.
locality matches against locality and sublocality types.
administrativeArea matches all the levels of administrative area.
postalCode matches postal codes and postal code prefixes.
country matches a country name or a two letter ISO 3166-1 country code. Note: The API follows the ISO standard for defining countries, and the filtering works best when using the corresponding ISO code of the country.
The following example demonstrates using the componentRestrictions parameter to filter by country and postalCode:


function codeAddress() {
geocoder.geocode({
  componentRestrictions: {
    country: 'AU',
    postalCode: '2000'
  }
}, function(results, status) {
  if (status == 'OK') {
    map.setCenter(results[0].geometry.location);
    var marker = new google.maps.Marker({
      map: map,
      position: results[0].geometry.location
    });
  } else {
    window.alert('Geocode was not successful for the following reason: ' + status);
  }
});
}
Fulfill on Zero Results
For reverse geocoding, by default the promise is broken on status=ZERO_RESULTS. However, the additional response level fields of plus_code and address_descriptor may still be populated in this case. If true is provided for the fulfillOnZeroResults parameter, populated in this case. If true is provided for the fulfillOnZeroResults parameter, the promise is not broken and these additional fields are accessible from the promise if present.

The following is an example of this behavior for a latitude/longitude in Antarctica. Even though there are no reverse geocoding results, we can still print the plus code in the promise if we set fulfillOnZeroResults=true.


    function addressDescriptorReverseGeocoding() {
      var latlng = new google.maps.LatLng(-75.290330, 38.653861);
      geocoder
        .geocode({
          'location': latlng,
          'fulfillOnZeroResults': true,
        })
        .then((response) => {
          console.log(response.plus_code);
        })
        .catch((error) => {
          window.alert(`Error`);
        });
    }
  
Address Descriptors
Address descriptors include additional information that help describe a location using landmarks and areas. Check out the address descriptors demo to explore the feature.

Address descriptors can be enabled through the use of the extraComputations parameter. Include extra_computations=ADDRESS_DESCRIPTORS in a geocoding request , reverse geocoding request , or a places geocoding request to receive address descriptors in your response.

Example in places geocoding
The following query contains the address of a place in Delhi.


function addressDescriptorPlaceIdLookup() {
  geocoder.geocode({
  geocoder.geocode({
    'placeId': 'ChIJyxAX8Bj9DDkRgBfAnBYa66Q',
    'extraComputations': ['ADDRESS_DESCRIPTORS']
    }, function(results, status) {
    if (status == 'OK') {
      console.log(results[0].address_descriptor);
    } else {
      window.alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
Note: Not all places are compatible with address descriptors. Very large places (for example, an airport) or areas (for example, a postal region) will never receive an address descriptor.
Example in reverse geocoding
The following query contains the latitude/longitude value for a location in Delhi.


    function addressDescriptorReverseGeocoding() {
      var latlng = new google.maps.LatLng(28.640964,77.235875);
      geocoder
        .geocode({
          'location': latlng,
          'extraComputations': ["ADDRESS_DESCRIPTORS"],
        })
        .then((response) => {
          console.log(response.address_descriptor);
        })
        .catch((error) => {
          window.alert(`Error`);
        });
    }
  
Note: Reverse geocoding includes a single address descriptor at the response level. Geocoding and places geocoding will receive an address descriptor for each compatible result in the response
Address Descriptor Example
An example address_descriptor is as follows.


  {
    "address_descriptor" : {
       "areas" : [
          {
             "containment" : "OUTSKIRTS",
             "display_name" : {
                "language_code" : "en",
                "text" : "Turkman Gate"
             },
             "place_id" : "ChIJ_7LLvyb9DDkRMKKxP9YyXgs"
          },
          {
             "containment" : "OUTSKIRTS",
             "display_name" : {
                "language_code" : "en",
                "text" : "Chandni Chowk"
             },
             "place_id" : "ChIJWcXciBr9DDkRUb4dCDykTwI"
          },
          {
             "containment" : "NEAR",
             "display_name" : {
                "language_code" : "en",
                "text" : "Katar Ganj"
             },
             "place_id" : "ChIJH3cWUyH9DDkRaw-9CjvcRvY"
          }
       ],
       "landmarks" : [
          {
             "display_name" : {
                "language_code" : "en",
                "text" : "Delite Cinema"
             },
             "straight_line_distance_meters" : 29.9306755065918,
             "place_id" : "ChIJLfiYDCT9DDkROoEa7NdupUM",
             "travel_distance_meters" : 418.7794799804688,
             "spatial_relationship" : "ACROSS_THE_ROAD",
             "types" : [ "establishment", "movie_theater", "point_of_interest" ]
          },
          {
             "display_name" : {
                "language_code" : "en",
                "text" : "YES Bank"
             },
             "straight_line_distance_meters" : 66.83731079101562,
             "place_id" : "ChIJFYHM3yb9DDkRRKGkZl2mpSQ",
             "travel_distance_meters" : 489.0340270996094,
             "spatial_relationship" : "DOWN_THE_ROAD",
             "types" : [ "bank", "establishment", "finance", "point_of_interest" ]
          },
          {
             "display_name" : {
                "language_code" : "en",
                "text" : "UCO Bank"
             },
             "straight_line_distance_meters" : 25.38849639892578,
             "place_id" : "ChIJ-c6_wCb9DDkRjIk1LeqRtGM",
             "travel_distance_meters" : 403.2246398925781,
             "spatial_relationship" : "ACROSS_THE_ROAD",
             "types" : [ "atm", "bank", "establishment", "finance", "point_of_interest" ]
          },
          {
             "display_name" : {
                "language_code" : "en",
                "text" : "Delhi By Cycle Meeting Point"
             },
             "straight_line_distance_meters" : 44.02867126464844,
             "place_id" : "ChIJNxVfkSb9DDkRJD22l-eGFdM",
             "travel_distance_meters" : 97.41281890869141,
             "spatial_relationship" : "AROUND_THE_CORNER",
             "types" : [
                "establishment",
                "point_of_interest",
                "tourist_attraction",
                "travel_agency"
             ]
          },
          {
             "display_name" : {
                "language_code" : "en",
                "text" : "Axis Bank Branch"
             },
             "straight_line_distance_meters" : 102.3495178222656,
             "place_id" : "ChIJr3uaDCT9DDkR8roHTVSn1x4",
             "travel_distance_meters" : 330.8566284179688,
             "spatial_relationship" : "DOWN_THE_ROAD",
             "types" : [ "bank", "establishment", "finance", "point_of_interest" ]
          }
       ]
    }
  }
There are two arrays in each address_descriptor object: landmarks and areas. The landmarks array contains up to 5 results ranked in order of relevance by taking account of proximity to the requested coordinate, the prevalence of the landmark and its visibility. Each landmark result contains the following values:

place_id is the place ID of the landmarks result. See the place ID overview.
display_name is the display name of the landmark and contains language_code and text.
straight_line_distance_meters is the point to point distance in meters between the input coordinate and the landmarks result.
travel_distance_meters is the distance in meters as traveled using the road network (ignoring road restrictions) between the input coordinate and the landmarks result.
spatial_relationship is the estimated relationship between the input coordinate and the landmarks result:
"NEAR" is the default relationship when none of the following applies.
"WITHIN" when the input coordinate is contained within the bounds of the structure associated with the landmark.
"BESIDE" when the input coordinate is directly adjacent to the landmark or landmark's access point.
"ACROSS_THE_ROAD" when the input coordinate is directly opposite of the landmark on the other side of the route.
"DOWN_THE_ROAD" when the input coordinate is along the same route as the landmark, but not "BESIDES" or "ACROSS_THE_ROAD".
"AROUND_THE_CORNER" when the input coordinate is along a perpendicular route as the landmark (restricted to a single turn).
"BEHIND" when the input coordinate is spatially close to the landmark, but far from its access point.
types are the Place types of the landmark.
The areas object contains up to 3 responses and limits itself to places that represent small regions, such as neighborhoods, sublocalities, and large complexes. Areas that contain the requested coordinate are listed first and ordered from smallest to largest. Each areas result contains the following values:

place_id is the place ID of the areas result. See the place ID overview.
display_name is the display name of the area and contains language_code and text.
containment is the estimated containment relationship between the input coordinate and the areas result:
"NEAR" is the default relationship when none of the following applies.
"WITHIN" when the input coordinate is close to the center of the area.
"OUTSKIRTS" when the input coordinate is close to the edge of the area.
Address Descriptor Coverage
Address descriptors are in GA for India. The use of address descriptors in India incurs no additional cost and usage is covered by the existing Geocoding (India) Essentials SKU.

Feedback
This feature is available in all regions. It is in GA for India and in the pre-GA Experimental launch stage for all other regions. We would appreciate feedback:

For issues related to the India region only, contact the support team.
For feedback on the experimental release, email us at address-descriptors-feedback@google.com.
See Address descriptors coverage details for more information.
Reverse Geocoding (Address Lookup)
The term geocoding generally refers to translating a human-readable address into a location on a map. The process of doing the converse, translating a location on the map into a human-readable address, is known as reverse geocoding.

Instead of supplying a textual address, supply a comma-separated latitude/longitude pair in the location parameter.

Note: If you include the componentRestrictions parameter in the request then the location parameter is ignored.
The following example geocodes a latitude/longitude value and centers the map at that location, bringing up an info window with the formatted address:

TypeScript
JavaScript

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 8,
      center: { lat: 40.731, lng: -73.997 },
    }
  );
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  (document.getElementById("submit") as HTMLElement).addEventListener(
    "click",
    () => {
      geocodeLatLng(geocoder, map, infowindow);
    }
  );
}

function geocodeLatLng(
  geocoder: google.maps.Geocoder,
  map: google.maps.Map,
  infowindow: google.maps.InfoWindow
) {
  const input = (document.getElementById("latlng") as HTMLInputElement).value;
  const latlngStr = input.split(",", 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1]),
  };

  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {
        map.setZoom(11);

        const marker = new google.maps.Marker({
          position: latlng,
          map: map,
        });

        infowindow.setContent(response.results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Note that in the previous example we showed the first result by selecting results[0]. The reverse geocoder often returns more than one result. Geocoded addresses are not just postal addresses, but any way to geographically name a location. For example, when geocoding a point in the city of Chicago, the geocoded point may be labeled as a street address, as the city (Chicago), as its state (Illinois) or as a country (The United States). All are addresses to the geocoder. The reverse geocoder returns all of these results.

The reverse geocoder matches political entities (countries, provinces, cities and neighborhoods), street addresses, and postal codes.

Here's an example of the list of addresses that the above query may return:


results[0].formatted_address: "277 Bedford Ave, Brooklyn, NY 11211, USA"
results[1].formatted_address: "Grand St/Bedford Av, Brooklyn, NY 11211, USA"
results[2].formatted_address: "Williamsburg, Brooklyn, NY, USA"
results[3].formatted_address: "Brooklyn, NY, USA"
results[4].formatted_address: "New York, NY, USA"
results[5].formatted_address: "Brooklyn, NY 11211, USA"
results[6].formatted_address: "Kings County, NY, USA"
results[7].formatted_address: "New York-Northern New Jersey-Long Island, NY-NJ-PA, USA"
results[8].formatted_address: "New York Metropolitan Area, USA"
results[9].formatted_address: "New York, USA"
Addresses are returned in the order of best to least matches. Generally, the more exact address is the most prominent result, as it is in this case. Note that we return different types of addresses, from the most specific street address to less specific political entities such as neighborhoods, cities, counties, states, etc. If you want to match a more general address, you may want to inspect the results[].types field.

Note: Reverse geocoding is not an exact science. The geocoder will attempt to find the closest addressable location within a certain tolerance.

Retrieving an Address for a Place ID
Supply a placeId to find the address for a given place ID. The place ID is a unique identifier that can be used with other Google APIs. For example, you can supply the placeId returned by the Roads API to get the address for a snapped point. For more information about place IDs, see the place ID overview.

When you supply a placeId, the request cannot contain any of the following fields:

address
latLng
location
componentRestrictions
The following example accepts a place ID, finds the corresponding address, and centers the map at that location. It also brings up an info window showing the formatted address of the relevant place:

TypeScript
JavaScript

// Initialize the map.
function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 8,
      center: { lat: 40.72, lng: -73.96 },
    }
  );
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  (document.getElementById("submit") as HTMLElement).addEventListener(
    "click",
    () => {
      geocodePlaceId(geocoder, map, infowindow);
    }
  );
}

// This function is called when the user clicks the UI button requesting
// a geocode of a place ID.
function geocodePlaceId(
  geocoder: google.maps.Geocoder,
  map: google.maps.Map,
  infowindow: google.maps.InfoWindow
) {
  const placeId = (document.getElementById("place-id") as HTMLInputElement)
    .value;

  geocoder
    .geocode({ placeId: placeId })
    .then(({ results }) => {
      if (results[0]) {
        map.setZoom(11);
        map.setCenter(results[0].geometry.location);

        const marker = new google.maps.Marker({
          map,
          position: results[0].geometry.location,
        });

        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;



Map color scheme

bookmark_border

For maps of type roadmap and terrain, you can set the map color scheme (dark, light, or current system setting) by using google.maps.colorScheme. The colorScheme option can only be set when the map is initialized; setting this option after the map is created will have no effect.

Roadmap
Terrain
The following image shows the light mode and dark mode color schemes for the roadmap type.

Two examples of the roadmap type map of Paris using the light mode and dark mode color schemes.

By default, the map uses light mode. When creating the map, import ColorScheme and specify the map color scheme (LIGHT, DARK, or FOLLOW_SYSTEM) in map options, as shown here.


const {ColorScheme} = await google.maps.importLibrary("core")

const mapOptions = {
  center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
  colorScheme: ColorScheme.DARK,
}
map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
If you reset the options after the map is instantiated, colorScheme has no effect.

To create custom light styles and dark styles for your roadmap map types, use cloud-based maps styling.



Map and Tile Coordinates

bookmark_border

Select platform: Android iOS JavaScript
The Maps JavaScript API uses the following coordinate systems:

Latitude and longitude values, which reference a point on the world uniquely. (Google uses the World Geodetic System WGS84 standard.)
World coordinates, which reference a point on the map uniquely.
Pixel coordinates, which reference a specific pixel on the map at a specific zoom level.
Tile coordinates, which reference a specific tile on the map at a specific zoom level.
World coordinates
Whenever the API needs to translate a location in the world to a location on a map, it first translates latitude and longitude values into a world coordinate. The API uses the Mercator projection to perform this translation.

For convenience in the calculation of pixel coordinates (see below) we assume a map at zoom level 0 is a single tile of the base tile size. We then define world coordinates relative to pixel coordinates at zoom level 0, using the projection to convert latitudes and longitudes to pixel positions on this base tile. This world coordinate is a floating point value measured from the origin of the map projection to the specific location. Note that since this value is a floating point value, it may be much more precise than the current resolution of the map image being shown. A world coordinate is independent of the current zoom level, in other words.

World coordinates in Google Maps are measured from the Mercator projection's origin (the northwest corner of the map at 180 degrees longitude and approximately 85 degrees latitude) and increase in the x direction towards the east (right) and increase in the y direction towards the south (down). Because the basic Mercator Google Maps tile is 256 x 256 pixels, the usable world coordinate space is {0-256}, {0-256}.



Note that a Mercator projection has a finite width longitudinally but an infinite height latitudinally. We cut off base map imagery utilizing the Mercator projection at approximately +/- 85 degrees to make the resulting map shape square, which allows easier logic for tile selection. Note that a projection may produce world coordinates outside the base map's usable coordinate space if you plot very near the poles, for example.

Pixel coordinates
Pixel coordinates reference a specific pixel on the map at a specific zoom level, whereas world coordinates reflect absolute locations on a given projection. Pixel coordinates are calculated using the following formula:


pixelCoordinate = worldCoordinate * 2zoomLevel
From the above equation, note that each increasing zoom level is twice as large in both the x and y directions. Therefore, each higher zoom level results in a resolution four times higher than the preceding level. For example, at zoom level 1, the map consists of 4 256x256 pixels tiles, resulting in a pixel space from 512x512. At zoom level 19, each x and y pixel on the map can be referenced using a value between 0 and 256 * 219.

Because we based world coordinates on the map's tile size, a pixel coordinate's integer part has the effect of identifying the exact pixel at that location in the current zoom level. Note that for zoom level 0, the pixel coordinates are equal to the world coordinates.

We now have a way to accurately denote each location on the map, at each zoom level. The Maps JavaScript API constructs a viewport given the zoom level center of the map (as a LatLng) and the size of the containing DOM element, and translates this bounding box into pixel coordinates. The API then determines logically all map tiles which lie within the given pixel bounds. Each of these map tiles are referenced using tile coordinates which greatly simplify the displaying of map imagery.

Tile coordinates
The API cannot load all the map imagery at once for the higher zoom levels. Instead, the API breaks up the imagery at each zoom level into a set of map tiles, which are logically arranged in an order which the application understands. When a map scrolls to a new location, or to a new zoom level, the API determines which tiles are needed using pixel coordinates, and translates those values into a set of tiles to retrieve. These tile coordinates are assigned using a scheme which makes it logically easy to determine which tile contains the imagery for any given point.

Tiles in Google Maps are numbered from the same origin as that for pixels. For Google's implementation of the Mercator projection, the origin tile is always at the northwest corner of the map, with x values increasing from west to east and y values increasing from north to south. Tiles are indexed using x,y coordinates from that origin. For example, at zoom level 2, when the earth is divided up into 16 tiles, each tile can be referenced by a unique x,y pair:

Map of the world divided into four rows and four columns of tiles.

Note that by dividing the pixel coordinates by the tile size (256) and taking the integer parts of the result, you produce as a by-product the tile coordinate at the current zoom level.

Example
The following example displays coordinates for Chicago, IL: latitude/longitude values, world coordinates, pixel coordinates, and tile coordinates. Use the zoom control to see the coordinate values at various zoom levels.


To see how the coordinates were calculated, view the code.

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

Markers (Legacy)

bookmark_border

Select platform: Android iOS JavaScript
As of February 21st, 2024 (v3.56), google.maps.Marker is deprecated. We encourage you to transition to the new google.maps.marker.AdvancedMarkerElement class. Advanced markers provide substantial improvements over the legacy google.maps.Marker class. The minimum version of the Maps JavaScript API with google.maps.marker.AdvancedMarkerElement is 3.53.2. At this time, google.maps.Marker is not scheduled to be discontinued.

Learn more

Introduction
A marker identifies a location on a map. By default, a marker uses a standard image. Markers can display custom images, in which case they are usually referred to as "icons." Markers and icons are objects of type Marker. You can set a custom icon within the marker's constructor, or by calling setIcon() on the marker. See more about customizing the marker image.

Broadly speaking, markers are a type of overlay. For information on other types of overlay, see Drawing on the map.

Markers are designed to be interactive. For example, by default they receive 'click' events, so you can add an event listener to bring up an info window displaying custom information. You can allow users to move a marker on the map by setting the marker's draggable property to true. For more information about draggable markers, see below.

Add a marker
The google.maps.Marker constructor takes a single Marker options object literal, specifying the initial properties of the marker.

The following fields are particularly important and commonly set when constructing a marker:

position (required) specifies a LatLng identifying the initial location of the marker. One way of retrieving a LatLng is by using the Geocoding service.
map (optional) specifies the Map on which to place the marker. If you do not specify the map on construction of the marker, the marker is created but is not attached to (or displayed on) the map. You may add the marker later by calling the marker's setMap() method.
The following example adds a simple marker to a map at Uluru, in the center of Australia:

TypeScript
JavaScript

function initMap(): void {
  const myLatLng = { lat: -25.363, lng: 131.044 };

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: myLatLng,
    }
  );

  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "Hello World!",
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
In the above example, the marker is placed on the map at construction of the marker using the map property in the marker options. Alternatively, you can add the marker to the map directly by using the marker's setMap() method, as shown in the example below:


var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
var mapOptions = {
  zoom: 4,
  center: myLatlng
}
var map = new google.maps.Map(document.getElementById("map"), mapOptions);

var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
});

// To add the marker to the map, call setMap();
marker.setMap(map);
The marker's title will appear as a tooltip.

If you do not wish to pass any Marker options in the marker's constructor, instead pass an empty object {} in the last argument of the constructor.

View example

Remove a marker
To remove a marker from the map, call the setMap() method passing null as the argument.


marker.setMap(null);
Note that the above method does not delete the marker. It removes the marker from the map. If instead you wish to delete the marker, you should remove it from the map, and then set the marker itself to null.

If you wish to manage a set of markers, you should create an array to hold the markers. Using this array, you can then call setMap() on each marker in the array in turn when you need to remove the markers. You can delete the markers by removing them from the map and then setting the array's length to 0, which removes all references to the markers.

View example

Customize a marker image
You can customize the visual appearance of markers by specifying an image file or vector-based icon to display instead of the default Google Maps pushpin icon. You can add text with a marker label, and use complex icons to define clickable regions, and set the stack order of markers.

Markers with image icons

In the most basic case, an icon can specify an image to use instead of the default Google Maps pushpin icon. To specify such an icon, set the marker's icon property to the URL of an image. The Maps JavaScript API will size the icon automatically.

TypeScript
JavaScript

// This example adds a marker to indicate the position of Bondi Beach in Sydney,
// Australia.
function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: -33, lng: 151 },
    }
  );

  const image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  const beachMarker = new google.maps.Marker({
    position: { lat: -33.89, lng: 151.274 },
    map,
    icon: image,
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Markers with vector-based icons
You can use custom SVG vector paths to define the visual appearance of markers. To do this, pass a Symbol object literal with the desired path to the marker's icon property. You can define a custom path using SVG path notation, or use one of the predefined paths in google.maps.SymbolPath. The anchor property is required in order for the marker to render correctly when the zoom level changes. Learn more about using Symbols to create vector-based icons for markers (and polylines).

TypeScript
JavaScript

// This example uses SVG path notation to add a vector-based symbol
// as the icon for a marker. The resulting icon is a marker-shaped
// symbol with a blue fill and no border.

function initMap(): void {
  const center = new google.maps.LatLng(-33.712451, 150.311823);
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 9,
      center: center,
    }
  );

  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 20),
  };

  new google.maps.Marker({
    position: map.getCenter(),
    icon: svgMarker,
    map: map,
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Marker labels

A marker label is a letter or number that appears inside a marker. The marker image in this section displays a marker label with the letter 'B' on it. You can specify a marker label as either a string or a MarkerLabel object that includes a string and other label properties.

When creating a marker, you can specify a label property in the MarkerOptions object. Alternatively, you can call setLabel() on the Marker object to set the label on an existing marker.

The following example displays labeled markers when the user clicks on the map:

TypeScript
JavaScript

// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let labelIndex = 0;

function initMap(): void {
  const bangalore = { lat: 12.97, lng: 77.59 };
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 12,
      center: bangalore,
    }
  );

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
  });

  // Add a marker at the center of the map.
  addMarker(bangalore, map);
}

// Adds a marker to the map.
function addMarker(location: google.maps.LatLngLiteral, map: google.maps.Map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map,
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Complex icons
You can specify complex shapes to indicate regions that are clickable, and specify how the icons should appear relative to other overlays (their "stack order"). Icons specified in this manner should set their icon properties to an object of type Icon.

Icon objects define an image. They also define the size of the icon, the origin of the icon (if the image you want is part of a larger image in a sprite, for example), and the anchor where the icon's hotspot should be located (which is based on the origin).

If you are using a label with a custom marker, you can position the label with the labelOrigin property in the Icon object.

Note: Marker shadows were removed in version 3.14 of the Maps JavaScript API. Any shadows specified programmatically will be ignored.
TypeScript
JavaScript

// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
// to the base of the flagpole.

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 10,
      center: { lat: -33.9, lng: 151.2 },
    }
  );

  setMarkers(map);
}

// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
const beaches: [string, number, number, number][] = [
  ["Bondi Beach", -33.890542, 151.274856, 4],
  ["Coogee Beach", -33.923036, 151.259052, 5],
  ["Cronulla Beach", -34.028249, 151.157507, 3],
  ["Manly Beach", -33.80010128657071, 151.28747820854187, 2],
  ["Maroubra Beach", -33.950198, 151.259302, 1],
];

function setMarkers(map: google.maps.Map) {
  // Adds markers to the map.

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  const image = {
    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32),
  };
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  const shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: "poly",
  };

  for (let i = 0; i < beaches.length; i++) {
    const beach = beaches[i];

    new google.maps.Marker({
      position: { lat: beach[1], lng: beach[2] },
      map,
      icon: image,
      shape: shape,
      title: beach[0],
      zIndex: beach[3],
    });
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Converting MarkerImage objects to type Icon 
Until version 3.10 of the Maps JavaScript API, complex icons were defined as MarkerImage objects. The Icon object literal was added in version 3.10, and replaces MarkerImage from version 3.11 onwards. Icon object literals support the same parameters as MarkerImage, allowing you to easily convert a MarkerImage to an Icon by removing the constructor, wrapping the previous parameters in {}'s, and adding the names of each parameter. For example:


var image = new google.maps.MarkerImage(
    place.icon,
    new google.maps.Size(71, 71),
    new google.maps.Point(0, 0),
    new google.maps.Point(17, 34),
    new google.maps.Size(25, 25));
becomes


var image = {
  url: place.icon,
  size: new google.maps.Size(71, 71),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(17, 34),
  scaledSize: new google.maps.Size(25, 25)
};
Optimize markers
Optimization enhances performance by rendering many markers as a single static element. This is useful in cases where a large number of markers is required. By default, the Maps JavaScript API will decide whether a marker will be optimized. When there is a large number of markers, the Maps JavaScript API will attempt to render markers with optimization. Not all Markers can be optimized; in some situations, the Maps JavaScript API may need to render Markers without optimization. Disable optimized rendering for animated GIFs or PNGs, or when each marker must be rendered as a separate DOM element. The following example shows creating an optimized marker:


var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!",
    optimized: true 
});
Learn more about optimization and best practices.
Make a marker accessible
You can make a marker accessible by adding a click listener event, and setting optimized to false. The click listener causes the marker to have button semantics, which can be accessed using keyboard navigation, screen readers, and so on. Use the title option to present accessible text for a marker.

In the following example, the first marker receives focus when tab is pressed; you can then use the arrow keys to move between markers. Press tab again to continue moving through the rest of the map controls. If a marker has an info window, you can open it by clicking the marker, or by pressing the enter key or space bar when the marker is selected. When the info window closes, focus will return to the associated marker.

TypeScript
JavaScript

// The following example creates five accessible and
// focusable markers.

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 12,
      center: { lat: 34.84555, lng: -111.8035 },
    }
  );

  // Set LatLng and title text for the markers. The first marker (Boynton Pass)
  // receives the initial focus when tab is pressed. Use arrow keys to
  // move between markers; press tab again to cycle through the map controls.
  const tourStops: [google.maps.LatLngLiteral, string][] = [
    [{ lat: 34.8791806, lng: -111.8265049 }, "Boynton Pass"],
    [{ lat: 34.8559195, lng: -111.7988186 }, "Airport Mesa"],
    [{ lat: 34.832149, lng: -111.7695277 }, "Chapel of the Holy Cross"],
    [{ lat: 34.823736, lng: -111.8001857 }, "Red Rock Crossing"],
    [{ lat: 34.800326, lng: -111.7665047 }, "Bell Rock"],
  ];

  // Create an info window to share between markers.
  const infoWindow = new google.maps.InfoWindow();

  // Create the markers.
  tourStops.forEach(([position, title], i) => {
    const marker = new google.maps.Marker({
      position,
      map,
      title: `${i + 1}. ${title}`,
      label: `${i + 1}`,
      optimized: false,
    });

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(marker.getTitle());
      infoWindow.open(marker.getMap(), marker);
    });
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Animate a marker
You can animate markers so that they exhibit dynamic movement in a variety of different circumstances. To specify the way a marker is animated, use the marker's animation property, of type google.maps.Animation. The following Animation values are supported:

DROP indicates that the marker should drop from the top of the map to its final location when first placed on the map. Animation will cease once the marker comes to rest and animation will revert to null. This type of animation is usually specified during creation of the Marker.
BOUNCE indicates that the marker should bounce in place. A bouncing marker will continue bouncing until its animation property is explicitly set to null.
You may initiate an animation on an existing marker by calling setAnimation() on the Marker object.

TypeScript
JavaScript

// The following example creates a marker in Stockholm, Sweden using a DROP
// animation. Clicking on the marker will toggle the animation between a BOUNCE
// animation and no animation.

let marker: google.maps.Marker;

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 13,
      center: { lat: 59.325, lng: 18.07 },
    }
  );

  marker = new google.maps.Marker({
    map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: { lat: 59.327, lng: 18.067 },
  });
  marker.addListener("click", toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
If you have many markers, you might not want to drop them on the map all at once. You can make use of setTimeout() to space your markers' animations using a pattern like that shown below:


function drop() {
  for (var i =0; i < markerArray.length; i++) {
    setTimeout(function() {
      addMarkerMethod();
    }, i * 200);
  }
}
View example

Make a marker draggable
To allow users to drag a marker to a different location on the map, set draggable to true in the marker options.


var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
var mapOptions = {
  zoom: 4,
  center: myLatlng
}
var map = new google.maps.Map(document.getElementById("map"), mapOptions);

// Place a draggable marker on the map
var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    draggable:true,
    title:"Drag me!"
});


Data Layer

bookmark_border

Select platform: Android iOS JavaScript
The Google Maps Data layer provides a container for arbitrary geospatial data. You can use the Data layer to store your custom data, or to display GeoJSON data on a Google map.

Overview
Watch this DevBytes video to learn more about the Data Layer.


With the Maps JavaScript API you can mark up a map with a variety of overlays, such as markers, polylines, polygons, etc. Each of these annotations combines styling information with location data. The google.maps.Data class is a container for arbitrary geospatial data. Instead of adding these overlays, you can use the Data layer to add arbitrary geographical data to your map. If that data contains geometries, such as points, lines or polygons, the API will render these by default as markers, polylines and polygons. You can style these features as you would a normal overlay, or apply styling rules based on other properties contained in your data set.

The google.maps.Data class allows you to:

Draw polygons on your map.
Add GeoJSON data to your map.
GeoJSON is a standard for geospatial data on the internet. The Data class follows the structure of GeoJSON in its data representation and makes it easy to display GeoJSON data. Use the loadGeoJson() method to easily import GeoJSON data and display points, line-strings and polygons.
Use google.maps.Data to model arbitrary data.
Most real-world entities have other properties associated with them. For example, stores have opening hours, roads have traffic speed, and each Girl Guide troupe has cookie-selling turf. With google.maps.Data, you can model these properties, and style your data accordingly.
Choose how your data is represented, and change your mind on the fly.
The Data layer lets you make decisions about the visualization and interaction of your data. For example, when looking at a map of convenience stores you might choose to display only those stores that sell transit tickets.
Draw a polygon
The Data.Polygon class handles polygon winding for you. You can pass it an array of one or more linear rings, defined as latitude/longitude coordinates. The first linear ring defines the outer boundary of the polygon. If you pass more than one linear ring, the second and subsequent linear rings are used to define inner paths (holes) in the polygon.

The following example creates a rectangular polygon with two holes in it:

TypeScript
JavaScript

// This example uses the Google Maps JavaScript API's Data layer
// to create a rectangular polygon with 2 holes in it.

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 6,
      center: { lat: -33.872, lng: 151.252 },
    }
  );

  // Define the LatLng coordinates for the outer path.
  const outerCoords = [
    { lat: -32.364, lng: 153.207 }, // north west
    { lat: -35.364, lng: 153.207 }, // south west
    { lat: -35.364, lng: 158.207 }, // south east
    { lat: -32.364, lng: 158.207 }, // north east
  ];

  // Define the LatLng coordinates for an inner path.
  const innerCoords1 = [
    { lat: -33.364, lng: 154.207 },
    { lat: -34.364, lng: 154.207 },
    { lat: -34.364, lng: 155.207 },
    { lat: -33.364, lng: 155.207 },
  ];

  // Define the LatLng coordinates for another inner path.
  const innerCoords2 = [
    { lat: -33.364, lng: 156.207 },
    { lat: -34.364, lng: 156.207 },
    { lat: -34.364, lng: 157.207 },
    { lat: -33.364, lng: 157.207 },
  ];

  map.data.add({
    geometry: new google.maps.Data.Polygon([
      outerCoords,
      innerCoords1,
      innerCoords2,
    ]),
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
Load GeoJSON
GeoJSON is a common standard for sharing geospatial data on the internet. It is lightweight and easily human-readable, making it ideal for sharing and collaborating. With the Data layer, you can add GeoJSON data to a Google map in just one line of code.


map.data.loadGeoJson('google.json');
Every map has a map.data object, which acts as a data layer for arbitrary geospatial data, including GeoJSON. You can load and display a GeoJSON file by calling the loadGeoJSON() method of the data object. The below example shows how to add a map and load external GeoJSON data.

TypeScript
JavaScript

let map: google.maps.Map;

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 4,
    center: { lat: -28, lng: 137 },
  });

  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  map.data.loadGeoJson(
    "https://storage.googleapis.com/mapsdevsite/json/google.json"
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
Note: Read the guide on using TypeScript and Google Maps.
View example
Try Sample 
JSFiddle.net
Google Cloud Shell
Sample GeoJSON
Most of the examples on this page use a common GeoJSON file. This file defines the six characters in ‘Google’ as polygons over Australia. Please feel free to copy or modify this file as you test out the Data layer.

Note: In order to load a json file from another domain, that domain must have enabled Cross-origin resource sharing.

The full text of the file can be seen below by expanding the small arrow next to the words google.json.

google.json
Style GeoJSON Data
Use the Data.setStyle() method to specify how your data should look. The setStyle() method takes either a StyleOptions object literal, or a function that computes the style for each feature.

Simple style rules
The simplest way to style features is to pass a StyleOptions object literal to setStyle(). This will set a single style for each feature in your collection. Note that each feature type is only able to render a subset of the available options. This means that its possible to combine styles for different feature types in a single object literal. For example, the below snippet sets both a custom icon, which only affects point geometries, and fillColor, which only affects polygons.


map.data.setStyle({
  icon: '//example.com/path/to/image.png',
  fillColor: 'green'
});
More information on valid style/feature combinations can be found in Style Options.

Below is an example of setting the stroke and fill color for several features using a StyleOptions object literal. Notice that each polygon is styled the same.



// Set the stroke width, and fill color for each polygon
map.data.setStyle({
  fillColor: 'green',
  strokeWeight: 1
});
Declarative style rules
If you want to update the style of a large number of overlays, such as markers or polylines, you typically have to iterate through each overlay on your map and set its style individually. With the Data layer, you can set rules declaratively and they will be applied across your entire data set. When either the data, or the rules, are updated, the styling will be automatically applied to every feature. You can use a features properties to customize its style.

For example, the below code sets the color of each character in our google.json by examining its position in the ascii character set. In this case we’ve encoded the character position along with our data.


// Color Capital letters blue, and lower case letters red.
// Capital letters are represented in ascii by values less than 91
map.data.setStyle(function(feature) {
    var ascii = feature.getProperty('ascii');
    var color = ascii > 91 ? 'red' : 'blue';
    return {
      fillColor: color,
      strokeWeight: 1
    };
});
Remove styles
If you’d like to remove any applied styles, pass an empty object literal to the setStyles() method.


// Remove custom styles.
map.data.setStyle({});
This will remove any custom styles that you’ve specified, and the features will render using the default styles. If you’d instead like to no longer render the features, set the visible property of StyleOptions to false.


// Hide the Data layer.
map.data.setStyle({visible: false});
Override default styles
Styling rules are typically applied to every feature in the Data layer. However, there are times when you’d like to apply special styling rules to specific features. For example, as a way to highlight a feature on click.

To apply special styling rules, use the overrideStyle() method. Any properties that you change with the overrideStyle() method are applied in addition to the global styles already specified in setStyle(). For example, the below code will change the fill color of a polygon on click, but will not set any other styles.


// Set the global styles.
map.data.setStyle({
  fillColor: 'green',
  strokeWeight: 3
});

// Set the fill color to red when the feature is clicked.
// Stroke weight remains 3.
map.data.addListener('click', function(event) {
   map.data.overrideStyle(event.feature, {fillColor: 'red'});
});
Call the revertStyle() method to remove all style overrides.

Style options
The options available for styling each feature depend upon the feature type. For example, fillColor will only render on polygon geometries, while icon will only appear on a point geometry. More information is available in the reference documentation for StyleOptions.

Available on all geometries

clickable: If true, the feature receives mouse and touch events
visible: If true, the feature is visible.
zIndex: All features are displayed on the map in order of their zIndex, with higher values displaying in front of features with lower values. Markers are always displayed in front of line-strings and polygons.
Available on point geometries

cursor: Mouse cursor to show on hover.
icon: Icon to show for the point geometry.
shape: Defines the image map used for hit detection.
title: Rollover text.
Available on line geometries

strokeColor: The stroke color. All CSS3 colors are supported except for extended named colors.
strokeOpacity: The stroke opacity between 0.0 and 1.0.
strokeWeight: The stroke width in pixels.
Available on polygon geometries

fillColor: The fill color. All CSS3 colors are supported except for extended named colors.
fillOpacity: The fill opacity between 0.0 and 1.0.
strokeColor: The stroke color. All CSS3 colors are supported except for extended named colors.
strokeOpacity: The stroke opacity between 0.0 and 1.0.
strokeWeight: The stroke width in pixels.
Add Event Handlers
Features respond to events, such as mouseup or mousedown. You can add event listeners to allow users to interact with the data on the map. In the below example, we add a mouseover event, that displays information about the feature under the mouse cursor.



// Set mouseover event for each feature.
map.data.addListener('mouseover', function(event) {
  document.getElementById('info-box').textContent =
      event.feature.getProperty('letter');
});
Data layer events
The following events are common to all features, regardless of their geometry type:

addfeature
click
dblclick
mousedown
mouseout
mouseover
mouseup
removefeature
removeproperty
rightclick
setgeometry
setproperty
More information about these events can be found in the reference documentation for the google.maps.data class.

Change Appearance Dynamically
You can set the style of the Data layer by passing a function that computes the style of each feature to the google.maps.data.setStyle() method. This function will be called each time a feature’s properties are updated.

In the below example, we add an event listener for the click event that updates the feature’s isColorful property. The feature styling is updated to reflect the change as soon as the property is set.



// Color each letter gray. Change the color when the isColorful property
// is set to true.
map.data.setStyle(function(feature) {
  var color = 'gray';
  if (feature.getProperty('isColorful')) {
    color = feature.getProperty('color');
  }
  return /** @type {!google.maps.Data.StyleOptions} */({
    fillColor: color,
    strokeColor: color,
    strokeWeight: 2
  });
});

// When the user clicks, set 'isColorful', changing the color of the letters.
map.data.addListener('click', function(event) {
  event.feature.setProperty('isColorful', true);
});

// When the user hovers, tempt them to click by outlining the letters.
// Call revertStyle() to remove all overrides. This will use the style rules
// defined in the function passed to setStyle()
map.data.addListener('mouseover', function(event) {
  map.data.revertStyle();
  map.data.overrideStyle(event.feature, {strokeWeight: 8});
});

map.data.addListener('mouseout', function(event) {
  map.data.revertStyle();
});


KML and GeoRSS Layers

bookmark_border

Select platform: Android iOS JavaScript
The KmlLayer renders KML and GeoRSS elements into a Maps JavaScript API tile overlay.

Overview
The Maps JavaScript API supports the KML and GeoRSS data formats for displaying geographic information. These data formats are displayed on a map using a KmlLayer object, whose constructor takes the URL of a publicly accessible KML or GeoRSS file.

Note: The KmlLayer class that generates KML overlays in the Maps JavaScript API uses a Google hosted service to retrieve and parse KML files for rendering. Consequently, it is only possible to display KML files if they are hosted at a publicly accessible URL that does not require authentication to access.

If you require access to private files, fine-grained control over caches, or send the browser viewport to a geospatial data server as a query parameter, we recommend using data layers instead of KmlLayer. This will direct your users' browsers to directly request resources from your web server.

The Maps JavaScript API converts the provided geographic XML data into a KML representation which is displayed on the map using a Maps JavaScript API tile overlay. This KML looks (and somewhat behaves) like familiar Maps JavaScript API overlay elements. KML <Placemark> and GeoRSS point elements are rendered as markers, for example, <LineString> elements are rendered as polylines and <Polygon> elements are rendered as polygons. Similarly, <GroundOverlay> elements are rendered as rectangular images on the map. Importantly, however, these objects are not Maps JavaScript API Markers, Polylines, Polygons or GroundOverlays; instead, they are rendered into a single object on the map.

KmlLayer objects appear on a map once their map property has been set. You can remove them from the map by calling setMap() passing null. The KmlLayer object manages the rendering of these child elements by automatically retrieving appropriate features for the map’s given bounds. As the bounds change, features in the current viewport are automatically rendered.

Because the components within a KmlLayer are rendered on demand, the layer allows you to easily manage the rendering of thousands of markers, polylines, and polygons. Note that you can’t access these constituent objects directly, though they each provide click events which return data on those individual objects.

KML layer options
The KmlLayer() constructor optionally passes a number of KmlLayerOptions:

map specifies the Map on which to render the KmlLayer. You can hide a KmlLayer by setting this value to null within the setMap() method.
preserveViewport specifies that the map should not be adjusted to the bounds of the KmlLayer’s contents when showing the layer. By default, when displaying a KmlLayer, the map is zoomed and positioned to show the entirety of the layer’s contents.
suppressInfoWindows indicates that clickable features within the KmlLayer should not trigger the display of InfoWindow objects.
Additionally, once the KmlLayer is rendered, it contains an immutable metadata property containing the layer’s name, description, snippet and author within a KmlLayerMetadata object literal. You can inspect this information using the getMetadata() method. Because rendering of KmlLayer objects requires asynchronous communication to an external server, you will want to listen for the metadata_changed event, which will indicate that the property has been populated.

The following example constructs a KmlLayer from the given GeoRSS feed:


TypeScript
JavaScript
CSS
HTML

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: 49.496675, lng: -102.65625 },
    }
  );

  const georssLayer = new google.maps.KmlLayer({
    url:
      "http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss",
  });
  georssLayer.setMap(map);
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
The following example constructs a KmlLayer from the given KML feed:


TypeScript
JavaScript
CSS
HTML

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 11,
      center: { lat: 41.876, lng: -87.624 },
    }
  );

  const ctaLayer = new google.maps.KmlLayer({
    url: "https://googlearchive.github.io/js-v2-samples/ggeoxml/cta.kml",
    map: map,
  });
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
KML feature details
Because KML may include a large number of features, you may not access feature data from the KmlLayer object directly. Instead, as features are displayed, they are rendered to look like clickable Maps JavaScript API overlays. Clicking on individual features, by default, brings up an InfoWindow containing KML <title> and <description> information on the given feature. Additionally, a click on a KML feature generates a KmlMouseEvent, which passes the following information:

position indicates the latitude/longitude coordinates at which to anchor the InfoWindow for this KML feature. This position is generally the clicked location for polygons, polylines, and GroundOverlays, but the true origin for markers.
pixelOffset indicates the offset from the above position to anchor the InfoWindow “tail.” For polygonal objects, this offset is typically 0,0 but for markers includes the height of the marker.
featureData contains a JSON structure of KmlFeatureData.
A sample KmlFeatureData object is shown below:


{
  author: {
    email: "nobody@google.com",
    name: "Mr Nobody",
    uri: "http://example.com"
  },
  description: "description",
  id: "id",
  infoWindowHtml: "html",
  name: "name",
  snippet: "snippet"
}
The following example displays KML feature <Description> text within a side <div> when the feature is clicked:


TypeScript
JavaScript
CSS
HTML

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 12,
      center: { lat: 37.06, lng: -95.68 },
    }
  );

  const kmlLayer = new google.maps.KmlLayer({
    url: "https://raw.githubusercontent.com/googlearchive/kml-samples/gh-pages/kml/Placemark/placemark.kml",
    suppressInfoWindows: true,
    map: map,
  });

  kmlLayer.addListener("click", (kmlEvent) => {
    const text = kmlEvent.featureData.description;

    showInContentWindow(text);
  });

  function showInContentWindow(text: string) {
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    sidebar.innerHTML = text;
  }
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
Size and complexity restrictions for KML rendering
The Maps JavaScript API has limitations to the size and complexity of loaded KML files. Below is a summary of the current limits.

Note: These limits are subject to change at any time.

Maximum fetched file size (raw KML, raw GeoRSS, or compressed KMZ)
3MB
Maximum uncompressed KML file size
10MB
Maximum uncompressed image file size in KMZ files
500KB per file
Maximum number of network Links
10
Maximum number of total document-wide features
1,000 1,000 
Number of KML layers
There is a limit on the number of KML Layers that can be displayed on a single Google Map. If you exceed this limit, none of your layers will appear on the map, and an error will be reported in your web browser's JavaScript console. The limit is based on a combination of the number of KmlLayer classes created and the total length of all the URLs used to create those layers. Each new KmlLayer you create will take up a portion of the limit for the layer and a further portion of the limit depending on the length of the URL where the KML file was loaded from. Consequently, the number of layers you can add will vary by application; on average, you should be able to load between 10 and 20 layers without hitting the limit. If you still hit the limit, use a URL shortener to shorten the KML URLs. Alternatively, create a single KML file consisting of NetworkLinks to the individual KML URLs.
Performance and caching considerations
Google's servers will temporarily cache KML files to reduce load on your servers. This will also improve performance for your users by serving a space-efficient representation of appropriate segments your KML file, as your users click on, pan and zoom the map.

For best performance, we recommend that you:

Use an appropriate <expires> tag in KML.

KmlLayer will not use HTTP headers when deciding how to cache KML files.
Don't generate files dynamically at request time.

Instead, generate the files before they will be needed, and serve them statically. If it takes a long time for your server to transmit the KML file, the KmlLayer may not display.
Don't attempt to bypass caches unless you know definitively that your file was updated.

Always bypassing caches (for example, by appending a random number or the user's clock time as a query parameter) can easily cause your servers to be overwhelmed if your site suddenly gets popular, and you are serving large KML files.

It can also cause the cache to serve stale data to users, if any user's clock is incorrect, and the <expires> tag has not been set correctly.

Instead, publish updated static files with a new, discrete revision number, and use server-side code to dynamically update the URL passed to KmlLayer with the current version.
Limit changes to your KML files to once per minute.

If all files total more than 1MB in size (uncompressed), limit changes to once per 5 minutes.
When using a geospatial data server, avoid using query parameters to limit the viewport of layers.

Instead, you can limit the map viewport with the bounds_changed event. Users will only be sent features that can be displayed automatically.

If there is a large amount of data in your geospatial data server, consider using data layers instead.
When using a geospatial data server, use multiple KmlLayers for each group of features that you wish to permit users to toggle, rather than a single KmlLayer with different query parameters.
Use compressed KMZ files to reduce file size.
If you are using Google Cloud Storage or another cloud storage solution, avoid using features like Signed URLs or temporary tokens to enforce access controls. These can unintentionally prevent caching.
Reduce the precision of all points to an appropriate precision.
Merge and simplify the geometry of similar features, such as polygons and polylines.
Remove any unused elements or image resources.
Remove any unsupported elements.
If you need to access private data, prevent caching, or send the browser viewport to a geospatial data server as a query parameter, we recommend using data layers instead of KmlLayer. This will direct your users' browsers to directly request resources from your web server.

Supported KML elements
The Maps JavaScript API supports the following KML elements. The KML parser generally silently ignores XML tags it does not understand.

Placemarks
Icons
Folders
Descriptive HTML—Entity replacement via <BalloonStyle> and <text>
KMZ (compressed KML, including attached images)
Polylines and polygons
Styles for polylines and polygons, including color, fill, and opacity
Network links to import data dynamically
Ground overlays and screen overlays
The following table gives full details of the supported KML elements.

KML element	Supported in the API?	Comment
<address> <address> 	no	
<AddressDetails> <AddressDetails> 	no	
<Alias> <Alias> 	N/A	<Model> is not supported
<altitude> <altitude> 	no	
<altitudeMode>	no	
<atom:author> <atom:author> 	yes	
<atom:link> <atom:link> 	yes	
<atom:name> <atom:name> 	yes	
<BalloonStyle> <BalloonStyle> 	partially	only <text> is supported
<begin> <begin> 	N/A	<TimeSpan> is not supported
<bgColor> <bgColor> 	no	
<bottomFov>	N/A	<PhotoOverlay> is not supported
<Camera> <Camera> 	no	
<Change> <Change> 	partially	only style changes are supported
<color> <color> 	partially	includes #AABBGGRR and #BBGGRR; not supported in <IconStyle>, <ScreenOverlay>, and <GroundOverlay>
<colorMode> <colorMode> 	no	
<cookie>	no	
<coordinates> <coordinates> 	yes	
<Create> <Create> 	no	
<Data> <Data> 	yes	
<Delete> <Delete> 	no	
<description>	yes	HTML content is allowed but is sanitized to protect from cross-browser attacks. Entity replacements of the form $[dataName] are not supported.
<displayMode> <displayMode> 	no	
<displayName> <DisplayName> 	no	
<Document> <Document> 	partially	implicitly, children are supported; no effect as child of other Features
<drawOrder> <drawOrder> 	no	
<east> <east> 	yes	
<end>	N/A	<TimeSpan> is not supported
<expires>	yes	see Summary section for details
<ExtendedData> <ExtendedData> 	partially	untyped <Data> only, no <SimpleData> or <Schema>, and entity replacements of the form $[dataName] are not supported.
<extrude> <extrude> 	no	
<fill> <fill> 	yes	
<flyToView> <flyToView> 	no	
<Folder> <Folder> 	yes	
<geomColor>	no	deprecated
<GeometryCollection>	no	deprecated
<geomScale>	no	deprecated
<gridOrigin> <gridOrigin> 	N/A	<PhotoOverlay> is not supported
<GroundOverlay> <GroundOverlay> 	yes	cannot be rotated
<h> <h> 	yes	deprecated
<heading> <heading> 	yes	
hint	yes	target=... supported
<hotSpot> <hotSpot> 	yes	
<href> <href> 	yes	
<httpQuery> <httpQuery> 	no	
<Icon>	yes	cannot be rotated
<IconStyle>	yes	
<ImagePyramid> <ImagePyramid> 	N/A	<PhotoOverlay> is not supported
<innerBoundaryIs> <innerBoundaryIs> 	yes	implicitly from <LinearRing> order
<ItemIcon> <ItemIcon> 	N/A	<ListStyle> is not supported
<key> <key> 	N/A	<StyleMap> is not supported
<kml> <kml> 	yes	
<labelColor>	no	deprecated
<LabelStyle>	no	
<latitude> <latitude> 	yes	
<LatLonAltBox> <LatLonAltBox> 	yes	
<LatLonBox> <LatLonBox> 	yes	
<leftFov> <Leftfov> 	N/A	<PhotoOverlay> is not supported
<LinearRing> <LinearRing> 	yes	
<LineString> <Linestring> 	yes	
<LineStyle>	yes	
<Link> <Link> 	yes	
<linkDescription> <linkDescription> 	no	
<linkName> <linkName> 	no	
<linkSnippet> <linkSnippet> 	no	
<listItemType> <listItemType> 	N/A	<ListStyle> is not supported
<ListStyle>	no	
<Location> <Location> 	N/A	<Model> is not supported
<Lod> <Lod> 	yes	
<longitude> <longitude> 	yes	
<LookAt>	no	
<maxAltitude> <maxAltitude> 	yes	
<maxFadeExtent> <maxFadeExtent> 	yes	
<maxHeight> <maxHeight> 	N/A	<PhotoOverlay> is not supported
<maxLodPixels> <maxLodPixels> 	yes	
<maxSessionLength>	no	
<maxWidth> <maxWidth> 	N/A	<PhotoOverlay> is not supported
<message> <message> 	no	
<Metadata> <Metadata> 	no	deprecated
<minAltitude>	yes	
<minFadeExtent> <minFadeExtent> 	yes	
<minLodPixels> <minLodPixels> 	yes	
<minRefreshPeriod> <minRefreshPeriod> 	no	<NetworkLink> <NetworkLink> 
<Model> <Model> 	no	
<MultiGeometry> <MultiGeometry> 	partially	rendered but displayed as separate features in left side panel
<name> <name> 	yes	
<near> <near> 	N/A	<PhotoOverlay> is not supported
<NetworkLink>	yes	 
<NetworkLinkControl> <NetworkLinkControl> 	partially	<Update> and <expires> partially supported. The API ignores expiration settings in the HTTP headers but does use the expiration settings specified in KML. In the absence of expiration settings, or within the time validity interval, Google Maps may cache data fetched from the Internet for unspecified durations. A refetch of the data from the Internet can be forced by renaming the document and fetching it under a different URL, or by making sure that the document contains appropriate expiration settings.
<north> <north> 	yes	
<open> <open> 	yes	
<Orientation> <Orientation> 	N/A	<Model> is not supported
<outerBoundaryIs>	yes	implicitly from <LinearRing> order
<outline>	yes	
<overlayXY> <overlayXY> 	no	
<Pair> <pair> 	N/A	<StyleMap> is not supported
<phoneNumber> <phonenumber> 	no	
<PhotoOverlay> <PhotoOverlay> 	no	
<Placemark>	yes	
<Point> <Point> 	yes	
<Polygon> <Polygon> 	yes	
<PolyStyle>	yes	
<range> <range> 	yes	
<refreshInterval> <refreshInterval> 	partially	<Link> only; not in <Icon>
<refreshMode> <refreshMode> 	yes	HTTP headers not supported for "onExpire" mode. See notes on <Update> and <expires> above.
<refreshVisibility>	no	
<Region> <Region> 	yes	
<ResourceMap> <ResourceMap> 	N/A	<Model> is not supported
<rightFov> <rightFov> 	N/A	<PhotoOverlay> is not supported
<roll> <roll> 	N/A	<Camera> and <Model> are not supported
<rotation> <rotation> 	no	
<rotationXY> <rotationXY> 	no	
<Scale>	N/A	<Model> is not supported
<scale>	no	
<Schema> <Schema> 	no	
<SchemaData>	no	
<ScreenOverlay> <ScreenOverlay> 	yes	cannot be rotated
<screenXY> <screenXY> 	no	
<shape> <shape> 	N/A	<PhotoOverlay> is not supported
<SimpleData> <Simpledata> 	N/A	<SchemaData> are not supported
<SimpleField> <SimpleField> 	N/A	<Schema> are not supported
<size>	yes	
<Snippet>	yes	
<south>	yes	
<state>	N/A	<ListStyle> is not supported
<Style> <Style> 	yes	
<StyleMap> <StyleMap> 	no	rollover (highlight) effects are not supported
<styleUrl> <styleUrl> 	N/A	<StyleMap> is not supported
<targetHref> <targetHref> 	partially	supported in <Update>, not in <Alias>
<tessellate> <tessellate> 	no	
<text>	yes	replacement of $[geDirections] is not supported
<textColor>	no	
<tileSize>	N/A	<PhotoOverlay> is not supported
<tilt> <tilt> 	no	
<TimeSpan> <TimeSpan> 	no	
<TimeStamp> <TimeStamp> 	no	
<topFov> <topFov> 	N/A	<PhotoOverlay> is not supported
<Update> <Update> 	partially	only style changes, not <Create> or <Delete>
<Url> <Url> 	yes	deprecated
<value> <value> 	yes	
<viewBoundScale> <viewBoundScale> 	no	
<viewFormat> <viewFormat> 	no	
<viewRefreshMode> <viewRefreshMode> 	partially	"onStop" is supported
<viewRefreshTime>	yes	
<ViewVolume> <ViewVolume> 	N/A	<PhotoOverlay> is not supported
<visibility>	partially	yes on <Folder> - child placemarks inherit their visibility
<w> <w> 	yes	deprecated
<west> <west> 	yes	
<when> <when> 	N/A	<TimeStamp> is not supported
<width>	yes	
<x> <x> 	yes	deprecated
<y> <y> 	yes	deprecated


Navigation Functions (Heading)

bookmark_border

This example demonstrates computing the heading between two coordinates using the Geometry library. Drag the markers on the map to see the origin, destination and heading change accordingly.

Read the documentation.


TypeScript
JavaScript
CSS
HTML

// This example requires the Geometry library. Include the libraries=geometry
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry">

let marker1: google.maps.Marker, marker2: google.maps.Marker;
let poly: google.maps.Polyline, geodesicPoly: google.maps.Polyline;

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: { lat: 34, lng: -40.605 },
    }
  );

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    document.getElementById("info") as HTMLElement
  );

  marker1 = new google.maps.Marker({
    map,
    draggable: true,
    position: { lat: 40.714, lng: -74.006 },
  });

  marker2 = new google.maps.Marker({
    map,
    draggable: true,
    position: { lat: 48.857, lng: 2.352 },
  });

  const bounds = new google.maps.LatLngBounds(
    marker1.getPosition() as google.maps.LatLng,
    marker2.getPosition() as google.maps.LatLng
  );

  map.fitBounds(bounds);

  google.maps.event.addListener(marker1, "position_changed", update);
  google.maps.event.addListener(marker2, "position_changed", update);

  poly = new google.maps.Polyline({
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
    map: map,
  });

  geodesicPoly = new google.maps.Polyline({
    strokeColor: "#CC0099",
    strokeOpacity: 1.0,
    strokeWeight: 3,
    geodesic: true,
    map: map,
  });

  update();
}

function update() {
  const path = [
    marker1.getPosition() as google.maps.LatLng,
    marker2.getPosition() as google.maps.LatLng,
  ];

  poly.setPath(path);
  geodesicPoly.setPath(path);

  const heading = google.maps.geometry.spherical.computeHeading(
    path[0],
    path[1]
  );

  (document.getElementById("heading") as HTMLInputElement).value =
    String(heading);
  (document.getElementById("origin") as HTMLInputElement).value = String(
    path[0]
  );
  (document.getElementById("destination") as HTMLInputElement).value = String(
    path[1]
  );
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
Clone Sample
Git and Node.js are required to run this sample locally. Follow these instructions to install Node.js and NPM. The following commands clone, install dependencies and start the sample application.


  git clone -b sample-geometry-headings https://github.com/googlemaps/js-samples.git
  cd js-samples
  npm i
  npm start
Other samples can be tried by switching to any branch beginning with sample-SAMPLE_NAME.


  git checkout sample-SAMPLE_NAME
  npm i
  npm start