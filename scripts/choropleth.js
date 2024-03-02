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
d3.json("../data/japan.json").then(function (geojson) {
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
        .style("fill", "lightblue") // Color based on region mapping
        .style("stroke", "white")
        .style("stroke-width", 0.5)
        .on("mouseover", function (d) {
            const tooltipWidth = 100; // Set the width of the tooltip box
            const tooltipHeight = 40; // Set the height of the tooltip box

            // Calculate the position for the tooltip
            const mouseX = d3.event.pageX;
            const mouseY = d3.event.pageY;

            const tooltipX = mouseX - tooltipWidth / 2;
            const tooltipY = mouseY - tooltipHeight - 10; // Adjust for a small gap

            // Add a tooltip box
            svg.append("rect")
                .attr("class", "tooltip-box")
                .attr("x", tooltipX)
                .attr("y", tooltipY)
                .attr("width", tooltipWidth + 10)
                .attr("height", tooltipHeight)
                .attr("fill", "rgba(62,197,255,0.8)")
                .style("border-radius", "10px")// Orange background color

            // Add text to the tooltip box
            svg.append("text")
                .attr("class", "tooltip-text")
                .attr("x", tooltipX + tooltipWidth / 2)
                .attr("y", tooltipY + tooltipHeight / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text(d.properties.nam);

            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function () {
            // Remove the tooltip box on mouseout
            svg.selectAll(".tooltip-box").remove();
            svg.selectAll(".tooltip-text").remove();
            d3.select(this).style("fill", "lightblue");
        });
});
