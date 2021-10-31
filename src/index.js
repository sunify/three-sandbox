import './styles.css';

import runWithFPS from 'run-with-fps';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

window.THREE = THREE;

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const shadowTexture = textureLoader.load(
  require('./textures/simpleShadow.jpg')
);

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
);
sphere.position.y = 0.5;
scene.add(sphere);


const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambLight);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  material
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: shadowTexture
  })
);
scene.add(sphereShadow);
sphereShadow.rotation.x = -Math.PI / 2;
sphereShadow.position.y = 0.001;

const ptLight = new THREE.PointLight(0xFFFFFF, 0.5, 20, 2);
ptLight.position.x = 2;
ptLight.position.y = 3;
ptLight.position.z = -4;
scene.add(ptLight);
ptLight.castShadow = true;
ptLight.shadow.mapSize.set(1024, 1024);
ptLight.shadow.camera.near = 2;
ptLight.shadow.camera.far = 6;

const dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
dirLight.castShadow = true;
scene.add(dirLight);
dirLight.position.set(1 , 1, 0);

dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 6;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.mapSize.set(1024, 1024)


const cam = new THREE.PerspectiveCamera(
  60,
  size.width / size.height,
  0.1,
  1000
);
scene.add(cam);

cam.position.z = 10;
cam.position.y = 5;

const aHelper = new THREE.AxesHelper();
scene.add(aHelper);

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({
  canvas,
});
// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
plane.receiveShadow = true;
sphere.castShadow = true;

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

  sphere.position.x = Math.cos(t) * 1.5;
  sphere.position.z = Math.sin(t) * 1.5;
  sphere.position.y = Math.abs(Math.sin(t * 3)) + 0.5;
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  const progress = 1 - sphere.position.distanceTo(sphereShadow.position) / 1.5;
  sphereShadow.material.opacity = (progress + 0.3) * 0.5;
  const scale = 1 - progress + 0.3;
  sphereShadow.scale.set(scale, scale, scale);

  controls.update();

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
  cam.aspect = size.width / size.height;
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
