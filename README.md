🚀 Project Zenith — The Celestial Eye
A real-time sky exploration platform that lets you explore the universe above any location on Earth — satellites, planets, the ISS, near-Earth asteroids, and observing conditions, all resolved to precise azimuth and elevation.

Built with Next.js 16 · React 19 · TypeScript · TailwindCSS · Framer Motion · Zustand · Leaflet · satellite.js


🛠 Installation and Setup Instructions
Prerequisites
Make sure you have the following installed:

Node.js v20 or higher (built and tested on v22.22.2)
npm v10 or higher


Step 1 — Clone or unzip the project
If you received the project as a zip file:
bashunzip project-zenith.zip -d project-zenith
cd project-zenith/frontend
If cloning from a repository:
bashgit clone https://github.com/your-username/project-zenith.git
cd project-zenith/frontend

Step 2 — Install dependencies
bashnpm install

Step 3 — Set up environment variables
bashcp .env.local.example .env.local
Open .env.local and optionally add a free NASA API key. The default DEMO_KEY works but is rate-limited to 30 requests/hour. Get a free unlimited key at api.nasa.gov:
env# .env.local

NEXT_PUBLIC_NASA_API_KEY=your_key_from_api.nasa.gov
NEXT_PUBLIC_APP_URL=http://localhost:3000

Step 4 — Run the development server
bashnpm run dev
Open http://localhost:3000 in your browser. The app will redirect you to the landing page automatically.

Step 5 (Optional) — Production build
bashnpm run build
npm start

Note: Production build requires a multi-core machine. Run on a standard developer machine or deploy directly to Vercel for best results.


Troubleshooting
If you encounter any issues on first run, clear the cache and reinstall:
bashrm -rf .next node_modules
npm install
npm run dev

🌌 Website Functionality and Unique Features
What makes Project Zenith stand out
Most astronomy apps are either generic star-chart viewers or raw data dashboards. Zenith combines real-time orbital mechanics, live NASA data feeds, and a purpose-built instrument-panel UI — designed to feel like operating an actual ground observation instrument, not clicking through a generic SaaS product.
The entire app recalculates for your chosen location and time. Nothing is hardcoded or static. Every reading — azimuth, elevation, magnitude, pass time — is computed for your exact horizon.

Core Modules
🌍 Sky Map Explorer

Click any point on the interactive world map to set your observation location
Search by city/address name with automatic reverse geocoding
One-click GPS detection to use your current location
Save favourite locations for instant recall
Every other module recalculates for the chosen point

🛸 Live Satellite Tracker

Tracks the ISS, Starlink trains, weather satellites, GPS satellites, and 5,000+ catalogued objects
Positions computed using SGP4/SDP4 orbital propagation from live TLE (Two-Line Element) data via CelesTrak
Updates every 10 seconds
Switch between an interactive map view and a sortable list view
Filter by satellite type (ISS / Starlink / Weather / GPS)

🚀 ISS Live Tracker

Real-time International Space Station ground track refreshed every 5 seconds
Displays live latitude, longitude, altitude (km), velocity (km/s), and crew count
Animated orbital trail on the map
One-click "Center on ISS" button
Full orbital parameter reference (period, inclination, orbits per day)

🪐 Planet Viewer

Positions for all 7 planets (Mercury → Neptune) computed server-side using Julian Date celestial mechanics
Shows azimuth, elevation, distance (AU), visual magnitude, right ascension, and declination
Daylight-aware visibility — planets are correctly hidden when the sun is above civil twilight, unless bright enough to be seen in twilight (Venus, Jupiter)
Visual sky-position plot showing where each planet sits relative to your horizon

☄️ Asteroid Monitor

Powered by NASA NeoWs (Near Earth Object Web Service)
Pulls close-approach data for the next 7 days
Displays name, estimated diameter, relative velocity, miss distance, and hazard classification
Hazardous asteroids prominently flagged with visual threat-assessment meters for size risk, velocity risk, and proximity risk
One-click retry on network failure with clear error states

🌤 Space Weather & Visibility

Hourly cloud cover, atmospheric visibility, precipitation probability, humidity, wind speed, and temperature via Open-Meteo
Translates raw meteorological data into a single observing-conditions rating: Excellent / Good / Moderate / Poor
12-hour forecast strip so you can plan the best viewing window
Updates automatically when you change your observation location

