// This file maps various country codes and names to our standardized format
// It helps resolve discrepancies between different GeoJSON sources and our data

const countryCodeMap = {
    // Official ISO -> Our data code
    "USA": "USA",
    "GBR": "GBR",
    "DEU": "DEU",
    // Sometimes GeoJSON uses these variants
    "US": "USA",
    "UK": "GBR",
    "United States": "USA",
    "United States of America": "USA",
    "United Kingdom": "GBR",
    "Britain": "GBR",
    "Germany": "DEU",
    // Add more mappings as needed based on console output
};

// Function to normalize a country code from various possible formats
function normalizeCountryCode(code, name) {
    if (vrAdoptionData[code]) {
        return code; // Direct match in our data
    }
    
    // Check if we have a mapping
    if (countryCodeMap[code]) {
        return countryCodeMap[code];
    }
    
    // Try to match by name if code fails
    if (name && countryCodeMap[name]) {
        return countryCodeMap[name];
    }
    
    // Return the original code if no mapping found
    return code;
}
