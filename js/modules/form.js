/* =================================================
   FORM MODULE
   Handles contact form submission with a success state
================================================= */
export function handleFormSubmit(form) {
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;

  btn.innerHTML = '<span>✓ Message sent successfully</span>';
  btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    form.reset();
  }, 3000);
}

// Expose for inline onsubmit handlers
window.handleFormSubmit = handleFormSubmit;
