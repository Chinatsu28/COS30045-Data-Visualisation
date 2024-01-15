// Set up the SVG container dimensions
const originalWidth = 800;
const originalHeight = 600;

// Enlarge the SVG by 1.5 times
const enlargedWidth = originalWidth * 1.5;
const enlargedHeight = originalHeight * 1.5;

// Append an SVG container to the map-container div
const svg = d3.select("#map-container")
  .append("svg")
  .attr("width", enlargedWidth)
  .attr("height", enlargedHeight);

// Load the GeoJSON data for Vietnam
d3.json("vietnam.geojson").then(function (geojson) {
  // Create a projection for the map
  const projection = d3.geoMercator()
    .fitSize([enlargedWidth, enlargedHeight], geojson);

  // Create a path generator
  const path = d3.geoPath().projection(projection);

  // Draw the map
  const features = svg.selectAll("path")
    .data(geojson.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", "lightgray")
    .style("stroke", "white")
    .style("stroke-width", 0.5)
    .on("mouseover", function () {
      d3.select(this).style("stroke", "black").style("stroke-width", 2);
    })
    .on("mouseout", function () {
      d3.select(this).style("stroke", "white").style("stroke-width", 0.5);
    })
    .on("click", function (event, d) {
      const clickedFeature = d3.select(this);

      // Check if this feature is already selected
      const isSelected = clickedFeature.classed("selected");

      // Deselect all features
      features.classed("selected", false).style("fill", "lightgray");

      // If the clicked feature was not already selected, select it
      if (!isSelected) {
        clickedFeature.classed("selected", true).style("fill", "cornflowerblue");

        
      }
    });
});
