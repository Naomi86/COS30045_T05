function renderSpotPriceLineChart(data) {
	const stateFields = [
		{ name: "Queensland", field: "Queensland ($ per megawatt hour)", color: "#c75c3a" },
		{ name: "New South Wales", field: "New South Wales ($ per megawatt hour)", color: "#3f7965" },
		{ name: "Victoria", field: "Victoria ($ per megawatt hour)", color: "#d4a33f" },
		{ name: "South Australia", field: "South Australia ($ per megawatt hour)", color: "#6586a0" },
		{ name: "Tasmania", field: "Tasmania ($ per megawatt hour)", color: "#9a6680" },
		{ name: "Snowy", field: "Snowy ($ per megawatt hour)", color: "#65733b" }
	];
	const observations = data
		.map(row => ({ ...row, year: Number(row.Year) }))
		.filter(row => Number.isFinite(row.year) && row.year >= 1998 && row.year <= 2024)
		.sort((a, b) => a.year - b.year);
	const values = observations.flatMap(row =>
		stateFields.map(state => row[state.field]).filter(Number.isFinite)
	);
	if (observations.length === 0 || values.length === 0) return;

	const width = 640;
	const height = 340;
	const margin = { top: 46, right: 18, bottom: 52, left: 64 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;
	const xScale = d3.scaleLinear()
		.domain(d3.extent(observations, row => row.year))
		.range([0, plotWidth]);
	const yScale = d3.scaleLinear()
		.domain([0, d3.max(values)])
		.nice()
		.range([plotHeight, 0]);
	const line = d3.line()
		.defined(point => Number.isFinite(point.value))
		.x(point => xScale(point.year))
		.y(point => yScale(point.value));
	const svg = d3.select("#chart-4")
		.append("svg")
		.attr("class", "spot-price-chart")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Annual wholesale spot prices by Australian region from 1998 to 2024");
	const plot = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	plot.append("g")
		.attr("class", "spot-grid")
		.call(d3.axisLeft(yScale).ticks(5).tickSize(-plotWidth).tickFormat(""));

	plot.append("g")
		.attr("class", "spot-axis")
		.attr("transform", `translate(0,${plotHeight})`)
		.call(d3.axisBottom(xScale)
			.tickValues(d3.range(1998, 2025, 4).concat(2024))
			.tickFormat(d3.format("d")));

	plot.append("g")
		.attr("class", "spot-axis")
		.call(d3.axisLeft(yScale).ticks(5));

	const series = stateFields.map(state => ({
		...state,
		points: observations.map(row => ({
			year: row.year,
			value: row[state.field]
		}))
	}));

	plot.selectAll(".spot-line")
		.data(series)
		.join("path")
		.attr("class", "spot-line")
		.attr("d", state => line(state.points))
		.attr("stroke", state => state.color);

	const legend = svg.append("g")
		.attr("class", "spot-legend")
		.attr("transform", `translate(${margin.left},15)`);
	const legendItems = legend.selectAll("g")
		.data(stateFields)
		.join("g")
		.attr("transform", (state, index) => `translate(${(index % 3) * 175},${Math.floor(index / 3) * 19})`);

	legendItems.append("line")
		.attr("x1", 0)
		.attr("x2", 18)
		.attr("y1", 6)
		.attr("y2", 6)
		.attr("stroke", state => state.color);

	legendItems.append("text")
		.attr("x", 24)
		.attr("y", 10)
		.text(state => state.name);

	const pointGroups = plot.selectAll(".spot-series-points")
		.data(series)
		.join("g")
		.attr("class", "spot-series-points")
		.attr("fill", state => state.color);

	pointGroups.selectAll("circle")
		.data(state => state.points.filter(point => Number.isFinite(point.value)).map(point => ({ ...point, state: state.name })))
		.join("circle")
		.attr("cx", point => xScale(point.year))
		.attr("cy", point => yScale(point.value))
		.attr("r", 2.2)
		.attr("class", "spot-point")
		.append("title")
		.text(point => `${point.state}, ${point.year}: $${d3.format(",.1f")(point.value)} per MWh`);

	svg.append("text")
		.attr("class", "spot-axis-label")
		.attr("x", margin.left + plotWidth / 2)
		.attr("y", height - 6)
		.attr("text-anchor", "middle")
		.text("Year");

	svg.append("text")
		.attr("class", "spot-axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -(margin.top + plotHeight / 2))
		.attr("y", 15)
		.attr("text-anchor", "middle")
		.text("Spot Price ($/MWh)");
}
