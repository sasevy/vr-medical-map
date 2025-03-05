// VR Medical Training Adoption Data for Countries Worldwide
const vrAdoptionData = {
    // North America
    "USA": { rate: 65, story: "Leading in VR surgical simulation at Stanford and Mayo Clinic." },
    "CAN": { rate: 58, story: "National initiative to integrate VR in all medical schools by 2026." },
    "MEX": { rate: 23, story: "Growing adoption in major urban medical centers." },

    // South America
    "BRA": { rate: 31, story: "São Paulo University pioneering VR medical training in Latin America." },
    "ARG": { rate: 27, story: null },
    "COL": { rate: 19, story: null },

    // Europe
    "GBR": { rate: 62, story: "NHS digital transformation includes VR training for surgical residents." },
    "DEU": { rate: 59, story: "Government-funded initiative for VR in medical education." },
    "FRA": { rate: 54, story: null },
    "NLD": { rate: 67, story: "Amsterdam Medical Center's VR anatomy lab serves as European model." },
    "CHE": { rate: 71, story: "Highest adoption rate in Europe with integration in all major medical schools." },

    // Asia
    "JPN": { rate: 59, story: "Tokyo Medical University's VR Center serves as a regional hub." },
    "KOR": { rate: 64, story: "National digital health initiative includes VR training." },
    "CHN": { rate: 47, story: "Rapid growth in tier-1 city hospitals and medical schools." },
    "IND": { rate: 21, story: "Focused adoption in major private hospitals and premier institutions." },
    "SGP": { rate: 73, story: "Singapore General Hospital's VR training program serves as an Asia-Pacific model." },

    // Middle East
    "SAU": { rate: 48, story: "Vision 2030 includes significant investment in medical VR." },
    "ARE": { rate: 53, story: "Dubai Healthcare City establishing comprehensive VR training hub." },
    "ISR": { rate: 68, story: "Tel Aviv University's medical VR innovations exported globally." },

    // Africa
    "ZAF": { rate: 27, story: "University of Cape Town leading continental adoption." },
    "KEN": { rate: 15, story: "Partnership with Meta bringing VR labs to rural clinics, increasing accessibility." },
    "EGY": { rate: 17, story: null },

    // Oceania
    "AUS": { rate: 67, story: "National digital health strategy includes VR training mandate." },
    "NZL": { rate: 61, story: null }
};

// Regional Averages for Comparison
const regionalAverages = {
    "North America": 48.7,
    "South America": 18.2,
    "Europe": 43.5,
    "Asia": 25.6,
    "Middle East": 34.2,
    "Africa": 7.1,
    "Oceania": 24.7
};
