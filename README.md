# Virtual Store Simulator

A browser-based store simulator in **vanilla JavaScript**: inventory, cart, sales and reports. Built as a Coderhouse JavaScript project to practice DOM manipulation, `fetch`, JSON and `localStorage`.

## Features
- Loads the initial products from `data/productos.json` with `fetch` on first run and then keeps them in `localStorage`.
- Add products with form validation and duplicate detection.
- Cart with automatic totals, 21% VAT and a 15% wholesale discount for 5+ items.
- Stock is updated after each sale.
- Reports: total revenue, average sale, best-selling products.
- Export the data as JSON.
- Alerts with **SweetAlert2** and notifications with **Toastify** (loaded from a CDN).

## Run it locally
No build step. Clone the repo and open `index.html` in a browser (or use a local server such as VS Code Live Server).

```bash
git clone https://github.com/lautarobermudez/Entregable1-Bermudez.git
```

## Structure
```
index.html
data/productos.json
script/script.js
style/style.css
```

## Known limitations / next steps
- All the logic is in one ~700-line `script.js`; it should be split into modules.
- Data lives only in the browser (`localStorage`); there is no backend.
- No automated tests.
