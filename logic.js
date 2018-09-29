// Create map
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3,
  });
  
// Add a tile layer (the background map image) to map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.high-contrast",
      accessToken: API_KEY
    }).addTo(myMap);

// Create function to get color when magnitude condition is true
function getColor(m) {
    return  m >= 5 ? '#380103' :
        m >= 4 ? '#770007' :
        m >= 3 ? '#C90E1A' :
        m >= 2 ? '#F94D58' :
        m >= 1 ? '#F49595' :
        m >= 0 ? '#F4DCDC' : '';
}    
    
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

    // Set earthquakeData variable that holds features
    var earthquakeData = data.features
    

    // Loop through earthquake data 
    for (var i = 0; i < earthquakeData.length; i++) {
        
        // Set circle radius based on earthquake magnitude 
        if (earthquakeData[i].properties.mag > 5) {
        radius = earthquakeData[i].properties.mag*250**2;
        }
        else if (earthquakeData[i].properties.mag > 4) {
        radius = earthquakeData[i].properties.mag*225**2;
        }
        else if (earthquakeData[i].properties.mag > 3) {
        radius = earthquakeData[i].properties.mag*200**2;
        }
        else if (earthquakeData[i].properties.mag > 2) {
        radius = earthquakeData[i].properties.mag*175**2;
        }
        else if (earthquakeData[i].properties.mag > 1) {
        radius = earthquakeData[i].properties.mag*125**2;
        }
        else {
        radius = earthquakeData[i].properties.mag*75**2
        }
    
        // Add circles and pop-up with earthquake data to map
        L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
        fillOpacity: .75,
        fillColor: getColor(earthquakeData[i].properties.mag),
        color: '#2B2B2B',
        weight: .5,
        radius: radius,
        }).bindPopup("<h3>" + earthquakeData[i].properties.place +
        "</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>" + 
        "<hr><p>" + "Magnitude:" + earthquakeData[i].properties.mag + "</p>").addTo(myMap);
    }

});

// Add legend to map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
        labels = [],
        magnitude = ['0','1','2','3','4','5'];

    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML += 
            labels.push(
                '<i style="background:' + getColor(magnitude[i]) + '"></i>' + 
                (magnitude[i] < 5 ? magnitude[i] + '&ndash;' + magnitude[i + 1] : magnitude[i] + '+')
            );
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(myMap);   

