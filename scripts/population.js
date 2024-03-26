function ditmednk() {
  d3.csv("../data/population.csv").then(function (data) {
    console.table(data);
    // Convert numerical values from strings to numbers
    data.forEach(function (d) {
      d.Inflows = +d.Inflows;
      d.Outflows = +d.Outflows;
    });

    // Proceed with the visualization setup (margin, width, height)
    var margin = { top: 40, right: 20, bottom: 30, left: 70 },
      width = 860 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Append SVG object to the HTML element with ID "InOutflow"
    var svg = d3
      .select("#InOutflow")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var captionBox = d3.select("#captionBox");
    captionBox.html("<p>Year: <br>Inflow: <br>Outflow:</p>");
    // Set up scales
    var x = d3.scaleBand().range([0, width]).padding(0.1);
    var y0 = d3.scaleLinear().range([height, 0]);

    x.domain(
      data.map(function (d) {
        return d.Year;
      })
    );
    y0.domain([
      0,
      d3.max(data, function (d) {
        return Math.max(d.Inflows);
      }),
    ]);

    // Axes
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y0));

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.Year);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y0(d.Inflows);
      })
      .attr("height", function (d) {
        return height - y0(d.Inflows);
      })
      .style("fill", "cornflowerblue")
      .on("mouseover", function (event, d) {
        captionBox
          .html(
            "<p>Year: " +
              data[d].Year +
              "<br>Inflow: " +
              data[d].Inflows +
              "<br>Outflow: " +
              data[d].Outflows +
                "</p>" 
          )
          .style("visibility", "visible");
      })
      .on("mouseout", function () {
        captionBox.html("<p>Year: <br>Inflow: <br>Outflow:</p>" );
      });

    // Line for Outflows
    var line = d3
      .line()
      .x(function (d) {
        return x(d.Year) + x.bandwidth() / 2;
      })
      .y(function (d) {
        return y0(d.Outflows);
      });

    var tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "lightgrey")
      .style("padding", "8px")
      .style("border-radius", "4px");

    var tooltipBar = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip-bar")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "lightblue")
      .style("padding", "8px")
      .style("border-radius", "4px");

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "red");

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function (d) {
        return x(d.Year) + x.bandwidth() / 2;
      })
      .attr("cy", function (d) {
        return y0(d.Outflows);
      })
      .attr("r", 3)
      .attr("fill", "red")
      .on("mouseover", function (event, d) {
        captionBox
          .html(
            "<p>Year: " +
              data[d].Year +
              "<br>Inflow: " +
              data[d].Inflows +
              "<br>Outflow: " +
              data[d].Outflows +
                "</p>" 
          )
          .style("visibility", "visible");
      })
      .on("mouseout", function () {
        captionBox.html(
            "<p>Year: <br>Inflow: <br>Outflow:</p>" 
        )
      });
    // Create a legend for inflows and outflows
    // Create a legend for inflows and outflows
    var legendData = [
      { label: "Inflows", shape: "rect", color: "cornflowerblue", size: 25 },
      { label: "Outflows", shape: "circle", color: "red", size: 5 },
    ];

    var legend = d3
      .select("#firstLegend")
      .append("svg")
      .attr("width", 120)
      .attr("height", 60)
      .append("g")
      .attr("transform", "translate(10, 10)");

    legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      })
      .each(function (d) {
        if (d.shape === "rect") {
          d3.select(this)
            .append("rect")
            .attr("width", d.size)
            .attr("height", d.size)
            .attr("fill", d.color);
        } else if (d.shape === "circle") {
          

            d3.select(this)
            .append("circle")
            .attr("cx", d.size + 9)
            .attr("cy", d.size + 14)
            .attr("r", d.size)
            .attr("fill", d.color)
            .attr("stroke", "white") // Optional: Add a white stroke for better visibility
            .attr("stroke-width", 2);
        
            d3.select(this)
            .append("line")
            .attr("x1", 0)
            .attr("y1", d.size + 14)
            .attr("x2", d.size + 20)
            .attr("y2", d.size + 14)
            .attr("stroke", d.color)
            .attr("stroke-width", 2);
        }
      });

    legend
      .selectAll(".legend-label")
      .data(legendData)
      .enter()
      .append("text")
      .attr("class", "legend-label")
      .attr("x", 35)
      .attr("y", function (d, i) {
        return i * 20 + 20;
      })
      .text(function (d) {
        return d.label;
      })
      .style("font-size", "12px");
  });
}

window.onload = ditmednk;
