
var immigrantSelected = null;
var color = null;
var colorRange = {
  inflow: ["lightblue", "darkblue"], // Define color range for inflow
  outflow: ["rgb(255,180,180)", "#ce0000"], // Define color range for outflow
};

function treemap(dataset) {
  // Fetch data from JSON file
  d3.json(dataset).then(function(data) {
    // Create the tree map
    var width = 1000; // Reduce the width
    var height = 400;
    d3.select("#treeMap svg").remove();
    var svg = d3
      .select("#treeMap")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var treemap = d3.treemap().size([width * 0.7, height]).padding(1); // Adjust size

    var root = d3.hierarchy({ children: data.data }).sum((d) => d.Total);

    treemap(root);

    var cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    var rectangles = cell
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => color(d.data.Continent))
        .style("opacity", 0) // Initially set opacity to 0
        .transition() // Start a transition
        .duration(1000) // Transition duration
        .style("opacity", 1) // End with opacity 1

    cell
      .append("text")
      .attr("x", 5)
      .attr("y", 15)
      .attr("fill", "white")
      .text((d) => `${d.data.Percentage}`);

    // Legend
    var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width * 0.8) + "," + (i * 20 + 20) + ")"; }); // Adjust position

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);


      legend.append("text")
      .attr("x", 22) // Position text to the right of the rect
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start") // Align text to the start of the rect
      .text(function(d) { return d; });
  });
}



  

function choropleth(color) {
    var clickOutsideMap;
  const originalWidth = 550;
  const originalHeight = 500;
  var selectedPrefecture = null;
  // Enlarge the SVG by 1.5 times
  const enlargedWidth = originalWidth * 1.3;
  const enlargedHeight = originalHeight * 1.3;
  var selected = null;
  // Append an SVG container to the map-container div
  d3.select("#choropleth svg").remove();
  const svg = d3
    .select("#choropleth")
    .append("svg")
    .attr("width", enlargedWidth)
    .attr("height", enlargedHeight);

  // Load the GeoJSON data for Japan
  d3.json("../data/japan.json").then(function (json) {
    // Create a projection for the map
      const center = d3.geoCentroid(json);

// Define a scale factor
      const scaleFactor = 14; // Change this value to zoom in or out

      const projection = d3.geoMercator()
          .scale((enlargedWidth / 2 / Math.PI) * scaleFactor) // Scale the map
          .translate([enlargedWidth / 2, enlargedHeight / 2]) // Center the map
          .center(center); // Set the center of the map to the center of the GeoJSON data

    // Create a path generator
    const path = d3.geoPath().projection(projection);

    // Load the CSV data for prefecture inflows
    d3.csv("../data/a001.csv").then(function (data) {
      // Convert inflow data to map for easy lookup
      let inflowMap = new Map(data.map((d) => [d.Prefectures, +d.In]));
      let outflowMap = new Map(data.map((d) => [d.Prefectures, +d.Out]));

      // Draw the map
      const features = svg
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
          .style("transition", "opacity 0.4s")
        .style("fill", function (d) {
          if (color == "inflow") {
            const inflow = inflowMap.get(d.properties.nam);
            if (inflow !== undefined) {
              const colorScale = d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => +d.In)])
                .range(colorRange.inflow); // Use color range for inflow
              return colorScale(inflow);
            } else {
              return "lightblue";
            }
          } else if (color == "outflow") {
            const outflow = outflowMap.get(d.properties.nam);
            if (outflow !== undefined) {
              const colorScale = d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => +d.Out)])
                .range(colorRange.outflow); // Use color range for outflow
              return colorScale(outflow);
            } else {
              return "rgb(255,180,180)";
            }
          } else {
            return "lightblue";
          }
        }) // Default color if inflow data not found
        .style("stroke", "white")
        .style("stroke-width", 0.5)
        .style("stroke-linejoin", "round") // Add this line
        .style("stroke-linecap", "round") // Add this line
        .on("mouseover", function (d) {
          const tooltipWidth = 100; // Set the width of the tooltip box
          const tooltipHeight = 40; // Set the height of the tooltip box
          this.parentNode.appendChild(this);
          // Calculate the position for the tooltip
          var svgBounds = svg.node().getBoundingClientRect();
          const mouseX = d3.event.pageX;
          const mouseY = d3.event.pageY - svgBounds.top - window.scrollY - 20;

          const tooltipX = mouseX  - tooltipWidth / 2;
          const tooltipY = mouseY  - tooltipHeight - 10// Adjust for a small gap

          // Add a tooltip box
          svg
            .append("rect")
            .attr("class", "tooltip-box")
            .attr("x", tooltipX - 25)
            .attr("y", tooltipY)
            .attr("width", tooltipWidth + 50)
            .attr("height", tooltipHeight)
              .attr("rx", 5) // Add horizontal corner radius
              .attr("ry", 5) // Add vertical corner radius
            .attr("fill", "black")
              .style("border-radius", "10px")
          .style("opacity", 0.6)


          // Add text to the tooltip box
          svg
        .append("text")
        .attr("class", "tooltip-text")
        .attr("x", tooltipX + tooltipWidth / 2)
        .attr("y", tooltipY + tooltipHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(function () {
            if (color === "inflow") {
                const inflow = inflowMap.get(d.properties.nam);
                return `${d.properties.nam}: ${inflow !== undefined ? inflow : 'N/A'}`;
            } else if (color === "outflow") {
                const outflow = outflowMap.get(d.properties.nam);
                return `${d.properties.nam}: ${outflow !== undefined ? outflow : 'N/A'}`;
            } else {
                return `${d.properties.nam}`;
            }
        });

            d3.select(this).style("stroke", "black")
            .style("stroke-width", 0.7)
            .style("stroke-linejoin", "round") // Add this line
            .style("stroke-linecap", "round"); // Add this line
        })
        .on("click", function (d) {
          selectedPrefecture = d.properties.nam;

          createTornadoChart(
            "../data/immigrant_by_age.json",
            selectedPrefecture,
            colorRange
          );
          clickOutsideMap = !clickOutsideMap;
                        features.style("opacity", 0.4);
                        d3.select(this).style("opacity", 1);
                        d3.select(this).style("z-index", "10")
                    console.log(clickOutsideMap);

        })

        .on("mouseout", function () {
            // Remove the tooltip box on mouseout
            svg.selectAll(".tooltip-box").remove();
            svg.selectAll(".tooltip-text").remove();
            d3.select(this).style("stroke", "white");
            d3.select(this).style("z-index", "0")
            d3.select(this).style("stroke-width", 0.5)
        .style("stroke-linejoin", "round") // Add this line
                .style("stroke-linecap", "round"); // Add this line
        });
        d3.select("#clear").on("click", function () {
            clickOutsideMap = false;
            color=null;
            choropleth();
            features.style("opacity", 0.7);
        });
        function zoomed(){
            const {transform} = d3.event;
            features.attr("transform", transform);
        }
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomed);

        svg.call(zoom);
    });
  });
}

