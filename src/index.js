import './styles.css';

import runWithFPS from 'run-with-fps';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

window.THREE = THREE;

const loadingManager = new THREE.LoadingManager();
const fontLoader = new FontLoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const font = fontLoader.parse(
  require('three/examples/fonts/helvetiker_regular.typeface.json')
);
console.log(font);

const doorColorTexture = textureLoader.load(
  require('./textures/door/color.jpg')
);
const doorAlphaTexture = textureLoader.load(
  require('./textures/door/alpha.jpg')
);
const doorAmbTexture = textureLoader.load(
  require('./textures/door/ambientOcclusion.jpg')
);
const doorMetalTexture = textureLoader.load(
  require('./textures/door/metalness.jpg')
);
const doorHeightTexture = textureLoader.load(
  require('./textures/door/height.jpg')
);
const doorNormalTexture = textureLoader.load(
  require('./textures/door/normal.jpg')
);
const doorRoughnessTexture = textureLoader.load(
  require('./textures/door/roughness.jpg')
);

const envTexture = cubeTextureLoader.load([
  require('./textures/environmentMaps/1/px.jpg'),
  require('./textures/environmentMaps/1/nx.jpg'),
  require('./textures/environmentMaps/1/py.jpg'),
  require('./textures/environmentMaps/1/ny.jpg'),
  require('./textures/environmentMaps/1/pz.jpg'),
  require('./textures/environmentMaps/1/nz.jpg'),
]);

const matcapTexture = textureLoader.load(require('./textures/matcaps/5.png'));
const matcapTexture2 = textureLoader.load(require('./textures/matcaps/8.png'));
const gradientTexture = textureLoader.load(
  require('./textures/gradients/3.jpg')
);

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});

const material2 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture2,
});

// const material = new THREE.MeshStandardMaterial({
//   transparent: true,
//   metalness: 1,
//   roughness: 0.1,
//   envMap: envTexture,
//   envMapIntensity: 1,
//   // wireframe: true
// });

// const ambLight = new THREE.AmbientLight(0xffccff, 0.4);
// scene.add(ambLight);

// const ptLight = new THREE.PointLight(0xcc00ff, 0.5);
// ptLight.position.x = 2;
// ptLight.position.y = 3;
// ptLight.position.z = 4;
// scene.add(ptLight);

const geometry = new TextGeometry('S U N I F Y', {
  font,
  size: 0.5,
  height: 0.4,
  bevelEnabled: true,
  bevelSize: 0.03,
  bevelThickness: 0.02,
  curveSegments: 5,
  bevelOffset: 0.01,
  bevelSegments: 4,
});
geometry.center();
geometry.computeBoundingBox();

const text = new THREE.Mesh(geometry, material);
scene.add(text);

const cam = new THREE.PerspectiveCamera(
  60,
  size.width / size.height,
  0.1,
  1000
);
scene.add(cam);

cam.position.z = 3;

// const aHelper = new THREE.AxesHelper();
// scene.add(aHelper);

console.time('geo');
const donutGeom = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
for (let i = 0; i < 100; i += 1) {
  const donut = new THREE.Mesh(donutGeom, material2);
  donut.position.x = (Math.min(1, Math.random() + 0.05) - 0.5) * 5;
  donut.position.y = (Math.min(1, Math.random() + 0.05) - 0.5) * 5;
  donut.position.z = (Math.min(1, Math.random() + 0.05) - 0.5) * 5;
  donut.rotation.x = Math.PI * 2 * Math.random();
  donut.rotation.y = Math.PI * 2 * Math.random();
  donut.rotation.z = Math.PI * 2 * Math.random();
  donut.scale.multiplyScalar(Math.random() - 0.5);
  scene.add(donut);
}
console.timeEnd('geo');

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({
  canvas,
});

const controls = new OrbitControls(cam, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();

runWithFPS((delta) => {
  // cam.position.x = Math.sin(cursor.x * Math.PI * 2) * 10;
  // cam.position.z = Math.cos(cursor.x * Math.PI * 2) * 10;
  // cam.position.y = cursor.y * 10;
  // cam.lookAt(group.position);

  const t = clock.getElapsedTime();
  // plane.rotation.x = -0.2 * t;
  // plane.rotation.y = 0.1 * t;

  controls.update();
  cam.aspect = size.width / size.height;
  cam.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.render(scene, cam);
}, 60);

// document.addEventListener("mousemove", (e) => {
//   cursor.x = e.clientX / size.width - 0.5;
//   cursor.y = -(e.clientY / size.height - 0.5);
// });

window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
});

const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;

window.addEventListener('dblclick', () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  const requestFullscreen =
    canvas.requestFullscreen || canvas.webkitRequestFullscreen;
  if (!fullscreenElement) {
    requestFullscreen.call(canvas);
  } else {
    exitFullscreen.call(document);
  }
});
