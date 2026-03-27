import * as THREE from "three";

// procedural cityscape shader background
const canvas = document.getElementById("skyline");
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const pixelRatioLimit = isMobile ? 1.0 : 1.25;

// theme colors
const THEME_COLORS = {
  light: { bg: new THREE.Vector3(0.7843, 0.8118, 0.7843), fog: 0.15, baseFog: 0.075 },
  dark: { bg: new THREE.Vector3(0.1137, 0.1608, 0.2392), fog: 0.08, baseFog: 0.04 },
};

let currentTheme = "light";
let themeObserver = null;

// Get initial theme from localStorage
function getInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark" ? "dark" : "light";
}

// Only initialize if canvas exists
if (canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: "high-performance",
    stencil: false,
    depth: false,
  });

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);

  // Get initial theme
  currentTheme = getInitialTheme();
  const colors = THEME_COLORS[currentTheme];

  const material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      uBgColor: { value: colors.bg },
      uFog: { value: colors.fog },
      uBaseFog: { value: colors.baseFog },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif

    uniform float iTime;
    uniform vec3 iResolution;
    uniform vec3 uBgColor;
    uniform float uFog;
    uniform float uBaseFog;
    varying vec2 vUv;

    uint seed = 31713U;

    float rand(void) {
      seed = (seed << 13U) ^ seed;
      seed = seed * (seed * seed * 15731U + 789221U) + 1376312589U;
      uint seed2 = seed * seed;
      return float(seed2&0x7fffffffU)/float(0x7fffffffU);
    }

    float Polygon(vec2 uv, float h) {
      float mid = (rand()-.5)*exp2(-h*2.);
      float f = abs(uv.y-rand()+.5)-rand()-2.;
      f = max(f,abs(uv.x-mid)-rand()-.5+h*.4);
      f = max(f,abs(dot(uv,vec2(1,1)/sqrt(2.))-rand()+.5)-rand()-1.);
      f = max(f,abs(dot(uv,vec2(1,-1)/sqrt(2.))-rand()+.5)-rand()-1.);
      return f;
    }

    vec3 Buildings(vec2 uv, int layer) {
      seed = uint(2. + uv.x/4.);
      uv.x = (fract(uv.x/4.)-.5)*4.;

      bool cull = (pow(float(layer+1)/8.,.3) < rand());
      seed += 0x1001U*uint(layer);

      float a = Polygon(uv-vec2(0,0), 0.);
      float b = Polygon(uv-vec2(0,2), .5);
      float c = Polygon(uv-vec2(0,4), 1.);
      if (cull) { a = 1.; b = 1.; c = 1.; }

      a = min(a, uv.y+.5);

      vec3 f = vec3(a,min(a,b),min(min(a,b),c)).zyx;
      vec3 col = vec3(.5+.5*f/(.01+abs(f)));

      return vec3(dot(col,vec3(.985,.01,.005)));
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec2 uv = (fragCoord-iResolution.xy*vec2(.5,.5))/iResolution.y;

      uv *= 10.;
      uv.y += 3.;
      uv.x -= 8.;

      vec3 color = vec3(1);

      const float size = .5;

      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*0.)+iTime*vec2(4,0),0), exp2(-uFog*0.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*1.)+iTime*vec2(4,0),1), exp2(-uFog*1.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*2.)+iTime*vec2(4,0),2), exp2(-uFog*2.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*3.)+iTime*vec2(4,0),3), exp2(-uFog*3.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*4.)+iTime*vec2(4,0),4), exp2(-uFog*4.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*5.)+iTime*vec2(4,0),5), exp2(-uFog*5.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*6.)+iTime*vec2(4,0),6), exp2(-uFog*6.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*7.)+iTime*vec2(4,0),7), exp2(-uFog*7.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*8.)+iTime*vec2(4,0),8), exp2(-uFog*8.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*9.)+iTime*vec2(4,0),9), exp2(-uFog*9.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*10.)+iTime*vec2(4,0),10), exp2(-uFog*10.-uBaseFog)));
      color = min(color, mix(vec3(1), Buildings(uv*exp2(size*11.)+iTime*vec2(4,0),11), exp2(-uFog*11.-uBaseFog)));

      color = pow(color, vec3(1./2.2));

      color = mix(uBgColor, vec3(0.0), 1.0 - color.r);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
    depthTest: false,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // resize handler with debounce
  let resizeTimeout;

  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioLimit));
      material.uniforms.iResolution.value.set(width, height, 1);
    }, 100);
  }

  // animation loop
  function animate(currentTime) {
    requestAnimationFrame(animate);
    material.uniforms.iTime.value = currentTime * 0.001;
    renderer.render(scene, camera);
  }

  // cleanup on page unload
  function cleanup() {
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("beforeunload", cleanup);
    if (themeObserver) themeObserver.disconnect();
  }

  // theme change listener
  function setupThemeListener() {
    themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          const newTheme = isDark ? "dark" : "light";

          if (newTheme !== currentTheme) {
            currentTheme = newTheme;
            const colors = THEME_COLORS[currentTheme];
            material.uniforms.uBgColor.value.copy(colors.bg);
            material.uniforms.uFog.value = colors.fog;
            material.uniforms.uBaseFog.value = colors.baseFog;
          }
        }
      });
    });

    themeObserver.observe(document.documentElement, { attributes: true });
  }

  // initialize
  handleResize();
  window.addEventListener("resize", handleResize);
  window.addEventListener("beforeunload", cleanup);
  setupThemeListener();

  // Apply current theme colors after initialization
  const initialTheme = getInitialTheme();
  if (initialTheme === "dark") {
    const colors = THEME_COLORS.dark;
    material.uniforms.uBgColor.value.copy(colors.bg);
    material.uniforms.uFog.value = colors.fog;
    material.uniforms.uBaseFog.value = colors.baseFog;
  }

  requestAnimationFrame(animate);
}
