import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);
document.getElementById('basketball-game').contentWindow.document.body.appendChild(renderer.domElement);

// Goal drawing
const ringGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.position.set(0, 2, 0);
scene.add(ring);

// Court drawing
const courtGeometry = new THREE.PlaneGeometry(10, 10);
const courtMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 });
const court = new THREE.Mesh(courtGeometry, courtMaterial);
court.rotation.x = -Math.PI / 2;
scene.add(court);

// Camera setup
camera.position.z = 5;
camera.position.y = 3;
camera.lookAt(0, 2, 0);

renderer.render(scene, camera);

// Variables for tracking success rates
let twoPointSuccess = 0;
let twoPointAttempts = 0;
let threePointSuccess = 0;
let threePointAttempts = 0;

function shootBall() {
    const x = Math.random() * 6 - 3;
    const z = Math.random() * 6 - 3;
    const isThreePoint = Math.sqrt(x ** 2 + z ** 2) > 3;

    const success = Math.random() < (isThreePoint ? 0.4 : 0.7);

    if (isThreePoint) {
        threePointAttempts++;
        if (success) threePointSuccess++;
    } else {
        twoPointAttempts++;
        if (success) twoPointSuccess++;
    }

    updateEvaluation();
}

function updateEvaluation() {
    const twoPointRate = (twoPointSuccess / twoPointAttempts) * 100 || 0;
    const threePointRate = (threePointSuccess / threePointAttempts) * 100 || 0;

    document.getElementById('twoPointRate').textContent = `${twoPointRate.toFixed(2)}%`;
    document.getElementById('threePointRate').textContent = `${threePointRate.toFixed(2)}%`;
}

setInterval(shootBall, 1000);
