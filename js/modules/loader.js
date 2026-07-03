/* =================================================
   LOADER MODULE
   Hides the loading screen after window load
================================================= */
export function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hide');
    }, 2500);
  });
}
