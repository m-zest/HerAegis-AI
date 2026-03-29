# Claude Code Prompt — Delhi Women Safety Intelligence App

## Project Overview

Build a full-stack web application called **"SheShield"** — a real-time women's safety intelligence platform for New Delhi. The app visualizes crime hotspots on an interactive dark-themed map, shows area-level risk scores, time-based danger patterns, and provides safety tools like SOS, safe route suggestions, and nearby safe spots.

**Tech Stack:**
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Map:** Mapbox GL JS (free tier, dark style)
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Deployment-ready:** Docker Compose

---

## Phase 1: Project Setup

```
Initialize a Next.js 14 project with TypeScript, Tailwind CSS, and the App Router.
Install these dependencies:
- mapbox-gl, @types/mapbox-gl (map rendering)
- prisma, @prisma/client (database)
- recharts (charts/graphs)
- lucide-react (icons)
- framer-motion (animations)
- shadcn/ui components: card, badge, sheet, dialog, button, slider, tabs, scroll-area, tooltip
- @turf/turf (geospatial calculations)
- date-fns (time formatting)

Create a .env.local with:
NEXT_PUBLIC_MAPBOX_TOKEN=<user_provides>
DATABASE_URL=postgresql://...

Set up the Prisma schema and seed script as described in Phase 2.
```

---

## Phase 2: Database Schema & Seed Data

### Prisma Schema

```prisma
model Area {
  id            String    @id @default(cuid())
  name          String    @unique
  district      String
  latitude      Float
  longitude     Float
  riskScore     Float     // 0-100
  crimeCount    Int
  population    Int?
  polygonGeoJSON Json     // GeoJSON polygon boundary
  incidents     Incident[]
  safeSpots     SafeSpot[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Incident {
  id            String    @id @default(cuid())
  areaId        String
  area          Area      @relation(fields: [areaId], references: [id])
  category      String    // "sexual_assault", "harassment", "stalking", "robbery", "kidnapping", "domestic_violence"
  severity      Int       // 1-5
  description   String?
  latitude      Float
  longitude     Float
  occurredAt    DateTime
  timeSlot      String    // "night_10pm_4am", "evening_6pm_10pm", "day_6am_6pm", "early_morning_4am_6am"
  source        String    // "ncrb_2023", "delhi_police", "crowdsourced"
  verified      Boolean   @default(true)
  createdAt     DateTime  @default(now())
}

model SafeSpot {
  id            String    @id @default(cuid())
  name          String
  type          String    // "police_station", "metro_station", "hospital", "fire_station", "24hr_store"
  latitude      Float
  longitude     Float
  areaId        String?
  area          Area?     @relation(fields: [areaId], references: [id])
  phone         String?
  isOpen24hrs   Boolean   @default(false)
}

model EmergencyContact {
  id            String    @id @default(cuid())
  name          String
  phone         String
  description   String?
  category      String    // "police", "women_helpline", "ambulance", "fire"
}
```

### Seed Script

Create a comprehensive seed script (`prisma/seed.ts`) that populates the database with **realistic data for 50+ Delhi areas**. Use actual Delhi coordinates and area boundaries.

**Areas to include (with approximate coordinates and realistic risk scores based on publicly known crime statistics):**

