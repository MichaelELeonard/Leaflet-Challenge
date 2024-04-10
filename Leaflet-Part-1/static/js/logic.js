// Set queryUrl to hold API URL Link
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Use D3 to pull JSon data and store in variable data 
d3.json(queryUrl).then
  (function (data) {

    // Call createFeatures function and pass it data.features pulled from JSon
    createFeatures(data.features);

    // Console log the data retrieved 
    console.log(data);

  });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Function to determine marker color by earthquake depth in kilometers
function getColorDepth(depth){                // Color Hex codes from https://www.w3schools.com/colors/colors_picker.asp    
  if (depth > 90) return '#c20814';           // red
  else if (depth >= 70) return '#e35b07';     // red/orange
  else if (depth >= 50) return '#ed8309';     // orange
  else if (depth >= 30) return '#edc709';     // orange/yellow
  else if (depth >= 10) return '#ede509';     // yellow
  else return '#4ded09';                      // green
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Function to multiply earthquake magnitude by 25000 to provide proportionality on the map
function earthquakeMultiplyer(magnitude){
  let multipliedMagnitude = magnitude * 25000
  return multipliedMagnitude;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createMap(earthquakeLayer) {

  // Create baseLayer of the map
  let baseMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Initiate creation of the map, giving it the baseLayer, earthquakeLayers, centering coordinates and zoom level
  let myMap = L.map('map', {
    center: [37.09, -95.71],   
    zoom: 5,
    layers: [baseMapLayer, earthquakeLayer] 
  });


  // Add the legend
  let legend = L.control({position: 'bottomright'});

  // Add onto legend setting div, the depth levels and initialize labels array
  legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let depth = [-10, 10, 30, 50, 70, 90];
    let labels = [];
  
    //Set up Legend Title
    div.innerHTML = '<h2>Earthquake Depth</h2>';

    // loop through depth array, get colors from , assemble HTML and append data to labels array 
    for (var i = 0; i < depth.length; i++) {
      labels.push('<ul style="background-color:' + getColorDepth(depth[i] +1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
    }

    // Connect labels information to <ul> tag to display on web page 
    div.innerHTML += '<ul>' + labels.join('') + '</ul>';
    return div;
  };

  //Adding the legend to the map
  legend.addTo(myMap);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Create earthquakeLayer to overlay on basic map

function createFeatures(earthquakeData) {

  // On each earthquake dataset use pointToLayer to create circle on earthquakeLayer with size based on the earthquake magnitude, and color based on earthquake depth in kilometers
  let earthquakeLayer = L.geoJSON(earthquakeData, {onEachFeature: onEachFeature, pointToLayer: function(feature, latlng) {      //from https://gis.stackexchange.com/questions/360293/add-something-into-l-circlemarker 
      // set markers based on earthquake variables                                                                              // & https://leafletjs.com/examples/geojson/
      let marker = {                    
        radius: earthquakeMultiplyer(feature.properties.mag),         // Call earthquakeMultiplyer to multiply earthquake magnitude by 25000 to provide proportionality on the map
        fillColor: getColorDepth(feature.geometry.coordinates[2]),    // Pull from 3rd entry in array
        fillOpacity: 0.5,                                             // Setting transparency of earthquake 
        color: '#000000',                                             //setting black outer edge    //Color Hex code from https://www.w3schools.com/colors/colors_picker.asp
        weight: 0.5                                                   // Setting weight of black edge
      }
      return L.circle(latlng,marker);
  }});

  
   // Bind popup to each earthquake information to earthquake location
                    // Header
                    // Earthquake Date and Time
                    // Earthquake Depth
                    // Earthquake Location

   function onEachFeature(feature, layer) {
    layer.bindPopup(`<h2>Earthquake Recorded</h2>                                             
                     <p>Date: ${new Date(feature.properties.time)}</p>
                     <p>Magnitude: ${feature.properties.mag}</p>
                     <p>Origination Depth: ${feature.geometry.coordinates[2]} kilometers</p>
                     <p>Epicenter Location: ${feature.properties.place}</p>`);
  }

  // Send our earthquakesLayer to the createMap function
  createMap(earthquakeLayer);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////