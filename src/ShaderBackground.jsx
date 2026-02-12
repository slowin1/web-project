import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader, trailShader } from './shader.js';

export default function ShaderBackground() {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const gradientCanvas = containerRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(W, H);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '10';
    gradientCanvas.appendChild(renderer.domElement);

    // Ping-pong render targets
    const rtOpts = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    };
    let rtA = new THREE.WebGLRenderTarget(W, H, rtOpts);
    let rtB = new THREE.WebGLRenderTarget(W, H, rtOpts);

    // Trail scene
    const trailScene = new THREE.Scene();
    const trailMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_prev: { value: rtA.texture },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_resolution: { value: new THREE.Vector2(W, H) },
        u_fade: { value: 0.97 },
        u_radius: { value: 0.025 },
        u_isMoving: { value: 0.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: trailShader,
    });
    trailScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), trailMaterial));

    // Main scene
    const mainScene = new THREE.Scene();
    const mainMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(W, H) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_strength: { value: 1.4 },
        u_trail: { value: rtB.texture },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });
    mainScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mainMaterial));

    // Mouse tracking
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const smoothMouse = new THREE.Vector2(0.5, 0.5);
    const prevSmooth = new THREE.Vector2(0.5, 0.5);
    const velocity = new THREE.Vector2(0.0, 0.0);
    const inertiaPos = new THREE.Vector2(0.5, 0.5);
    const mouseLerp = 0.12;
    const friction = 1.0;

    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const prevInertia = new THREE.Vector2(0.5, 0.5);
    const subStep = new THREE.Vector2();
    const subPrev = new THREE.Vector2();
    const SUBSTEPS = 4;

    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);

      prevSmooth.copy(smoothMouse);
      smoothMouse.lerp(targetMouse, mouseLerp);

      velocity.x = (smoothMouse.x - prevSmooth.x) * 0.5 + velocity.x * friction;
      velocity.y = (smoothMouse.y - prevSmooth.y) * 0.5 + velocity.y * friction;

      inertiaPos.set(
        smoothMouse.x + velocity.x * 0.5,
        smoothMouse.y + velocity.y * 0.5
      );

      const isMoving = (smoothMouse.distanceTo(prevSmooth) > 0.0003 || velocity.length() > 0.001) ? 1.0 : 0.0;

      for (let i = 0; i < SUBSTEPS; i++) {
        const t = (i + 1) / SUBSTEPS;
        subStep.lerpVectors(prevInertia, inertiaPos, t);
        subPrev.lerpVectors(prevInertia, inertiaPos, i / SUBSTEPS);

        trailMaterial.uniforms.u_prev.value = rtA.texture;
        trailMaterial.uniforms.u_mouse.value.copy(subStep);
        trailMaterial.uniforms.u_prevMouse.value.copy(subPrev);
        trailMaterial.uniforms.u_isMoving.value = isMoving;

        renderer.setRenderTarget(rtB);
        renderer.render(trailScene, camera);
        renderer.setRenderTarget(null);

        const tmp2 = rtA;
        rtA = rtB;
        rtB = tmp2;
      }

      prevInertia.copy(inertiaPos);

      mainMaterial.uniforms.u_trail.value = rtA.texture;
      mainMaterial.uniforms.u_mouse.value.copy(smoothMouse);
      mainMaterial.uniforms.u_time.value = performance.now() * 0.001;

      renderer.render(mainScene, camera);
    }

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      rtA.setSize(w, h);
      rtB.setSize(w, h);
      trailMaterial.uniforms.u_resolution.value.set(w, h);
      mainMaterial.uniforms.u_resolution.value.set(w, h);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup function
    cleanupRef.current = () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      rtA.dispose();
      rtB.dispose();
      trailMaterial.dispose();
      mainMaterial.dispose();
      if (gradientCanvas.contains(renderer.domElement)) {
        gradientCanvas.removeChild(renderer.domElement);
      }
    };

    return cleanupRef.current;
  }, []);

  return <div ref={containerRef} className="gradient-canvas fixed inset-0 z-10 pointer-events-none" />;
}
