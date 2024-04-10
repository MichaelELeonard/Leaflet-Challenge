Week 15 - leaflet-challenge


THE BACKGROUND (from challenge page)
The United States Geological Survey, or USGS for short, is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment, and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.
The USGS is interested in building a new set of tools that will allow them to visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. In this challenge, you have been tasked with developing a way to visualize USGS data that will allow them to better educate the public and other government organizations (and hopefully secure more funding) on issues facing our planet.


THE GOAL

For the Week 15 - leaflet-challenge we were tasked with creating an map displaying JSON earthquake data pulled from https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson.  The add on library leaflet & JavaScript were utilized to accomplish this challenge.   The functions used to complete this challenge include:

  function createFeatures()
  function getColorDepth()
  function earthquakeMultiplyer()
  function createMap()


THE START

To start the process, the variable ‘queryUrl’ was established to hold our API HTML link and the imported data was stored in a variable ‘data’ using D3.  A subset of the data labeled “data.features’ was then passed as a parameter to the function createFeatures() and also sent to the webpage console.log for tracking. 

let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
d3.json(queryUrl).then
  		(function (data) {
    			createFeatures(data.features);
    		console.log(data);


function createFeatures()

The goal of the createFeatures function was to create a graphical earthquake marker to be displayed on the map and to bind the information to the earthquake’s epicenter on the final map.   

A variable ‘earthquakeLayer’ was established and the function onEachFeature was used cycle through the individual earthquake in the data set, sending each one through a pointToLayer function to gather the specific earthquake attributes to be displayed.  The earthquake attributes were stored in variable ‘marker’ which included were the circle radius based on the earthquake’s magnitude and the fill color based on the earthquake’s origination depth.  Other functions called by function createFeatures included ‘earthquakeMultiplyer()’ which adjusted the size of the earthquake circle diameter based on the earthquake magnitude and ‘getColorDepth()’ which adjusts the circle color based on earthquake origination depth.
  
function createFeatures(earthquakeData) {
let earthquakeLayer = L.geoJSON(earthquakeData, {onEachFeature: onEachFeature,    pointToLayer: function(feature, latlng) {   
     		let marker = {
        			radius: earthquakeMultiplyer(feature.properties.mag),
        			fillColor: getColorDepth(feature.geometry.coordinates[2]),    
        			fillOpacity: 0.5,                                             
        			color: '#000000',                                             
        			weight: 0.5                                                   
     		}
     	return L.circle(latlng,marker);   

Another goal the earthquakeLayer was to bind the pop-up earthquake information to the earthquake origination location, so that when the location is clicked pop-up earthquake information is produced.  The function onEachFeature was used cycle through the individual earthquake and the notification header, date & time, magnitude, origin depth and epicenter location was bound to the earthquake location using layer.bindPopup.  Finally, the completed earthquakeLayer was sent as a parameter to the function createMap() to complete the mapping process. 
function onEachFeature(feature, layer) {
layer.bindPopup(`<h2>Earthquake Recorded</h2>                                             
            		<p>Date: ${new Date(feature.properties.time)}</p>
                     	<p>Magnitude: ${feature.properties.mag}</p>
                     	<p>Origination Depth: ${feature.geometry.coordinates[2]} kilometers</p>
                     	<p>Epicenter Location: ${feature.properties.place}</p>`);
}
createMap(earthquakeLayer);


function earthquakeMultiplyer()

The function earthquakeMultiplyer receives the magnitude of the earthquake as a parameter and multiplies it by 25000 to provide its circle size and proportionality on the map for clarity. The variable ‘multipliedMagnitude’ holds the adjusted earthquake magnitude level and returns it to be displayed on the map.  

function earthquakeMultiplyer(magnitude){
  		let multipliedMagnitude = magnitude * 25000
  		return multipliedMagnitude;      


function getColorDepth()

The function getColorDepth returns a color based on the earthquake origination depth in kilometers.  The origination depth is passed into the function as a parameter, and the color is determined by a series of ‘else if’ statements and then returned.  This function is called by the function createFeatures to set the displayed earthquake circle & by the function createMap to set the colors on the map legend.

function getColorDepth(depth){                
  if (depth > 90) return '#c20814';           // red
  else if (depth >= 70) return '#e35b07';     // red-orange
  else if (depth >= 50) return '#ed8309';     // orange
  else if (depth >= 30) return '#edc709';     // orange-yellow
  else if (depth >= 10) return '#ede509';     // yellow
  else return '#4ded09';                      // green

function createMap(earthquakeLayer)

The goal of the function createMap is to bring all the mapping components together to create the map and the map legend.  The variable ‘baseMapLayer’ is established to hold a .png map titleLayer pulled from openstreetmap.org.  The variable ‘myMap’ is then created with the center location coordinates, zoom level and baseLayers & earthquakeLayers passed to initiate map.   
let baseMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  	})

 	let myMap = L.map('map', {
    		center: [37.09, -95.71],   
    		zoom: 5,
    		layers: [baseMapLayer, earthquakeLayer] 
  	});

![Map](https://github.com/MichaelELeonard/leaflet-challenge/assets/152725440/2f969f97-a7f2-44a5-88e4-993db06b07dd)

The second component of the createMap is the earthquake legend based off the earthquake origination depth which was placed in the lower right-hand corner of the map.  A variable legend was created to hold the components for the map legend with the positioning set to ‘bottomright’.  The method .onAdd was used to establish the components for the legend.  These components include:
•	Set up a div 
•	The array of depths to be displayed
•	Initializing an empty array to hold the labels to be displayed  
•	The title of the legend

After the div, array of depths, empty array for the labels and legend title is established, the array of depths is traversed using a for-loop, and the HTML is assembled and appended to the labels array including the color and text of the legend levels.  The result is then added to ‘myMap’ to create the map legend.  
let legend = L.control({position: 'bottomright'});

  	legend.onAdd = function() {
    		let div = L.DomUtil.create('div', 'info legend');
   		 let depth = [-10, 10, 30, 50, 70, 90];
    		let labels = [];
  
   		 div.innerHTML = '<h2>Earthquake Depth</h2>';

    		for (var i = 0; i < depth.length; i++) {
labels.push('<ul style="background-color:' + getColorDepth(depth[i] +1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
    		}

   	 	div.innerHTML += '<ul>' + labels.join('') + '</ul>';
    		return div;
  	};
  	legend.addTo(myMap);
