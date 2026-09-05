# 3D Terrain Viewer & Flythrough

A web-based 3D terrain visualizer built using Three.js and Vite. It takes a satellite image and an AI-predicted Digital Elevation Model (DEM) heightmap to render the terrain in 3D with an automated camera flythrough mode.

## Features
- **3D Elevation**: Generates terrain height dynamically using displacement mapping from a DEM image.
- **Flight Path (Flythrough)**: Orbiting camera animation to view the terrain and peaks automatically.
- **GUI Controls**: Sliders to adjust flight speed, altitude, elevation scale, and toggle wireframe mode.
- **Manual Controls**: Rotate, pan, and zoom using mouse orbit controls.

## Tech Stack

- JavaScript / HTML5
- Three.js
- Vite
- lil-gui

## How to Run Locally

1. Clone this repo:

    git clone https://github.com/Sahanatara/terrain-viewer.git
   
    cd terrain-viewer

3. Run the app:

    npm install
   
    npm run dev

Open http://localhost:5173 in your browser.
