$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$csvFiles = [ordered]@{
    spotPrices = "Ex5_ARE_Spot_Prices.csv"
    tvEnergy55Inch = "Ex5_TV_energy_55inchtv_byScreenType.csv"
    tvEnergyAllSizes = "Ex5_TV_energy_Allsizes_byScreenType.csv"
    tvEnergy = "Ex5_TV_energy.csv"
}
$csvData = [ordered]@{}

foreach ($key in $csvFiles.Keys) {
    $path = Join-Path $root "data\$($csvFiles[$key])"
    $csvData[$key] = [System.IO.File]::ReadAllText($path)
}

$json = ConvertTo-Json -InputObject $csvData -Compress
$output = "window.chartCsvData = $json;"
$encoding = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $root "data-inline.js"), $output, $encoding)