```
HIGH RISK (score 70-95):
- Paharganj (28.6448, 77.2120) — score: 88
- GB Road (28.6500, 77.2300) — score: 91
- Kashmere Gate (28.6670, 77.2280) — score: 82
- Nand Nagri (28.6930, 77.3120) — score: 85
- Seemapuri (28.6870, 77.3310) — score: 83
- Mangolpuri (28.7060, 77.0690) — score: 80
- Jahangirpuri (28.7280, 77.1700) — score: 84
- Seelampur (28.6770, 77.2720) — score: 81
- Shahdara (28.6730, 77.2910) — score: 78
- Trilokpuri (28.6100, 77.3100) — score: 79

MODERATE RISK (score 40-69):
- Connaught Place (28.6315, 77.2167) — score: 55
- Karol Bagh (28.6519, 77.1905) — score: 62
- Lajpat Nagar (28.5700, 77.2430) — score: 58
- Sarojini Nagar (28.5774, 77.2007) — score: 52
- Chandni Chowk (28.6506, 77.2301) — score: 65
- Dwarka (28.5921, 77.0460) — score: 48
- Rohini (28.7495, 77.0565) — score: 52
- Janakpuri (28.6289, 77.0817) — score: 50
- Pitampura (28.6997, 77.1316) — score: 47
- Rajouri Garden (28.6492, 77.1225) — score: 55

LOW RISK (score 10-39):
- Lutyens Delhi (28.6139, 77.2090) — score: 15
- Vasant Kunj (28.5195, 77.1570) — score: 28
- Defence Colony (28.5743, 77.2305) — score: 22
- Greater Kailash (28.5494, 77.2430) — score: 25
- Chanakyapuri (28.5975, 77.1855) — score: 12
- South Extension (28.5720, 77.2210) — score: 30
- Hauz Khas (28.5494, 77.2001) — score: 32
- Saket (28.5245, 77.2066) — score: 27
- Vasant Vihar (28.5620, 77.1590) — score: 20
- Golf Links (28.5980, 77.2310) — score: 18

...add 20 more areas to reach 50+
```

**For each area, generate:**
- 30-150 synthetic incidents spread across the last 2 years
- Distribute incident categories weighted by area type:
  - High-risk: more sexual_assault, harassment, stalking
  - Moderate: more robbery, harassment
  - Low-risk: mostly petty crime
- Time distribution: 45% night (10pm-4am), 25% evening (6pm-10pm), 20% day, 10% early morning
- Random lat/lng within ~500m radius of area center

**Safe spots — use real Delhi locations:**
- All Delhi Metro stations (use actual coordinates from DMRC data)
- Major police stations per district
- Government hospitals
- Fire stations

**Emergency contacts:**
```
- Police: 112
- Women Helpline: 1091 / 181
- Delhi Commission for Women: 011-23379181
- Ambulance: 102
- Fire: 101
- Child Helpline: 1098
```

---

## Phase 3: API Routes

Create these Next.js API routes:

### `GET /api/areas`
- Returns all areas with risk scores, crime counts, and center coordinates
- Query params: `?minRisk=0&maxRisk=100&district=<name>`

### `GET /api/areas/[id]`
- Returns full area detail including polygon boundary, incident breakdown by category and time

### `GET /api/areas/[id]/incidents`
- Returns paginated incidents for an area
- Query params: `?category=<cat>&timeSlot=<slot>&page=1&limit=20`

### `GET /api/heatmap`
- Returns array of `{lat, lng, intensity}` for all incidents
- Query params: `?timeSlot=<slot>&category=<cat>&dateFrom=<date>&dateTo=<date>`

### `GET /api/safe-spots`
- Returns safe spots near a coordinate
- Query params: `?lat=<lat>&lng=<lng>&radius=2000&type=<type>`

### `GET /api/stats`
- Returns aggregate stats: total incidents, most dangerous time, top 5 risky areas, category breakdown

### `GET /api/emergency-contacts`
- Returns all emergency contacts

---

## Phase 4: Frontend — Main Dashboard

### Layout Structure

The app should be a single-page dashboard with:

1. **Full-screen dark map** (Mapbox `dark-v11` style) as the base layer
2. **Top bar** — floating, transparent dark glass: logo, search, time filter, stats
3. **Right panel** — slide-in panel showing area details when an area is clicked
4. **Bottom sheet** (mobile) — swipe-up panel for area details on mobile
5. **SOS button** — always visible, bottom-right, pulsing red

### Theme & Design System

Use these exact design tokens:

