# Folio PDF Editor

Open, edit, sign and fill in PDF files in your browser. Folio runs entirely on your device. Your PDFs are never uploaded.

## Use it on an iPad

1. Open this site in Safari.
2. Tap **Share** (or **•••**, then **Share**), then **Add to Home Screen**. Leave **Open as Web App** on.
3. Open Folio from your Home Screen once while you're online. After that it works without the internet.

To save a PDF, tap **Save PDF**, then **Save PDF** again, then **Save or share…**, then **Save to Files**.

## What's in this repository

| File | What it does |
| --- | --- |
| `index.html` | The whole app, including its fonts and PDF libraries |
| `sw.js` | Keeps a copy of the app on your device for offline use |
| `manifest.webmanifest` | App name, colours and icons for the Home Screen |
| `icons/` | App icons |
| `.nojekyll` | Tells GitHub Pages to publish the files as they are |

Built with [PDF.js](https://mozilla.github.io/pdf.js/) (Apache 2.0) and [pdf-lib](https://pdf-lib.js.org/) (MIT).
