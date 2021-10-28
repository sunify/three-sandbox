import './styles.css';

import runWithFPS from 'run-with-fps';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

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

const matcapTexture = textureLoader.load(require('./textures/matcaps/3.png'));
const gradientTexture = textureLoader.load(
  require('./textures/gradients/3.jpg')
);

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture, alphaMap: doorAlphaTexture, transparent: true });
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial({ flatShading: true });

// const material = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture
// });

// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshPhongMaterial({ color: 0xffffcc, shininess: 1000, specular: 0xffffee });
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;
// const material = new THREE.MeshToonMaterial({ gradientMap: gradientTexture });

const material = new THREE.MeshStandardMaterial({
  // map: doorColorTexture,
  // metalnessMap: doorMetalTexture,
  // roughnessMap: doorRoughnessTexture,
  // aoMap: doorAmbTexture,
  // displacementMap: doorHeightTexture,
  // displacementScale: 0.08,
  // normalMap: doorNormalTexture,
  // alphaMap: doorAlphaTexture,
  transparent: true,
  metalness: 1,
  roughness: 0.1,
  envMap: envTexture,
  envMapIntensity: 1
});

const ambLight = new THREE.AmbientLight(0xffccff, 0.4);
scene.add(ambLight);

const ptLight = new THREE.PointLight(0xcc00ff, 0.5);
ptLight.position.x = 2;
ptLight.position.y = 3;
ptLight.position.z = 4;
scene.add(ptLight);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 30), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.position.x = -2;
plane.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
sphere.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 20, 50),
  material
);
torus.position.x = 2;

scene.add(torus, plane, sphere);

const cam = new THREE.PerspectiveCamera(
  60,
  size.width / size.height,
  0.1,
  1000
);
scene.add(cam);

cam.position.z = 6;

const aHelper = new THREE.AxesHelper();
scene.add(aHelper);

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
  sphere.rotation.x = -0.2 * t;
  sphere.rotation.y = 0.1 * t;
  torus.rotation.x = 0.2 * t;
  torus.rotation.y = 0.1 * t;
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
