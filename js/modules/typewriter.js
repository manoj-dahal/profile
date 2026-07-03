/* =================================================
   TYPEWRITER MODULE
   Cycles through roles in the hero section
================================================= */
export function initTypewriter() {
  const roles = [
    'AI Engineer',
    'Software Developer',
    'Game Developer',
    'Algorithm Designer',
    'UI/UX Designer',
    'Ethical Hacker'
  ];

  let roleIndex = 0, charIndex = 0, isDeleting = false;
  const twEl = document.getElementById('typewriter');
  if (!twEl) return;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      twEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      twEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 50 : 100);
  }
  setTimeout(typeLoop, 2700);
}
