/**
 * Display a bubble chart based on the provided data and selected value.
 * @param {Array} data - The data to be displayed in the bubble chart.
 * @param {string} selectedValue - The selected value determining how the data should be visualized.
 * @returns {void}
 */
export function displayChart(data, selectedValue) {
  // Assign random radius to each data point
  data = data.map((item) => ({
    ...item,
    radius: Math.floor(Math.random() * (60 - 10 + 1)) + 10,
  }))
  // Get width and height of the chart container
  const width = document.getElementById("chart-container").clientWidth
  const height = document.getElementById("chart-container").clientHeight
  // Define default values for sorting and data selection
  let first = "alpha3Code"
  let second = "population"
  // Adjust sorting parameters based on selected value
  if (selectedValue === "noOfBoarders") {
    second = "borders"
  } else if (selectedValue === "noOfTimezones") {
    second = "timezones"
  } else if (selectedValue === "noOfLanguages") {
    second = "languages"
  } else if (selectedValue === "countriesInRegion") {
    first = "region"
    second = "country"
  } else if (selectedValue === "uniqueTimeZones") {
    first = "region"
    second = "timezones"
    // If uniqueTimeZones, map timezones array to its length
    data = data.map((item) => ({
      ...item,
      timezones: item.timezones.length,
    }))
  }
  // Sort the data by population in descending order
  const sortedData = data.sort((a, b) => b[second] - a[second])
  // Remove existing elements inside the chart container
  d3.select("#chart").selectAll("*").remove()
  // Create the force simulation for the bubble chart
  const simulation = d3
    .forceSimulation(sortedData)
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "collision",
      d3.forceCollide().radius((d) => d.radius + 2)
    )
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .alphaDecay(0.02)

  // Create the SVG element if it doesn't exist
  let svg = d3.select("#chart")
  if (svg.empty()) {
    svg = d3
      .select("body")
      .append("svg")
      .attr("id", "chart")
      .attr("width", width)
      .attr("height", height)
  }
  // Set width and height attributes for the SVG
  svg.attr("width", width).attr("height", height)
  // Update existing bubbles
  let bubbles = svg.selectAll(".bubble").data(sortedData)

  // Exit old bubbles
  bubbles.exit().remove()

  // Enter new bubbles
  const bubblesEnter = bubbles.enter().append("g").attr("class", "bubble")
  const bubbleMargin = 5
  // Add circles to new bubbles
  bubblesEnter
    .append("circle")
    .attr("r", (d) => d.radius)
    .attr("stroke", "black")
    .style("fill", "black")
    .attr("transform", `translate(${bubbleMargin}, ${bubbleMargin})`)
  // Add text to new bubbles
  bubblesEnter
    .append("text")
    .style("text-anchor", "middle")
    .classed("text-no-select", true)
    .append("tspan")
    .attr("class", "country")
    .each(function (d) {
      const text = d3.select(this)
      text.append("tspan").attr("x", 0).text(d[first])
      text.append("tspan").attr("x", 0).attr("dy", "1.2em").text(d[second])
    })
    .style("font-size", function (d) {
      // Adjust font size based on bubble radius
      let fontSizeInPixels = Math.min(
        2 * d.radius,
        ((2 * d.radius - 8) / this.getComputedTextLength()) * 10
      )
      // Set maximum font size to 0.8rem
      fontSizeInPixels = Math.min(fontSizeInPixels, 1 * 16) // Convert rem to pixels
      const fontSizeInRem = fontSizeInPixels / 16 // Convert pixels to rem
      return fontSizeInRem + "rem"
    })
    .style("fill", "white")
    .attr("transform", `translate(${bubbleMargin}, ${bubbleMargin})`)
  // Merge enter and update selections
  bubbles = bubblesEnter.merge(bubbles)

  // Set the text color to black
  bubbles.selectAll("text").style("fill", "black")

  // Start the simulation
  simulation.nodes(sortedData).on("tick", () => {
    bubbles.attr("transform", (d) => `translate(${d.x}, ${d.y})`)
  })

  // Add event listeners for tooltip
  bubblesEnter
    .on("mouseover", function (event, d) {
      // Construct tooltip HTML based on selected value
      let tooltipHtml = `<div style="display: flex; flex-direction: column; ">
          <p> <strong>Name</strong>: ${d["name"]}</p>
          <p><strong>Capital</strong>: ${d["capital"]}</p>
          <p><strong>Region</strong>: ${d["region"]}</p>
          <p><strong>Population</strong>: ${d["population"]}</p>
      </div>`
      if (selectedValue === "countriesInRegion") {
        tooltipHtml = `<div style="display: flex; flex-direction: column; ">
          <p> <strong>Region</strong>: ${d["region"]}</p>
          <p><strong>No Of Countries</strong>: ${d["country"]}</p>
      </div>`
      } else if (selectedValue === "uniqueTimeZones") {
        tooltipHtml = `<div style="display: flex; flex-direction: column; ">
          <p> <strong>Region</strong>: ${d["region"]}</p>
      </div>`
      }
      const tooltip = d3.select(".tooltip")
      tooltip
        .style("visibility", "visible")
        .html(tooltipHtml)
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px")
    })
    .on("mousemove", function (event) {
      const tooltip = d3.select(".tooltip")
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px")
    })
    .on("mouseout", function () {
      const tooltip = d3.select(".tooltip")
      tooltip.style("visibility", "hidden")
    })
}
