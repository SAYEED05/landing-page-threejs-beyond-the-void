import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";

export const createPlaneGeometry = (width, height) => {
  return new THREE.PlaneGeometry(width, height);
};
export const createMeshBasicMaterials = (obj) => {
  return new THREE.MeshStandardMaterial(obj);
};
export const createPlaneMesh = (width, height, obj) => {
  const geometry = createPlaneGeometry(width, height);
  const material = createMeshBasicMaterials(obj);
  return new THREE.Mesh(geometry, material);
};
export const createStatsElement = () => {
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  return stats;
};
export const createSpotlight = (obj, position) => {
  const spotLight = new THREE.SpotLight(0xffffff, 200, undefined, 0.2, 0.5);
  spotLight.castShadow = true;
  spotLight.position.set(position.x, position.y, position.z);
  spotLight.target.position.set(0, 0, 0);
  return spotLight;
};
