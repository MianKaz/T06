const drawScatterplot = (data) => {
    // T06-2 Step 2.2
    /// Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "Scatterplot of TV screen size by energy star rating");

    /// Create an inner chart group with margins
    innerChartS = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // T06-2 Step 2.3
    /// Set up x and y scales using data extents
    const starExtent = d3.extent(data, d => d.star);
    const sizeExtent = d3.extent(data, d => d.screenSize);

    /// Map star ratings and screen sizes to positions within the chart area.
    xScaleS
        .domain([starExtent[0] - 0.5, starExtent[1] + 0.5])
        .range([0, innerWidth]);
    yScaleS
        .domain([sizeExtent[0], sizeExtent[1]])
        .range([innerHeight, 0])
        .nice();

    // T06-2 Step 2.4
    /// (Corrected code) Set up colours for screen technologies
    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];

    colorScale
        .domain(uniqueTechs)
        .range(d3.schemeCategory10);
    
    // T06-2 Step 2.5 Draw the circles
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.screenSize))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);

    // T06-2 Step 2.6 Add bottom and left axis
    /// Add axes
    innerChartS.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScaleS));
    innerChartS.append("g")
        .call(d3.axisLeft(yScaleS));

    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height - 5)
        .attr("class", "axis-label");
    svg.append("text")
        .text("Screen size (inches)")
        .attr("text-anchor", "start")
        .attr("x", 5)
        .attr("y", margin.top - 15)
        .attr("class", "axis-label");

    // T06-2 Step 2.7 Add legend
    /// Add a legend on the right-hand side
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 100},${margin.top})`);

    // Show each screen technology with its matching point colour.
    uniqueTechs.forEach((tech, index) => {
        const item = legend.append("g")
            .attr("transform", `translate(0,${index * 22})`);

        item.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colorScale(tech));
        item.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .text(tech)
            .attr("class", "axis-label");
    });
};