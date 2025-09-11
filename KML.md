Display KML data

bookmark_border

Overview
This tutorial shows you how to display information of a KML file in a Google map and sidebar. For more information on using KML files in maps, read the guide to KML Layers. Try clicking a marker on the map below to see data in the sidebar.


The section below displays the entire code you need to create the map and sidebar.

var map;
var src = 'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml';

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(-19.257753, 146.823688),
    zoom: 2,
    mapTypeId: 'terrain'
  });

  var kmlLayer = new google.maps.KmlLayer(src, {
    suppressInfoWindows: true,
    preserveViewport: false,
    map: map
  });
  kmlLayer.addListener('click', function(event) {
    var content = event.featureData.infoWindowHtml;
    var testimonial = document.getElementById('capture');
    testimonial.innerHTML = content;
  });
}
<div id="map"></div>
<div id="capture"></div>
html, body {
  height: 370px;
  padding: 0;
  margin: 0;
  }
#map {
 height: 360px;
 width: 300px;
 overflow: hidden;
 float: left;
 border: thin solid #333;
 }
#capture {
 height: 360px;
 width: 480px;
 overflow: hidden;
 float: left;
 background-color: #ECECFB;
 border: thin solid #333;
 border-left: none;
 }
<!-- Replace the value of the key parameter with your own API key. -->
<script async
src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkUOdZ5y7hMm0yrcCQoCvLwzdM6M8s5qk&callback=initMap">
</script>
Try it yourself
You can experiment with this code in JSFiddle by clicking the <> icon in the top-right corner of the code window.


<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>KML Click Capture Sample</title>
    <style>
      html, body {
        height: 370px;
        padding: 0;
        margin: 0;
        }
      #map {
       height: 360px;
       width: 300px;
       overflow: hidden;
       float: left;
       border: thin solid #333;
       }
      #capture {
       height: 360px;
       width: 480px;
       overflow: hidden;
       float: left;
       background-color: #ECECFB;
       border: thin solid #333;
       border-left: none;
       }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div id="capture"></div>
    <script>
      var map;
      var src = 'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml';

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: new google.maps.LatLng(-19.257753, 146.823688),
          zoom: 2,
          mapTypeId: 'terrain'
        });

        var kmlLayer = new google.maps.KmlLayer(src, {
          suppressInfoWindows: true,
          preserveViewport: false,
          map: map
        });
        kmlLayer.addListener('click', function(event) {
          var content = event.featureData.infoWindowHtml;
          var testimonial = document.getElementById('capture');
          testimonial.innerHTML = content;
        });
      }
    </script>
    <script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
    </script>
  </body>
</html>
Getting Started
These are the stages to creating the map and sidebar for this tutorial:

Setting up the KML file
Displaying the KMLlayer
Displaying data in the sidebar

Setting up the KML file for import
Your KML file should conform to the KML standard. For details about this standard, refer the Open Geospatial Consortium website. Google's KML documentation also describes the language, and offers both a reference and conceptual developer documentation.

If you're just learning and don't have a KML file, you can:

Use the following KML file for this tutorial:


https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml
Find a KML file on the web. You can use Google's filetype search operator.



Substitute any search term for velodromes, or omit the term altogether to find all KML files.

If you're creating your own file, the code in this example assumes that:

You have publicly hosted the file on the internet. This is a requirement for all applications that load KML into a KMLLayer, so that Google's servers can find and retrieve the content to display it on the map.
The file is not on a password-protected page.
Your features have info window content. You can contain this content in a description element, or include it using an ExtendedData element and entity replacement (read below for more info). Both are accessible as the feature's infoWindowHtml property.
ExtendedData elements
The KML file in this tutorial includes feature information in an ExtendedData element. In order to bring this information into the feature's description, use entity replacement, which is essentially a variable in the BalloonStyle tag.

The table below explains the code for this section.

Code and description

<Style id="west_campus_style">
  <IconStyle>
    <Icon>
      <href>https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png
      </href>
    </Icon>
  </IconStyle>
  <BalloonStyle>
    <text>$[video]</text>
  </BalloonStyle>
</Style>

The KML file has a single Style element that is applied to all the placemarks.
This Style element assigns a value of #[video] to the BalloonStyle's text element.
The $[x] format tells the KML parser to look for a Data element named video, and to use it as the balloon text.

<Placemark>
    <name>Google West Campus 1</name>
    <styleUrl>#west_campus_style</styleUrl>
    <ExtendedData>
      <Data name="video">
        <value><![CDATA[<iframe width="640" height="360"
          src="https://www.youtube.com/embed/ZE8ODPL2VPI" frameborder="0"
          allowfullscreen></iframe><br><br>]]></value>
      </Data>
    </ExtendedData>
    <Point>
      <coordinates>-122.0914977709329,37.42390182131783,0</coordinates>
    </Point>
