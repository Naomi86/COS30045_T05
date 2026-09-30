function renderEnergyBarChart(data) {
	const energyField = "Mean(Labelled energy consumption (kWh/year))";
	const observations = data.filter(row =>
		row.Screen_Tech && Number.isFinite(row[energyField])
	);
	if (observations.length === 0) return;

	const width = 640;
	const height = 280;
	const margin = { top: 22, right: 20, bottom: 42, left: 62 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;
	const xScale = d3.scaleBand()
		.domain(observations.map(row => row.Screen_Tech))
		.range([0, plotWidth])
		.padding(0.32);
	const yScale = d3.scaleLinear()
		.domain([0, d3.max(observations, row => row[energyField]) * 1.18])
		.nice()
		.range([plotHeight, 0]);
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
		.call(d3.axisLeft(yScale).ticks(5).tickSize(-plotWidth).tickFormat(""));

	plot.append("g")
		.attr("class", "bar-axis")
		.attr("transform", `translate(0,${plotHeight})`)
		.call(d3.axisBottom(xScale));

	plot.append("g")
		.attr("class", "bar-axis")
		.call(d3.axisLeft(yScale).ticks(5));

	plot.selectAll("rect")
		.data(observations)
		.join("rect")
		.attr("class", "bar")
		.attr("x", row => xScale(row.Screen_Tech))
		.attr("y", row => yScale(row[energyField]))
		.attr("width", xScale.bandwidth())
		.attr("height", row => plotHeight - yScale(row[energyField]))
		.attr("rx", 3)
		.attr("fill", row => colors(row.Screen_Tech))
		.append("title")
		.text(row => `${row.Screen_Tech}: ${d3.format(",.1f")(row[energyField])} kWh/year`);

	plot.selectAll(".bar-value")
		.data(observations)
		.join("text")
		.attr("class", "bar-value")
		.attr("x", row => xScale(row.Screen_Tech) + xScale.bandwidth() / 2)
		.attr("y", row => yScale(row[energyField]) - 7)
		.attr("text-anchor", "middle")
		.text(row => d3.format(",.1f")(row[energyField]));

	svg.append("text")
		.attr("class", "bar-axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -(margin.top + plotHeight / 2))
		.attr("y", 16)
		.attr("text-anchor", "middle")
		.text("Mean Energy Consumption (kWh/year)");
}
