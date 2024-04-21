import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.0001,
  1000
);

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableZoom = true;
controls.enableDamping = true;
controls.maxPolarAngle = 1.45;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 2);

const texture = new THREE.TextureLoader().load("textures/square_floor.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);

const material = new THREE.MeshBasicMaterial({
  color: 0x808080,
  map: texture,
  side: THREE.DoubleSide,
  shadowSide: true,
});

const plane = new THREE.Mesh(geometry, material);
plane.rotateX(-Math.PI * 0.5);
// scene.add(plane);

camera.position.set(0.5, 0.1, 1);

const stats = new Stats();
document.body.appendChild(stats.dom);
const params = {
  height: 0.5,
  radius: 5,
  enabled: true,
};

const exrLoader = new EXRLoader();
const envMap = await exrLoader.loadAsync("/beach.exr");
envMap.mapping = THREE.EquirectangularReflectionMapping;

let skybox = new GroundedSkybox(envMap, params.height, params.radius);
skybox.position.y = params.height;
scene.add(skybox);

scene.environment = envMap;
scene.background = envMap;

const loader = new GLTFLoader();

loader.load(
  "/models/car/scene.gltf",
  function (gltf) {
    gltf.scene.scale.set(0.001, 0.001, 0.001);
    gltf.scene.receiveShadow = true;
    gltf.scene.castShadow = true;
    camera.lookAt(gltf.scene.position);

    scene.add(gltf.scene);
  },
  function (progress) {},
  function (error) {
    console.error(error);
  }
);

function animate() {
  stats.update();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
