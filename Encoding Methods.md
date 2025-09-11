Encoding Methods

bookmark_border

This example demonstrates path encoding using the Geometry library. Click the map to create a polyline. The encoding of this polyline then appears in the text box.

Read the documentation.


TypeScript
JavaScript
CSS
HTML

// This example requires the Geometry library. Include the libraries=geometry
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry">

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 14,
      center: { lat: 34.366, lng: -89.519 },
    }
  );
  const poly = new google.maps.Polyline({
    strokeColor: "#000000",
    strokeOpacity: 1,
    strokeWeight: 3,
    map: map,
  });

  // Add a listener for the click event
  google.maps.event.addListener(map, "click", (event) => {
    addLatLngToPoly(event.latLng, poly);
  });
}

/**
 * Handles click events on a map, and adds a new point to the Polyline.
 * Updates the encoding text area with the path's encoded values.
 */
function addLatLngToPoly(
  latLng: google.maps.LatLng,
  poly: google.maps.Polyline
) {
  const path = poly.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear
  path.push(latLng);

  // Update the text field to display the polyline encodings
  const encodeString = google.maps.geometry.encoding.encodePath(path);

  if (encodeString) {
    (document.getElementById("encoded-polyline") as HTMLInputElement).value =
      encodeString;
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;



Address Validation

bookmark_border
Use this demo to try the Address Validation API using any address from a supported region. The demo takes address components as input, and displays the validation response below. To parse an unstructured address, enter the entire address in the Street Address 1 field. Select example addresses from the drop-down at the top of the form.

Read the documentation.


TypeScript
JavaScript
CSS
HTML

// DOM Refs
const addressForm = document.getElementById('address-form');
const validateButton = document.getElementById('validate-button');
const clearFormButton = document.getElementById('clear-form-button');
const resultDisplay = document.getElementById('result-display');
const loadingText = document.getElementById('loading-text');
// Input field refs
const streetAddress1Input = document.getElementById('street-address-1') as HTMLInputElement;
const streetAddress2Input = document.getElementById('street-address-2') as HTMLInputElement;
const cityInput = document.getElementById('city') as HTMLInputElement;
const stateInput = document.getElementById('state') as HTMLInputElement;
const zipCodeInput = document.getElementById('zip-code') as HTMLInputElement;
const regionSelect = document.getElementById('region-select') as HTMLSelectElement;
const exampleSelect = document.getElementById('example-select') as HTMLSelectElement;

// Core Initialization
async function init() {
  // Load the Address Validation library.
  await google.maps.importLibrary('addressValidation');
  // Set event listeners
  addressForm!.addEventListener('submit', handleValidationSubmit);
  exampleSelect!.addEventListener('change', handleExampleSelectChange);
  clearFormButton!.addEventListener('click', handleClearForm);
}

// Validation Handler
async function handleValidationSubmit(event) {
  event.preventDefault();  // Prevent default form submission
  resultDisplay!.textContent = 'Validating...';  // Clear previous results

  // Validate the address
  try {
    //@ts-ignore
    const result = await google.maps.addressValidation.AddressValidation.fetchAddressValidation({
      address: {
        regionCode: regionSelect!.value.trim(),
        languageCode: 'en',
        addressLines: [
          streetAddress1Input!.value.trim(),
          streetAddress2Input!.value.trim()
        ].filter(line => line),  // Filter out empty lines
        locality: cityInput!.value.trim(),
        administrativeArea: stateInput!.value.trim(),
        postalCode: zipCodeInput!.value.trim(),
      },
    });

    resultDisplay!.textContent =
        "Verdict summary\n================\n" +
        `Formatted address: ${result.address.formattedAddress}\n` +
        `Entered: ${result.verdict.inputGranularity}\n` +
        `Validated: ${result.verdict.validationGranularity}\n` +
        `Geocoded: ${result.verdict.geocodeGranularity}\n` +
        `Possible next action: ${result.verdict.possibleNextAction}\n\n` +
        `${getVerdictMessage(result.verdict, 'addressComplete')}\n` +
        `${getVerdictMessage(result.verdict, 'hasUnconfirmedComponents')}\n` +
        `${getVerdictMessage(result.verdict, 'hasInferredComponents')}\n` +
        `${getVerdictMessage(result.verdict, 'hasReplacedComponents')}\n\n` +
        `Raw JSON response\n=================\n` +
        JSON.stringify(result, null, '  ');

  } catch (error) {
    console.error('Validation failed:', error);    
    if (error instanceof Error) {
      resultDisplay!.textContent = `Error: ${error.message}`;
    }
  } 
}

// Verdict messages
const verdictMessages = {
  addressComplete: {
    trueMessage:
        '- The API found no unresolved, unexpected, or missing address elements.',
    falseMessage:
        '- At least one address element is unresolved, unexpected, or missing.',
  },
  hasUnconfirmedComponents: {
    trueMessage: '- The API can\'t confirm at least one address component.',
    falseMessage: '- The API confirmed all address components.',
  },
  hasInferredComponents: {
    trueMessage: '- The API inferred (added) at least one address component.',
    falseMessage: '- The API did not infer (add) any address components.',
  },
  hasReplacedComponents: {
    trueMessage: '- The API replaced at least one address component.',
    falseMessage: '- The API did not replace any address components.',
  },
};

// Helper function to get the verdict message for a given verdict key
function getVerdictMessage(verdict, key) {
  if (!verdict || !verdictMessages[key]) return 'Unknown';
  return verdict[key] ? verdictMessages[key].trueMessage :
                        verdictMessages[key].falseMessage;
}

// Handler for Dropdown Change
function handleExampleSelectChange(event) {
  const selectedValue = event.target.value;
  if (selectedValue && examples[selectedValue]) {
      populateAddressFields(examples[selectedValue]);
  } else if (!selectedValue) {
      populateAddressFields(null); // Pass null to clear fields
  }
}

// Clear Form Handler
function handleClearForm() {
  streetAddress1Input!.value = '';
  streetAddress2Input!.value = '';
  cityInput!.value = '';
  stateInput!.value = '';
  zipCodeInput!.value = '';
  regionSelect!.value = '';
  exampleSelect!.value = '';
  resultDisplay!.textContent = 'Result will appear here...';
  console.log('Cleared form');
}

// Example Address Data
const examples = {
  google: {
      streetAddress1: '1600 Amphitheatre Parkway',
      streetAddress2: '', // Explicitly empty
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94043',
      region: 'US'
  },
  nonExistentSubpremise: {
      streetAddress1: '2930 Pearl St.',
      streetAddress2: 'Suite 100',
      city: 'Boulder',
      state: 'CO',
      zipCode: '', // Explicitly empty
      region: 'US'
  },
  missingSubpremise: {
      streetAddress1: '500 West 2nd Street',
      streetAddress2: null, // Can use null or undefined too
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      region: 'US'
  },
  misspelledLocality: {
      streetAddress1: '1600 Amphitheatre Pkwy',
      streetAddress2: '',
      city: 'Montan View',
      state: 'CA',
      zipCode: '94043',
      region: 'US'
  },
  missingLocality: {
      streetAddress1: 'Brandschenkestrasse 110 8002',
      streetAddress2: '',
      city: '',
      state: '',
      zipCode: '',
      region: ''
  },
  usPoBox: {
      streetAddress1: 'PO Box 1108',
      streetAddress2: '',
      city: 'Sterling',
      state: 'VA',
      zipCode: '20166-1108',
      region: 'US'
  },
};

// Helper function to populate form fields with example address data
function populateAddressFields(exampleAddress) {
  if (!exampleAddress) {
      console.warn("No example address data provided.");
      return;
  }

  // Get values from example, providing empty string as default
  streetAddress1Input!.value = exampleAddress.streetAddress1 || '';
  streetAddress2Input!.value = exampleAddress.streetAddress2 || '';
  cityInput!.value = exampleAddress.city || '';
  stateInput!.value = exampleAddress.state || '';
  zipCodeInput!.value = exampleAddress.zipCode || '';
  regionSelect!.value = exampleAddress.region || '';

  // Clear previous results and errors
  resultDisplay!.textContent = 'Result will appear here...';

  console.log("Populated fields with example: ", exampleAddress);
}

init();



React Google Maps Library - Basic Map

bookmark_border

This example uses the vis.gl/react-google-maps open source library to render a Google map in a React app. The vis.gl/react-google-maps library is a collection of React components and hooks for the Google Maps JavaScript API.

Important: The vis.gl/react-google-maps library is offered using an open source license. It is not governed by the Google Maps Platform Support Technical Support Services Guidelines, the SLA, or the Deprecation Policy (however, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service). If you find a bug, or have a feature request, file an issue on GitHub .

TypeScript
JavaScript
CSS
HTML

import React from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? ("YOUR_API_KEY");

const App = () => (
  <APIProvider
    solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'
    apiKey={API_KEY}>
    <Map
      defaultZoom={8}
      defaultCenter={{ lat: -34.397, lng: 150.644 }}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    />
  </APIProvider>
);
const root = createRoot(document.getElementById('app')!);
root.render(<App />);

export default App;


React Google Maps Library - Place Autocomplete

bookmark_border

This example shows using the Places Autocomplete widget to update a map and marker in a React application. It uses the vis.gl/react-google-maps open source library.The vis.gl/react-google-maps library is a collection of React components and hooks for the Google Maps JavaScript API.

Important: The vis.gl/react-google-maps library is offered using an open source license. It is not governed by the Google Maps Platform Support Technical Support Services Guidelines, the SLA, or the Deprecation Policy (however, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service). If you find a bug, or have a feature request, file an issue on GitHub .

TypeScript
JavaScript
CSS
HTML

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
  AdvancedMarkerRef
} from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? ("YOUR_API_KEY");

const App = () => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'>
      <Map
        mapId={'bf51a910020fa25a'}
        defaultZoom={3}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <AdvancedMarker ref={markerRef} position={null} />
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
        </div>
      </MapControl>
      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
};

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

