// Country Code Mapping for Standardization
const countryCodeMap = {
    // Standard ISO 3166-1 alpha-3 codes
    "USA": "USA",
    "CAN": "CAN",
    "MEX": "MEX",
    "BRA": "BRA",
    "ARG": "ARG",
    "COL": "COL",
    "GBR": "GBR",
    "DEU": "DEU",
    "FRA": "FRA",
    "NLD": "NLD",
    "CHE": "CHE",
    "JPN": "JPN",
    "KOR": "KOR",
    "CHN": "CHN",
    "IND": "IND",
    "SGP": "SGP",
    "SAU": "SAU",
    "ARE": "ARE",
    "ISR": "ISR",
    "ZAF": "ZAF",
    "KEN": "KEN",
    "EGY": "EGY",
    "AUS": "AUS",
    "NZL": "NZL",

    // Alternative country names used in GeoJSON
    "United States": "USA",
    "United States of America": "USA",
    "Canada": "CAN",
    "Mexico": "MEX",
    "Brazil": "BRA",
    "Argentina": "ARG",
    "Colombia": "COL",
    "United Kingdom": "GBR",
    "Britain": "GBR",
    "Germany": "DEU",
    "France": "FRA",
    "Netherlands": "NLD",
    "Switzerland": "CHE",
    "Japan": "JPN",
    "South Korea": "KOR",
    "China": "CHN",
    "India": "IND",
    "Singapore": "SGP",
    "Saudi Arabia": "SAU",
    "UAE": "ARE",
    "United Arab Emirates": "ARE",
    "Israel": "ISR",
    "South Africa": "ZAF",
    "Kenya": "KEN",
    "Egypt": "EGY",
    "Australia": "AUS",
    "New Zealand": "NZL",

    // Additional common variants used in GeoJSON data
    "UK": "GBR",
    "U.S.": "USA",
    "U.S.A.": "USA",
    "Deutschland": "DEU",
    "Suomi": "FIN",
    "España": "ESP",
    "Italia": "ITA",
    "Brasil": "BRA"
};

// Function to normalize country codes from GeoJSON data
function normalizeCountryCode(code, name) {
    if (vrAdoptionData[code]) {
        return code; // Direct match in VR adoption dataset
    }

    // Check if the code is mapped
    if (countryCodeMap[code]) {
        return countryCodeMap[code];
    }

    // Check if the name is mapped
    if (name && countryCodeMap[name]) {
        return countryCodeMap[name];
    }

    // Return the original code if no mapping is found
    return code;
}
