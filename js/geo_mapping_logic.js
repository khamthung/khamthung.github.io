var faultlinesLayer = new L.LayerGroup();//global obj layer group to add line later
var earthquakesLayer = new L.LayerGroup();//global obj layer group to add circle markers later

startHere();//call initiate function


////////////// START HERE ///////////////////
function startHere(){
  createStartMap();// step 1: Create a map on load with basemap and overlay map (with empty faultlinesLayer & EarhtquakesLayer ).
  addFaultlinesLayer();//step 2: Query data and add them to faultlinesLayer 
  addEarthquakesLayer(); //step 3: Query data and add them to EarhtquakesLayer 
}
///////////////////////////////////////////////

function createStartMap(){
  var grayMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var satelliteMap= L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  
  var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  
  var baseMaps = {
    "Satellite": satelliteMap,
    "Outdoors": outdoorsMap,
    "Grayscale":grayMap
  };

  var overlayMaps = {
    "Earthquakes": earthquakesLayer,
    "Fault Line":faultlinesLayer
  };
  
  // Create our map with layers to display on load
  var myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3,
    layers: [outdoorsMap, faultlinesLayer,earthquakesLayer]
  });
  
  // Create map options control and add to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  ///////// Create Legend //////////////
  var legendControl = L.control({position: "bottomright"});
  legendControl.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = ["#98ee00","#d4ee00","#eecc00","#ee9c00","#ea822c","#ea2c2c"];

    // Loop through our intervals and generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legendControl.addTo(myMap);
}


function addEarthquakesLayer(){
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
    data.features.forEach(d =>{
        L.circle([d.geometry.coordinates[1],d.geometry.coordinates[0]], {
        fillOpacity: 0.8,
        color: "white",
        stroke: true,
        weight: 0.3,
        fillColor: getColor(d.properties.mag),
        radius: getRadius(d.properties.mag)
      }).bindPopup(`<h3>${d.properties.place}</h3><hr><p>${new Date(d.properties.time)}</p>`)
        .addTo(earthquakesLayer)
    });
  });
}
 
function addFaultlinesLayer(){
 d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(data =>{
  L.geoJson(data, {
    color: "orange",
    weight: 1.5
  }).addTo(faultlinesLayer);
});
}

function getRadius(m) {
  //if magnitude=0 then return 1 else return multiplication
  return m===0?1:m* 15000;
}

function getColor(m) {
  return m > 5?"#ea2c2c":m> 4?"#ea822c":m > 3?"#ee9c00":m > 2?"#eecc00":m > 1?"#d4ee00":"#98ee00";
}


  







