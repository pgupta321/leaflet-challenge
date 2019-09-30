// map object
var map = L.map("map", {
    center: [35, -98],
    zoom: 4,
  });

// Selectable backgrounds of our map - tile layers:
// streets background

var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoicHJlcm5hZ3VwdGEiLCJhIjoiY2swdG1nZWEzMGYxcTNkbGFwaG1jYjB4aiJ9.u3C9KOpN9a39C2zoskuFMw"
}).addTo(map);

// satellite background
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: "pk.eyJ1IjoicHJlcm5hZ3VwdGEiLCJhIjoiY2swdG1nZWEzMGYxcTNkbGFwaG1jYjB4aiJ9.u3C9KOpN9a39C2zoskuFMw"
  }).addTo(map);

// Pirates background
var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pirates",
    accessToken: "pk.eyJ1IjoicHJlcm5hZ3VwdGEiLCJhIjoiY2swdG1nZWEzMGYxcTNkbGFwaG1jYjB4aiJ9.u3C9KOpN9a39C2zoskuFMw"
  }).addTo(map);


// layer for earthquakes data set

var earthquakes = new L.LayerGroup();

// base layers
var baseMaps = {
  Streets: streets,
  Satellite: satellite,
  Pirate: pirates
};

// overlays 
var overlayMaps = {
  "Earthquakes": earthquakes
};

// control which layers are visible.
L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(map);

// retrieve earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {


  function styleInfo(feature) {
    return {
      fillOpacity: 1,
      opacity: 0.8,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Color by magnitude
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#663f3f";
      case magnitude > 4:
        return "#825050";
      case magnitude > 3:
        return "#965b5b";
      case magnitude > 2:
        return "#b26c6c";
      case magnitude > 1:
        return "#cc7a7a";
      default:
        return "#f49292";
    }
  }

  // earthquake radius
  function getRadius(magnitude) {
    return magnitude * 2 + 1;
  }

  // add layer
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>" + "Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);


  var legend = L.control({
    position: "bottomleft"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#f49292",
      "#cc7a7a",
      "#b26c6c",
      "#965b5b",
      "#825050",
      "#663f3f"
    ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;

  };


legend.addTo(map);

})

  // retrive Tectonic Plate Geo Jason. 
/*  d3.json("https://github.com/fraxen/tectonicplates",
    function(platedata) {
 
      L.geoJson(platedata, {
        color: "black",
        weight: 2
      })
      .addTo(faultLines);

      faultLines.addTo(map);
    })}) */