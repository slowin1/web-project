const PV = {
  config: {
    canvasBg: { light: "#E7E5E4", dark: "#E7E5E4" },

    logoSize: 1600,
    distortionRadius: 460,
    maxDisplacement: 150,

    forceStrength: 0.09,
    returnForce: 0.13,
    logoPath: "/lab/hero-visual.png",
    particleSpacing: 1,
  },
  canvas: null,
  gl: null,
  program: null,
  geometry: null,
  particles: [],
  posArray: null,
  colorArray: null,
  mouse: { x: 0, y: 0 },
  activeFrames: 0,
  isMobile: false,
  animFrame: null,
  isAnimating: false,
  themeObserver: null,
};

document.addEventListener("DOMContentLoaded", init);

function getDpr() {
  return Math.min(devicePixelRatio || 1, PV.isMobile ? 1 : 1.25);
}

function init() {
  cleanup();

  PV.canvas = document.getElementById("particle-canvas");
  if (!PV.canvas) return;

  PV.isMobile = window.innerWidth < 1000;
  const dpr = getDpr();

  PV.canvas.width = innerWidth * dpr;
  PV.canvas.height = innerHeight * dpr;
  PV.canvas.style.width = innerWidth + "px";
  PV.canvas.style.height = innerHeight + "px";

  PV.gl = PV.canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
    desynchronized: true,
  });

  if (!PV.gl) return;

  PV.gl.enable(PV.gl.BLEND);
  PV.gl.blendFunc(PV.gl.SRC_ALPHA, PV.gl.ONE_MINUS_SRC_ALPHA);

  setupShaders();
  loadImage();

  if (!PV.isMobile) {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
  }
  window.addEventListener("resize", handleResize);
  setupThemeListener();
}

