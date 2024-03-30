function init(data) {
   var w = 600;
   var h = 450;
   var padding = 55;
   var outerRadius = w / 3;
   var innerRadius = w / 6;
 
   var arc = d3.arc()
     .innerRadius(innerRadius)
     .outerRadius(outerRadius);
 
   var pie = d3.pie()
     .value(function(d) { return d.value; });
 
   var svg = d3.select("#proportion")
     .append("svg")
     .attr("width", w)
     .attr("height", h);
 
   var tooltip = d3.select("body")
     .append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);
 
   var arcs = svg.selectAll("g.arc")
     .data(pie(data))
     .enter()
     .append("g")
     .attr("class", "arc")
     .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")
     .on("mouseover", function(event, d) {
      d3.select(this).select("path")
          .transition()
          .duration(100)
          .attr("d", arc.padAngle(0.01));
  
      tooltip.transition()
          .duration(200)
          .style("opacity", .9);
  
          const tooltipWidth = 100; // Set the width of the tooltip box
          const tooltipHeight = 40; // Set the height of the tooltip box
  
          // Calculate the position for the tooltip
          const mouseX = d3.event.pageX;
          const mouseY = d3.event.pageY;
  
          const tooltipX = mouseX - tooltipWidth / 2;
          const tooltipY = mouseY - tooltipHeight - 400; // Adjust for a small gap
  
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
            .text(d.data.value);
  })
  .on("mouseout", function() {
      d3.select(this).select("path")
          .transition()
          .duration(100)
          .attr("d", arc.padAngle(0.03));
  
      tooltip.transition()
          .duration(500)
          .style("opacity", 0);

          svg.selectAll(".tooltip-box").remove();
        svg.selectAll(".tooltip-text").remove();
        d3.select(this).style("fill", "lightblue");
  });
  
 
   arcs.append("path")
     .attr("fill", function(d, i) {
       return d3.schemeCategory10[i];
     })
     .attr("d", arc.padAngle(0.03));
   
   // Legend
   var legend = svg.selectAll(".legend")
       .data(data.map(function(d) { return d.label; }))
       .enter().append("g")
       .attr("class", "legend")
       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

   // Legend rects
   legend.append("rect")
       .attr("x", w - 18)
       .attr("width", 18)
       .attr("height", 18)
       .style("fill", function(d, i) { return d3.schemeCategory10[i]; });

   // Legend text
   legend.append("text")
       .attr("x", w - 24)
       .attr("y", 9)
       .attr("dy", ".35em")
       .style("text-anchor", "end")
       .text(function(d) { return d; });
 }

 // Define a global variable to hold the selected year
// Define a global variable to hold the selected year
var selectedYear = "2021";

// Function to update the chart based on the selected year
function updateChart(data) {
   // Filter data for the selected year
   var filteredData = data.map(function(d) {
      return {
         label: d.Country,
         value: +d[selectedYear] || 0 // Convert value to a number, default to 0 if no data for the selected year
      };
   });

   

   // Remove the existing chart
   d3.select("#proportion").select("svg").remove();

   // Render the updated chart
   init(filteredData);
}

window.onload = function() {
   d3.csv("../data/immigration_proportion.csv").then(function(data) {
      // Initial rendering of the chart with the default year
      updateChart(data);

      // Event listeners to change the selected year
      d3.select("#pie2020").on("click", function () {
         selectedYear = "2020";
         updateChart(data);
      });
      d3.select("#pie2021").on("click", function () {
         selectedYear = "2021";
         updateChart(data);
      });
      d3.select("#pie2019").on("click", function () {
         selectedYear = "2019";
         updateChart(data);
      });
      d3.select("#pie2018").on("click", function () {
         selectedYear = "2018";
         updateChart(data);
      });
      d3.select("#pie2017").on("click", function () {
         selectedYear = "2017";
         updateChart(data);
      });
   }).catch(function(error) {
      console.error("Error loading data:", error); // Log any error that occurs during data loading
   });
};


 