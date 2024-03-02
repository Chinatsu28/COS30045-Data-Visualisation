
    // Set up the SVG container dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // Your CSV data
    const data = [
    { Year: 2000, Population: 345779 },
    { Year: 2001, Population: 351187 },
    // Add more years and populations...
    ];

    // Set up X and Y scales
    const x = d3.scaleBand()
    .domain(data.map(d => d.Year))
    .range([0, width])
    .padding(0.1);

    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Population)])
    .range([height, 0]);

    // Add X-axis
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

    // Add Y-axis
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add bars
    svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.Year))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.Population))
    .attr("height", d => height - y(d.Population));

