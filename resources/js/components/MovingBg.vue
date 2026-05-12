<template>
  <section class="relative w-full h-full bg-gray-950">
    <!-- Canvas Background -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <!-- Overlay Content Slot -->
    <div class="relative z-10 w-full h-full">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

const canvasRef = ref(null);
let ctx;
let animationId;
let particles = [];

const config = {
  particleCount: 60,
  maxDistance: 120,
  speed: 0.4,
};

function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles(width, height) {
  particles = Array.from({ length: config.particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * config.speed,
    vy: (Math.random() - 0.5) * config.speed,
  }));
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    // bounce
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.fillStyle = "rgba(156, 163, 175, 0.5)"; // gray subtle
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();

    // connect lines
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < config.maxDistance) {
        ctx.strokeStyle = `rgba(156, 163, 175, ${1 - dist / config.maxDistance})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  animationId = requestAnimationFrame(draw);
}

onMounted(() => {
  const canvas = canvasRef.value;
  ctx = canvas.getContext("2d");

  resizeCanvas(canvas);
  createParticles(canvas.width, canvas.height);

  window.addEventListener("resize", () => {
    resizeCanvas(canvas);
    createParticles(canvas.width, canvas.height);
  });

  draw();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
});
</script>

<style scoped>
canvas {
  background: radial-gradient(circle at center, #0b0f19 0%, #05070d 100%);
}
</style>
