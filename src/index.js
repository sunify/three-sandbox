import './styles.css';

import runWithFPS from 'run-with-fps';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

window.THREE = THREE;

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const doorTextures = {
  color: textureLoader.load(require('./textures/door/color.jpg')),
  alpha: textureLoader.load(require('./textures/door/alpha.jpg')),
  ambientOcclusion: textureLoader.load(require('./textures/door/ambientOcclusion.jpg')),
  height: textureLoader.load(require('./textures/door/height.jpg')),
  normal: textureLoader.load(require('./textures/door/normal.jpg')),
  metalness: textureLoader.load(require('./textures/door/metalness.jpg')),
  roughness: textureLoader.load(require('./textures/door/roughness.jpg')),
};

const wallTexture = {
  color: textureLoader.load(require('./textures/bricks/color.jpg')),
  ambientOcclusion: textureLoader.load(require('./textures/bricks/ambientOcclusion.jpg')),
  normal: textureLoader.load(require('./textures/bricks/normal.jpg')),
  roughness: textureLoader.load(require('./textures/bricks/roughness.jpg')),
};

const grassTexture = {
  color: textureLoader.load(require('./textures/grass/color.jpg')),
  ambientOcclusion: textureLoader.load(require('./textures/grass/ambientOcclusion.jpg')),
  normal: textureLoader.load(require('./textures/grass/normal.jpg')),
  roughness: textureLoader.load(require('./textures/grass/roughness.jpg')),
};

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const ambLight = new THREE.AmbientLight('#b9d5ff', 0.12);
scene.add(ambLight);

const moonlight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonlight.position.set(4, 5, -2);
scene.add(moonlight);


const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost1, ghost2, ghost3);


Object.entries(grassTexture).forEach(([, texture]) => {
  texture.repeat.set(8, 8);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
})
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassTexture.color,
    aoMap: grassTexture.ambientOcclusion,
    normalMap: grassTexture.normal,
    roughnessMap: grassTexture.roughness
  })
);
plane.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2));
plane.rotation.x = -Math.PI / 2;
scene.add(plane);


const house = new THREE.Group();

const height = 2.5;
const roofHeight = 1.5;
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, height, 4),
  new THREE.MeshStandardMaterial({
    map: wallTexture.color,
    aoMap: wallTexture.ambientOcclusion,
    normalMap: wallTexture.normal,
    roughnessMap: wallTexture.roughness
  })
);
walls.position.y = height / 2;
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, roofHeight, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45'})
);
roof.rotation.y = Math.PI / 4;
roof.position.y = height + roofHeight / 2;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 20, 20),
  new THREE.MeshStandardMaterial({
    map: doorTextures.color,
    alphaMap: doorTextures.alpha,
    aoMap: doorTextures.ambientOcclusion,
    normalMap: doorTextures.normal,
    metalnessMap: doorTextures.metalness,
    rougnessMap: doorTextures.rougness,
    displacementMap: doorTextures.height,
    displacementScale: 0.01,
    transparent: true
  })
);
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
door.position.y = 1;
door.position.z = 2 + 0.001;

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.multiplyScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.multiplyScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.multiplyScalar(0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.multiplyScalar(0.15);
bush4.position.set(-1, 0.05, 2.6);

const doorlight = new THREE.PointLight('#ff7d46', 1, 7);
doorlight.position.set(0, 2.2, 2.7);

house.add(walls, roof, door, bush1, bush2, bush3, bush4, doorlight);

const graves = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });
for (let i = 0; i < 50; i += 1) {
  const angle = Math.PI * 1.8 * Math.random() + Math.PI * 0.1;
  const dist = Math.random() * 5 + 3.5;

  const grave = new THREE.Mesh(
    graveGeometry,
    graveMaterial
  );
  grave.castShadow = true;
  grave.position.x = Math.sin(angle) * dist;
  grave.position.z = Math.cos(angle) * dist;
  grave.position.y = 0.4;
  grave.rotation.y = Math.PI / 6 * (Math.random() - 0.5);
  grave.rotation.z = Math.PI / 10 * (Math.random() - 0.5);

  graves.add(grave);
}

scene.add(house, graves);




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

const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;
renderer.setClearColor('#262837');

renderer.shadowMap.enabled = true;
moonlight.castShadow = true;
doorlight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

plane.receiveShadow = true;
walls.castShadow = true;
walls.receiveShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

const controls = new OrbitControls(cam, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();

const handleResize = () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  cam.aspect = size.width / size.height;
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  cam.updateProjectionMatrix();
};
handleResize();
window.addEventListener('resize', handleResize);

runWithFPS((delta) => {
  const t = clock.getElapsedTime();

  const angle1 = t * 0.5;
  ghost1.position.x = Math.sin(angle1) * 4;
  ghost1.position.z = Math.cos(angle1) * 4;
  ghost1.position.y = Math.sin(t * 3);

  const angle2 = -t * 0.32;
  ghost2.position.x = Math.sin(angle2) * 5;
  ghost2.position.z = Math.cos(angle2) * 5;
  ghost2.position.y = Math.sin(t * 4) + Math.sin(t * 2.5);

  const angle3 = -t * 0.18;
  ghost3.position.x = Math.sin(angle3) * (7 + Math.sin(t * 0.32));
  ghost3.position.z = Math.cos(angle3) * (7 + Math.sin(t * 0.5));
  ghost3.position.y = Math.sin(t * 4) + Math.sin(t * 2.5);


  controls.update();
  renderer.render(scene, cam);
}, 60);

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
