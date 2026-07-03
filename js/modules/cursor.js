/* =================================================
   CUSTOM CURSOR MODULE
   Manages dot, ring, glow, trail particles, and click ripples
================================================= */
export function initCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorGlow = document.getElementById('cursorGlow');
  const spotlight = document.getElementById('spotlight');

  if (!cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    spotlight.style.left = mouseX + 'px';
    spotlight.style.top = mouseY + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states on interactive elements
  document.querySelectorAll('a, button, .btn, .skill, .project-card, .contact-card, .social-icon, .process-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hover');
        cursorDot.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('hover');
        cursorDot.classList.remove('hover');
      });
    });

  // Trail particles
  initTrail();

  // Click ripples
  initRipples();
}

function initTrail() {
  const trailCount = 8;
  const trails = [];

  for (let i = 0; i < trailCount; i++) {
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    t.style.opacity = (1 - i / trailCount) * 0.6;
    t.style.width = (8 - i * 0.6) + 'px';
    t.style.height = t.style.width;
    document.body.appendChild(t);
    trails.push({ el: t, x: 0, y: 0 });
  }

  let trailMouseX = 0, trailMouseY = 0;
  document.addEventListener('mousemove', (e) => {
    trailMouseX = e.clientX; trailMouseY = e.clientY;
  });

  function animateTrail() {
    trails[0].x += (trailMouseX - trails[0].x) * 0.25;
    trails[0].y += (trailMouseY - trails[0].y) * 0.25;
    for (let i = 1; i < trailCount; i++) {
      trails[i].x += (trails[i - 1].x - trails[i].x) * 0.4;
      trails[i].y += (trails[i - 1].y - trails[i].y) * 0.4;
      trails[i].el.style.transform = `translate(${trails[i].x}px, ${trails[i].y}px) translate(-50%, -50%)`;
    }
    trails[0].el.style.transform = `translate(${trails[0].x}px, ${trails[0].y}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}

function initRipples() {
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 3; i++) {
      const r = document.createElement('div');
      r.className = 'ripple';
      r.style.left = e.clientX + 'px';
      r.style.top = e.clientY + 'px';
      r.style.width = r.style.height = (60 + Math.random() * 60) + 'px';
      r.style.animationDelay = (i * 0.1) + 's';
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 900);
    }
  });
}
