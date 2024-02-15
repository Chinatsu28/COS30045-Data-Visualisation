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
d3.json("japan.geojson").then(function (geojson) {
  // Create a projection for the map
  const projection = d3.geoMercator()
    .fitSize([enlargedWidth, enlargedHeight], geojson);

  // Create a path generator
  const path = d3.geoPath().projection(projection);

  // Define a mapping between provinces and regions
  const regionMapping = {
    "Hokkaido": "Hokkaido",
  "Aomori": "Tohoku",
  "Iwate": "Tohoku",
  "Miyagi": "Tohoku",
  "Akita": "Tohoku",
  "Yamagata": "Tohoku",
  "Fukushima": "Tohoku",
  "Ibaraki": "Kanto",
  "Tochigi": "Kanto",
  "Gunma": "Kanto",
  "Saitama": "Kanto",
  "Chiba": "Kanto",
  "Tokyo": "Kanto",
  "Kanagawa": "Kanto",
  "Niigata": "Chubu",
  "Toyama": "Chubu",
  "Ishikawa": "Chubu",
  "Fukui": "Chubu",
  "Yamanashi": "Chubu",
  "Nagano": "Chubu",
  "Gifu": "Chubu",
  "Shizuoka": "Chubu",
  "Aichi": "Chubu",
  "Mie": "Chubu",
  "Shiga": "Kansai",
  "Kyoto": "Kansai",
  "Osaka": "Kansai",
  "Hyogo": "Kansai",
  "Nara": "Kansai",
  "Wakayama": "Kansai",
  "Tottori": "Chugoku",
  "Shimane": "Chugoku",
  "Okayama": "Chugoku",
  "Hiroshima": "Chugoku",
  "Yamaguchi": "Chugoku",
  "Tokushima": "Shikoku",
  "Kagawa": "Shikoku",
  "Ehime": "Shikoku",
  "Kochi": "Shikoku",
  "Fukuoka": "Kyushu",
  "Saga": "Kyushu",
  "Nagasaki": "Kyushu",
  "Kumamoto": "Kyushu",
  "Oita": "Kyushu",
  "Miyazaki": "Kyushu",
  "Kagoshima": "Kyushu",
  "Okinawa": "Okinawa"
  };

  // Define color scale for regions
  const colorScale = d3.scaleOrdinal()
    .domain(["Hokkaido", "Tohoku", "Kanto", "Chubu", "Kinki", "Chugoku", "Shikoku", "Kyushu"])
    .range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#66c2a5"]);

  // Draw the map
  const features = svg.selectAll("path")
    .data(geojson.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", d => colorScale(regionMapping[d.properties.nam] || "Other")) // Color based on region mapping
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
      features.classed("selected", false).style("fill", d => colorScale(regionMapping[d.properties.nam] || "Other"));

      // If the clicked feature was not already selected, select it
      if (!isSelected) {
        clickedFeature.classed("selected", true).style("fill", "cornflowerblue");
      }
    });
});