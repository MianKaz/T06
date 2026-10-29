// Build the screen-technology buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners
    d3.select("#filters_screen")
        .selectAll("button")
        .data(filters_screen, d => d.id)
        .join("button")
        .attr("type", "button")
        .attr("class", d => `filter${d.isActive ? " active" : ""}`)
        .attr("aria-pressed", d => d.isActive)
        .text(d => d.label)
        .on("click", (event, selectedFilter) => {
            filters_screen.forEach(filter => {
                filter.isActive = selectedFilter.id === "all"
                    ? filter.id === "all"
                    : filter.id === selectedFilter.id;
            });

            d3.select("#filters_screen")
                .selectAll("button")
                .attr("class", d => `filter${d.isActive ? " active" : ""}`)
                .attr("aria-pressed", d => d.isActive);

            updateHistogram(selectedFilter.id, data);
        });
};

const updateHistogram = (filterId, data) => {
    // Step 7.4 Update the histogram
    const filteredData = filterId === "all"
        ? data
        : data.filter(d => d.screenTech === filterId);
    const updatedBins = binGenerator(filteredData);

    innerChart.selectAll("rect.bar")
        .data(updatedBins)
        .join("rect")
        .attr("class", "bar")
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2)
        .transition()
        .duration(300)
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => innerHeight - yScale(d.length));
};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart
    const tooltip = innerChartS.append("g")
        .attr("class", "tooltip")
        .attr("transform", "translate(0, 500)")
        .style("opacity", 0)
        .style("pointer-events", "none");

    // Step 3.3 Append tooltip background rectangle
    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.9);

    // Step 3.4 Apped tooltip text
    tooltip.append("text")
        .text("N/A")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2 + 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")
        .style("font-weight", 700);

};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    // Step 3.6 Select all circles in scatter plot
    // Step 3.7 Attach event listeners to mouseenter and mouseleave events
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            tooltip.select("text")
                .text(`${d.screenSize} inches`);

            // Get the hovered circle's position
            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            // Keep the tooltip inside the chart while centring it above the circle.
            const tooltipX = Math.max(
                0,
                Math.min(cx - tooltipWidth / 2, innerWidth - tooltipWidth)
            );
            const tooltipY = Math.max(0, cy - 1.5 * tooltipHeight);

            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${tooltipX},${tooltipY})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .style("opacity", 0)
                .attr("transform", "translate(0,500)");
        });
};