import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const particaleGeometry = new THREE.BufferGeometry();
const particaleCount = 20000;

const positions = new Float32Array(particaleCount * 3);
const colors = new Float32Array(particaleCount * 3);

for (let i = 0; i < particaleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particaleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particaleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particaleMaterial = new THREE.PointsMaterial();
particaleMaterial.size = 0.1;
particaleMaterial.sizeAttenuation = true;
particaleMaterial.alphaMap = textureLoader.load("/textures/particles/2.png");
particaleMaterial.transparent = true;
particaleMaterial.depthWrite = false;
// particaleMaterial.blending = THREE.AdditiveBlending;
particaleMaterial.vertexColors = true;

const particales = new THREE.Points(particaleGeometry, particaleMaterial);
scene.add(particales);

gui
  .add(particaleMaterial, "size")
  .min(0)
  .max(0.5)
  .step(0.001)
  .name("particaleSize");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 8;
camera.position.y = 2;
camera.position.x = 0;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  for (let i = 0; i < particaleCount; i++) {
    const i3 = i * 3;
    const x = particaleGeometry.attributes.position.array[i3];
    particaleGeometry.attributes.position.array[i3 + 1] =
      Math.sin((elapsedTime + x) * 2) * 0.5;
  }
  particaleGeometry.attributes.position.needsUpdate = true;
  // particales.rotation.y = elapsedTime * 0.2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
