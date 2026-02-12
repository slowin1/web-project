
// Vertex Shader
export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Glossy gradient fragment shader for the overlay
export const fragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_strength;
varying vec2 vUv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    vec2 uv = vUv;
    vec2 mouseUV = u_mouse;
    vec2 p = uv - 0.5;
    p.x *= u_resolution.x / u_resolution.y;
    p += (mouseUV - 0.5) * 0.12;

    vec3 c1 = vec3(0.04, 0.04, 0.08);
    vec3 c2 = vec3(0.06, 0.10, 0.18);
    vec3 c3 = vec3(0.12, 0.08, 0.06);

    float sweep = smoothstep(-0.6, 0.6, p.y + 0.2 * sin(u_time * 0.2));
    vec3 base = mix(c1, c2, sweep);
    base = mix(base, c3, smoothstep(0.15, 0.85, uv.x) * 0.2);

    vec3 n = normalize(vec3(p * 1.4, 0.8));
    vec3 l = normalize(vec3(-0.35, 0.85, 0.6));
    float spec = pow(max(dot(n, l), 0.0), 64.0);
    float fresnel = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);

    vec2 ld = normalize(vec2(0.8, 0.6));
    float streak = exp(-abs(dot(p, vec2(-ld.y, ld.x))) * 22.0);
    streak *= 0.2 + 0.1 * sin(u_time * 0.25);

    float sparkle = noise(uv * 6.0 + u_time * 0.15) * 0.02;
    float glow = smoothstep(0.65, 0.0, distance(uv, mouseUV));
    float glow2 = smoothstep(0.9, 0.0, distance(uv, mouseUV));
    vec3 color = base + vec3(spec * 0.4 + streak * 0.15 + sparkle);
    color += vec3(0.15, 0.25, 0.45) * glow * 1.4;
    color += vec3(0.06, 0.10, 0.20) * glow2 * 0.6;
    color += fresnel * 0.06;
    color = mix(color, color + vec3(0.03, 0.05, 0.08), u_strength * 0.5);

    // black vignette (on top of everything — increases alpha at edges)
    vec2 vig = uv - 0.5;
    float vignette = 1.0 - dot(vig, vig) * 1.8;
    vignette = clamp(vignette, 0.0, 1.0);
    vignette = smoothstep(0.0, 0.6, vignette);
    color *= vignette;
    float vigAlpha = 1.0 - vignette; // edges become fully opaque black

    // film grain (static, on top of everything)
    float grain = hash(uv * u_resolution) - 0.5;
    color += grain * 0.07;
    float grainAlpha = 0.45 + abs(grain) * 0.55;

    float finalAlpha = max(grainAlpha, vigAlpha);
    gl_FragColor = vec4(color, finalAlpha);
}
`;

// Fragment Shader - Fluid Simulation with Mouse Tracking
export const fluidShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec4 iMouse;
uniform int iFrame;
uniform sampler2D iPreviousFrame;  // Previous velocity field
uniform float uBrushSize;
uniform float uBrushStrength;
uniform float uFluidDecay;
uniform float uTrailLength;
uniform float uStopDecay;
varying vec2 vUv;

// Pseudo-random function
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Calculate mouse velocity
vec2 getMouseVelocity(vec2 uv, vec2 prevMouse, vec2 currMouse, vec2 resolution) {
    vec2 prevPos = prevMouse.xy / resolution;
    vec2 currPos = currMouse.xy / resolution;
    return (currPos - prevPos) * uBrushStrength;
}

void main() {
    vec2 uv = vUv;
    vec2 texel = 1.0 / iResolution.xy;

    // Get previous velocity from frame buffer
    vec4 prevVelocity = texture2D(iPreviousFrame, uv);

    // Calculate mouse position in UV coordinates
    vec2 mouseUV = iMouse.xy / iResolution.xy;

    // Calculate distance from current pixel to mouse
    float dist = distance(uv, mouseUV);

    // Mouse influence
    float mouseInfluence = smoothstep(uBrushSize, 0.0, dist);

    // Calculate mouse velocity (delta movement)
    vec2 mouseVel = vec2(0.0);
    if (iMouse.z > 0.0) {  // If mouse is pressed/moving
        vec2 prevMouseUV = iMouse.zw / iResolution.xy;
        mouseVel = (mouseUV - prevMouseUV) * uBrushStrength;
    }

    // Add mouse influence to velocity
    vec2 velocity = prevVelocity.xy + mouseVel * mouseInfluence;

    // Sample surrounding velocities for advection
    vec2 advectedUV = uv - velocity * texel * 2.0;
    vec4 advectedVelocity = texture2D(iPreviousFrame, advectedUV);

    // Advect velocity field
    velocity = mix(velocity, advectedVelocity.xy, uTrailLength);

    // Apply decay to slow down fluid over time
    velocity *= (1.0 - uFluidDecay);

    // Add some turbulence/noise for liquid effect
    float noise = rand(uv + iTime) * 0.01;
    velocity += vec2(noise, noise);

    // Divergence-free approximation (simple diffusion)
    vec2 left = texture2D(iPreviousFrame, uv - vec2(texel.x, 0.0)).xy;
    vec2 right = texture2D(iPreviousFrame, uv + vec2(texel.x, 0.0)).xy;
    vec2 top = texture2D(iPreviousFrame, uv - vec2(0.0, texel.y)).xy;
    vec2 bottom = texture2D(iPreviousFrame, uv + vec2(0.0, texel.y)).xy;

    vec2 divergence = (left + right + top + bottom) * 0.25 - velocity;
    velocity += divergence * 0.1;

    // Output velocity as color for visualization
    vec3 visual = vec3(0.5) + velocity * 2.0;

    // Add mouse highlight
    visual += vec3(0.2, 0.4, 0.8) * mouseInfluence;

    gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

// Display Shader - Shows the fluid simulation with coloring
export const displayShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec4 iMouse;
uniform int iFrame;
uniform sampler2D iFluidTexture;  // The fluid velocity field
varying vec2 vUv;

// Color palette for fluid visualization
vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = vUv;

    // Get velocity from fluid simulation
    vec4 fluidData = texture2D(iFluidTexture, uv);
    vec2 velocity = fluidData.xy;
    float magnitude = length(velocity);

    // Create fluid-like color based on velocity
    float angle = atan(velocity.y, velocity.x);
    float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);

    // Color based on velocity direction and magnitude
    vec3 color = palette(normalizedAngle + magnitude * 0.5 + iTime * 0.1);

    // Add iridescent effect based on magnitude
    color += vec3(magnitude * 0.5);


// Mouse highlight
    vec2 mouseUV = iMouse.xy / iResolution.xy;
    float dist = distance(uv, mouseUV);
    float mouseInfluence = smoothstep(0.1, 0.0, dist);
    color += vec3(0.2, 0.6, 1.0) * mouseInfluence * 0.5;

    // Background gradient
    vec3 bg = mix(vec3(0.05, 0.05, 0.1), vec3(0.1, 0.1, 0.2), uv.y);
    color = mix(bg, color, magnitude * 2.0 + 0.2);

    gl_FragColor = vec4(color, 1.0);
}
`;