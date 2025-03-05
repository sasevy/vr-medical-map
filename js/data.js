// This file contains the VR medical training adoption data for countries worldwide
const vrAdoptionData = {
    // Data represents percentage of medical institutions using VR for training
    // Format: ISO 3166-1 alpha-3 country code: adoption percentage
    
    // North America
    "USA": { rate: 65, story: "Leading in VR surgical simulation with programs at Stanford and Mayo Clinic." },
    "CAN": { rate: 58, story: "National initiative to integrate VR in all medical schools by 2026." },
    "MEX": { rate: 23, story: "Growing adoption in major urban medical centers." },
    
    // South America
    "BRA": { rate: 31, story: "São Paulo University pioneering VR medical training in Latin America." },
    "ARG": { rate: 27, story: null },
    "COL": { rate: 19, story: null },
    "CHL": { rate: 34, story: "National telemedicine program incorporating VR training modules." },
    "PER": { rate: 15, story: null },
    "VEN": { rate: 8, story: null },
    "ECU": { rate: 12, story: null },
    "BOL": { rate: 9, story: null },
    "PRY": { rate: 11, story: null },
    "URY": { rate: 29, story: null },
    "GUY": { rate: 7, story: null },
    "SUR": { rate: 5, story: null },
    
    // Europe
    "GBR": { rate: 62, story: "NHS digital transformation includes VR training for surgical residents." },
    "DEU": { rate: 59, story: "Government-funded initiative for VR in medical education." },
    "FRA": { rate: 54, story: null },
    "ITA": { rate: 47, story: null },
    "ESP": { rate: 49, story: null },
    "PRT": { rate: 42, story: null },
    "NLD": { rate: 67, story: "Amsterdam Medical Center's VR anatomy lab serves as European model." },
    "BEL": { rate: 55, story: null },
    "CHE": { rate: 71, story: "Highest adoption rate in Europe with integration in all major medical schools." },
    "AUT": { rate: 53, story: null },
    "SWE": { rate: 69, story: "Karolinska Institute VR training program received EU innovation award." },
    "NOR": { rate: 64, story: null },
    "DNK": { rate: 68, story: null },
    "FIN": { rate: 66, story: null },
    "IRL": { rate: 57, story: null },
    "POL": { rate: 38, story: null },
    "UKR": { rate: 17, story: null },
    "ROU": { rate: 25, story: null },
    "GRC": { rate: 33, story: null },
    "HUN": { rate: 29, story: null },
    "CZE": { rate: 42, story: null },
    "SVK": { rate: 36, story: null },
    "BGR": { rate: 22, story: null },
    "SRB": { rate: 19, story: null },
    "HRV": { rate: 31, story: null },
    "BIH": { rate: 15, story: null },
    "ALB": { rate: 13, story: null },
    "MKD": { rate: 14, story: null },
    "SVN": { rate: 39, story: null },
    "EST": { rate: 47, story: null },
    "LVA": { rate: 32, story: null },
    "LTU": { rate: 28, story: null },
    "BLR": { rate: 15, story: null },
    "MDA": { rate: 10, story: null },
    
    // Asia
    "JPN": { rate: 59, story: "Tokyo Medical University's VR Center serves as regional hub." },
    "KOR": { rate: 64, story: "National digital health initiative includes VR training." },
    "CHN": { rate: 47, story: "Rapid growth in tier-1 city hospitals and medical schools." },
    "IND": { rate: 21, story: "Focused adoption in major private hospitals and premier institutions." },
    "IDN": { rate: 14, story: null },
    "MYS": { rate: 26, story: null },
    "THA": { rate: 19, story: null },
    "VNM": { rate: 11, story: null },
    "PHL": { rate: 13, story: null },
    "SGP": { rate: 73, story: "Singapore General Hospital's VR training program serves as Asia-Pacific model." },
    "PAK": { rate: 8, story: null },
    "BGD": { rate: 5, story: null },
    "NPL": { rate: 4, story: null },
    "LKA": { rate: 9, story: null },
    "KHM": { rate: 6, story: null },
    "LAO": { rate: 3, story: null },
    "MMR": { rate: 4, story: null },
    "SAU": { rate: 48, story: "Vision 2030 includes significant investment in medical VR." },
    "ARE": { rate: 53, story: "Dubai Healthcare City establishing comprehensive VR training hub." },
    "ISR": { rate: 68, story: "Tel Aviv University's medical VR innovations exported globally." },
    "TUR": { rate: 31, story: null },
    "IRN": { rate: 13, story: null },
    "IRQ": { rate: 7, story: null },
    "JOR": { rate: 19, story: null },
    "LBN": { rate: 15, story: null },
    "SYR": { rate: 4, story: null },
    "QAT": { rate: 57, story: null },
    "KWT": { rate: 44, story: null },
    "OMN": { rate: 32, story: null },
    "BHR": { rate: 41, story: null },
    "YEM": { rate: 2, story: null },
    
    // Africa
    "ZAF": { rate: 27, story: "University of Cape Town leading continental adoption." },
    "EGY": { rate: 17, story: null },
    "MAR": { rate: 14, story: null },
    "TUN": { rate: 13, story: null },
    "DZA": { rate: 11, story: null },
    "NGA": { rate: 9, story: null },
    "GHA": { rate: 8, story: null },
    "KEN": { rate: 15, story: "Partnership with Meta bringing VR labs to rural clinics, dramatically increasing accessibility." },
    "ETH": { rate: 5, story: null },
    "UGA": { rate: 7, story: null },
    "TZA": { rate: 6, story: null },
    "MOZ": { rate: 4, story: null },
    "ZMB": { rate: 6, story: null },
    "ZWE": { rate: 7, story: null },
    "BWA": { rate: 14, story: null },
    "NAM": { rate: 12, story: null },
    "SEN": { rate: 9, story: null },
    "MLI": { rate: 3, story: null },
    "BFA": { rate: 3, story: null },
    "CIV": { rate: 7, story: null },
    "GIN": { rate: 3, story: null },
    "CMR": { rate: 6, story: null },
    "COD": { rate: 2, story: null },
    "AGO": { rate: 6, story: null },
    "SOM": { rate: 1, story: null },
    "SDN": { rate: 4, story: null },
    "LBY": { rate: 8, story: null },
    "TCD": { rate: 2, story: null },
    "NER": { rate: 2, story: null },
    "MRT": { rate: 5, story: null },
    "MWI": { rate: 4, story: null },
    "GAB": { rate: 11, story: null },
    "RWA": { rate: 9, story: "National e-health strategy incorporating VR for medical training." },
    "BDI": { rate: 3, story: null },
    "SSD": { rate: 1, story: null },
    "ERI": { rate: 2, story: null },
    "DJI": { rate: 4, story: null },
    "SLE": { rate: 3, story: null },
    "LBR": { rate: 3, story: null },
    "TGO": { rate: 5, story: null },
    "BEN": { rate: 5, story: null },
    "CAF": { rate: 1, story: null },
    "COG": { rate: 5, story: null },
    "GNB": { rate: 2, story: null },
    "GMB": { rate: 5, story: null },
    
    // Oceania
    "AUS": { rate: 67, story: "National digital health strategy includes VR training mandate." },
    "NZL": { rate: 61, story: null },
    "PNG": { rate: 5, story: null },
    "FJI": { rate: 8, story: null },
    "SLB": { rate: 3, story: null },
    "VUT": { rate: 4, story: null }
};

// Regional averages for context
const regionalAverages = {
    "North America": 48.7,
    "South America": 18.2,
    "Europe": 43.5,
    "Asia": 25.6,
    "Africa": 7.1,
    "Oceania": 24.7
};
