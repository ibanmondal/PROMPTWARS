# CrowdSync AI

CrowdSync AI is an intelligent crowd optimization system designed to dynamically manage crowd flow, reduce queue times, and handle real-time alerts in large venues. It utilizes simulated environments and AI-driven graph traversal algorithms to guide users to their destinations efficiently while preventing congestion.

## Core Features

- **Interactive AI Heatmap Simulation**: A real-time, dynamic mathematical grid representing venue zones, highlighting areas with low, medium, and critical crowd densities.
- **Intelligent Navigation Engine**: Generates dynamically optimized routing paths for users to navigate to key Points of Interest (POIs) such as Food Stalls, Washrooms, Stages, and Exits based on real-time crowd congestion weighting.
- **Queue Prediction System**: Analyzes live density fluxes to calculate estimated wait times at utilities, actively recommending optimal alternatives.
- **Dual Perspective Interface**: 
  - **User Mode**: Focused on self-navigation, wait times, and discovering safe routes.
  - **Organizer Mode**: Provides venue managers with emergency controls, venue load capacities, warning zones, and the ability to dispatch ground staff to red zones to disperse congestion.
- **System Diagnostics**: Built-in visual system logs identifying the active states of simulation engines and cloud connections.

## Google Cloud & Ecosystem Integrations

This project heavily leverages the Google ecosystem to ensure hackathon-grade performance and polished delivery without compromising its single-file footprint:

- **Google Firebase**: Uses the modular Firebase Web SDK v10.7 to securely initialize the project (`promptwar-b3e93`) for backend readiness. Let's build scalable apps faster!
- **Google Analytics**: Directly linked to `G-MK7N1T48CX` to silently pool user navigation behaviors across the venue dashboard.
- **Google Material Icons**: Entire UI icon system powered by Google Material Icons for crisp, lightweight, vector-based visual cues.
- **Google Fonts**: Designed globally utilizing the modern, highly readable `Inter` font family from Google Fonts. 

## Technology Stack

- **HTML5 (Monolithic Architecture)**: Entirely bundled into a single zero-dependency `index.html` suitable for ultra-fast CDN deployments. Fully semantic structure leveraging `aria-roles` for WAI-ARIA accessibility compliance.
- **Vanilla CSS3**: Engineered without heavy frameworks; features responsive fluid layouts, custom CSS variables, intelligent z-indexing, hardware-accelerated animations, glassmorphism filtering, and strict Content Security Policies (`CSP`).
- **Vanilla JavaScript**: Real-time rendering loops, recursive DOM mapping, and complex graph algorithms (`Dijkstra/A* simulation`) processed locally without server round-trips.
- **Jest Automation**: Complete underlying TDD local testing suite implemented via `npm` to test mathematical algorithms independently of the browser.

## Getting Started

Because everything is compiled into one file, executing the dashboard is incredibly fast.

1. Clone or download the repository to your local machine.
2. Open `index.html` in any browser (Google Chrome highly recommended for optimal performance) to launch the dashboard.
3. No build tools, external webservers, or dependency installation nodes (`npm start`) are required to run the core simulation!

### Running Local Test Suites (Optional)
If you wish to test the underlying navigation modules:
1. Ensure [Node.js](https://nodejs.org/) is installed.
2. Run `npm install` to download Jest.
3. Run `npm test` to verify the mathematical soundness of the pathfinding mechanics.

## Usage Guide
- Click **"Initialize Local Simulation"** on the welcome modal.
- Under **User Mode**, select a target destination from the dropdown. Notice how the blue highlighted path avoids "red" heavily congested zones dynamically.
- Toggle to **Organizer Mode** using the top utility bar.
- Inside Organizer Mode, click the "Trigger Emergency Redirect" or "Deploy Staff" buttons to instantly inject density modifications across the simulation map data.
