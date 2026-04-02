#!/usr/bin/env node
/**
 * Station Picker — click stations on a map to build a CRS array.
 *
 * Usage:
 *   node scripts/station-picker.js
 *
 * Then open http://localhost:3333 in your browser.
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT          = 3333;
const STATIONS_PATH = path.join(__dirname, '..', 'src', 'data', 'stations.json');
const stations      = JSON.parse(fs.readFileSync(STATIONS_PATH, 'utf8'));
const stationsJSON  = JSON.stringify(stations);

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Station Picker</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { display: flex; height: 100vh; font-family: system-ui, sans-serif; background: #111; color: #f0f0f0; }

    #map { flex: 1; }

    #panel {
      width: 340px;
      display: flex;
      flex-direction: column;
      background: #1a1a1a;
      border-left: 1px solid #333;
    }

    #panel-header {
      padding: 14px 16px 10px;
      border-bottom: 1px solid #333;
      font-size: 13px;
      color: #aaa;
    }
    #panel-header strong { display: block; font-size: 16px; color: #f0f0f0; margin-bottom: 4px; }

    #search-wrap {
      padding: 10px 12px;
      border-bottom: 1px solid #333;
    }
    #search {
      width: 100%;
      padding: 7px 10px;
      background: #272727;
      border: 1px solid #444;
      border-radius: 6px;
      color: #f0f0f0;
      font-size: 13px;
      outline: none;
    }
    #search:focus { border-color: #60a5fa; }

    #station-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 0;
    }
    .station-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.1s;
    }
    .station-item:hover { background: #252525; }
    .station-item.selected { background: #1e3a5f; }
    .station-item .crs {
      font-family: monospace;
      font-size: 12px;
      color: #60a5fa;
      min-width: 36px;
    }
    .station-item .sname { color: #ddd; flex: 1; }
    .station-item .country {
      font-size: 11px;
      color: #666;
    }

    #output-wrap {
      border-top: 1px solid #333;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    #output-label {
      font-size: 12px;
      color: #888;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #clear-btn {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 12px;
      padding: 0;
    }
    #clear-btn:hover { text-decoration: underline; }
    #output {
      font-family: monospace;
      font-size: 12px;
      background: #111;
      border: 1px solid #333;
      border-radius: 6px;
      padding: 10px;
      min-height: 60px;
      max-height: 160px;
      overflow-y: auto;
      word-break: break-all;
      color: #86efac;
      white-space: pre-wrap;
      line-height: 1.5;
    }
    #copy-btn {
      padding: 8px;
      background: #2563eb;
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    #copy-btn:hover { background: #1d4ed8; }
    #copy-btn.copied { background: #16a34a; }

    #count-badge {
      display: inline-block;
      background: #2563eb;
      color: #fff;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 7px;
      margin-left: 6px;
      vertical-align: middle;
    }
  </style>
</head>
<body>

<div id="map"></div>

<div id="panel">
  <div id="panel-header">
    <strong>Station Picker <span id="count-badge">0</span></strong>
    Click a marker on the map, or search below.
  </div>
  <div id="search-wrap">
    <input id="search" type="text" placeholder="Search by name or CRS..." autocomplete="off" />
  </div>
  <div id="station-list"></div>
  <div id="output-wrap">
    <div id="output-label">
      Selected CRS codes
      <button id="clear-btn">Clear all</button>
    </div>
    <div id="output">[]</div>
    <button id="copy-btn">Copy array</button>
  </div>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
const stations = ${stationsJSON};

// ── Map ──────────────────────────────────────────────────────────────────────
const map = L.map('map').setView([54.5, -2.5], 6);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  maxZoom: 19,
}).addTo(map);

// ── State ────────────────────────────────────────────────────────────────────
const selected = new Set();    // CRS codes
const markerMap = {};          // crsCode → L.circleMarker
const listItems = {};          // crsCode → DOM element

// ── Marker styles ────────────────────────────────────────────────────────────
const styleDefault  = { radius: 5, fillColor: '#60a5fa', color: '#1e40af', weight: 1, fillOpacity: 0.8 };
const styleSelected = { radius: 7, fillColor: '#facc15', color: '#854d0e', weight: 2, fillOpacity: 1   };

function toggle(crs) {
  if (selected.has(crs)) {
    selected.delete(crs);
    markerMap[crs]?.setStyle(styleDefault);
    listItems[crs]?.classList.remove('selected');
  } else {
    selected.add(crs);
    markerMap[crs]?.setStyle(styleSelected);
    listItems[crs]?.classList.add('selected');
  }
  renderOutput();
}

function renderOutput() {
  const arr = [...selected];
  document.getElementById('output').textContent =
    arr.length ? JSON.stringify(arr) : '[]';
  document.getElementById('count-badge').textContent = arr.length;
}

// ── Build markers & list ──────────────────────────────────────────────────────
const listEl = document.getElementById('station-list');

stations.forEach(s => {
  // Map marker
  const marker = L.circleMarker([s.lat, s.long], { ...styleDefault })
    .addTo(map)
    .bindTooltip(\`\${s.crsCode} — \${s.stationName}\`, { direction: 'top', offset: [0, -4] });

  marker.on('click', () => {
    toggle(s.crsCode);
    listItems[s.crsCode]?.scrollIntoView({ block: 'nearest' });
  });
  markerMap[s.crsCode] = marker;

  // Sidebar row
  const div = document.createElement('div');
  div.className = 'station-item';
  div.dataset.name = s.stationName.toLowerCase();
  div.dataset.crs  = s.crsCode.toLowerCase();
  div.innerHTML = \`
    <span class="crs">\${s.crsCode}</span>
    <span class="sname">\${s.stationName}</span>
    <span class="country">\${s.constituentCountry}</span>
  \`;
  div.addEventListener('click', () => {
    toggle(s.crsCode);
    // pan map to station
    map.setView([s.lat, s.long], Math.max(map.getZoom(), 10), { animate: true });
  });
  listEl.appendChild(div);
  listItems[s.crsCode] = div;
});

// ── Search ───────────────────────────────────────────────────────────────────
document.getElementById('search').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  for (const div of listEl.children) {
    const match = !q || div.dataset.name.includes(q) || div.dataset.crs.includes(q);
    div.style.display = match ? '' : 'none';
  }
});

// ── Copy ─────────────────────────────────────────────────────────────────────
document.getElementById('copy-btn').addEventListener('click', function () {
  const text = document.getElementById('output').textContent;
  navigator.clipboard.writeText(text).then(() => {
    this.textContent = 'Copied!';
    this.classList.add('copied');
    setTimeout(() => {
      this.textContent = 'Copy array';
      this.classList.remove('copied');
    }, 2000);
  });
});

// ── Clear ─────────────────────────────────────────────────────────────────────
document.getElementById('clear-btn').addEventListener('click', () => {
  [...selected].forEach(crs => {
    markerMap[crs]?.setStyle(styleDefault);
    listItems[crs]?.classList.remove('selected');
  });
  selected.clear();
  renderOutput();
});
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`\n  Station Picker running at http://localhost:${PORT}\n`);
  console.log('  Open that URL in your browser. Press Ctrl+C to stop.\n');

  // Try to auto-open the browser
  const { exec } = require('child_process');
  const cmd = process.platform === 'win32' ? `start http://localhost:${PORT}`
            : process.platform === 'darwin' ? `open http://localhost:${PORT}`
            : `xdg-open http://localhost:${PORT}`;
  exec(cmd);
});
