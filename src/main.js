import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

// 1. Scene & Setup
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b14);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 45, 65);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

// 2. Lighting & Grid
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight.position.set(60, 100, 40);
scene.add(dirLight);

const grid = new THREE.GridHelper(120, 24, 0x0284c7, 0x1e293b);
scene.add(grid);

// 3. Textures & Terrain Mesh
const textureLoader = new THREE.TextureLoader();
const satelliteTexture = textureLoader.load('/input.jpg');
const heightMap = textureLoader.load('/predicted_dem.png');

const geometry = new THREE.PlaneGeometry(70, 70, 256, 256);
const material = new THREE.MeshStandardMaterial({
  map: satelliteTexture,
  displacementMap: heightMap,
  displacementScale: 16,
  roughness: 0.8,
  side: THREE.DoubleSide
});

const terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

// Metadata UI
document.getElementById('meta-dim').innerText = '256 x 256 Mesh';
document.getElementById('meta-min').innerText = '0';
document.getElementById('meta-max').innerText = '3776';

// 4. Flythrough Flight Path Settings
const flightSettings = {
  isFlying: false,
  flightSpeed: 0.35,
  altitude: 35,
  radius: 48,
  elevationScale: 16,
  wireframe: false,
  startFlythrough: () => {
    flightSettings.isFlying = !flightSettings.isFlying;
    controls.enabled = !flightSettings.isFlying;
  }
};

// 5. GUI Panel
const gui = new GUI({ title: 'ISRO Flythrough Control' });
gui.add(flightSettings, 'startFlythrough').name('Toggle Flythrough');
gui.add(flightSettings, 'flightSpeed', 0.1, 1.5, 0.05).name('Flight Speed');
gui.add(flightSettings, 'altitude', 15, 70, 1).name('Flight Altitude');
gui.add(flightSettings, 'elevationScale', 0, 40, 0.5).name('Elevation Scale').onChange(v => {
  material.displacementScale = v;
});
gui.add(flightSettings, 'wireframe').name('Wireframe').onChange(v => {
  material.wireframe = v;
});

// 6. Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 7. Animation Loop with Elliptical Fly Path
let flightClock = 0;

function animate() {
  requestAnimationFrame(animate);

  if (flightSettings.isFlying) {
    flightClock += 0.005 * flightSettings.flightSpeed;
    
    // Calculate elliptical camera orbit
    const x = Math.sin(flightClock) * flightSettings.radius;
    const z = Math.cos(flightClock) * (flightSettings.radius * 0.8);
    const y = flightSettings.altitude + Math.sin(flightClock * 2) * 4;

    camera.position.set(x, y, z);
    camera.lookAt(0, 3, 0); // Keep focused on the crater peak
  } else {
    controls.update();
  }

  renderer.render(scene, camera);
}

animate();