```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: rgba(18, 18, 26, 0.85);
  --bg-glass: rgba(18, 18, 26, 0.6);
  --border: rgba(255, 255, 255, 0.06);
  --text-primary: #e8e8ed;
  --text-secondary: #8888a0;
  --text-muted: #55556a;
  --accent-red: #ff2d55;
  --accent-red-glow: rgba(255, 45, 85, 0.4);
  --accent-orange: #ff9500;
  --accent-yellow: #ffd60a;
  --accent-green: #30d158;
  --risk-critical: #ff2d55;
  --risk-high: #ff6b35;
  --risk-moderate: #ff9500;
  --risk-low: #ffd60a;
  --risk-safe: #30d158;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
  --font-sans: 'Inter', -apple-system, sans-serif;
}
```

**Glassmorphism styling for all panels:**
```css
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 16px;
}
```

### Map Implementation

```
1. Initialize Mapbox with style 'mapbox://styles/mapbox/dark-v11'
2. Center on New Delhi: [77.2090, 28.6139], zoom 11
3. Add THREE layers:

LAYER 1 — Heatmap Layer:
- Source: /api/heatmap endpoint
- Use mapbox heatmap layer with:
  - Radius: interpolate from zoom 10→20px to zoom 15→40px
  - Color ramp: transparent → yellow → orange → red → deep red
  - Intensity based on incident severity
  - Opacity: 0.7

LAYER 2 — Area Polygons:
- Source: area polygonGeoJSON from /api/areas
- Fill color based on riskScore:
  - 0-30: green with 15% opacity
  - 30-50: yellow with 20% opacity
  - 50-70: orange with 25% opacity
  - 70-100: red with 30% opacity
- Stroke: matching color at 40% opacity, 1.5px width
- On hover: increase fill opacity to 45%, show tooltip

LAYER 3 — Safe Spots:
- Custom markers for police stations (blue shield icon), metro (blue M), hospitals (green cross)
- Toggle visibility with a button
- Cluster when zoomed out

4. Click handler on area polygons:
   - Fly to area with animation
   - Open right panel (desktop) or bottom sheet (mobile) with area details

5. Enable:
   - ScrollZoom, TouchZoomRotate, DragPan
   - GeolocateControl (find my location)
   - NavigationControl (zoom +/-)
   - Scale bar
```

### Top Bar Component

Floating bar at top of map with glass background:

```
┌──────────────────────────────────────────────────────────┐
│ 🛡 SheShield    [🔍 Search area...]   [Time ▾]   Stats  │
│                                                          │
│  📊 3,847 incidents  │  ⚠️ 12 high-risk  │  🕐 Live     │
└──────────────────────────────────────────────────────────┘
```

- **Search**: autocomplete search across area names, fly to selected area
- **Time Filter**: dropdown/segmented control — "All Hours", "Night (10PM-4AM)", "Evening (6PM-10PM)", "Daytime", "Early Morning"
  - Changing this re-filters the heatmap and recalculates visible risk scores
- **Stats bar**: scrollable horizontal stats on mobile

### Right Panel / Area Detail (Desktop)

When an area polygon is clicked, slide in from right:

```
┌─────────────────────────────┐
│  ✕                          │
│  PAHARGANJ                  │
│  Central District           │
│                             │
│  ██████████░░  Risk: 88/100 │
│  🔴 CRITICAL                │
│                             │
│  ┌─────────┬─────────┐      │
│  │  3,284  │   142   │      │
│  │ Total   │ This    │      │
│  │ Cases   │ Month   │      │
│  └─────────┴─────────┘      │
│                             │
│  CRIME BREAKDOWN            │
│  ━━━━━━━━━━━━━━━            │
│  Harassment      45% ████▌  │
│  Sexual Assault  22% ██▎    │
│  Stalking        15% █▌     │
│  Robbery         12% █▎     │
│  Other            6% ▋      │
│                             │
│  DANGER BY TIME             │
│  ━━━━━━━━━━━━━━━            │
│  [Radial/bar chart showing  │
│   risk by time slot]        │
│                             │
│  PEAK DANGER: 11PM - 2AM    │
│                             │
│  NEARBY SAFE SPOTS          │
│  ━━━━━━━━━━━━━━━            │
│  🚔 Paharganj PS   0.3km    │
│  🚇 New Delhi Metro 0.5km  │
│  🏥 RML Hospital   1.2km   │
│                             │
│  [🚨 SOS — Emergency Call]  │
│                             │
│  MONTHLY TREND              │
│  [Sparkline chart]          │
│                             │
└─────────────────────────────┘
```

