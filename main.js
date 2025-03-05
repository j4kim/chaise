import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import "./app.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const loader = new GLTFLoader();

let chaise;

const states = {
    initial: {
        cameraPosition: [0, 0.4, 3],
        cameraRotation: [0, 0.2, 0],
        chaiseRotation: [0, -0.5, 0],
    },
    full: {
        cameraPosition: [0, 0.5, 2],
        cameraRotation: [-0.2, -0.2, 0],
        chaiseRotation: [0, -1.8 * Math.PI, 0],
    },
};

const initialState = states.initial;

loader.load(
    "chaise.glb",
    function (gltf) {
        chaise = gltf.scene;
        scene.add(chaise);
        setState(initialState);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

function animate() {
    renderer.render(scene, camera);
}

function setState(state) {
    camera.position.set(...state.cameraPosition);
    camera.rotation.set(...state.cameraRotation);
    chaise.rotation.set(...state.chaiseRotation);
}

document.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", (e) => {
        setState(states[b.value]);
    });
});

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function lerpArray(start, end, t) {
    return start.map((n, i) => lerp(n, end[i], t));
}

function lerpState(start, end, t) {
    setState({
        cameraPosition: lerpArray(start.cameraPosition, end.cameraPosition, t),
        cameraRotation: lerpArray(start.cameraRotation, end.cameraRotation, t),
        chaiseRotation: lerpArray(start.chaiseRotation, end.chaiseRotation, t),
    });
}

ScrollTrigger.create({
    trigger: "#s1",
    start: "top top",
    onUpdate: (self) => {
        if (!chaise) return;
        lerpState(states.initial, states.full, self.progress);
    },
});
