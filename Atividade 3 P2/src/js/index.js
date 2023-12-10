import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200);
camera.position.set(0, 1, -5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

scene.background = new THREE.Color(0x000000);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 10);
spotLight.position.set(2, 12, 2);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.5;
spotLight.decay = 1;
spotLight.distance = 200;

spotLight.castShadow = true;
spotLight.shadow.bias = -0.001;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 60;
spotLight.shadow.focus = 1;

scene.add(spotLight);
scene.add(spotLight.target);

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x0008b });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

let dragonKnight;
let mixer;

function initDragonKnight() {
  const modelLoader = new GLTFLoader();
  modelLoader.load('../../assets/dragon_walk/scene.gltf', function (gltf) {
    dragonKnight = gltf.scene;
    dragonKnight.scale.set(0.01, 0.01, 0.01);

    dragonKnight.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    mixer = new THREE.AnimationMixer(dragonKnight);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    scene.add(dragonKnight);
    if (mixer) mixer.update(0.01);
  });
}

function handleKeyDown(event) {
  switch (event.key) {
    case 'a':
      if (dragonKnight) dragonKnight.rotation.y += 0.1;
      break;
    case 'ArrowLeft':
      if (dragonKnight) dragonKnight.rotation.y += 0.1;
      break;
    case 'ArrowRight':
      if (dragonKnight) dragonKnight.rotation.y -= 0.1;
      break;
    case 'd':
      if (dragonKnight) dragonKnight.rotation.y -= 0.1;
      break;
    case 'c':
      spotLight.color.setHex(Math.random() * 0xffffff);
      break;
    case 'r':
      resetDragonKnight();
      break;
    case 'w':
      flag = 1;
      break;
  }
}

function resetDragonKnight() {
  if (dragonKnight) {
    dragonKnight.position.set(0, 0, 0);
    dragonKnight.rotation.set(0, 0, 0);
  }
}

let flag = 0;

function animateDragonKnight() {
  requestAnimationFrame(animateDragonKnight);
  controls.update();
  if (flag) {
    if (mixer) mixer.update(0.01);
  }

  if (dragonKnight) {
    if (flag) {
      dragonKnight.position.x += 0.01 * Math.cos(dragonKnight.rotation.y);
      dragonKnight.position.z -= 0.01 * Math.sin(dragonKnight.rotation.y);
    }

    if (Math.abs(dragonKnight.position.x) > 100 || Math.abs(dragonKnight.position.z) > 100) {
      dragonKnight.position.set(0, 0, 0);
    }

    spotLight.target = dragonKnight;
  }

  renderer.render(scene, camera);
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupEventListeners() {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', handleWindowResize, false);
}

function init() {
  initDragonKnight();
  setupEventListeners();
}

function run() {
  animateDragonKnight();
}

init();
run();
