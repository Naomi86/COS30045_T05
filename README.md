# COS30045_T05
COS30045

The charts work both when `index.html` is opened directly and when served by a
local web server. The browser cannot fetch local CSV files from a `file://` page,
so `data-inline.js` contains a JavaScript-safe copy of the CSV contents.

The CSV files in `data/` are the source data. After changing them, regenerate the
inline copy from the repository root with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\generate-inline-data.ps1
```
