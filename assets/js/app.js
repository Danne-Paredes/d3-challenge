// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(newData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    newData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    //   console.log(data.poverty)
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(newData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([20, d3.max(newData, d => d.obesity)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================

    var node = chartGroup.selectAll("g")
                .data(newData)
                .enter()
                .append("g");

    var circlesGroup = node.append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "20")
    .attr("fill", "blue")
    .attr("opacity", ".9")
    .attr('class','stateCircle');

// used answer from here to add labels: https://stackoverflow.com/questions/12266967/d3-js-how-to-add-labels-to-scatter-points-on-graph
    node.append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .attr('class','stateText')
    .text(function(d) { return d.abbr; });


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr('class','d3-tip')
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    node.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("class", "active")
      .text("In Poverty(%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("class", "active")
      .text('Is Obese(%)');
  }).catch(function(error) {
    console.log(error);
  });
