import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import "./app.css";

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

const light = new THREE.DirectionalLight(0xff5555, 6);
light.position.set(2, 2, 2);
scene.add(light);

camera.position.z = 3;
camera.position.y = 0.4;
camera.rotation.x = 0;
camera.rotation.y = 0.2;

const loader = new GLTFLoader();

let chaise;
let scrollY = 0;

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
    renderer.render(scene, camera);
}

window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
});

const states = {
    initial: {
        cameraPosition: [0, 0.4, 3],
        cameraRotation: [0, 0.2, 0],
        chaiseRotation: [0, -0.5, 0],
    },
    full: {
        cameraPosition: [0, 0.5, 2],
        cameraRotation: [-0.2, 0, 0],
        chaiseRotation: [0, 0, 0],
    },
};

document.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", (e) => {
        const state = states[b.value];
        camera.position.set(...state.cameraPosition);
        camera.rotation.set(...state.cameraRotation);
        chaise.rotation.set(...state.chaiseRotation);
    });
});
