<div align="center">

<img src="public/shield.svg" alt="HerAegis AI" width="80" height="80" />

# HerAegis AI

**Real-time women's safety intelligence for New Delhi**

An interactive safety analytics platform that visualizes crime hotspots, risk zones, and safe corridors across 52+ Delhi areas — empowering women with data-driven awareness and instant emergency tools.

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

---

[Live Demo](#) &nbsp;&middot;&nbsp; [Report Issue](https://github.com/m-zest/HerAegis-AI/issues) &nbsp;&middot;&nbsp; [Request Feature](https://github.com/m-zest/HerAegis-AI/issues)

</div>

<br/>

## The Problem

Every year, thousands of women in Delhi face safety threats that could be mitigated with better awareness. Crime data exists in scattered government reports, but there's no accessible, real-time tool that translates this data into actionable safety intelligence.

## The Solution

HerAegis AI transforms raw crime statistics into an interactive dark-themed intelligence map. Women can instantly see which areas are dangerous at what times, find nearby safe spots, and trigger emergency calls — all from a single dashboard.

<br/>

## Features

### Interactive Crime Heatmap
Full-screen dark map with multi-layer heatmap visualization powered by Leaflet. Color-coded intensity from low (purple) to extreme (bright yellow) renders thousands of data points in real-time.

### Risk-Scored Area Zones
52+ Delhi areas with risk scores (0-100) based on NCRB data. Each zone is color-coded — tap any zone to reveal detailed crime analytics including category breakdown, time-of-day patterns, and monthly trends.

### Time-Based Danger Analysis
Filter the entire map by time of day — Night, Evening, Daytime, or Early Morning. Risk patterns shift dramatically after dark, and HerAegis shows exactly where and when.

### Safe Spot Network
26 verified safe spots mapped across Delhi — metro stations, police stations, and hospitals. The detail panel shows the nearest safe spots sorted by distance from any selected area.

### SOS Emergency System
Always-visible pulsing emergency button with one-tap access to Police (112), Women Helpline (1091), DCW (181), and instant location sharing via clipboard.

### Responsive Design
Fully responsive — desktop shows a slide-in detail panel, mobile switches to a bottom sheet. Touch-optimized with 44px+ tap targets.

<br/>

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Vue 3 (Composition API, `<script setup>`) |
| **Language** | TypeScript 5.9 |
| **Build** | Vite 7.3 |
| **Map** | Leaflet + leaflet.heat (CartoDB dark tiles) |
| **Typography** | DM Sans (UI) + JetBrains Mono (data) |
| **Design** | Dark glassmorphism, custom CSS |
| **Deploy** | Vercel (static) |

<br/>

## Quick Start

```bash
# Clone the repository
git clone https://github.com/m-zest/HerAegis-AI.git
cd HerAegis-AI

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Static output in `dist/` — deploy to any static hosting provider.

<br/>

## Project Structure

```
src/
  components/
    LeafletMap.vue        # Map with heatmap, area markers, safe spots
    TopBar.vue            # Logo, search, time filters, live stats
    FilterBar.vue         # Crime category filter chips
    AreaDetailPanel.vue   # Slide-in panel with full area analytics
    SOSButton.vue         # Pulsing emergency button
    SOSModal.vue          # Emergency call & location sharing modal
    MapLegend.vue         # Heatmap intensity legend
  data/
    areas.ts              # 52 Delhi areas with risk data
    safeSpots.ts          # 26 safe spots (metro, police, hospitals)
    emergencyContacts.ts  # Emergency helpline numbers
    helpers.ts            # Risk colors, heatmap generation, distance calc
    types.ts              # TypeScript interfaces
  views/
    Dashboard.vue         # Main orchestrator view
  App.vue                 # Root component
  main.ts                 # Entry point
```

<br/>

## Data Sources

Crime data is synthetic but modeled on publicly available statistics from:

- **NCRB** (National Crime Records Bureau) — Annual crime reports
- **Delhi Police** — District-level public records
- **DMRC** — Metro station coordinates

> This tool shows **area-level aggregate data only**. No individual identification. This is a safety awareness tool, not a surveillance tool.

<br/>

## Deployment

### Vercel (Recommended)

1. Import the GitHub repository on [vercel.com](https://vercel.com)
2. Framework auto-detects as **Vue.js**
3. Deploy — no configuration needed

### Other Platforms

Works with any static hosting — Netlify, Cloudflare Pages, GitHub Pages, Firebase Hosting. Just point to the `dist/` output directory.

<br/>

## Roadmap

- [ ] Real-time data integration (Delhi Police Open Data Portal)
- [ ] Safe route suggestions between two points
- [ ] Area comparison (side-by-side analytics)
- [ ] Crowdsourced incident reporting
- [ ] PWA with offline support
- [ ] Multi-language support (Hindi, Urdu)

<br/>

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br/>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<br/>

---

<div align="center">

**Built for safety. Built for awareness. Built for her.**

Made by [Mohammad Zeeshan](https://github.com/m-zest)

</div>
