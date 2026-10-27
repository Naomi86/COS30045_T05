const chartData = {
	spotPrices: d3.csvParse(window.chartCsvData.spotPrices, d3.autoType),
	tvEnergy55Inch: d3.csvParse(window.chartCsvData.tvEnergy55Inch, d3.autoType),
	tvEnergyAllSizes: d3.csvParse(window.chartCsvData.tvEnergyAllSizes, d3.autoType),
	tvEnergy: d3.csvParse(window.chartCsvData.tvEnergy, d3.autoType)
};

window.chartData = chartData;
renderEnergyScatterplot(chartData.tvEnergy);
renderEnergyDonut(chartData.tvEnergyAllSizes);
renderEnergyBarChart(chartData.tvEnergy55Inch);
renderSpotPriceLineChart(chartData.spotPrices);