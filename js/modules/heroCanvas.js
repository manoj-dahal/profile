/* =================================================
   HERO CANVAS MODULE
   3D orbiting particles in the hero visual
================================================= */
export function initHeroCanvas() {
  const heroCanvas = document.getElementById('heroCanvas');
  if (!heroCanvas) return;
  const hCtx = heroCanvas.getContext('2d');

  function resizeHero() {
    heroCanvas.width  = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;
  }
  resizeHero();
  window.addEventListener('resize', resizeHero);

  const heroParticles = [];
  for (let i = 0; i < 60; i++) {
    heroParticles.push({
      angle:  Math.random() * Math.PI * 2,
      radius: 80 + Math.random() * 250,
      speed:  (Math.random() - 0.5) * 0.008,
      size:   Math.random() * 2 + 0.5,
      color:  Math.random() > 0.66
        ? '#00f0ff'
        : (Math.random() > 0.5 ? '#b400ff' : '#ff00aa')
    });
  }

  let heroAngle = 0;

  function drawHero() {
    hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    const cx = heroCanvas.width / 2;
    const cy = heroCanvas.height / 2;
    heroAngle += 0.005;

    // Draw particles
    heroParticles.forEach(p => {
      p.angle += p.speed;
      const wobble = Math.sin(heroAngle * 2 + p.angle) * 20;
      const x = cx + Math.cos(p.angle) * (p.radius + wobble);
      const y = cy + Math.sin(p.angle) * (p.radius + wobble) * 0.6;
      hCtx.beginPath();
      hCtx.arc(x, y, p.size, 0, Math.PI * 2);
      hCtx.fillStyle = p.color;
      hCtx.shadowColor = p.color;
      hCtx.shadowBlur = 15;
      hCtx.fill();
    });

    // Draw connection lines
    for (let i = 0; i < heroParticles.length; i++) {
      for (let j = i + 1; j < heroParticles.length; j++) {
        const a = heroParticles[i], b = heroParticles[j];
        const aWobble = Math.sin(heroAngle * 2 + a.angle) * 20;
        const bWobble = Math.sin(heroAngle * 2 + b.angle) * 20;
        const ax = cx + Math.cos(a.angle) * (a.radius + aWobble);
        const ay = cy + Math.sin(a.angle) * (a.radius + aWobble) * 0.6;
        const bx = cx + Math.cos(b.angle) * (b.radius + bWobble);
        const by = cy + Math.sin(b.angle) * (b.radius + bWobble) * 0.6;
        const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
        if (d < 80) {
          hCtx.beginPath();
          hCtx.moveTo(ax, ay);
          hCtx.lineTo(bx, by);
          hCtx.strokeStyle = `rgba(0, 240, 255, ${0.3 * (1 - d / 80)})`;
          hCtx.lineWidth = 0.5;
          hCtx.shadowBlur = 0;
          hCtx.stroke();
        }
      }
    }
    requestAnimationFrame(drawHero);
  }
  drawHero();
}