const MapHandler = ({ place, marker }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
};

const root = createRoot(document.getElementById('app')!);
root.render(<App />);

export default App;


React Google Maps Library - Extended Component Library

bookmark_border

This example shows how to build a basic locations services web app using the Google Maps Platform's Extended Component Library with the vis.gl/react-google-maps open source library.

Google Maps Platform's Extended Component Library is a set of Web Components that helps developers build better maps faster, and with less effort. It encapsulates boilerplate code, best practices, and responsive design, reducing complex map UIs into what is effectively a single HTML element. These components make it easier to read, learn, customize, and maintain maps-related code.

The vis.gl/react-google-maps library is a collection of React components and hooks for the Google Maps JavaScript API.

Important: The vis.gl/react-google-maps library and the Extended Component Library are offered using an open source license. It is not governed by the Google Maps Platform Support Technical Support Services Guidelines, the SLA, or the Deprecation Policy (however, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service). If you find a bug, or have a feature request, file an issue on the respective library site.

TypeScript
JavaScript
CSS
HTML

import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { AdvancedMarker, Map, Pin, APIProvider } from '@vis.gl/react-google-maps';
import {
  PlaceReviews,
  PlaceDataProvider,
  PlaceDirectionsButton,
  IconButton,
  PlaceOverview,
  SplitLayout,
  OverlayLayout,
  PlacePicker
} from '@googlemaps/extended-component-library/react';
/**
 * The below imports are necessary because we are creating refs of 
 * the OverlayLayout and PlacePicker components. You need to pass 
 * the ref property a web component type object. Imports from  
 * @googlemaps/extended-component-library/react are wrappers around
 * the web components, not the components themselves. For the ref 
 * property we import the actual components and alias them for clarity.
 */
