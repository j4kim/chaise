import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import "./app.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const w = window.innerWidth;
const ratio = w / window.innerHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff0000);
const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xff5555, 6);
light.position.set(2, 2, 2);
scene.add(light);

const loader = new GLTFLoader();

let chaise;

const wmax = 1000;
const wmin = 400;

function mapY(max, min = 0) {
    if (w <= wmin) return min;
    if (w > wmax) return max;
    return ((w - wmin) / (wmax - wmin)) * max;
}

const states = {
    initial: {
        cameraPosition: [0, 0.4, 3],
        cameraRotation: [0, mapY(0.35, 0.05), 0],
        chaiseRotation: [0, -0.5, 0],
    },
    full: {
        cameraPosition: [0, 0.5, 2],
        cameraRotation: [-0.2, mapY(-0.3, -0.2), 0],
        chaiseRotation: [0, -1.8 * Math.PI, 0],
    },
    back: {
        cameraPosition: [0, 0.2, 1],
        cameraRotation: [0, 0, 0],
        chaiseRotation: [0, -1 * Math.PI, 0],
    },
    through: {
        cameraPosition: [0, 0.2, -0.5],
        cameraRotation: [0, 0, 0],
        chaiseRotation: [0, -1 * Math.PI, 0],
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

document.querySelectorAll(".buttons button").forEach((b) => {
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

ScrollTrigger.create({
    trigger: "#s2 .text",
    start: "top center",
    onUpdate: (self) => {
        if (!chaise) return;
        lerpState(states.full, states.back, self.progress);
    },
});

ScrollTrigger.create({
    trigger: "#s3",
    start: "top top",
    onUpdate: (self) => {
        if (!chaise) return;
        lerpState(states.back, states.through, self.progress);
        const textel = document.querySelector("#s4 .text");
        textel.style.opacity = (self.progress - 0.5) * 3;
    },
});
