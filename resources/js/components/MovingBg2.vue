<template>
  <section class="moving-bg-webgl relative h-full w-full">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full"></canvas>

    <div class="relative z-10 h-full w-full">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const canvasRef = ref(null);

const config = {
  particleCount: 60,
  maxDistance: 120,
  speed: 0.4,
  particleSize: 4,
};

const color = {
  r: 156 / 255,
  g: 163 / 255,
  b: 175 / 255,
};

const maxLineVertices = config.particleCount * (config.particleCount - 1);

const lineVertexShaderSource = `
attribute vec2 a_position;
attribute float a_alpha;

uniform vec2 u_resolution;

varying float v_alpha;

void main() {
  vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;

  gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
  v_alpha = a_alpha;
}
`;

const lineFragmentShaderSource = `
precision mediump float;

uniform vec3 u_color;

varying float v_alpha;

void main() {
  gl_FragColor = vec4(u_color, v_alpha);
}
`;

const pointVertexShaderSource = `
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform float u_pointSize;

void main() {
  vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;

  gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
  gl_PointSize = u_pointSize;
}
`;

const pointFragmentShaderSource = `
precision mediump float;

uniform vec4 u_color;

void main() {
  vec2 centered = gl_PointCoord - vec2(0.5);
  float dist = dot(centered, centered);
  float alpha = (1.0 - smoothstep(0.16, 0.25, dist)) * u_color.a;

  gl_FragColor = vec4(u_color.rgb, alpha);
}
`;

let gl;
let animationId;
let resizeHandler;
let lineProgram;
let pointProgram;
let particleBuffer;
let linePositionBuffer;
let lineAlphaBuffer;
let particles = [];
let lastFrameTime = 0;

const viewport = {
  width: 0,
  height: 0,
  dpr: 1,
};

const pointPositions = new Float32Array(config.particleCount * 2);
const linePositions = new Float32Array(maxLineVertices * 2);
const lineAlphas = new Float32Array(maxLineVertices);

function createShader(context, type, source) {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    console.error(context.getShaderInfoLog(shader));
    context.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(context, vertexSource, fragmentSource) {
  const vertexShader = createShader(context, context.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(
    context,
    context.FRAGMENT_SHADER,
    fragmentSource,
  );

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = context.createProgram();
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);

  context.deleteShader(vertexShader);
  context.deleteShader(fragmentShader);

  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    console.error(context.getProgramInfoLog(program));
    context.deleteProgram(program);
    return null;
  }

  return program;
}

function createParticles(width, height) {
  particles = Array.from({ length: config.particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * config.speed,
    vy: (Math.random() - 0.5) * config.speed,
  }));
}

function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas || !gl) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));

  if (canvas.width === width && canvas.height === height) {
    return;
  }

  const prevWidth = viewport.width;
  const prevHeight = viewport.height;

  canvas.width = width;
  canvas.height = height;

  viewport.width = width;
  viewport.height = height;
  viewport.dpr = dpr;

  gl.viewport(0, 0, width, height);

  if (!prevWidth || !prevHeight) {
    createParticles(width, height);
    return;
  }

  const scaleX = width / prevWidth;
  const scaleY = height / prevHeight;

  particles = particles.map((particle) => ({
    ...particle,
    x: particle.x * scaleX,
    y: particle.y * scaleY,
  }));
}

function updateParticles(deltaScale) {
  const velocityScale = deltaScale * viewport.dpr;

  for (const particle of particles) {
    particle.x += particle.vx * velocityScale;
    particle.y += particle.vy * velocityScale;

    if (particle.x <= 0 || particle.x >= viewport.width) {
      particle.vx *= -1;
      particle.x = Math.min(Math.max(particle.x, 0), viewport.width);
    }

    if (particle.y <= 0 || particle.y >= viewport.height) {
      particle.vy *= -1;
      particle.y = Math.min(Math.max(particle.y, 0), viewport.height);
    }
  }
}

function rebuildGeometry() {
  let pointIndex = 0;
  let linePositionIndex = 0;
  let lineAlphaIndex = 0;

  for (let i = 0; i < particles.length; i += 1) {
    const particle = particles[i];

    pointPositions[pointIndex] = particle.x;
    pointPositions[pointIndex + 1] = particle.y;
    pointIndex += 2;

    for (let j = i + 1; j < particles.length; j += 1) {
      const other = particles[j];
      const dx = (particle.x - other.x) / viewport.dpr;
      const dy = (particle.y - other.y) / viewport.dpr;
      const distance = Math.hypot(dx, dy);

      if (distance >= config.maxDistance) {
        continue;
      }

      const alpha = 1 - distance / config.maxDistance;

      linePositions[linePositionIndex] = particle.x;
      linePositions[linePositionIndex + 1] = particle.y;
      linePositions[linePositionIndex + 2] = other.x;
      linePositions[linePositionIndex + 3] = other.y;
      linePositionIndex += 4;

      lineAlphas[lineAlphaIndex] = alpha;
      lineAlphas[lineAlphaIndex + 1] = alpha;
      lineAlphaIndex += 2;
    }
  }

  return lineAlphaIndex;
}