function setupShaders() {
  const vs = `
    precision mediump float;
    uniform vec2 u_resolution;
    attribute vec2 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main() {
      vec2 clip = (a_position / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0);
      v_color = a_color;
      gl_Position = vec4(clip, 0.0, 1.0);
      gl_PointSize = 1.8;
    }`;

  const fs = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
      if (v_color.a < 0.01) discard;
      float dist = length(gl_PointCoord - 0.5);
      float alpha = 1.0 - smoothstep(0.08, 0.5, dist);
      gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
    }`;

  const vShader = PV.gl.createShader(PV.gl.VERTEX_SHADER);
  PV.gl.shaderSource(vShader, vs);
  PV.gl.compileShader(vShader);

  const fShader = PV.gl.createShader(PV.gl.FRAGMENT_SHADER);
  PV.gl.shaderSource(fShader, fs);
  PV.gl.compileShader(fShader);

  PV.program = PV.gl.createProgram();
  PV.gl.attachShader(PV.program, vShader);
  PV.gl.attachShader(PV.program, fShader);
  PV.gl.linkProgram(PV.program);
}

function loadImage() {
  if (!PV.config.logoPath) {
    createProceduralParticleMask();
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const temp = document.createElement("canvas");
    const ctx = temp.getContext("2d", { willReadFrequently: true });
    const logoSize = PV.config.logoSize;
    temp.width = temp.height = logoSize;

    const s = logoSize * 0.9;
    const o = (logoSize - s) / 2;
    ctx.drawImage(img, o, o, s, s);

    createParticles(ctx.getImageData(0, 0, logoSize, logoSize).data);
  };
  img.onerror = createProceduralParticleMask;
  img.src = PV.config.logoPath;
}

function createProceduralParticleMask() {
  const temp = document.createElement("canvas");
  const ctx = temp.getContext("2d", { willReadFrequently: true });
  const logoSize = PV.config.logoSize;
  const center = logoSize / 2;

  temp.width = temp.height = logoSize;
  ctx.clearRect(0, 0, logoSize, logoSize);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const drawCurve = (points, width, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let index = 1; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      ctx.quadraticCurveTo(
        current[0],
        current[1],
        (current[0] + next[0]) / 2,
        (current[1] + next[1]) / 2,
      );
    }
    ctx.stroke();
  };

  const scale = logoSize / 1000;
  const toPx = (points) => points.map(([x, y]) => [x * scale, y * scale]);

  drawCurve(
    toPx([
      [170, 640],
      [260, 495],
      [390, 420],
      [520, 440],
      [660, 462],
      [790, 360],
      [858, 220],
    ]),
    92 * scale,
    "#d7d2cc",
  );

  drawCurve(
    toPx([
      [222, 760],
      [340, 625],
      [480, 578],
      [626, 604],
      [760, 552],
      [890, 420],
    ]),
    64 * scale,
    "#bfc7c8",
  );

  drawCurve(
    toPx([
      [286, 340],
      [395, 270],
      [505, 260],
      [612, 314],
      [725, 306],
      [820, 236],
    ]),
    42 * scale,
    "#ece5dc",
  );

  ctx.fillStyle = "#aeb8b8";
  ctx.beginPath();
  ctx.ellipse(center - 165 * scale, center + 70 * scale, 46 * scale, 70 * scale, -0.65, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(center + 214 * scale, center - 180 * scale, 42 * scale, 58 * scale, 0.72, 0, Math.PI * 2);
  ctx.fill();

  createParticles(ctx.getImageData(0, 0, logoSize, logoSize).data);
}

function computeScale() {
  // Размер логотипа = 38% от меньшей стороны viewport.
  // Работает одинаково на любом aspect ratio (16:9, 16:10, 4:3 и т.д.)
  const vmin = Math.min(innerWidth, innerHeight);
  return (vmin * 1.0) / PV.config.logoSize;
}

PV.getDistortionRadius = () => {
  const dpr = getDpr();
  const vmin = Math.min(innerWidth, innerHeight);
  return (vmin * PV.config.distortionRadius / 1000) * dpr;
};

PV.getMaxDisplacement = () => {
  const dpr = getDpr();
  const vmin = Math.min(innerWidth, innerHeight);
  return (vmin * PV.config.maxDisplacement / 1000) * dpr;
};

function createParticles(pixels) {
  const cx = PV.canvas.width / 2;
  const cy = PV.canvas.height / 2;
  const scale = computeScale() * getDpr();
  const dim = PV.config.logoSize;
  const spacing = PV.config.particleSpacing;

  const pos = [];
  const colors = [];
  PV.particles = [];

  for (let i = 0; i < dim; i += spacing) {
    for (let j = 0; j < dim; j += spacing) {
      const idx = (i * dim + j) * 4;
      if (pixels[idx + 3] > 50) {
        const x = cx + (j - dim / 2) * scale;
        const y = cy + (i - dim / 2) * scale;

        pos.push(x, y);
        colors.push(
          pixels[idx] / 255,
          pixels[idx + 1] / 255,
          pixels[idx + 2] / 255,
          pixels[idx + 3] / 255,
        );
        PV.particles.push({ ox: x, oy: y, vx: 0, vy: 0, i, j });
      }
    }
  }

  PV.posArray = new Float32Array(pos);
  const posBuf = PV.gl.createBuffer();
  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, posBuf);
  PV.gl.bufferData(PV.gl.ARRAY_BUFFER, PV.posArray, PV.gl.DYNAMIC_DRAW);

  const colBuf = PV.gl.createBuffer();
  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, colBuf);
  PV.gl.bufferData(
    PV.gl.ARRAY_BUFFER,
    new Float32Array(colors),
    PV.gl.STATIC_DRAW,
  );

  PV.geometry = { posBuf, colBuf, count: PV.particles.length };
  render();
}

function startAnimation() {
  if (PV.isAnimating) return;
  PV.isAnimating = true;
  PV.animFrame = requestAnimationFrame(animate);
}

function animate() {
  if (!PV.isAnimating || !PV.geometry) return;

  const rad = PV.getDistortionRadius() ** 2;
  const maxDisp = PV.getMaxDisplacement();
  const maxDispSq = maxDisp * maxDisp;
  let needsUpdate = false;
  let hasMotion = false;

  if (PV.activeFrames > 0) {
    PV.activeFrames--;
  }

  for (let i = 0; i < PV.particles.length; i++) {
    const x = PV.posArray[i * 2];
    const y = PV.posArray[i * 2 + 1];
    const p = PV.particles[i];

    if (!PV.isMobile && PV.activeFrames > 0) {
      const dx = PV.mouse.x - x;
      const dy = PV.mouse.y - y;
      const dis = dx * dx + dy * dy;

      if (dis < rad && dis > 0.0001) {
        const invDist = 1 / Math.sqrt(dis);
        const distOrigSq = (x - p.ox) ** 2 + (y - p.oy) ** 2;
        const mult = Math.max(0.1, 1 - Math.sqrt(distOrigSq) / (maxDisp * 2));
        const force = (-rad / dis) * PV.config.forceStrength * mult;
        p.vx += dx * invDist * force;
        p.vy += dy * invDist * force;
        hasMotion = true;
      }
    }

    const homeDx = x - p.ox;
    const homeDy = y - p.oy;
    const isAwayFromHome = homeDx * homeDx + homeDy * homeDy > 0.35;

    if (Math.abs(p.vx) > 0.01 || Math.abs(p.vy) > 0.01 || isAwayFromHome) {
      let nx = x + (p.vx *= 0.84) + (p.ox - x) * PV.config.returnForce;
      let ny = y + (p.vy *= 0.84) + (p.oy - y) * PV.config.returnForce;
      const dox = nx - p.ox;
      const doy = ny - p.oy;
      const distOrigSq = dox * dox + doy * doy;

      if (distOrigSq > maxDispSq) {
        const distOrig = Math.sqrt(distOrigSq);
        const s = maxDisp / distOrig;
        nx = p.ox + dox * s;
        ny = p.oy + doy * s;
        p.vx *= 0.65;
        p.vy *= 0.65;
      }

      PV.posArray[i * 2] = nx;
      PV.posArray[i * 2 + 1] = ny;
      needsUpdate = true;
      hasMotion = true;
    }
  }

  if (needsUpdate) {
    PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, PV.geometry.posBuf);
    PV.gl.bufferSubData(PV.gl.ARRAY_BUFFER, 0, PV.posArray);
  }

  render();

  if (hasMotion || PV.activeFrames > 0) {
    PV.animFrame = requestAnimationFrame(animate);
    return;
  }

  PV.isAnimating = false;
  PV.animFrame = null;
}

function render() {
  const isDark = document.documentElement.classList.contains("dark");
  const bgColor = isDark ? PV.config.canvasBg.dark : PV.config.canvasBg.light;
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bgColor);
  PV.gl.viewport(0, 0, PV.canvas.width, PV.canvas.height);
  PV.gl.clearColor(
    parseInt(rgb[1], 16) / 255,
    parseInt(rgb[2], 16) / 255,
    parseInt(rgb[3], 16) / 255,
    1,
  );
  PV.gl.clear(PV.gl.COLOR_BUFFER_BIT);
  PV.gl.useProgram(PV.program);

  PV.gl.uniform2f(
    PV.gl.getUniformLocation(PV.program, "u_resolution"),
    PV.canvas.width,
    PV.canvas.height,
  );

  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, PV.geometry.posBuf);
  PV.gl.enableVertexAttribArray(0);
  PV.gl.vertexAttribPointer(0, 2, PV.gl.FLOAT, false, 0, 0);

  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, PV.geometry.colBuf);
  PV.gl.enableVertexAttribArray(1);
  PV.gl.vertexAttribPointer(1, 4, PV.gl.FLOAT, false, 0, 0);

  PV.gl.drawArrays(PV.gl.POINTS, 0, PV.geometry.count);
}

function handleMouseMove(e) {
  const rect = PV.canvas.getBoundingClientRect();
  const dpr = getDpr();
  PV.mouse.x = (e.clientX - rect.left) * dpr;
  PV.mouse.y = (e.clientY - rect.top) * dpr;
  PV.activeFrames = 72;
  startAnimation();
}

function handleResize() {
  if (!PV.geometry || !PV.posArray || !PV.gl) return;

  PV.isMobile = innerWidth < 1000;

  const dpr = getDpr();
  PV.canvas.width = innerWidth * dpr;
  PV.canvas.height = innerHeight * dpr;
  PV.canvas.style.width = innerWidth + "px";
  PV.canvas.style.height = innerHeight + "px";

  const cx = PV.canvas.width / 2;
  const cy = PV.canvas.height / 2;
  const scale = computeScale() * dpr;
  const dim = PV.config.logoSize;

  for (let i = 0; i < PV.particles.length; i++) {
    const p = PV.particles[i];
    p.ox = cx + (p.j - dim / 2) * scale;
    p.oy = cy + (p.i - dim / 2) * scale;
    p.vx = p.vy = 0;
    PV.posArray[i * 2] = p.ox;
    PV.posArray[i * 2 + 1] = p.oy;
  }

  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, PV.geometry.posBuf);
  PV.gl.bufferSubData(PV.gl.ARRAY_BUFFER, 0, PV.posArray);
  render();
}

function setupThemeListener() {
  PV.themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        // Theme changed - colors are automatically picked up in render()
      }
    });
  });

  PV.themeObserver.observe(document.documentElement, { attributes: true });
}

function cleanup() {
  if (PV.animFrame) cancelAnimationFrame(PV.animFrame);
  if (PV.themeObserver) PV.themeObserver.disconnect();

  document.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("resize", handleResize);

  if (PV.gl) {
    if (PV.geometry?.posBuf) PV.gl.deleteBuffer(PV.geometry.posBuf);
    if (PV.geometry?.colBuf) PV.gl.deleteBuffer(PV.geometry.colBuf);
    if (PV.program) PV.gl.deleteProgram(PV.program);
  }

  PV.gl = null;
  PV.program = null;
  PV.geometry = null;
  PV.particles = [];
  PV.posArray = null;
  PV.colorArray = null;
  PV.animFrame = null;
  PV.isAnimating = false;
  PV.themeObserver = null;
}