</Placemark>

Each Placemark contains an ExtendedData element, which holds the Data element. Notice that each Placemark has a single Data element with a name attribute of video.
The file for this tutorial uses the embedded YouTube video as the value of each Placemark's balloon text.
You can learn more about entity replacement in the Adding Custom Data chapter of the KML documentation.


Displaying the KMLLayer
Initializing the map
This table explains the code for this section.

Code and description

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(-19.257753, 146.823688),
    zoom: 2,
    mapTypeId: 'terrain'
  });
}

To display KML on a map, you need to first create the map.
This code creates a new Google Map object, tells it where to center and zoom, and attaches the map to the div.
To learn more about the basics of creating a Google Map, read the Adding a Google Map to your website tutorial.
Creating the KMLLayer
This table explains the code that creates a KMLLayer.

Code and description

var kmlLayer = new google.maps.KmlLayer();

Creates a new KMLLayer object to display your KML.

var src = 'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml';
var kmlLayer = new google.maps.KmlLayer(src, {
  suppressInfoWindows: true,
  preserveViewport: false,
  map: map
});

The KMLLayer constructor sets the URL of your KML file. It also defines properties for the KMLLayer object that do the following:
Tells the layer not to display an info window when clicked.
Tells the map to center and zoom to the bounding box of the layer's contents.
Sets the map to the Map object created earlier.
The Maps JavaScript API reference guide lists all available options for this layer.
Load your HTML file to display the KML file content as a layer on top of the base map. However, clicking any feature won't result in any action yet.

Displaying data in the sidebar
This section explains the settings that displays info window content in the sidebar when you click a feature on the map. This is done by:

Listening for a click event on any of the KMLLayer's features.
Grabbing the clicked feature's data.
Writing that data to the sidebar.
Adding an event listener
Google Maps provides a function to listen and respond to user events on the map, such as clicks or keyboard keypresses. It adds a listener for such click events.

The table below explains the code for this section.

Code and description

kmlLayer.addListener('click', function(event) {});

The kmlLayer.addListener event listener focuses on the following:
The type of event to listen for. In this tutorial, it is the click event.
A function to call when the event occurs.
You can learn more about events in the Developer's Guide.
Writing the KML feature data to the sidebar
By this stage of the tutorial, you have captured click events on the layer's features. You can now set the application to write the feature's data and info window content to the sidebar.

The table below explains the code for this section.

Code and description

var content = event.featureData.infoWindowHtml;

Writes the info window content to a variable.

var testimonial = document.getElementById('capture');
testimonial.innerHTML = content;

Identifies the div to write to, and replaces the HTML in it with the feature's content.

kmlLayer.addListener('click', function(event) {
  var content = event.featureData.infoWindowHtml;
  var testimonial = document.getElementById('capture');
  testimonial.innerHTML = content;
});

These lines of code become the function within the addListener constructor.
Now each time you click a KML feature on the map, the sidebar updates to display its info window content.

