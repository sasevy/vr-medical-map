document.addEventListener('DOMContentLoaded', function () {
    // Initialize Leaflet map
    const map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        scrollWheelZoom: true
    });

    // Add a light basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
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
        const countryCode = normalizeCountryCode(feature.properties.iso_a3, feature.properties.name);
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
        }).bringToFront();
        updateInfoBox(layer.feature);
    }

    // Function to reset highlight on mouseout
    function resetHighlight(e) {
        geojsonLayer.resetStyle(e.target);
        document.getElementById('country-info').innerHTML = '<p>Hover over a country to see details</p>';
    }

    // Function to update the info box with country data
    function updateInfoBox(feature) {
        const countryCode = normalizeCountryCode(feature.properties.iso_a3, feature.properties.name);
        const adoptionData = vrAdoptionData[countryCode];
        const countryName = feature.properties.name || 'Unknown Country';

        let infoContent = `<p><span class="highlight">${countryName}</span></p>`;

        if (adoptionData) {
            infoContent += `<p>VR Medical Training Adoption: <span class="highlight">${adoptionData.rate}%</span></p>`;
            if (adoptionData.story) {
                infoContent += `<div class="success-story">${adoptionData.story}</div>`;
            }
        } else {
            infoContent += `<p>No adoption data available for this country.</p>`;
        }

        document.getElementById('country-info').innerHTML = infoContent;
    }

    // Add interaction functions to each feature
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function(e) {
                highlightFeature(e);
                map.fitBounds(e.target.getBounds());
            }
        });
    }

    // Create a variable to store the GeoJSON layer
    let geojsonLayer;

    // Function to initialize GeoJSON data with fallbacks
    function initializeGeoJSON() {
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Primary GeoJSON source failed');
                }
                return response.json();
            })
            .then(data => {
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
        if (data.features && data.features.length > 0) {
            console.log('GeoJSON structure example:', data.features[0].properties);
        }

        geojsonLayer = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        const infoControl = L.control({position: 'bottomright'});
        infoControl.onAdd = function() {
            const div = L.DomUtil.create('div', 'data-source-info');
            div.innerHTML = '<p>Data compiled from healthcare technology surveys & academic studies (2024)</p>';
            return div;
        };
        infoControl.addTo(map);
    }

    // Start loading GeoJSON when the page loads
    initializeGeoJSON();
});
