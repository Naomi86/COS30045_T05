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
		renderEnergyDonut(tvEnergyAllSizes);
	})
	.catch(error => {
		console.error("Could not load chart datasets:", error);
	});
