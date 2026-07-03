/* =================================================
   PARALLAX MODULE
   Moves the hero orbit container with the mouse
================================================= */
export function initParallax() {
  const orbitWrap = document.querySelector('.hero-orbit');
  if (!orbitWrap) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    orbitWrap.style.transform = `translate(${x}px, ${y}px)`;
  });
}
