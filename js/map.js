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
    // Check all possible ISO code properties in the GeoJSON
    const countryCode = feature.properties.iso_a3 || feature.properties.ISO_A3 || feature.properties.ISO3 || 
                       feature.properties.ADM0_A3 || feature.properties.ADMIN;
    
    // For debugging, log countries with missing data
    if (!vrAdoptionData[countryCode]) {
        console.log(`Missing data for country: ${feature.properties.name || feature.properties.NAME}, code: ${countryCode}`);
    }
    
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
    // First, determine which property holds the country code in this GeoJSON
    const countryCode = feature.properties.iso_a3 || feature.properties.ISO_A3 || 
                       feature.properties.ISO3 || feature.properties.ADM0_A3;
    
    // Get country name from any available property
    const countryName = feature.properties.name || feature.properties.NAME || 
                       feature.properties.ADMIN || feature.properties.admin;
    
    const adoptionData = vrAdoptionData[countryCode];
    
    let infoContent = `<p><span class="highlight">${countryName || 'Unknown Country'}</span>`;
    if (countryCode) {
        infoContent += ` (${countryCode})`;
    }
    infoContent += `</p>`;
    
    if (adoptionData) {
        infoContent += `<p>VR Medical Training Adoption: <span class="highlight">${adoptionData.rate}%</span></p>`;
        
        // Get region for comparison
        let region = "";
        const continent = feature.properties.continent || feature.properties.CONTINENT || 
                         feature.properties.REGION || feature.properties.region;
                         
        if (continent) {
            if (continent.includes("America")) {
                region = continent.includes("North") ? "North America" : "South America";
            } else {
                region = continent;
            }
            
            if (regionalAverages[region]) {
                infoContent += `<p>${region} Average: ${regionalAverages[region].toFixed(1)}%</p>`;
            }
        }
        
        // Add success story if available
        if (adoptionData.story) {
            infoContent += `<div class="success-story">${adoptionData.story}</div>`;
        }
    } else {
        infoContent += `<p>No adoption data available for this country.</p>`;
        
        // For debugging - show what properties are available
        infoContent += `<p><small>Debug: Looking for code ${countryCode}</small></p>`;
    }
    
    document.getElementById('country-info').innerHTML = infoContent;
}

// Add interaction functions to each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function(e) {
            // On click, keep the highlight and info display
            highlightFeature(e);
            
            // Optional: Zoom to country
            map.fitBounds(e.target.getBounds());
        }
    });
}

// Create a variable to store the GeoJSON layer
let geojsonLayer;

// Function to initialize GeoJSON data with fallbacks
function initializeGeoJSON() {
    // Primary source
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Primary GeoJSON source failed');
            }
            return response.json();
        })
        .then(data => {
            // When data loads successfully, process and add to map
            processGeoJSON(data);
        })
        .catch(error => {
            console.error('Error with primary source:', error);
            // Try backup source
            fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Backup GeoJSON source failed');
                    }
                    return response.json();
                })
                .then(data => {
                    processGeoJSON(data);
                })
                .catch(backupError => {
                    console.error('All GeoJSON sources failed:', backupError);
                    document.getElementById('map').innerHTML = 
                        '<div class="error-message">Unable to load map data. Please try again later.</div>';
                });
        });
}

// Process GeoJSON data and add to map
function processGeoJSON(data) {
    // Examine the first feature to understand the structure
    if (data.features && data.features.length > 0) {
        console.log('GeoJSON structure example:', data.features[0].properties);
    }
    
    // Add the GeoJSON layer to the map
    geojsonLayer = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    
    // Add a custom control to show data source info
    const infoControl = L.control({position: 'bottomright'});
    infoControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'data-source-info');
        div.innerHTML = '<p>Data compiled from healthcare technology surveys & academic studies (2024)</p>';
        return div;
    };
    infoControl.addTo(map);
}

// Start loading GeoJSON when the page loads
document.addEventListener('DOMContentLoaded', initializeGeoJSON);