function drawLines(vertexCount) {
  if (!vertexCount) {
    return;
  }

  gl.useProgram(lineProgram.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, linePositionBuffer);
  gl.bufferSubData(
    gl.ARRAY_BUFFER,
    0,
    linePositions.subarray(0, vertexCount * 2),
  );
  gl.enableVertexAttribArray(lineProgram.positionLocation);
  gl.vertexAttribPointer(lineProgram.positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, lineAlphaBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, lineAlphas.subarray(0, vertexCount));
  gl.enableVertexAttribArray(lineProgram.alphaLocation);
  gl.vertexAttribPointer(lineProgram.alphaLocation, 1, gl.FLOAT, false, 0, 0);

  gl.uniform2f(lineProgram.resolutionLocation, viewport.width, viewport.height);
  gl.uniform3f(lineProgram.colorLocation, color.r, color.g, color.b);
  gl.drawArrays(gl.LINES, 0, vertexCount);
}

function drawPoints() {
  gl.useProgram(pointProgram.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, pointPositions);
  gl.enableVertexAttribArray(pointProgram.positionLocation);
  gl.vertexAttribPointer(pointProgram.positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(pointProgram.resolutionLocation, viewport.width, viewport.height);
  gl.uniform1f(pointProgram.pointSizeLocation, config.particleSize * viewport.dpr);
  gl.uniform4f(pointProgram.colorLocation, color.r, color.g, color.b, 0.5);
  gl.drawArrays(gl.POINTS, 0, particles.length);
}

function render(time) {
  if (!gl) {
    return;
  }

  const deltaMs = lastFrameTime ? time - lastFrameTime : 16.67;
  lastFrameTime = time;

  updateParticles(Math.min(deltaMs / 16.67, 2));

  const lineVertexCount = rebuildGeometry();

  gl.clear(gl.COLOR_BUFFER_BIT);
  drawLines(lineVertexCount);
  drawPoints();

  animationId = window.requestAnimationFrame(render);
}

onMounted(() => {
  const canvas = canvasRef.value;

  gl = canvas?.getContext("webgl", {
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });

  if (!gl) {
    return;
  }

  const lineProgramInstance = createProgram(
    gl,
    lineVertexShaderSource,
    lineFragmentShaderSource,
  );
  const pointProgramInstance = createProgram(
    gl,
    pointVertexShaderSource,
    pointFragmentShaderSource,
  );

  if (!lineProgramInstance || !pointProgramInstance) {
    return;
  }

  lineProgram = {
    program: lineProgramInstance,
    positionLocation: gl.getAttribLocation(lineProgramInstance, "a_position"),
    alphaLocation: gl.getAttribLocation(lineProgramInstance, "a_alpha"),
    resolutionLocation: gl.getUniformLocation(
      lineProgramInstance,
      "u_resolution",
    ),
    colorLocation: gl.getUniformLocation(lineProgramInstance, "u_color"),
  };

  pointProgram = {
    program: pointProgramInstance,
    positionLocation: gl.getAttribLocation(pointProgramInstance, "a_position"),
    resolutionLocation: gl.getUniformLocation(
      pointProgramInstance,
      "u_resolution",
    ),
    pointSizeLocation: gl.getUniformLocation(
      pointProgramInstance,
      "u_pointSize",
    ),
    colorLocation: gl.getUniformLocation(pointProgramInstance, "u_color"),
  };

  particleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointPositions.byteLength, gl.DYNAMIC_DRAW);

  linePositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, linePositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, linePositions.byteLength, gl.DYNAMIC_DRAW);

  lineAlphaBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineAlphaBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, lineAlphas.byteLength, gl.DYNAMIC_DRAW);

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  resizeHandler = () => resizeCanvas();
  resizeCanvas();
  window.addEventListener("resize", resizeHandler);

  animationId = window.requestAnimationFrame(render);
});

onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }

  if (animationId) {
    window.cancelAnimationFrame(animationId);
  }

  if (gl) {
    if (particleBuffer) {
      gl.deleteBuffer(particleBuffer);
    }

    if (linePositionBuffer) {
      gl.deleteBuffer(linePositionBuffer);
    }

    if (lineAlphaBuffer) {
      gl.deleteBuffer(lineAlphaBuffer);
    }

    if (lineProgram?.program) {
      gl.deleteProgram(lineProgram.program);
    }

    if (pointProgram?.program) {
      gl.deleteProgram(pointProgram.program);
    }
  }
});
</script>

<style scoped>
.moving-bg-webgl {
  background: radial-gradient(circle at center, #0b0f19 0%, #05070d 100%);
}

canvas {
  display: block;
}
</style>
