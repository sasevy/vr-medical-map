document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map centered on a global view
    const map = L.map('map').setView([20, 0], 2);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Define color scale function
    function getColor(rate) {
        return rate > 80 ? '#006d2c' :
               rate > 60 ? '#31a354' :
               rate > 40 ? '#74c476' :
               rate > 20 ? '#bae4b3' :
                          '#edf8e9';
    }
    
    // Load GeoJSON world boundaries
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        .then(response => response.json())
        .then(geoJsonData => {
            // Add GeoJSON layer with styling
            L.geoJson(geoJsonData, {
                style: function(feature) {
                    // Find the data for this country
                    const countryCode = feature.properties.iso_a3;
                    const countryData = vrAdoptionData.find(d => d.countryCode === countryCode);
                    
                    // Default styling
                    const style = {
                        weight: 1,
                        opacity: 1,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7,
                        fillColor: '#f0f0f0' // Default color for countries without data
                    };
                    
                    // If we have data for this country, set the color based on adoption rate
                    if (countryData) {
                        style.fillColor = getColor(countryData.adoptionRate);
                    }
                    
                    return style;
                },
                onEachFeature: function(feature, layer) {
                    // Find the data for this country
                    const countryCode = feature.properties.iso_a3;
                    const countryData = vrAdoptionData.find(d => d.countryCode === countryCode);
                    
                    if (countryData) {
                        // Create popup content
                        const popupContent = `
                            <div class="custom-popup">
                                <div class="country-name">${countryData.country}</div>
                                <div class="adoption-rate">VR Adoption Rate: <strong>${countryData.adoptionRate}%</strong></div>
                                <div class="details">${countryData.details}</div>
                            </div>
                        `;
                        
                        // Bind popup to layer
                        layer.bindPopup(popupContent);
                        
                        // Highlight on hover
                        layer.on({
                            mouseover: function(e) {
                                layer.setStyle({
                                    weight: 2,
                                    color: '#666',
                                    dashArray: '',
                                    fillOpacity: 0.9
                                });
                                
                                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                    layer.bringToFront();
                                }
                            },
                            mouseout: function(e) {
                                layer.setStyle({
                                    weight: 1,
                                    opacity: 1,
                                    color: '#666',
                                    dashArray: '',
                                    fillOpacity: 0.7
                                });
                            }
                        });
                    } else {
                        // For countries without data, show a simple popup
                        layer.bindPopup(`<div class="custom-popup">
                            <div class="country-name">${feature.properties.name}</div>
                            <div class="details">No VR adoption data available.</div>
                        </div>`);
                    }
                }
            }).addTo(map);
            
            // Add markers for featured initiatives
            vrAdoptionData.filter(d => d.featured).forEach(country => {
                // Find the country in the GeoJSON to get its centroid
                const countryFeature = geoJsonData.features.find(f => f.properties.iso_a3 === country.countryCode);
                
                if (countryFeature) {
                    // Calculate rough centroid
                    let centerLat = 0, centerLon = 0, numPoints = 0;
                    
                    if (countryFeature.geometry.type === 'Polygon') {
                        const coords = countryFeature.geometry.coordinates[0];
                        coords.forEach(coord => {
                            centerLon += coord[0];
                            centerLat += coord[1];
                            numPoints++;
                        });
                    } else if (countryFeature.geometry.type === 'MultiPolygon') {
                        countryFeature.geometry.coordinates.forEach(polygon => {
                            polygon[0].forEach(coord => {
                                centerLon += coord[0];
                                centerLat += coord[1];
                                numPoints++;
                            });
                        });
                    }
                    
                    if (numPoints > 0) {
                        centerLat /= numPoints;
                        centerLon /= numPoints;
                        
                        // Add marker at country centroid
                        L.circleMarker([centerLat, centerLon], {
                            radius: 8,
                            fillColor: '#E74C3C',
                            color: '#fff',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.8
                        }).addTo(map).bindPopup(`
                            <div class="custom-popup">
                                <div class="country-name">${country.country}: Featured Initiative</div>
                                <div class="adoption-rate">VR Adoption Rate: <strong>${country.adoptionRate}%</strong></div>
                                <div class="details">${country.details}</div>
                            </div>
                        `);
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading GeoJSON data:', error);
            document.getElementById('map').innerHTML = '<p class="error">Error loading map data. Please try again later.</p>';
        });
});
