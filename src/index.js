import "./styles.css";

import runWithFPS from "run-with-fps";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
// const colorTexture = textureLoader.load(require("./textures/door/color.jpg"))
const colorTexture = textureLoader.load(require("./textures/minecraft.png"))
// const alphaTexture = textureLoader.load(require("./textures/door/alpha.jpg"))
// const heightTexture = textureLoader.load(require("./textures/door/height.jpg"))
// const normalTexture = textureLoader.load(require("./textures/door/normal.jpg"))
// const metalnessTexture = textureLoader.load(require("./textures/door/metalness.jpg"))
// const roughnessTexture = textureLoader.load(require("./textures/door/roughness.jpg"))
// const ambientOcclusionTexture = textureLoader.load(require("./textures/door/ambientOcclusion.jpg"))

// loadingManager.onProgress = ((_, loaded, total) => {
//   console.log({ loaded, total });
// });

// loadingManager.onLoad = () => {
//   console.log('load is done');
// }

// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

const size = {
  width: window.innerWidth,
  height: window.innerHeight
};

const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.BoxBufferGeometry(1, 1, 1);

console.log(geometry.attributes.uv)
const box2 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ map: colorTexture })
);
group.add(box2);
box2.position.set(1.5, 0, 0);

const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00cc })
);
group.add(box3);
box3.position.set(-1.5, 0, 0);

// group.rotation.z = 0.3;

const cam = new THREE.PerspectiveCamera(
  60,
  size.width / size.height,
  0.1,
  1000
);
scene.add(cam);

cam.position.z = 4;
// cam.position.x = 1;
// cam.position.y = 1;

const aHelper = new THREE.AxesHelper();
scene.add(aHelper);

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({
  canvas
});

const controls = new OrbitControls(cam, canvas);
controls.enableDamping = true;

runWithFPS((delta) => {
  // cam.position.x = Math.sin(cursor.x * Math.PI * 2) * 10;
  // cam.position.z = Math.cos(cursor.x * Math.PI * 2) * 10;
  // cam.position.y = cursor.y * 10;
  // cam.lookAt(group.position);
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

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
});

const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;

window.addEventListener("dblclick", () => {
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
