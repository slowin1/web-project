import * as THREE from "three";

const vertexShader = `
  uniform float uScrollVelocity;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;
  out vec2 vUvCover;

  vec2 getCoverUv(vec2 uv, vec2 textureSize, vec2 quadSize) {
    vec2 ratio = vec2(
      min((quadSize.x / quadSize.y) / (textureSize.x / textureSize.y), 1.0),
      min((quadSize.y / quadSize.x) / (textureSize.y / textureSize.x), 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    vUvCover = getCoverUv(uv, uTextureSize, uQuadSize);
    vec3 pos = position;
    float dist = length(uv - vec2(0.5));
    float bend = dist * dist * uScrollVelocity * 7.5;
    pos.z += bend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  in vec2 vUvCover;
  out vec4 outColor;

  void main() {
    outColor = vec4(texture(uTexture, vUvCover).rgb, 1.0);
  }
`;

const heroCubeVertexShader = `
attribute vec2 a_position;
void main(){
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const heroCubeFragmentShader = `
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_camOffset;
uniform sampler2D u_noise;
uniform float u_cubeSize;
uniform vec3 u_bgColor;
uniform vec3 u_smokeColor;

#define PI 3.141592653589793
#define TWOPI 6.283185307179586
#define HALFPI 1.570796326794896

#define POLAR(theta) vec3(cos(theta), 0.0, sin(theta))
#define SPHERICAL(theta, phi) (sin(phi)*POLAR(theta) + vec3(0.0, cos(phi), 0.0))

#define MAX_ALPHA_PER_UNIT_DIST 10.0
#define QUIT_ALPHA 0.99
#define RAY_STEP 0.04

#define TAN_HALF_FOVY 0.5773502691896257

float len2Inf(vec2 v){
  vec2 d = abs(v);
  return max(d.x, d.y);
}

void boxClip(
  in vec3 boxMin, in vec3 boxMax,
  in vec3 p, in vec3 v,
  out vec2 tRange, out float didHit
){
  vec3 tb0 = (boxMin - p) / v;
  vec3 tb1 = (boxMax - p) / v;
  vec3 tmin = min(tb0, tb1);
  vec3 tmax = max(tb0, tb1);
  tRange = vec2(
    max(max(tmin.x, tmin.y), tmin.z),
    min(min(tmax.x, tmax.y), tmax.z)
  );
  didHit = step(tRange.x, tRange.y);
}

float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 colormap(float t){
  return 0.5 + 0.5 * cos(TWOPI * (t + vec3(0.0, 0.1, 0.2)));
}

vec4 blendOnto(vec4 cFront, vec4 cBehind){
  return cFront + (1.0 - cFront.a) * cBehind;
}

float noise(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  vec2 uv = (i.xy + vec2(37.0, 17.0) * i.z) + f.xy;
  vec2 rg = texture2D(u_noise, (uv + 0.5) / 256.0).yx;
  return mix(rg.x, rg.y, f.z);
}

float fbm(vec3 p){
  p *= 0.6;
  float v = noise(p);
  p *= 0.3;
  v = mix(v, noise(p), 0.7);
  p *= 0.3;
  v = mix(v, noise(p), 0.7);
  return v;
}

float fDensity(vec3 lmn, float t){
  t += 32.0;
  vec3 uvw = (lmn - vec3(63.5)) / 63.5;
  float d2 = fbm(
    vec3(0.6, 0.3, 0.6) * lmn +
    vec3(0.0, 8.0 * t, 0.0)
  );
  float d1 = fbm(
    0.3 * lmn +
    vec3(0.0, 4.0 * t, 0.0) +
    5.0 * vec3(cos(d2 * TWOPI), 2.0 * d2, sin(d2 * TWOPI))
  );
  d1 = pow(d1, mix(4.0, 12.0, smoothstep(0.6, 1.0, len2Inf(uvw.xz))));
  float a = 0.02;
  float b = 0.08;
  float raw = 0.02 + 0.2 * smoothstep(0.0, a, d1) + 0.5 * smoothstep(a, b, d1) + 0.18 * smoothstep(b, 1.0, d1);
  float edgeDist = 1.0 - len2Inf(uvw.xz);
  float edgeFade = smoothstep(0.0, 0.08, edgeDist) * smoothstep(0.0, 0.08, 1.0 - abs(uvw.y));
  return raw * edgeFade;
}