function createTornadoChart(filename, selectedPrefecture, colorRange) {
  // Clear existing chart
  d3.select("#tornado_chart").html("");

  d3.json(filename).then(function (data) {
    console.log(data);
    if (!data || !data.prefectures || !Array.isArray(data.prefectures)) {
      console.error(
        "Invalid data format. Please provide valid prefecture data."
      );
      return;
    }

    let selectedData = data.prefectures.find(
      (prefecture) => prefecture.name === selectedPrefecture
    );

    if (!selectedData) {
      console.log("Data for the selected prefecture not found.");
      return;
    }

    const ageGroups = selectedData.age_groups;

    // Select the container for the tornado chart
    const tornadoChartContainer = d3.select("#tornado_chart");

    // Set up the dimensions and margins for the chart
    const margin = { top: 20, right: 30, bottom: 20, left: 30 };
    const width =
      tornadoChartContainer.node().getBoundingClientRect().width -
      margin.left -
      margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG element for the chart
    const svg = tornadoChartContainer
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Calculate the maximum absolute value across inflow and outflow data points
    const maxAbsValue = d3.max(ageGroups, (d) =>
      Math.max(Math.abs(d.inflow), Math.abs(d.outflow))
    );

    // Create scales for the chart
    const xScale = d3
      .scaleLinear()
      .domain([-maxAbsValue, maxAbsValue])
      .range([100, width - 100]);

    const yScale = d3
      .scaleBand()
      .domain(ageGroups.map((d) => d.age_range))
      .range([20, height - 20])
      .padding(0.1);

    // Create bars for inflow
    const inflowBars = svg
      .selectAll(".inflow-bar")
      .data(ageGroups)
      .enter()
      .append("rect")
      .attr("class", "inflow-bar")
      .attr("x", (d) => xScale(0)) // Start from 0 for inflow
      .attr("y", (d) => yScale(d.age_range))
      .attr("width", 0) // Initially set width to 0 for animation
      .attr("height", yScale.bandwidth())
      .style("fill", "cornflowerblue")
      .on("click", function (d) {
        color = "inflow";
        choropleth(color);
        treemap("../data/immigrant_by_nationality.json");
      })
      .transition()
      .duration(1000) // Transition duration
      .attr("width", (d) => Math.abs(xScale(d.inflow) - xScale(0) - 50))
      .attr("prefecture", (d) => d.prefecture) // Add prefecture attribute

    // Create bars for outflow
    const outflowBars = svg
      .selectAll(".outflow-bar")
      .data(ageGroups)
      .enter()
      .append("rect")
      .attr("class", "outflow-bar")
      .attr("x", (d) => xScale(-Math.abs(d.outflow))) // Start from 0 for outflow
      .attr("y", (d) => yScale(d.age_range))
      .attr("width", 0) // Initially set width to 0 for animation
      .attr("height", yScale.bandwidth())
      .style("fill", "#e62020")
      .on("click", function (d) {
        color = "outflow";
        treemap("../data/emigrant_by_nationality.json");
        choropleth(color);
      })

      .transition()
      .duration(1000) // Transition duration
      .attr("width", (d) => Math.abs(xScale(d.outflow) - xScale(0)))
      .attr("prefecture", (d) => d.prefecture); // Add prefecture attribute
    // Add x-axis
   

    // Add labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2 + 10)
      .attr("text-anchor", "middle")
      .text("Population Change");


    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${width - margin.right},${height - margin.bottom})`
      );

    legend
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
        .attr("y", -50)
      .attr("fill", "cornflowerblue");

    legend.append("text").attr("x", -60).attr("y", -35).text("Inflow");

    legend
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("y", -20)
      .attr("fill", "#e62020");

    legend.append("text").attr("x", -60).attr("y", -5).text("Outflow");
  });
}

choropleth();

