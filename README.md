<img src="Pics/Header.png" width="756" height="364">



# Leaflet Challenge

[Leaflet Code Link]( https://github.com/MichaelELeonard/Leaflet-Challenge/blob/main/Leaflet/static/js/logic.js)

## THE BACKGROUND
The United States Geological Survey, or USGS for short, is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment, and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.
The USGS is interested in building a new set of tools that will allow them to visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. In this challenge, we have been tasked with developing a way to visualize USGS data that will allow them to better educate the public and other government organizations (and hopefully secure more funding) on issues facing our planet.

## THE GOAL

The USGS provides earthquake data in several different formats, updated every 5 minutes.  Download to earthquake data for the [last seven days]( https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson) from [USGS GeoJSON FeedLinks](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) and visualize the data using Leaflet. 

<img src="Pics/USGS Feed.png" width="1148" height="681">
<br>

## THE VISUALIZATIONS

The data was imported and visualized using Leaflet for all the earthquakes in the dataset based on their longitude and latitude.  Visualization attributes include:
* The markers reflect the magnitude of the earthquake by their size and the depth by color.  Earthquakes with higher magnitudes appear larger and earthquakes with greater depth appear darker in color.
* Popups include additional information about the earthquake when its associated marker is clicked.
* The legend provides context for the map data.

## Global View
<img src="Pics/Earthquakes Global View.png" width="837" height="461">

## Alaska View
<img src="Pics/Earthquakes Alaska View.png" width="749" height="467">

## Contiguous United States View
<img src="Pics/Earthquakes US View.png" width="924" height="502">


