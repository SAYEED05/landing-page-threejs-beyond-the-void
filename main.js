import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import {
  createPlaneMesh,
  createSpotlight,
  createStatsElement,
} from "./helpers/creators";
import gsap from "gsap";
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.0001,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0x121112, 50); // soft white light
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.enableZoom = true;
controls.enableDamping = true;
controls.maxPolarAngle = 1.45;

const ground = createPlaneMesh(50, 50, {
  color: 0x000000,
  side: THREE.DoubleSide,
});
ground.receiveShadow = true;

ground.rotateX(-Math.PI * 0.5);
scene.add(ground);
const frontWall = createPlaneMesh(10, 5, {
  color: 0xffffff,
  side: THREE.DoubleSide,
  shadowSide: true,
  roughness: 0.1,
});
frontWall.position.z = 25;
frontWall.position.y = 2.5;
scene.add(frontWall);

camera.position.set(1, 1, -10);

const stats = createStatsElement();

const spotLight = createSpotlight(
  {
    color: 0xffffff,
    intensity: 200,
    distance: undefined,
    angle: 0.2,
    penumbra: 0.5,
  },
  { x: 0, y: 7, z: 0 }
);
scene.add(spotLight);
// const spotLighthelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLighthelper);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
// directionalLight.castShadow = true;
// directionalLight.position.x = 0;
// directionalLight.position.y = 4;
// directionalLight.position.z = 8;
// directionalLight.target.position.set(0, 0, 0);
// scene.add(directionalLight);

// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(helper);

const loader = new GLTFLoader();

loader.load(
  "/models/cooper/scene.gltf",
  function (gltf) {
    console.log(gltf, "gltf");
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.y = 1.25;
    gltf.scene.traverse(function (node) {
      if (node.name === "Ground_1") {
        node.visible = false;
      }
      if (node.isMesh) {
        console.log(node, "node");
        node.castShadow = true;
      }
    });
    scene.add(gltf.scene);
  },
  function (progress) {
    console.log("loading");
  },
  function (error) {
    console.error(error);
  }
);

window.addEventListener("resize", function onWindowResized() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

////AUDIO/////

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("sounds/bg2.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
});
// addEventListener("mousedown", () => sound.play());

//Main Loop

function animate() {
  stats.update();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
