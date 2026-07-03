/* =================================================
   BACKGROUND MODULE
   4-canvas animated background system:
   - Particle network (neural connections)
   - AI grid (mouse-reactive)
   - Nebula (drifting clouds)
   - Lightning (random bolts)
================================================= */
export function initBackgrounds() {
  const pCanvas = document.getElementById('particleCanvas');
  const gCanvas = document.getElementById('gridCanvas');
  const nCanvas = document.getElementById('nebulaCanvas');
  const lCanvas = document.getElementById('lightningCanvas');

  if (!pCanvas) return;

  const pCtx = pCanvas.getContext('2d');
  const gCtx = gCanvas.getContext('2d');
  const nCtx = nCanvas.getContext('2d');
  const lCtx = lCanvas.getContext('2d');

  // Resize all canvases
  function resize() {
    [pCanvas, gCanvas, nCanvas, lCanvas].forEach(c => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    });
  }
  resize();
  window.addEventListener('resize', resize);

  const pMouse = { x: -1000, y: -1000 };
  document.addEventListener('mousemove', e => { pMouse.x = e.clientX; pMouse.y = e.clientY; });

  // --- Particle class ---
  class Particle {
    constructor() {
      this.x = Math.random() * pCanvas.width;
      this.y = Math.random() * pCanvas.height;
      this.size = Math.random() * 2 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? '0, 240, 255'
        : (Math.random() > 0.5 ? '180, 0, 255' : '255, 0, 170');
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > pCanvas.width)  this.speedX *= -1;
      if (this.y < 0 || this.y > pCanvas.height) this.speedY *= -1;
    }
    draw() {
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      pCtx.shadowColor = `rgba(${this.color}, 1)`;
      pCtx.shadowBlur = 8;
      pCtx.fill();
    }
  }

  const particles = [];
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // --- Animate particles + neural connections ---
  function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Particle-to-particle links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          pCtx.beginPath();
          pCtx.moveTo(particles[i].x, particles[i].y);
          pCtx.lineTo(particles[j].x, particles[j].y);
          pCtx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 120)})`;
          pCtx.lineWidth = 0.5;
          pCtx.stroke();
        }
      }
      // Particle-to-mouse links
      const dxm = particles[i].x - pMouse.x;
      const dym = particles[i].y - pMouse.y;
      const distM = Math.sqrt(dxm * dxm + dym * dym);
      if (distM < 150) {
        pCtx.beginPath();
        pCtx.moveTo(particles[i].x, particles[i].y);
        pCtx.lineTo(pMouse.x, pMouse.y);
        pCtx.strokeStyle = `rgba(180, 0, 255, ${0.4 * (1 - distM / 150)})`;
        pCtx.lineWidth = 0.6;
        pCtx.stroke();
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- AI grid ---
  function drawGrid() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    const size = 60;
    const offsetX = (pMouse.x / window.innerWidth - 0.5) * 20;
    const offsetY = (pMouse.y / window.innerHeight - 0.5) * 20;
    gCtx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    gCtx.lineWidth = 1;

    for (let x = -size; x < gCanvas.width + size; x += size) {
      gCtx.beginPath();
      gCtx.moveTo(x + offsetX, 0);
      gCtx.lineTo(x + offsetX, gCanvas.height);
      gCtx.stroke();
    }
    for (let y = -size; y < gCanvas.height + size; y += size) {
      gCtx.beginPath();
      gCtx.moveTo(0, y + offsetY);
      gCtx.lineTo(gCanvas.width, y + offsetY);
      gCtx.stroke();
    }

    // Glow at intersections near mouse
    for (let x = -size; x < gCanvas.width + size; x += size) {
      for (let y = -size; y < gCanvas.height + size; y += size) {
        const dx = x + offsetX - pMouse.x;
        const dy = y + offsetY - pMouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) {
          const a = (1 - d / 200) * 0.4;
          gCtx.beginPath();
          gCtx.arc(x + offsetX, y + offsetY, 2, 0, Math.PI * 2);
          gCtx.fillStyle = `rgba(0, 240, 255, ${a})`;
          gCtx.fill();
        }
      }
    }
    requestAnimationFrame(drawGrid);
  }
  drawGrid();

  // --- Nebula clouds ---
  let t = 0;
  function drawNebula() {
    nCtx.clearRect(0, 0, nCanvas.width, nCanvas.height);
    t += 0.003;
    const colors = [
      'rgba(0, 240, 255, 0.08)',
      'rgba(180, 0, 255, 0.08)',
      'rgba(255, 0, 170, 0.08)',
      'rgba(58, 123, 255, 0.08)'
    ];
    for (let i = 0; i < 4; i++) {
      const x = nCanvas.width  * (0.3 + 0.4 * Math.sin(t + i));
      const y = nCanvas.height * (0.3 + 0.4 * Math.cos(t * 0.7 + i * 1.5));
      const grad = nCtx.createRadialGradient(x, y, 0, x, y, 400);
      grad.addColorStop(0, colors[i]);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      nCtx.fillStyle = grad;
      nCtx.fillRect(0, 0, nCanvas.width, nCanvas.height);
    }
    requestAnimationFrame(drawNebula);
  }
  drawNebula();

  // --- Lightning bolts ---
  let nextBolt = Math.random() * 300 + 200;

  function drawBolt(x, y, len, angle, depth) {
    if (depth === 0) return;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    lCtx.beginPath();
    lCtx.moveTo(x, y);
    lCtx.lineTo(x2, y2);
    lCtx.strokeStyle = `rgba(180, 220, 255, ${0.4 * depth})`;
    lCtx.lineWidth = depth;
    lCtx.shadowColor = 'rgba(0, 240, 255, 1)';
    lCtx.shadowBlur = 20;
    lCtx.stroke();
    if (depth > 1 && Math.random() > 0.4) {
      drawBolt(x2, y2, len * 0.7, angle + (Math.random() - 0.5) * 0.8, depth - 1);
    }
    if (depth > 1 && Math.random() > 0.6) {
      drawBolt(x2, y2, len * 0.6, angle + (Math.random() - 0.5) * 1.2, depth - 1);
    }
  }

  function lightningLoop() {
    lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
    nextBolt--;
    if (nextBolt < 0) {
      if (Math.random() > 0.5) {
        const x = Math.random() * lCanvas.width;
        drawBolt(x, 0, 100 + Math.random() * 80, Math.PI / 2 + (Math.random() - 0.5) * 0.4, 4);
      }
      nextBolt = Math.random() * 400 + 300;
    }
    requestAnimationFrame(lightningLoop);
  }
  lightningLoop();
}
