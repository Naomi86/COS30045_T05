function renderEnergyScatterplot(data) {
	const observations = data.filter(row =>
		Number.isFinite(row.energy_consumpt) && Number.isFinite(row.star2)
	);
	if (observations.length === 0) return;

	const width = 640;
	const height = 320;
	const margin = { top: 12, right: 18, bottom: 54, left: 62 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;
	const xScale = d3.scaleLinear()
		.domain(d3.extent(observations, row => row.energy_consumpt))
		.nice()
		.range([0, plotWidth]);
	const yScale = d3.scaleLinear()
		.domain(d3.extent(observations, row => row.star2))
		.nice()
		.range([plotHeight, 0]);

	const svg = d3.select("#chart-1")
		.append("svg")
		.attr("class", "scatterplot")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Scatterplot of TV energy consumption and star rating");

	svg.append("g")
		.attr("class", "grid")
		.attr("transform", `translate(${margin.left},${margin.top})`)
		.call(d3.axisLeft(yScale).tickSize(-plotWidth).tickFormat(""));

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", `translate(${margin.left},${margin.top + plotHeight})`)
		.call(d3.axisBottom(xScale).ticks(6));

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", `translate(${margin.left},${margin.top})`)
		.call(d3.axisLeft(yScale));

	svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`)
		.selectAll("circle")
		.data(observations)
		.join("circle")
		.attr("class", "dot")
		.attr("cx", row => xScale(row.energy_consumpt))
		.attr("cy", row => yScale(row.star2))
		.attr("r", 3.5)
		.append("title")
		.text(row => `Energy: ${d3.format(",.1f")(row.energy_consumpt)} kWh/year; rating: ${row.star2}`);

	svg.append("text")
		.attr("class", "axis-label")
		.attr("x", margin.left + plotWidth / 2)
		.attr("y", height - 8)
		.attr("text-anchor", "middle")
		.text("Energy Consumption (kWh/year)");

	svg.append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -(margin.top + plotHeight / 2))
		.attr("y", 16)
		.attr("text-anchor", "middle")
		.text("Star Rating");
}

Promise.all([
	d3.csv("data/Ex5_ARE_Spot_Prices.csv", d3.autoType),
	d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv", d3.autoType),
	d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType),
	d3.csv("data/Ex5_TV_energy.csv", d3.autoType)
])
	.then(([spotPrices, tvEnergy55Inch, tvEnergyAllSizes, tvEnergy]) => {
		window.chartData = {
			spotPrices,
			tvEnergy55Inch,
			tvEnergyAllSizes,
			tvEnergy
		};
		renderEnergyScatterplot(tvEnergy);
	})
	.catch(error => {
		console.error("Could not load chart datasets:", error);
	});