float BOX_N = 128.0;

vec3 lmnFromWorldPos(vec3 p, float cubeSize){
  vec3 bmin = vec3(-cubeSize);
  vec3 bmax = vec3(cubeSize);
  vec3 uvw = (p - bmin) / (bmax - bmin);
  return uvw * (BOX_N - 1.0);
}

float estimateLight(vec3 lmn, vec3 nvToLight, float cubeSize, float time){
  float s1 = fDensity(lmn + nvToLight * 3.0, time);
  float s2 = fDensity(lmn + nvToLight * 8.0, time);
  float occlusion = s1 * 0.5 + s2 * 0.5;
  return exp(-occlusion * 12.0);
}

vec4 marchVolume(vec3 p, vec3 nv, vec2 fragCoord, float cubeSize, float time){
  vec3 bmin = vec3(-cubeSize);
  vec3 bmax = vec3(cubeSize);
  vec2 tRange;
  float didHit;
  boxClip(bmin, bmax, p, nv, tRange, didHit);
  tRange.x = max(0.0, tRange.x);
  vec4 color = vec4(0.0);
  if(didHit < 0.5) return color;

  float camTheta = 0.2 * time + u_camOffset.x;
  vec3 lightPos = 0.9 * POLAR(camTheta + PI * 0.15) + vec3(0.0, 2.0, 0.0);

  float t = tRange.x + min(tRange.y - tRange.x, RAY_STEP) * 0.5 * hash12(fragCoord);
  for(int i = 0; i < 56; i++){
    if(t > tRange.y || color.a > QUIT_ALPHA) break;
    vec3 rayPos = p + t * nv;
    vec3 lmn = lmnFromWorldPos(rayPos, cubeSize);
    float density = fDensity(lmn, time);
    vec3 nvToLight = normalize(lmnFromWorldPos(lightPos, cubeSize) - lmn);
    float lightAmount = estimateLight(lmn, nvToLight, cubeSize, time);
    lightAmount = mix(lightAmount, 1.0, 0.05);

    vec3 cfrag = u_smokeColor * colormap(0.7 * density + 0.8);
    float calpha = density * MAX_ALPHA_PER_UNIT_DIST * RAY_STEP;
    vec4 ci = clamp(vec4(cfrag * lightAmount, 1.0) * calpha, 0.0, 1.0);
    color = blendOnto(color, ci);
    t += RAY_STEP;
  }
  float finalA = clamp(color.a / QUIT_ALPHA, 0.0, 1.0);
  color *= (finalA / (color.a + 1e-5));
  return color;
}

