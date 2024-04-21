import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  convertToParticle,
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
// scene.add(frontWall);

camera.position.set(1, 1, -10);

const stats = createStatsElement();

const spotLight = createSpotlight(
  {
    color: 0xffffff,
    intensity: 0,
    distance: undefined,
    angle: 0.2,
    penumbra: 0.5,
  },
  { x: 0, y: 7, z: 0 }
);
spotLight.visible = false;
scene.add(spotLight);

const loader = new GLTFLoader();

let humanModel = loader.load(
  "/models/cooper/scene.gltf",
  function (human) {
    console.log(human, "human");
    human.scene.scale.set(1, 1, 1);
    // human.scene.position.y = 1.25;
    human.scene.traverse(function (node) {
      if (node.name === "Ground_1") {
        node.visible = false;
      }
      if (node.isMesh) {
        node.castShadow = true;
        //use points instead of mesh
        // node.visible = false;
        // convertToParticle(scene, 3000, node);
      }
    });

    scene.add(human.scene);
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
  sound.offset = 0.7;
});
// addEventListener("mousedown", () => sound.play());

const startButton = document.getElementById("start_button");
startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  // sound.play();
  // gsap.to(humanModel.position, { duration: 5, delay: 1, y: 1.25 });
  spotLight.visible = true;
  gsap.to(camera.position, { duration: 10, delay: 1, x: 0.5, y: 4.5, z: -7 });
  gsap.to(spotLight, {
    duration: 10,
    delay: 1,
    intensity: 200,
    angle: 0.2,
    penumbra: 0.5,
  });
});
//Main Loop

function animate() {
  console.log(camera.position);
  stats.update();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
