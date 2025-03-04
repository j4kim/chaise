import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff0000);
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xff5555, 3);
light.position.set(2, 2, 2);
scene.add(light);

camera.position.z = 2;
camera.position.y = 0.3;
camera.rotation.x = -0.15;

const loader = new GLTFLoader();

let chaise;

loader.load(
    "chaise.glb",
    function (gltf) {
        chaise = gltf.scene;
        scene.add(chaise);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

function animate() {
    if (chaise) {
        chaise.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}
