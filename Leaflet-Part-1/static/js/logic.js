// Set queryUrl to hold API URL Link
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Use D3 to pull JSon data and store in variable data 
d3.json(queryUrl).then
  (function (data) {
    // Call createFeatures function and pass it data.features
    createFeatures(data.features);

    // Console log the data retrieved 
    console.log(data);
  });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Function to determine marker color by depth   
function Get_Color_Depth(depth){              //Color Hex codes from https://www.w3schools.com/colors/colors_picker.asp    
  if (depth > 90) return '#c20814';
  else if (depth >= 70) return '#e35b07';
  else if (depth >= 50) return '#ed8309';
  else if (depth >= 30) return '#edc709';
  else if (depth >= 10) return '#ede509';
  else return '#4ded09';
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array


  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h2>Earthquake Recorded</h2><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>
    <p>Origination Depth: ${feature.geometry.coordinates[2]} kilometers</p><p>Epicenter Location: ${feature.properties.place}</p>`);
  }
  
  
  let earthquakeLayer = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
      // Point to layer used to alter markers
      pointToLayer: function(feature, latlng) {            //from https://gis.stackexchange.com/questions/360293/add-something-into-l-circlemarker
        // Determine the style of markers based on properties
      let marker = {
          radius: feature.properties.mag * 25000,
          fillColor: Get_Color_Depth(feature.geometry.coordinates[2]),   //From 3rd entry in Array
          fillOpacity: 0.5,
          color: '#000000',           //Color Hex code from https://www.w3schools.com/colors/colors_picker.asp
          weight: 0.5
        }
      return L.circle(latlng,marker);
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakeLayer);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createMap(earthquakeLayer) {

  // Create the base layers.
  let mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create our map, giving it the streetmap and earthquakes layers
  let myMap = L.map('map', {
    center: [37.09, -95.71],   
    zoom: 5,
    layers: [mapLayer, earthquakeLayer] 
  
  });


  // Add the legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let depth = [-10, 10, 30, 50, 70, 90];
    let labels = [];
  
    div.innerHTML = '<h2>Earthquake Depth</h2>';

    for (var i = 0; i < depth.length; i++) {
      labels.push('<ul style="background-color:' + Get_Color_Depth(depth[i] +1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
    }

    // add each label list item to the div under the <ul> tag
      div.innerHTML += '<ul>' + labels.join('') + '</ul>';

    return div;
  };
  legend.addTo(myMap);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