import { OverlayLayout as TOverlayLayout } from '@googlemaps/extended-component-library/overlay_layout.js';
import { PlacePicker as TPlacePicker } from '@googlemaps/extended-component-library/place_picker.js';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? ("YOUR_API_KEY");
const DEFAULT_CENTER = { lat: 38, lng: -98 };
const DEFAULT_ZOOM = 4;
const DEFAULT_ZOOM_WITH_LOCATION = 16;
/**
 * Sample app that helps users locate a college on the map, with place info such
 * as ratings, photos, and reviews displayed on the side.
 */
const App = () => {
  const overlayLayoutRef = useRef<TOverlayLayout>(null);
  const pickerRef = useRef<TPlacePicker>(null);
  const [college, setCollege] = useState<google.maps.places.Place | undefined>(undefined);
  /**
   * See https://lit.dev/docs/frameworks/react/#using-slots for why
   * we need to wrap our custom elements in a div with a slot attribute. 
   */
  return (
    <div className="App">
      <APIProvider
        solutionChannel='GMP_devsite_samples_v3_rgmcollegepicker'
        apiKey={API_KEY}
        version='beta' >
        <SplitLayout rowReverse rowLayoutMinWidth={700}>
          <div className="SlotDiv" slot="fixed">
            <OverlayLayout ref={overlayLayoutRef}>
              <div className="SlotDiv" slot="main">
                <PlacePicker
                  className="CollegePicker"
                  ref={pickerRef}
                  forMap="gmap"
                  country={['us', 'ca']}
                  type="university"
                  placeholder="Enter a college in the US or Canada"
                  onPlaceChange={() => {
                    if (!pickerRef.current?.value) {
                      setCollege(undefined);
                    } else {
                      setCollege(pickerRef.current?.value);
                    }
                  }}
                />
                <PlaceOverview
                  size="large"
                  place={college}
                  googleLogoAlreadyDisplayed
                >
                  <div slot="action" className="SlotDiv">
                    <IconButton
                      slot="action"
                      variant="filled"
                      onClick={() => overlayLayoutRef.current?.showOverlay()}
                    >
                      See Reviews
                    </IconButton>
                  </div>
                  <div slot="action" className="SlotDiv">
                    <PlaceDirectionsButton slot="action" variant="filled">
                      Directions
                    </PlaceDirectionsButton>
                  </div>
                </PlaceOverview>
              </div>
              <div slot="overlay" className="SlotDiv">
                <IconButton
                  className="CloseButton"
                  onClick={() => overlayLayoutRef.current?.hideOverlay()}
                >
                  Close
                </IconButton>
                <PlaceDataProvider place={college}>
                  <PlaceReviews />
                </PlaceDataProvider>
              </div>
            </OverlayLayout>
          </div>
          <div className="SplitLayoutContainer" slot="main">
            <Map
              id="gmap"
              mapId="8c732c82e4ec29d9"
              center={college?.location ?? DEFAULT_CENTER}
              zoom={college?.location ? DEFAULT_ZOOM_WITH_LOCATION : DEFAULT_ZOOM}
              gestureHandling="none"
              fullscreenControl={false}
              zoomControl={false}
            >
              {college?.location && (
                <AdvancedMarker position={college?.location}>
                  <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
              )}
            </Map>
          </div>
        </SplitLayout>
      </APIProvider>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);