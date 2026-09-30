function renderEnergyBarChart(data) {
	const energyField = "Mean(Labelled energy consumption (kWh/year))";
	const observations = data.filter(row =>
		row.Screen_Tech && Number.isFinite(row[energyField])
	);
	if (observations.length === 0) return;

	const width = 640;
	const height = 280;
	const margin = { top: 12, right: 78, bottom: 48, left: 70 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;
	const xScale = d3.scaleLinear()
		.domain([0, d3.max(observations, row => row[energyField]) * 1.18])
		.nice()
		.range([0, plotWidth]);
	const yScale = d3.scaleBand()
		.domain(observations.map(row => row.Screen_Tech))
		.range([0, plotHeight])
		.padding(0.32);
	const colors = d3.scaleOrdinal()
		.domain(observations.map(row => row.Screen_Tech))
		.range(["#c75c3a", "#3f7965", "#d4a33f"]);
	const svg = d3.select("#chart-3")
		.append("svg")
		.attr("class", "bar-chart")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Mean annual energy consumption by screen technology for 55-inch TVs");
	const plot = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	plot.append("g")
		.attr("class", "bar-grid")
		.attr("transform", `translate(0,${plotHeight})`)
		.call(d3.axisBottom(xScale).ticks(5).tickSize(-plotHeight).tickFormat(""));

	plot.append("g")
		.attr("class", "bar-axis")
		.call(d3.axisLeft(yScale));

	plot.selectAll("rect")
		.data(observations)
		.join("rect")
		.attr("class", "bar")
		.attr("x", 0)
		.attr("y", row => yScale(row.Screen_Tech))
		.attr("width", row => xScale(row[energyField]))
		.attr("height", yScale.bandwidth())
		.attr("rx", 3)
		.attr("fill", row => colors(row.Screen_Tech))
		.append("title")
		.text(row => `${row.Screen_Tech}: ${d3.format(",.1f")(row[energyField])} kWh/year`);

	plot.selectAll(".bar-value")
		.data(observations)
		.join("text")
		.attr("class", "bar-value")
		.attr("x", row => xScale(row[energyField]) + 8)
		.attr("y", row => yScale(row.Screen_Tech) + yScale.bandwidth() / 2)
		.attr("dy", "0.35em")
		.text(row => d3.format(",.1f")(row[energyField]));

	plot.append("g")
		.attr("class", "bar-axis")
		.attr("transform", `translate(0,${plotHeight})`)
		.call(d3.axisBottom(xScale).ticks(5));

	svg.append("text")
		.attr("class", "bar-axis-label")
		.attr("x", margin.left + plotWidth / 2)
		.attr("y", height - 5)
		.attr("text-anchor", "middle")
		.text("Mean Energy Consumption (kWh/year)");
}
