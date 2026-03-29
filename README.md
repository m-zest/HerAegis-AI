# HerAegis AI

Real-time women's safety intelligence platform for New Delhi. Visualizes crime hotspots on an interactive dark-themed map with area-level risk scores, time-based danger patterns, and safety tools.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Map**: Leaflet with dark CartoDB tiles + leaflet.heat
- **Design**: Dark glassmorphism (DM Sans + JetBrains Mono)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Production Build

```bash
npm run build
```

Output in `dist/` — deploy to Vercel, Netlify, or any static host.

## Features

- Interactive heatmap with 52+ Delhi areas
- Risk-scored area zones with crime breakdown
- Time-of-day danger analysis
- Nearby safe spots (metro, police, hospitals)
- SOS emergency modal
- Fully responsive (desktop + mobile)
