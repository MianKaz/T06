const drawHistogram = (data) => {
    // Step 6.1 Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "Histogram of TV energy consumption");

    // Create an inner chart group with margins
    innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Step 6.2 Set up bins
    // First, in shared-constants.js, create a bin generator using d3.bin
    // Second, Generate the bins
    const bins = binGenerator(data); // Save the bins into an array

    // Step 6.3 Get the lower and upper bounds of bins
    const minEnergy = d3.min(bins, d => d.x0);
    const maxEnergy = d3.max(bins, d => d.x1);
    const maxBinLength = d3.max(bins, d => d.length) || 0;

    // Define scales (from shared constants)
    xScale
        .domain([minEnergy, maxEnergy])
        .range([0, innerWidth]);
    yScale
        .domain([0, maxBinLength])
        .range([innerHeight, 0])
        .nice();

    // Step 6.4 Draw the bars of the histogram
    innerChart.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2);

    // Step 6.5 Add axes
    const bottomAxis = d3.axisBottom(xScale);

    // Add the x-axis to the bottom of the inner chart
    innerChart.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(bottomAxis);

    // Add the x-axis label
    svg.append("text")
        .text("Labelled Energy Consumption (kWh/year)")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    // Step 6.6 Add left axis
    const leftAxis = d3.axisLeft(yScale);

    // Add the y-axis to the bottom of the chart relative to the inner chart
    innerChart.append("g")
        .call(leftAxis);

    svg.append("text")
        .text("Frequency")
        .attr("text-anchor", "start")
        .attr("x", 5)
        .attr("y", margin.top - 15)
        .attr("class", "axis-label");
};