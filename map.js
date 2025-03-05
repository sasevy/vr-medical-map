// Set up width and height based on window size
const width = window.innerWidth;
const height = window.innerHeight;

// Create an SVG element and append it to the body
const svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

// Set up map projection
const projection = d3.geoNaturalEarth1()
                     .scale(200)
                     .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Load the TopoJSON world map data
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function (topology) {
    const countries = topojson.feature(topology, topology.objects.countries);

    // Draw the map
    svg.append("g")
       .selectAll("path")
       .data(countries.features)
       .enter().append("path")
       .attr("d", path)
       .attr("fill", "#d3d3d3") // Light gray color for land
       .attr("stroke", "#333"); // Darker outline

}).catch(function (error) {
    console.error("Error loading TopoJSON:", error);
});
