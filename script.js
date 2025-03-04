// Set up dimensions and projection
const width = 960, height = 600;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geoNaturalEarth1()
    .scale(160)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);
const g = svg.append("g");

// Define color scale
const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

// Sample VR adoption data (Replace with actual dataset)
const vrAdoptionData = [
    { code: "USA", name: "United States", adoption: 45 },
    { code: "CHN", name: "China", adoption: 60 },
    { code: "IND", name: "India", adoption: 25 },
    { code: "BRA", name: "Brazil", adoption: 30 },
    { code: "DEU", name: "Germany", adoption: 50 }
];

// Tooltip setup
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("box-shadow", "0px 0px 5px rgba(0,0,0,0.3)")
    .style("opacity", 0);

// Fetch and process world map data
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
  .then(function (topology) {
    console.log("Successfully loaded TopoJSON:", topology);
    // Process your TopoJSON data here...
  })
  .catch(function (error) {
    console.error("Error loading TopoJSON:", error);
  });
    .then(response => response.json())
    .then(worldData => {
        console.log("Map data loaded successfully:", worldData);

        const countries = topojson.feature(worldData, worldData.objects.countries).features;
        console.log("Extracted countries:", countries);

        // Draw the map
        g.selectAll("path")
            .data(countries)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => {
                const country = vrAdoptionData.find(c => c.code === getCountryISO3(d.id));
                return country ? colorScale(country.adoption) : "#ccc";
            })
            .attr("stroke", "#fff")
            .on("mouseover", function (event, d) {
                const country = vrAdoptionData.find(c => c.code === getCountryISO3(d.id));
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${country ? country.name : "Unknown"}</strong><br>Adoption: ${country ? country.adoption + "%" : "N/A"}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(200).style("opacity", 0);
            });
    })
    .catch(error => console.error("Error loading map data:", error));

// Function to get ISO3 code from TopoJSON ID
function getCountryISO3(id) {
    const isoMapping = {
        840: "USA", 156: "CHN", 356: "IND", 76: "BRA", 276: "DEU"
        // Add more mappings based on the dataset
    };
    return isoMapping[id] || null;
}
