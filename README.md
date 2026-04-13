# CrowdSync AI

CrowdSync AI is an intelligent crowd optimization system designed to dynamically manage crowd flow, reduce queue times, and manage real-time alerts in large venues. It utilizes simulated environments and graph traversal algorithms to guide users to their destinations efficiently while preventing congestion.

## Features

- **Interactive Heatmap Simulation**: A real-time, dynamic grid representing venue zones, highlighting areas with low, medium, and high crowd densities.
- **Intelligent Pathfinding**: Generates optimized routes for users to navigate to key Points of Interest (POIs) such as Food Stalls, Washrooms, Stages, and Exits without passing through heavily congested areas.
- **Queue Prediction System**: Analyzes current crowd densities to predict estimated wait times at various venue utilities, suggesting the fastest available options to the user.
- **Dual Perspective Interface**: 
  - **User Mode**: Focused on finding amenities, checking queue times, and viewing the best routes.
  - **Organizer Mode**: Provides venue managers with high-level statistics, alert broadcasting capabilities, and total venue capacity metrics.
- **Real-Time Alert Broadcasts**: Simulates pushing real-time emergency or informational alerts (e.g., congestion warnings, general announcements) to all active users.

## Technology Stack

- **HTML5**: Semi-semantic structure for the dashboard layout.
- **CSS3 / Vanilla CSS**: Modern, responsive, system-level design with custom variables, glassmorphism effects, flexbox/grid layouts, and advanced animations.
- **Vanilla JavaScript**: Core logic for the simulation, DOM manipulation, pathfinding algorithms (A* or Dijkstra simulation), state management, and real-time updates.
- **Jest**: Comprehensive unit testing for core simulation logic and queue mechanics.
- **Google Cloud Services**: Integrations for Google Analytics and Firebase performance tracking implementations.

## Getting Started

While the dashboard runs natively in the browser without bundlers, setting up the environment enables local testing suites.

1. Clone or download the repository to your local machine.
2. Ensure you have [Node.js](https://nodejs.org/) installed.
3. Open your terminal in the project directory and run `npm install` to install testing dependencies.
4. Run `npm test` to verify the core simulation logic.
5. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge) to launch the tool.

## Usage

Upon loading the application, you will be greeted with an initialization modal. Click "Initialize Local Simulation" to start generating simulated crowd data.

### Navigating as a User
By default, the application opens in **User Mode**.
- Use the **Destination Points** section to select a POI you want to reach.
- The system will highlight the optimal path on the heatmap.
- Check the **Queue Predictions** section to see estimated wait times for amenities like food stalls.

### Navigating as an Organizer
Toggle the switch in the top navigation bar to switch to **Organizer Mode**.
- Review high-level metrics in the **Venue Overview** panel (e.g., Total Attendees, Current Density).
- Use the **Broadcast Operations** area to simulate sending venue-wide alerts or triggering emergency protocols.
- The heatmap zones will dynamically react and pulse based on simulated anomalies or triggered events.

## Contributing

Contributions are welcome. Please ensure that your pull requests maintain the project's design language and performance standards. Before submitting any changes, verify that the application layout does not break on smaller resolutions.

## License

This project is licensed under standard open-source licenses. Please refer to the specific license file in the repository if available, or contact the repository owner for terms of use.