⏱ Time Machine

Slide between −7 days and +30 days from the current moment
Quick-jump presets: +1H, +6H, +1D, +7D, +30D and backwards equivalents
All modules (planets, satellites, ISS) recalculate for the simulated time
Clear Live / Simulation mode indicator so you always know if you're viewing real or simulated data

📚 APOD Learning Center

Fetches NASA's Astronomy Picture of the Day for any date since 1995
Date navigation (previous/next arrows) with full archive access
Rotating astronomy field notes banner with curated facts
Recent history sidebar for quick navigation between visited dates

⚡ Mission Control Dashboard

Live overview panel showing ISS position, hazardous asteroid count, observing conditions, and today's APOD title simultaneously
Module launcher grid — one click to any instrument
Live hazardous asteroid alert strip when close-approach objects are detected

👤 Observer Profile

Saved locations persisted across sessions (Zustand + localStorage)
Coordinate format and time format preferences
Data source connection status panel


Signature Design Element — The Planisphere Dial
The hero of the landing page features a custom-built animated SVG planisphere dial — a counter-rotating star-chart instrument with engraved tick marks, a sweeping observation line, and a golden-angle star distribution. It's built entirely in TypeScript/SVG with no external graphics library, and serves as the visual identity marker for the platform.

UI Design Language
Zenith uses a star-chart instrument panel visual identity rather than generic dark-mode SaaS aesthetics:
TokenValueUsagevoid#05070DPage/canvas backgroundpanel#0B0F1ASurface panelshairline#1C2333Borders, dividers, grid linesparchment#E8E3D3Primary text (warm white, like a star chart)signal#FF6A3DPrimary accent (astronomer red-light mode)data#4FD1C5Live data indicators, teal accentwarn#F2C879Caution statesdanger#E0654BHazard/error states
Panels use squared corners with engraved corner ticks (technical drawing reference marks) instead of rounded glassmorphism. Data readouts use JetBrains Mono throughout so coordinates, magnitudes, and NORAD IDs read like real instrument output.

📦 Dependencies
Framework and Core
PackageVersionPurposenext16.2.9React framework (App Router, Turbopack)react19UI libraryreact-dom19DOM renderertypescript5.xType safety throughout
UI and Styling
PackagePurposetailwindcssUtility-first CSS with custom design tokensframer-motionPage transitions, animated components, scroll-linked effectslucide-reactIcon setclsx + tailwind-mergeConditional class name composition
Self-Hosted Fonts (no Google Fonts dependency)
PackageFont@fontsource/interBody text@fontsource/space-groteskDisplay headings@fontsource/jetbrains-monoData readouts, coordinates, monospace
State Management
PackagePurposezustandGlobal state (selected location, sky data, time, favourites) with localStorage persistence
Maps and Visualization
PackagePurposeleaflet + @types/leafletInteractive world map for location selection, ISS tracking, satellite map
Astronomy and Orbital Mechanics
PackagePurposesatellite.jsSGP4/SDP4 orbital propagation — computes satellite position from TLE elements
Real-Time Data Sources (external APIs, no npm package)
ServiceData providedEndpointNASA NeoWsNear-Earth asteroid close-approach dataapi.nasa.gov/neo/rest/v1/feedNASA APODAstronomy Picture of the Dayapi.nasa.gov/planetary/apodOpen NotifyISS live latitude/longitudeapi.open-notify.org/iss-now.jsonCelesTrakSatellite TLE (orbital element) datacelestrak.org/NORAD/elementsOpen-MeteoWeather and atmospheric visibilityapi.open-meteo.com/v1/forecastNominatimForward and reverse geocodingnominatim.openstreetmap.org

Development Tools
PackagePurposeeslint + eslint-config-nextLinting (zero errors on final pass)postcss + autoprefixerCSS processing for Tailwind

🚀 Deploy on Vercel
The easiest way to deploy:

Push to a GitHub/GitLab repository
Import at vercel.com/new
Set the Root Directory to frontend
Add your NEXT_PUBLIC_NASA_API_KEY in the Environment Variables section
Deploy — Vercel handles the build automatically

For other platforms, run npm run build then npm start. The app is a standard Next.js App Router project with no special server requirements.
