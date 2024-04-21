import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

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
  const spotLight = new THREE.SpotLight(obj);
  spotLight.castShadow = true;
  spotLight.position.set(position.x, position.y, position.z);
  spotLight.target.position.set(0, 0, 0);
  return spotLight;
};

export const convertToParticle = (scene, numParticles, node) => {
  const particles = [];
  const originalPositions = [];
  const originalMaterials = [];
  const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const sphereGeometry = new THREE.SphereGeometry(0.003, 16, 16);
  let sampler = new MeshSurfaceSampler(node).build();

  for (let i = 0; i < numParticles; i++) {
    const sample = new THREE.Vector3();
    sampler.sample(sample);
    const particle = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshStandardMaterial()
    );
    particle.position.copy(sample);
    particle.position.copy(node.localToWorld(particle.position));
    particles.push(particle);
    originalPositions.push(sample.clone());
    originalMaterials.push(particle.material.clone());
    scene.add(particle);
  }
};
