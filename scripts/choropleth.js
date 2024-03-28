function choropleth() {
  const originalWidth = 600;
  const originalHeight = 600;
  var selectedPrefecture = null;
  // Enlarge the SVG by 1.5 times
  const enlargedWidth = originalWidth * 1.3;
  const enlargedHeight = originalHeight * 1.3;
  var selected = null;
  // Append an SVG container to the map-container div
  const svg = d3
    .select("#choropleth")
    .append("svg")
    .attr("width", enlargedWidth)
    .attr("height", enlargedHeight);

  // Load the GeoJSON data for Vietnam
  d3.csv("../data/a001.csv").then(function (data) {
    d3.json("../data/japan.json").then(function (json) {
      // Create a projection for the map
      const projection = d3
        .geoMercator()
        .fitSize([enlargedWidth, enlargedHeight], json);

      // Create a path generator
      const path = d3.geoPath().projection(projection);

      // Draw the map
      const features = svg
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
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
          svg
            .append("rect")
            .attr("class", "tooltip-box")
            .attr("x", tooltipX)
            .attr("y", tooltipY)
            .attr("width", tooltipWidth + 10)
            .attr("height", tooltipHeight)
            .attr("fill", "rgba(62,197,255,0.8)")
            .style("border-radius", "10px"); // Orange background color

          // Add text to the tooltip box
          svg
            .append("text")
            .attr("class", "tooltip-text")
            .attr("x", tooltipX + tooltipWidth / 2)
            .attr("y", tooltipY + tooltipHeight / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(d.properties.nam);

          d3.select(this).style("stroke", "black")
            .style("stroke-width", 1)
        })
        .on("click", function (d) {
          selectedPrefecture = d.properties.nam;
          var prefecture = document.getElementById("prefecture");
          prefecture.innerHTML = selectedPrefecture;

          createTornadoChart("../data/immigrant_by_age.json", selectedPrefecture);
        })

        .on("mouseout", function () {
          // Remove the tooltip box on mouseout
          svg.selectAll(".tooltip-box").remove();
          svg.selectAll(".tooltip-text").remove();
          d3.select(this).style("stroke", "none");
        });
    });


  });
}

function createTornadoChart(filename, selectedPrefecture) {
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
    const height = 400 - margin.top - margin.bottom;

    // Create SVG element for the chart
    const svg = tornadoChartContainer
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate the maximum absolute value across inflow and outflow data points
    const maxAbsValue = d3.max(ageGroups, (d) =>
      Math.max(Math.abs(d.inflow), Math.abs(d.outflow))
    );

    // Create scales for the chart
    const xScale = d3
      .scaleLinear()
      .domain([-maxAbsValue, maxAbsValue])
      .range([50, width - 50]);

    const yScale = d3
      .scaleBand()
      .domain(ageGroups.map((d) => d.age_range))
      .range([20, height - 20])
      .padding(0.1);

    // Create bars for inflow
    svg
      .selectAll(".inflow-bar")
      .data(ageGroups)
      .enter()
      .append("rect")
      .attr("class", "inflow-bar")
      .attr("x", (d) => xScale(0)) // Start from 0 for inflow
      .attr("y", (d) => yScale(d.age_range))
      .attr("width", 0) // Initially set width to 0 for animation
      .attr("height", yScale.bandwidth())
      .style("fill", "steelblue")
      .transition()
      .duration(1000) // Transition duration
      .attr("width", (d) => Math.abs(xScale(d.inflow) - xScale(0) - 50)); // Expand width

    // Create bars for outflow
    svg
      .selectAll(".outflow-bar")
      .data(ageGroups)
      .enter()
      .append("rect")
      .attr("class", "outflow-bar")
      .attr("x", (d) => xScale(-Math.abs(d.outflow))) // Start from 0 for outflow
      .attr("y", (d) => yScale(d.age_range))
      .attr("width", 0) // Initially set width to 0 for animation
      .attr("height", yScale.bandwidth())
      .style("fill", "orange")
      .transition()
      .duration(1000) // Transition duration
      .attr("width", (d) => Math.abs(xScale(d.outflow) - xScale(0))); // Expand width

    // Add x-axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    // Add labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .text("Population Change");

    svg
      .append("text")
      .attr("x", -margin.left)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Age Range");

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
      .attr("fill", "steelblue");

    legend.append("text").attr("x", 30).attr("y", 10).text("Inflow");

    legend
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("y", 30)
      .attr("fill", "orange");

    legend.append("text").attr("x", 30).attr("y", 40).text("Outflow");
  });
}



choropleth();
