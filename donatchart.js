function renderEnergyDonut(data) {
	const energyField = "Mean(Labelled energy consumption (kWh/year))";
	const observations = data.filter(row =>
		row.Screen_Tech && Number.isFinite(row[energyField]) && row[energyField] > 0
	);
	if (observations.length === 0) return;

	const width = 600;
	const height = 260;
	const colors = d3.scaleOrdinal()
		.domain(observations.map(row => row.Screen_Tech))
		.range(["#c75c3a", "#3f7965", "#d4a33f", "#6586a0"]);
	const pieData = d3.pie()
		.sort(null)
		.value(row => row[energyField])(observations);
	const arc = d3.arc()
		.innerRadius(52)
		.outerRadius(92);
	const total = d3.sum(observations, row => row[energyField]);
	const svg = d3.select("#chart-2")
		.append("svg")
		.attr("class", "donut-chart")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Donut chart of mean TV energy consumption by screen technology");

	const donut = svg.append("g")
		.attr("transform", "translate(140,130)");

	donut.selectAll("path")
		.data(pieData)
		.join("path")
		.attr("class", "donut-slice")
		.attr("d", arc)
		.attr("fill", slice => colors(slice.data.Screen_Tech))
		.append("title")
		.text(slice => `${slice.data.Screen_Tech}: ${d3.format(",.1f")(slice.data[energyField])} kWh/year (${d3.format(".1%")(slice.value / total)})`);

	const legend = svg.append("g")
		.attr("class", "donut-legend")
		.attr("transform", "translate(285,77)");
	const entries = legend.selectAll("g")
		.data(pieData)
		.join("g")
		.attr("class", "donut-legend-entry")
		.attr("transform", (slice, index) => `translate(0,${index * 48})`);

	entries.append("rect")
		.attr("width", 12)
		.attr("height", 12)
		.attr("rx", 2)
		.attr("fill", slice => colors(slice.data.Screen_Tech));

	entries.append("text")
		.attr("class", "donut-label")
		.attr("x", 20)
		.attr("y", 10)
		.text(slice => `${slice.data.Screen_Tech}  ${d3.format(",.1f")(slice.data[energyField])} kWh/year`);

	entries.append("text")
		.attr("class", "donut-share")
		.attr("x", 20)
		.attr("y", 28)
		.text(slice => `${d3.format(".1%")(slice.value / total)} of combined mean`);
}