vec3 nvCamDirFromClip(vec3 nvFw, vec2 clip, vec2 res){
  vec3 nvRt = normalize(cross(nvFw, vec3(0.0, 1.0, 0.0)));
  vec3 nvUp = cross(nvRt, nvFw);
  return normalize(TAN_HALF_FOVY * (clip.x * (res.x / res.y) * nvRt + clip.y * nvUp) + nvFw);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float camTheta = 0.2 * u_time + u_camOffset.x;
  float camPhi = HALFPI - 0.2 + u_camOffset.y;

  vec3 camPos = 2.5 * SPHERICAL(camTheta, camPhi);
  vec3 lookTarget = vec3(0.0);
  vec3 nvCamFw = normalize(lookTarget - camPos);
  vec3 nvCamDir = nvCamDirFromClip(nvCamFw, uv * 2.0 - 1.0, u_resolution);

  vec4 fgColor = marchVolume(camPos, nvCamDir, gl_FragCoord.xy, u_cubeSize, u_time);
  vec3 finalColor = blendOnto(fgColor, vec4(u_bgColor, 1.0)).rgb;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

let workDistortionInstance = null;
let workHeroCubeInstance = null;

class WorkHeroCube {
  constructor(canvas) {
    this.canvas = canvas;
    this.section = canvas.closest(".work-hero");
    this.gl = null;
    this.program = null;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.buffer = null;
    this.noiseTexture = null;
    this.uniforms = {};
    this.animationFrame = null;
    this.resizeHandler = null;
    this.pointerMoveHandler = null;
    this.visibilityObserver = null;
    this.isVisible = true;
    this.parallaxTarget = { x: 0, y: 0 };
    this.parallaxCurrent = { x: 0, y: 0 };
    this.startTime = performance.now();
    this.init();
  }

  init() {
    if (!this.canvas || !this.section) return;
    if (window.innerWidth < 1000 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.canvas.style.display = "none";
      return;
    }

    this.gl = this.canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
      desynchronized: true,
    });

    if (!this.gl) return;

    this.vertexShader = this.compileShader(this.gl.VERTEX_SHADER, heroCubeVertexShader);
    this.fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, heroCubeFragmentShader);
    if (!this.vertexShader || !this.fragmentShader) return;

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(this.program));
      return;
    }

    this.gl.useProgram(this.program);

    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      this.gl.STATIC_DRAW,
    );

    const positionAttribute = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(positionAttribute);
    this.gl.vertexAttribPointer(positionAttribute, 2, this.gl.FLOAT, false, 0, 0);

    this.noiseTexture = this.createNoiseTexture();
    this.uniforms = {
      time: this.gl.getUniformLocation(this.program, "u_time"),
      resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
      camOffset: this.gl.getUniformLocation(this.program, "u_camOffset"),
      noise: this.gl.getUniformLocation(this.program, "u_noise"),
      cubeSize: this.gl.getUniformLocation(this.program, "u_cubeSize"),
      bgColor: this.gl.getUniformLocation(this.program, "u_bgColor"),
      smokeColor: this.gl.getUniformLocation(this.program, "u_smokeColor"),
    };

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.noiseTexture);
    this.gl.uniform1i(this.uniforms.noise, 0);

    this.resizeHandler = () => this.resize();
    this.pointerMoveHandler = (event) => this.handlePointerMove(event);
    window.addEventListener("resize", this.resizeHandler);
    document.addEventListener("pointermove", this.pointerMoveHandler, { passive: true });
    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && !this.animationFrame) this.render();
      },
      { threshold: 0.01 },
    );
    this.visibilityObserver.observe(this.section);

    this.resize();
    this.render();
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createNoiseTexture() {
    const texture = this.gl.createTexture();
    const noiseData = new Uint8Array(256 * 256 * 4);

    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 256) | 0;
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      256,
      256,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      noiseData,
    );
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return texture;
  }

  resize() {
    if (!this.gl || !this.section) return;

    const scale = Math.min(window.devicePixelRatio || 1, 1);
    const width = Math.max(1, this.section.clientWidth);
    const height = Math.max(1, this.section.clientHeight);
    const renderWidth = Math.round(width * scale);
    const renderHeight = Math.round(height * scale);

    if (this.canvas.width !== renderWidth || this.canvas.height !== renderHeight) {
      this.canvas.width = renderWidth;
      this.canvas.height = renderHeight;
    }
  }

  handlePointerMove(event) {
    if (!this.section) return;

    const rect = this.section.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside || !rect.width || !rect.height) {
      this.parallaxTarget.x = 0;
      this.parallaxTarget.y = 0;
      return;
    }

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    this.parallaxTarget.x = x * 0.58;
    this.parallaxTarget.y = -y * 0.42;
  }

  render() {
    if (!this.gl || !this.program) return;
    if (!this.isVisible || document.hidden) {
      this.animationFrame = null;
      return;
    }

    this.resize();

    this.parallaxCurrent.x += (this.parallaxTarget.x - this.parallaxCurrent.x) * 0.065;
    this.parallaxCurrent.y += (this.parallaxTarget.y - this.parallaxCurrent.y) * 0.065;

    const time = (performance.now() - this.startTime) / 1000;
    const isDark = document.documentElement.classList.contains("dark");
    const bgColor = isDark ? [0.043, 0.043, 0.043] : [0.79, 0.79, 0.76];
    const smokeColor = isDark ? [1.0, 1.0, 1.0] : [0.045, 0.048, 0.045];
    const cubeSize = isDark ? 0.75 : 0.84;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.noiseTexture);

    this.gl.uniform1f(this.uniforms.time, time);
    this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.uniforms.camOffset, this.parallaxCurrent.x, this.parallaxCurrent.y);
    this.gl.uniform1f(this.uniforms.cubeSize, cubeSize);
    this.gl.uniform3f(this.uniforms.bgColor, bgColor[0], bgColor[1], bgColor[2]);
    this.gl.uniform3f(this.uniforms.smokeColor, smokeColor[0], smokeColor[1], smokeColor[2]);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.animationFrame = requestAnimationFrame(() => this.render());
  }

  destroy() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.resizeHandler) window.removeEventListener("resize", this.resizeHandler);
    if (this.pointerMoveHandler) {
      document.removeEventListener("pointermove", this.pointerMoveHandler);
    }
    if (this.visibilityObserver) this.visibilityObserver.disconnect();

    if (this.gl) {
      if (this.program) this.gl.deleteProgram(this.program);
      if (this.vertexShader) this.gl.deleteShader(this.vertexShader);
      if (this.fragmentShader) this.gl.deleteShader(this.fragmentShader);
      if (this.buffer) this.gl.deleteBuffer(this.buffer);
      if (this.noiseTexture) this.gl.deleteTexture(this.noiseTexture);
    }
  }
}

