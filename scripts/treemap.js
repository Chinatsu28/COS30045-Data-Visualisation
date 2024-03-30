function treemap() {
var data = [
    { Continent: "Asia", Country: "India", Total: 36058, Percentage: 1.3 },
    { Continent: "Asia", Country: "Indonesia", Total: 59820, Percentage: 2.2 },
    { Continent: "Asia", Country: "Korea", Total: 436167, Percentage: 15.8 },
    { Continent: "Asia", Country: "Thailand", Total: 50324, Percentage: 1.8 },
    { Continent: "Asia", Country: "China", Total: 767797, Percentage: 27.8 },
    { Continent: "Asia", Country: "Bangladesh", Total: 17538, Percentage: 0.6 },
    {
      Continent: "Asia",
      Country: "Philippines",
      Total: 276615,
      Percentage: 10.0,
    },
    { Continent: "Asia", Country: "Viet Nam", Total: 432934, Percentage: 15.7 },
    { Continent: "Asia", Country: "Malaysia", Total: 9659, Percentage: 0.3 },
    {
      Continent: "Europe",
      Country: "United Kingdom",
      Total: 16163,
      Percentage: 0.6,
    },
    { Continent: "Europe", Country: "Germany", Total: 5553, Percentage: 0.2 },
    { Continent: "Europe", Country: "France", Total: 11319, Percentage: 0.4 },
    {
      Continent: "North America",
      Country: "Canada",
      Total: 9848,
      Percentage: 0.4,
    },
    {
      Continent: "North America",
      Country: "U.S.A.",
      Total: 54162,
      Percentage: 2.0,
    },
    {
      Continent: "South America",
      Country: "Brazil",
      Total: 204879,
      Percentage: 7.4,
    },
    {
      Continent: "South America",
      Country: "Peru",
      Total: 48291,
      Percentage: 1.7,
    },
    { Continent: "Others", Country: "Australia", Total: 8960, Percentage: 0.3 },
  ];

  // Create the tree map
  var width = 800;
  var height = 500;

  var svg = d3
    .select("#treeMap")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var treemap = d3.treemap().size([width, height]).padding(1);

  var root = d3.hierarchy({ children: data }).sum((d) => d.Total);

  treemap(root);

  var cell = svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  cell
    .append("rect")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => color(d.data.Continent));

  cell
    .append("text")
    .attr("x", 5)
    .attr("y", 15)
    .attr("fill", "white")
    .text((d) => `${d.data.Percentage}`);
}

treemap();