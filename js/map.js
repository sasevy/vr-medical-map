// Initialize the map centered on (0, 0) with zoom level 2
const map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 6,
    scrollWheelZoom: true
});

// Add a light basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
}).addTo(map);

// Function to determine color based on adoption rate
function getColor(rate) {
    return rate > 60 ? '#006d2c' :
           rate > 40 ? '#2ca25f' :
           rate > 20 ? '#66c2a4' :
           rate > 5 ? '#b2e2e2' :
                      '#edf8fb';
}

// Function to style countries based on VR adoption rate
function style(feature) {
    const countryCode = feature.properties.iso_a3;
    const adoptionData = vrAdoptionData[countryCode];
    
    return {
        fillColor: adoptionData ? getColor(adoptionData.rate) : '#f0f0f0',
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Function to highlight a country on mouseover
function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9
    });

    layer.bringToFront();
    updateInfoBox(layer.feature);
}

// Function to reset highlight on mouseout
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    document.getElementById('country-info').innerHTML = '<p>Hover over a country to see details</p>';
}

// Function to update the info box with country data
function updateInfoBox(feature) {
    const countryCode = feature.properties.iso_a3;
    const countryName = feature.properties.name;
    const adoptionData = vrAdoptionData[countryCode];
    
    let infoContent = `<p><span class="highlight">${countryName}</span></p>`;
    
    if (adoptionData) {
        infoContent += `<p>VR Medical Training Adoption: <span class="highlight">${adoptionData.rate}%</span></p>`;
        
        // Get region for comparison
        let region = "";
        if (feature.properties.continent === "North America" || feature.properties.continent === "South America") {
            region = feature.properties.continent;
        } else {
            region = feature.properties.continent;
        }
        
        if (regionalAverages[region]) {
            infoContent += `<p>${region} Average: ${regionalAverages[region].toFixed(1)}%</p>`;
        }
        
        // Add success story if available
        if (adoptionData.story) {
            infoContent += `<div class="success-story">${adoptionData.story}</div>`;
        }
    } else {
        infoContent += '<p>No data available</p>';
    }
    
    document.getElementById('country-info').innerHTML = infoContent;
}

// Add interaction functions to each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

// Load GeoJSON data from natural earth dataset
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(response => response.json())
    .then(data => {
        // Add the GeoJSON layer to the map
        geojsonLayer = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
        document.getElementById('map').innerHTML = '<p class="error">Error loading map data. Please try again later.</p>';
    });
