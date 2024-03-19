const width = 800;
    const height = 400;
    const margin = { top: 20, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#proportion")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    // Load data from CSV
    d3.csv("../data/immigration_proportion.csv").then(function(data) {
      console.table("Data: " + data);
      // Remove 2021 data
      data = data.filter(d => d.Year !== "2021");

      // Group data into 10-year intervals
      const groupedData = [];
      for (let i = 0; i < data.length; i += 10) {
        groupedData.push(data.slice(i, i + 10));
      }

      // Define scales
      const xScale = d3.scaleBand()
                      .domain(groupedData.map((d, i) => i))
                      .range([margin.left, innerWidth + margin.left])
                      .padding(0.1);

      const yScale = d3.scaleLinear()
                      .domain([0, d3.max(data, d => +d.Value)])
                      .range([innerHeight + margin.top, margin.top]);

      // Define line generator
      const line = d3.line()
                     .x((d, i) => xScale(i))
                     .y(d => yScale(+d.Value));

      // Draw lines
      svg.selectAll("path")
         .data(groupedData)
         .join("path")
         .attr("d", d => line(d))
         .attr("fill", "none")
         .attr("stroke", "steelblue");

      // Draw x-axis
      svg.append("g")
         .attr("transform", `translate(0, ${innerHeight + margin.top})`)
         .call(d3.axisBottom(xScale).tickFormat(i => `${i * 10 + 1950}-${i * 10 + 1959}`))
         .selectAll("text")
         .style("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", ".15em")
         .attr("transform", "rotate(-65)");

      // Draw y-axis
      svg.append("g")
         .attr("transform", `translate(${margin.left}, 0)`)
         .call(d3.axisLeft(yScale));

      // Add labels
      svg.append("text")
         .attr("transform", `translate(${width / 2}, ${height - 10})`)
         .style("text-anchor", "middle")
         .text("Year");

      svg.append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 0)
         .attr("x", 0 - (height / 2))
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .text("Value");
    }).catch(function(error) {
      console.error("Error loading the data: ", error);
    });