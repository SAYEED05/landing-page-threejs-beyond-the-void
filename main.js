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

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  logarithmicDepthBuffer: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0x121112, 5); // soft white light
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

camera.position.set(1, 1.5, 8);

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

let humanModel; // Define the humanModel variable outside the scope of the loader

// Create a function to load the model and return a promise
function loadModel() {
  return new Promise((resolve, reject) => {
    loader.load(
      "/models/cooper/scene.gltf",
      function (human) {
        // Your loading logic here
        humanModel = human.scene; // Assign the loaded scene to the humanModel variable
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
        resolve(humanModel); // Resolve the promise with the loaded model
      },
      function (progress) {
        console.log("loading");
      },
      function (error) {
        console.error(error);
        reject(error); // Reject the promise if an error occurs
      }
    );
  });
}

loadModel();

loader.load(
  "/models/blackhole/scene.gltf",
  function (blackhole) {
    blackhole.scene.scale.set(10, 10, 10);
    blackhole.scene.position.set(0, 9, 50);
    scene.add(blackhole.scene);
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
audioLoader.load("sounds/bg.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.offset = 0.7;
});
// addEventListener("mousedown", () => sound.play());

const startButton = document.getElementById("start_button");
const title = document.getElementById("title");
const releaseDate = document.getElementById("release_date");
const helperText = document.getElementById("helperText");
startButton.addEventListener("click", async () => {
  gsap.to(helperText, { duration: 0.5, opacity: 0 });
  sound.play();
  startButton.style.display = "none";
  spotLight.visible = true;
  gsap.to(spotLight, {
    duration: 10,
    delay: 1,
    intensity: 200,
    angle: 0.2,
    penumbra: 0.5,
  });
  if (humanModel) {
    const tl = gsap.timeline();
    tl.to(humanModel.position, { duration: 5, delay: 1, y: 1.25 })
      .to(humanModel.position, {
        duration: 2,
        y: 1.15,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      })

      .to(camera.position, {
        duration: 10,
        x: -0.1,
        y: 1,
        z: -9,
      })
      .to(title, {
        duration: 1,
        opacity: 1,
      })
      .to(releaseDate, {
        duration: 1,
        opacity: 1,
      });
  }
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