- Risk score bar: animated fill with color matching risk level
- Crime breakdown: horizontal bar chart with category colors
- Time chart: use Recharts `RadialBarChart` or `BarChart`
- Safe spots: sorted by distance, clickable to show on map
- Monthly trend: Recharts `AreaChart` sparkline showing last 12 months

### Bottom Sheet (Mobile)

On screens < 768px, replace the right panel with a bottom sheet:
- Default state: collapsed, showing area name + risk score (peek height: 80px)
- Half state: shows stats + crime breakdown (50% screen)
- Full state: shows everything (90% screen)
- Implement with touch drag gesture (framer-motion `useDragControls`)
- Smooth spring animation on snap points

### SOS Emergency Button

Always visible, bottom-right corner (above mobile nav if any):

```tsx
// Pulsing red circle with phone icon
// On click: opens modal with:
// - "Call 112" (primary, large red button)
// - "Women Helpline 1091" button
// - "Share Live Location" button (copies Google Maps link)
// - "DCW Helpline" button
// Pulse animation: CSS keyframe with box-shadow glow
```

### Stats Overview Modal

Accessible from top bar "Stats" button:

```
Full-screen modal with:
1. Total incidents (animated counter)
2. Top 10 most dangerous areas (horizontal bar chart)
3. Crime category distribution (donut chart)
4. Time-of-day risk distribution (24hr radial chart)
5. Month-over-month trend (area chart)
6. District-level comparison (grouped bar chart)

All charts use Recharts with the dark theme colors.
```

---

## Phase 5: Advanced Features

### 1. Real-Time Risk Indicator
Show a floating badge that says "Current Risk Level" based on user's approximate location + current time of day. Changes color dynamically.

### 2. Safe Route Suggestion (Simplified)
- User taps two points on map
- Draw a line between them
- Highlight which risk areas the route passes through
- Show a risk summary: "This route passes through 2 high-risk areas. Consider traveling during daylight."

### 3. Area Comparison
- Let user select 2-3 areas
- Side-by-side comparison cards with all stats

### 4. Crowdsourced Reporting
- "Report Incident" floating button
- Form: location (auto from map tap), category (dropdown), time, optional description
- Saved as unverified incident (source: "crowdsourced", verified: false)
- Show crowdsourced incidents with different marker style (dimmer, dashed border)

### 5. Data Filters
Floating filter chips below top bar:
- Category filters: All, Harassment, Assault, Stalking, Robbery
- Time: All Hours, Night, Evening, Day
- Source: All, Official, Crowdsourced
- Date range: Last 30 days, 6 months, 1 year, All

---

## Phase 6: Mobile Responsiveness

**Critical — the app MUST work perfectly on mobile:**

```
BREAKPOINTS:
- Mobile: < 768px
  - Top bar collapses to hamburger menu
  - Right panel becomes bottom sheet
  - Stats bar becomes horizontally scrollable
  - SOS button: 56px, bottom-right, 16px margin
  - Map controls: left side, smaller
  - Touch-optimized: all tap targets ≥ 44px

- Tablet: 768px - 1024px
  - Right panel width: 360px
  - Top bar fully visible

- Desktop: > 1024px
  - Right panel width: 420px
  - Full stats bar in top bar
```

**Mobile gestures:**
- Pinch to zoom map (native Mapbox)
- Swipe up bottom sheet
- Swipe right to close bottom sheet
- Long press on map to report incident
- Pull down to refresh data