More information

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
1,000
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
<address>	no	
<AddressDetails>	no	
<Alias>	N/A	<Model> is not supported
<altitude>	no	
<altitudeMode>	no	
<atom:author>	yes	
<atom:link>	yes	
<atom:name>	yes	
<BalloonStyle>	partially	only <text> is supported
<begin>	N/A	<TimeSpan> is not supported
<bgColor>	no	
<bottomFov>	N/A	<PhotoOverlay> is not supported
<Camera>	no	
<Change>	partially	only style changes are supported
<color>	partially	includes #AABBGGRR and #BBGGRR; not supported in <IconStyle>, <ScreenOverlay>, and <GroundOverlay>
<colorMode>	no	
<cookie>	no	
<coordinates>	yes	
<Create>	no	
<Data>	yes	
<Delete>	no	
<description>	yes	HTML content is allowed but is sanitized to protect from cross-browser attacks. Entity replacements of the form $[dataName] are not supported.
<displayMode>	no	
<displayName>	no	
<Document>	partially	implicitly, children are supported; no effect as child of other Features
<drawOrder>	no	
<east>	yes	
<end>	N/A	<TimeSpan> is not supported
<expires>	yes	see Summary section for details
<ExtendedData>	partially	untyped <Data> only, no <SimpleData> or <Schema>, and entity replacements of the form $[dataName] are not supported.
<extrude>	no	
<fill>	yes	
<flyToView>	no	
<Folder>	yes	
<geomColor>	no	deprecated
<GeometryCollection>	no	deprecated
<geomScale>	no	deprecated
<gridOrigin>	N/A	<PhotoOverlay> is not supported
<GroundOverlay>	yes	cannot be rotated
<h>	yes	deprecated
<heading>	yes	
hint	yes	target=... supported
<hotSpot>	yes	
<href>	yes	
<httpQuery>	no	
<Icon>	yes	cannot be rotated
<IconStyle>	yes	
<ImagePyramid>	N/A	<PhotoOverlay> is not supported
<innerBoundaryIs>	yes	implicitly from <LinearRing> order
<ItemIcon>	N/A	<ListStyle> is not supported
<key>	N/A	<StyleMap> is not supported
<kml>	yes	
<labelColor>	no	deprecated
<LabelStyle>	no	
<latitude>	yes	
<LatLonAltBox>	yes	
<LatLonBox>	yes	
<leftFov>	N/A	<PhotoOverlay> is not supported
<LinearRing>	yes	
<LineString>	yes	
<LineStyle>	yes	
<Link>	yes	
<linkDescription>	no	
<linkName>	no	
<linkSnippet>	no	
<listItemType>	N/A	<ListStyle> is not supported
<ListStyle>	no	
<Location>	N/A	<Model> is not supported
<Lod>	yes	
<longitude>	yes	
<LookAt>	no	
<maxAltitude>	yes	
<maxFadeExtent>	yes	
<maxHeight>	N/A	<PhotoOverlay> is not supported
<maxLodPixels>	yes	
<maxSessionLength>	no	
<maxWidth>	N/A	<PhotoOverlay> is not supported
<message>	no	
<Metadata>	no	deprecated
<minAltitude>	yes	
<minFadeExtent>	yes	
<minLodPixels>	yes	
<minRefreshPeriod>	no	<NetworkLink>
<Model>	no	
<MultiGeometry>	partially	rendered but displayed as separate features in left side panel
<name>	yes	
<near>	N/A	<PhotoOverlay> is not supported
<NetworkLink>	yes	 
<NetworkLinkControl>	partially	<Update> and <expires> partially supported. The API ignores expiration settings in the HTTP headers but does use the expiration settings specified in KML. In the absence of expiration settings, or within the time validity interval, Google Maps may cache data fetched from the Internet for unspecified durations. A refetch of the data from the Internet can be forced by renaming the document and fetching it under a different URL, or by making sure that the document contains appropriate expiration settings.
<north>	yes	
<open>	yes	
<Orientation>	N/A	<Model> is not supported
<outerBoundaryIs>	yes	implicitly from <LinearRing> order
<outline>	yes	
<overlayXY>	no	
<Pair>	N/A	<StyleMap> is not supported
<phoneNumber>	no	
<PhotoOverlay>	no	
<Placemark>	yes	
<Point>	yes	
<Polygon>	yes	
<PolyStyle>	yes	
<range>	yes	
<refreshInterval>	partially	<Link> only; not in <Icon>
<refreshMode>	yes	HTTP headers not supported for "onExpire" mode. See notes on <Update> and <expires> above.
<refreshVisibility>	no	
<Region>	yes	
<ResourceMap>	N/A	<Model> is not supported
<rightFov>	N/A	<PhotoOverlay> is not supported
<roll>	N/A	<Camera> and <Model> are not supported
<rotation>	no	
<rotationXY>	no	
<Scale>	N/A	<Model> is not supported
<scale>	no	
<Schema>	no	
<SchemaData>	no	
<ScreenOverlay>	yes	cannot be rotated
<screenXY>	no	
<shape>	N/A	<PhotoOverlay> is not supported
<SimpleData>	N/A	<SchemaData> are not supported
<SimpleField>	N/A	<Schema> are not supported
<size>	yes	
<Snippet>	yes	
<south>	yes	
<state>	N/A	<ListStyle> is not supported
<Style>	yes	
<StyleMap>	no	rollover (highlight) effects are not supported
<styleUrl>	N/A	<StyleMap> is not supported
<targetHref>	partially	supported in <Update>, not in <Alias>
<tessellate>	no	
<text>	yes	replacement of $[geDirections] is not supported
<textColor>	no	
<tileSize>	N/A	<PhotoOverlay> is not supported
<tilt>	no	
<TimeSpan>	no	
<TimeStamp>	no	
<topFov>	N/A	<PhotoOverlay> is not supported
<Update>	partially	only style changes, not <Create> or <Delete>
<Url>	yes	deprecated
<value>	yes	
<viewBoundScale>	no	
<viewFormat>	no	
<viewRefreshMode>	partially	"onStop" is supported
<viewRefreshTime>	yes	
<ViewVolume>	N/A	<PhotoOverlay> is not supported
<visibility>	partially	yes on <Folder> - child placemarks inherit their visibility
<w>	yes	deprecated
<west>	yes	
<when>	N/A	<TimeStamp> is not supported
<width>	yes	
<x>	yes	deprecated
<y>	yes	deprecated
