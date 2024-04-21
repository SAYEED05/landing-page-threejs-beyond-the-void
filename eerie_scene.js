import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";
import { createPlaneMesh } from "./helpers/creators";
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.0001,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableZoom = true;
controls.enableDamping = true;
controls.maxPolarAngle = 1.45;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const froundTexture = new THREE.TextureLoader().load(
  "textures/rubber_tiles_diff_4k.jpg"
);
froundTexture.wrapS = THREE.RepeatWrapping;
froundTexture.wrapT = THREE.RepeatWrapping;
froundTexture.repeat.set(4, 3);

const ground = createPlaneMesh(10, 20, {
  // map: froundTexture,
  color: 0xebdb34,
  side: THREE.DoubleSide,
});
ground.receiveShadow = true;

const frontWall = createPlaneMesh(10, 5, {
  // color: 0xd41313,
  side: THREE.DoubleSide,
  // shadowSide: true,
  metalness: 1,
  roughness: 0.1,
});
const backWall = createPlaneMesh(10, 5, {
  // color: 0xd41313,
  side: THREE.DoubleSide,
  // shadowSide: true,
  metalness: 1,
  roughness: 0.1,
});
backWall.receiveShadow = true;
ground.rotateX(-Math.PI * 0.5);
scene.add(ground);

frontWall.position.z = 10;
frontWall.position.y = 2.5;
scene.add(frontWall);

// backWall.position.z = -10;
// backWall.position.y = 2.5;
// scene.add(backWall);

camera.position.set(3.7, 3.6, -26);

const stats = new Stats();
document.body.appendChild(stats.dom);

const directionalLight = new THREE.DirectionalLight(0xff0000, 5);
directionalLight.castShadow = true;
directionalLight.position.x = 0;
directionalLight.position.y = 4;
directionalLight.position.z = 5.25;
directionalLight.target.position.set(0, 0, 0);

directionalLight.shadow.mapSize.width = 1024; // Adjust shadow map size
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5; // Adjust shadow camera near and far planes
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -10; // Adjust shadow camera frustum
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
scene.add(directionalLight);

const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(helper);

const light = new THREE.AmbientLight(0x404040, 50); // soft white light
scene.add(light);

const loader = new GLTFLoader();

loader.load(
  "/models/cooper/scene.gltf",
  function (gltf) {
    console.log(gltf, "gltf");
    gltf.scene.scale.set(1, 1, 1);
    // gltf.scene.position.z = 1;
    gltf.scene.position.y = 1;
    gltf.scene.traverse(function (node) {
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

function animate() {
  stats.update();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