**Performance:**
- Lazy load area polygons (only render visible areas)
- Debounce heatmap updates on pan/zoom
- Use `next/dynamic` to lazy load heavy components (map, charts)
- Image optimization with `next/image`
- Skeleton loaders for all async content

---

## Phase 7: PWA & Offline

```
Add next-pwa for Progressive Web App:
- Installable on home screen
- Cache area data for offline viewing
- Offline banner when no connection
- Service worker for static assets
- App manifest with SheShield branding
```

---

## Phase 8: Polish & Animations

```
1. Map load: fade in from black with slight zoom
2. Heatmap points: pulse animation on high-risk areas
3. Panel slide: spring animation (framer-motion)
4. Risk score bar: animate fill on load (0 → value)
5. Stats counters: count-up animation
6. Area hover: smooth opacity transition
7. SOS button: continuous pulse glow animation
8. Filter chips: smooth enter/exit transitions
9. Charts: animate on first render
10. Loading states: skeleton shimmer animation
```

---

## File Structure

```
sheshield/
├── app/
│   ├── layout.tsx          // Root layout with fonts, metadata
│   ├── page.tsx            // Main dashboard
│   ├── globals.css         // Theme variables, animations
│   └── api/
│       ├── areas/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       └── incidents/route.ts
│       ├── heatmap/route.ts
│       ├── safe-spots/route.ts
│       ├── stats/route.ts
│       └── emergency-contacts/route.ts
├── components/
│   ├── map/
│   │   ├── MapContainer.tsx
│   │   ├── HeatmapLayer.tsx
│   │   ├── AreaPolygons.tsx
│   │   ├── SafeSpotMarkers.tsx
│   │   └── MapControls.tsx
│   ├── panels/
│   │   ├── AreaDetailPanel.tsx
│   │   ├── BottomSheet.tsx
│   │   └── StatsModal.tsx
│   ├── ui/
│   │   ├── TopBar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TimeFilter.tsx
│   │   ├── FilterChips.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── SOSButton.tsx
│   │   └── SkeletonLoader.tsx
│   ├── charts/
│   │   ├── CrimeBreakdown.tsx
│   │   ├── TimeRiskChart.tsx
│   │   ├── MonthlyTrend.tsx
│   │   └── DistrictComparison.tsx
│   └── report/
│       └── IncidentReportForm.tsx
├── lib/
│   ├── prisma.ts           // Prisma client singleton
│   ├── utils.ts            // Risk color helpers, formatters
│   └── constants.ts        // Categories, time slots, colors
├── hooks/
│   ├── useMapbox.ts
│   ├── useAreaData.ts
│   ├── useGeolocation.ts
│   └── useBottomSheet.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── markers/            // Custom map marker SVGs
│   └── manifest.json
├── docker-compose.yml
├── Dockerfile
└── .env.local
```

---

## Important Implementation Notes

1. **No real criminal profiles.** This app shows AREA-LEVEL aggregate crime data only. No names, no photos, no individual identification. This is a safety tool, not a surveillance tool.

2. **Data disclaimer.** Add a footer note: "Data sourced from NCRB annual reports and Delhi Police public records. Incidents are approximate and for awareness purposes only. This tool does not replace emergency services."

3. **The seed data is synthetic but realistic.** Base risk scores on publicly available NCRB district-level crime statistics for Delhi. The app is designed so that when real API data becomes available (Delhi Police Open Data Portal, data.gov.in), it can be plugged in with minimal changes.

4. **Mapbox token.** User needs to get a free Mapbox token from mapbox.com. The free tier allows 50,000 map loads/month which is plenty for development and moderate usage.

5. **Accessibility.** All interactive elements must have aria labels. Color is never the only indicator (always pair with text/icons). Minimum contrast ratio 4.5:1 for all text.

6. **Performance target.** First contentful paint < 2s. Map interactive < 3s. Lighthouse score > 90 on mobile.
