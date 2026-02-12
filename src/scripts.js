import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shader.js';

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const gradientCanvas = document.querySelector('.gradient-canvas');
if (!gradientCanvas) {
    console.warn('No .gradient-canvas element found for shader overlay');
} else {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '10';
    gradientCanvas.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_strength: { value: 1.4 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const smoothMouse = new THREE.Vector2(0.5, 0.5);
    const mouseLerp = 0.4;

    window.addEventListener('mousemove', (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        targetMouse.set(x, y);
    });

    function animate() {
        requestAnimationFrame(animate);
        smoothMouse.lerp(targetMouse, mouseLerp);
        material.uniforms.u_mouse.value.set(smoothMouse.x, smoothMouse.y);
        material.uniforms.u_time.value = performance.now() * 0.001;
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        material.uniforms.u_resolution.value.set(w, h);
    });

    animate();
}