// scroll-driven image distortion effect
class WorkDistortion {
  constructor() {
    this.maxDistortionItems = 24;
    this.scrollVelocity = 0;
    this.smoothVelocity = 0;
    this.mediaStore = [];
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.resizeHandler = null;
    this.mutationObserver = null;
    this.visibilityObserver = null;
    this.rebuildTimer = null;
    this.animationFrame = null;
    this.isRendering = false;
    this.meshBuildId = 0;
    this.isDestroyed = false;
    this.isInGalleryViewport = false;
    this.isMobile = window.innerWidth < 1000;
    this.init();
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupGeometry();
    this.setupMaterial();
    this.createMeshes();
    this.setupLenisListener();
    this.addEventListeners();
    this.observeGalleryVisibility();
    this.observeMediaChanges();
    if (!this.isMobile) this.startRender();
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    const CAMERA_POS = 400;
    const calcFov = (pos) =>
      (2 * Math.atan(window.innerHeight / 2 / pos) * 180) / Math.PI;

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      10,
      1000,
    );
    this.camera.position.z = CAMERA_POS;
    this.camera.fov = calcFov(CAMERA_POS);
    this.camera.updateProjectionMatrix();
  }

  setupRenderer() {
    if (this.isMobile) return;

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    this.renderer.domElement.style.position = "fixed";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.left = "0";
    this.renderer.domElement.style.pointerEvents = "none";
    this.renderer.domElement.style.zIndex = "1";
    this.renderer.domElement.style.display = "none";
    document.body.appendChild(this.renderer.domElement);
  }

  setupGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  }

  setupMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uScrollVelocity: { value: 0 },
        uTexture: { value: null },
        uTextureSize: { value: new THREE.Vector2(100, 100) },
        uQuadSize: { value: new THREE.Vector2(100, 100) },
      },
      vertexShader,
      fragmentShader,
      glslVersion: THREE.GLSL3,
    });
  }

  createMeshes() {
    const buildId = ++this.meshBuildId;
    const scrollY = window.scrollY || window.pageYOffset;
    const allMedia = [...document.querySelectorAll(".work-item img")];
    const media = allMedia.slice(0, this.maxDistortionItems);

    if (this.isMobile || !this.renderer) {
      allMedia.forEach((img) => {
        img.style.opacity = "1";
      });
      return;
    }

    allMedia.slice(this.maxDistortionItems).forEach((img) => {
      img.style.opacity = "1";
    });
    this.updateRendererVisibility();

    Promise.all(media.map((img) => this.loadTextureSource(img))).then((loadedImages) => {
      if (this.isDestroyed || buildId !== this.meshBuildId) return;

      this.mediaStore = loadedImages.filter(Boolean).map(({ mediaElement, textureElement }) => {
        const bounds = mediaElement.getBoundingClientRect();
        const imageMaterial = this.material.clone();
        const imageMesh = new THREE.Mesh(this.geometry, imageMaterial);

        const texture = new THREE.Texture(textureElement);
        texture.needsUpdate = true;
        texture.colorSpace = THREE.SRGBColorSpace;

        imageMaterial.uniforms.uTexture.value = texture;
        imageMaterial.uniforms.uTextureSize.value.x =
          textureElement.naturalWidth || mediaElement.naturalWidth || 1;
        imageMaterial.uniforms.uTextureSize.value.y =
          textureElement.naturalHeight || mediaElement.naturalHeight || 1;
        imageMaterial.uniforms.uQuadSize.value.x = bounds.width;
        imageMaterial.uniforms.uQuadSize.value.y = bounds.height;

        imageMesh.scale.set(bounds.width, bounds.height, 1);

        this.scene.add(imageMesh);
        mediaElement.style.opacity = "0";

        return {
          media: mediaElement,
          material: imageMaterial,
          mesh: imageMesh,
          width: bounds.width,
          height: bounds.height,
          top: bounds.top + scrollY,
          left: bounds.left,
        };
      });

      if (this.mediaStore.length === 0 && this.renderer) {
        this.renderer.domElement.style.display = "none";
      }

      this.updateRendererVisibility();
    });
  }

  loadTextureSource(mediaElement) {
    const src = mediaElement.currentSrc || mediaElement.src;

    const waitForDomImage = () =>
      new Promise((resolve) => {
        if (mediaElement.complete && mediaElement.naturalWidth > 0) {
          resolve(mediaElement);
        } else {
          mediaElement.onload = () => resolve(mediaElement);
          mediaElement.onerror = () => resolve(null);
        }
      });

    return waitForDomImage().then((loadedMedia) => {
      if (!loadedMedia) return null;

      try {
        const url = new URL(src, window.location.href);
        if (url.origin === window.location.origin) {
          return { mediaElement, textureElement: mediaElement };
        }
      } catch {
        return { mediaElement, textureElement: mediaElement };
      }

      return new Promise((resolve) => {
        const textureImage = new Image();
        textureImage.crossOrigin = "anonymous";
        textureImage.onload = () => resolve({ mediaElement, textureElement: textureImage });
        textureImage.onerror = () => {
          mediaElement.style.opacity = "1";
          resolve(null);
        };
        textureImage.src = src;
      });
    });
  }

  clearMeshes() {
    this.mediaStore.forEach((object) => {
      object.media.style.opacity = "1";
      if (this.scene && object.mesh) this.scene.remove(object.mesh);
      if (object.material?.uniforms?.uTexture?.value) {
        object.material.uniforms.uTexture.value.dispose();
      }
      if (object.material) object.material.dispose();
    });

    this.mediaStore = [];
  }

  rebuildMeshes() {
    clearTimeout(this.rebuildTimer);
    this.rebuildTimer = setTimeout(() => {
      if (this.isDestroyed) return;
      this.clearMeshes();
      this.createMeshes();
    }, 50);
  }

  setupLenisListener() {
    const checkLenis = () => {
      if (window.lenis) {
        window.lenis.on("scroll", ({ velocity }) => {
          this.scrollVelocity = velocity;
        });
      } else {
        setTimeout(checkLenis, 50);
      }
    };
    checkLenis();
  }

  setPositions() {
    const scrollY = window.scrollY || window.pageYOffset;

    this.mediaStore.forEach((object) => {
      const bounds = object.media.getBoundingClientRect();
      const isVisible =
        bounds.bottom > 0 &&
        bounds.top < window.innerHeight &&
        bounds.right > 0 &&
        bounds.left < window.innerWidth;

      object.mesh.visible = isVisible;
      if (!isVisible) return;

      object.width = bounds.width;
      object.height = bounds.height;
      object.top = bounds.top + scrollY;
      object.left = bounds.left;
      object.mesh.scale.set(bounds.width, bounds.height, 1);
      object.material.uniforms.uQuadSize.value.x = bounds.width;
      object.material.uniforms.uQuadSize.value.y = bounds.height;

      const x = object.left - window.innerWidth / 2 + object.width / 2;
      const y =
        -object.top + scrollY + window.innerHeight / 2 - object.height / 2;
      object.mesh.position.x = x;
      object.mesh.position.y = y;
    });
  }

  addEventListeners() {
    this.resizeHandler = () => this.handleResize();
    window.addEventListener("resize", this.resizeHandler);
  }

  observeGalleryVisibility() {
    const workItems = document.querySelector(".work-items");
    if (!workItems || !("IntersectionObserver" in window)) {
      this.isInGalleryViewport = true;
      this.updateRendererVisibility();
      return;
    }

    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.isInGalleryViewport = entry.isIntersecting;
        this.updateRendererVisibility();
      },
      { rootMargin: "-12% 0px -12% 0px", threshold: 0.01 },
    );
    this.visibilityObserver.observe(workItems);
  }

  observeMediaChanges() {
    const workItems = document.querySelector(".work-items");
    if (!workItems) return;

    this.mutationObserver = new MutationObserver(() => this.rebuildMeshes());
    this.mutationObserver.observe(workItems, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1000;

    if (this.isMobile !== wasMobile) {
      this.toggleMode();
      return;
    }

    if (this.isMobile) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const scrollY = window.scrollY || window.pageYOffset;
    this.mediaStore.forEach((object) => {
      const bounds = object.media.getBoundingClientRect();
      object.width = bounds.width;
      object.height = bounds.height;
      object.top = bounds.top + scrollY;
      object.left = bounds.left;

      object.mesh.scale.set(bounds.width, bounds.height, 1);
      object.material.uniforms.uQuadSize.value.x = bounds.width;
      object.material.uniforms.uQuadSize.value.y = bounds.height;
    });
  }

  toggleMode() {
    if (this.isMobile) {
      if (this.renderer) this.renderer.domElement.style.display = "none";
      this.stopRender();
      this.mediaStore.forEach((object) => {
        object.media.style.opacity = "1";
      });
    } else {
      if (!this.renderer) this.setupRenderer();
      this.updateRendererVisibility();
      this.mediaStore.forEach((object) => {
        object.media.style.opacity = "0";
        if (!this.scene.children.includes(object.mesh))
          this.scene.add(object.mesh);
      });
      this.startRender();
    }
  }

  startRender() {
    if (this.isRendering || this.isDestroyed || this.isMobile) return;
    this.isRendering = true;
    this.render();
  }

  stopRender() {
    this.isRendering = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
  }

  updateRendererVisibility() {
    if (!this.renderer) return;
    this.renderer.domElement.style.display =
      !this.isMobile && this.isInGalleryViewport && this.mediaStore.length > 0
        ? "block"
        : "none";
  }

  render() {
    if (this.isDestroyed || !this.isRendering || this.isMobile || document.hidden) {
      this.isRendering = false;
      this.animationFrame = null;
      return;
    }

    this.smoothVelocity += (this.scrollVelocity - this.smoothVelocity) * 0.1;

    this.mediaStore.forEach((object) => {
      object.material.uniforms.uScrollVelocity.value = this.smoothVelocity;
    });

    this.setPositions();
    this.updateRendererVisibility();
    if (this.renderer && this.isInGalleryViewport) {
      this.renderer.render(this.scene, this.camera);
    }
    this.animationFrame = requestAnimationFrame(() => this.render());
  }

  destroy() {
    this.isDestroyed = true;
    clearTimeout(this.rebuildTimer);

    this.stopRender();
    if (this.resizeHandler) window.removeEventListener("resize", this.resizeHandler);
    if (this.mutationObserver) this.mutationObserver.disconnect();
    if (this.visibilityObserver) this.visibilityObserver.disconnect();

    this.clearMeshes();
    if (this.geometry) this.geometry.dispose();

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}

// initialization
document.addEventListener("DOMContentLoaded", () => {
  if (workHeroCubeInstance) {
    workHeroCubeInstance.destroy();
  }

  if (workDistortionInstance) {
    workDistortionInstance.destroy();
  }

  const heroShaderCanvas = document.querySelector(".work-hero-shader");
  if (heroShaderCanvas) {
    workHeroCubeInstance = new WorkHeroCube(heroShaderCanvas);
  }

  workDistortionInstance = new WorkDistortion();
});
