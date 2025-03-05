document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map centered on a global view
    const map = L.map('map').setView([20, 0], 2);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Define color scale function
    function getColor(adoptionrate) {
        return adoptionrate > 80 ? '#006d2c' :
               adoptionrate > 60 ? '#31a354' :
               adoptionrate > 40 ? '#74c476' :
               adoptionrate > 20 ? '#bae4b3' :
                          '#edf8e9';
    }
    
    // Counter to track matched countries
    let matchedCountries = 0;
    let totalCountriesWithData = vrAdoptionData.length;
    
    // Common country code mappings (in case there are mismatches)
    const countryCodeMappings = {
        // Common variations between ISO codes and names
        "USA": "US", "GBR": "GB", "KOR": "KR", 
        "CHN": "CN", "ARE": "AE", "RUS": "RU"
    };
    
    // Load GeoJSON world boundaries
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        .then(response => response.json())
        .then(geoJsonData => {
            console.log("GeoJSON loaded successfully");
            
            // Check the structure of the GeoJSON
            const sampleFeature = geoJsonData.features[0];
            console.log("Sample feature properties:", sampleFeature.properties);
            
            // Create a map of country names to ISO codes from the GeoJSON
            const countryNameToCode = {};
            geoJsonData.features.forEach(feature => {
                if (feature.properties.name && feature.properties.iso_a3) {
                    countryNameToCode[feature.properties.name.toUpperCase()] = feature.properties.iso_a3;
                }
            });
            
            // Debug country codes
            console.log("Our data country codes:", vrAdoptionData.map(d => d.countryCode));
            
            // Enhance our data with additional code mappings
            vrAdoptionData.forEach(country => {
                // Keep track of the original code for debugging
                country.originalCode = country.countryCode;
                
                // Try to find a matching code in our mappings
                if (countryCodeMappings[country.countryCode]) {
                    country.countryCode = countryCodeMappings[country.countryCode];
                }
                
                // Try to find by country name if the code doesn't match
                const upperName = country.country.toUpperCase();
                if (countryNameToCode[upperName] && !geoJsonData.features.some(f => f.properties.iso_a3 === country.countryCode)) {
                    console.log(`Remapping ${country.country} from ${country.countryCode} to ${countryNameToCode[upperName]}`);
                    country.countryCode = countryNameToCode[upperName];
                }
            });
            
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
                        matchedCountries++;
                        
                        // Add debug info for the first few matches
                        if (matchedCountries <= 5) {
                            console.log(`Match found: ${feature.properties.name} (${countryCode}) - Rate: ${countryData.adoptionRate}%`);
                        }
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
            
            // Report on our success rate
            console.log(`Matched ${matchedCountries} countries out of ${totalCountriesWithData} in our dataset`);
            
            // List unmatched countries for debugging
            const unmatchedCountries = vrAdoptionData.filter(country => 
                !geoJsonData.features.some(feature => feature.properties.iso_a3 === country.countryCode)
            );
            
            if (unmatchedCountries.length > 0) {
                console.log("Unmatched countries:", unmatchedCountries.map(c => `${c.country} (${c.originalCode}→${c.countryCode})`));
                
                // Provide suggestions for fixing unmatched countries
                unmatchedCountries.forEach(country => {
                    // Find potential matches based on name similarity
                    const potentialMatches = geoJsonData.features
                        .filter(feature => {
                            const countryName = country.country.toLowerCase();
                            const featureName = feature.properties.name.toLowerCase();
                            return featureName.includes(countryName) || countryName.includes(featureName);
                        })
                        .map(feature => ({
                            name: feature.properties.name,
                            code: feature.properties.iso_a3
                        }));
                    
                    if (potentialMatches.length > 0) {
                        console.log(`Suggestion for ${country.country}: Use code ${potentialMatches[0].code} (${potentialMatches[0].name})`);
                    }
                });
            }
            
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
                } else {
                    console.log(`Could not find GeoJSON feature for featured country: ${country.country}`);
                }
            });
        })
        .catch(error => {
            console.error('Error loading GeoJSON data:', error);
            document.getElementById('map').innerHTML = '<p class="error">Error loading map data. Please try again later.</p>';
        });
});
