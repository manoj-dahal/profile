/* =================================================
   MAIN ENTRY POINT
   Imports all feature modules and bootstraps them
   when the DOM is ready.
================================================= */
import { initLoader }       from './modules/loader.js';
import { initCursor }       from './modules/cursor.js';
import { initMagnetic }     from './modules/magnetic.js';
import { initTilt }         from './modules/tilt.js';
import { initTypewriter }   from './modules/typewriter.js';
import { initReveal }       from './modules/reveal.js';
import { initCounters }     from './modules/counter.js';
import { initActiveNav }    from './modules/nav.js';
import { initParallax }     from './modules/parallax.js';
import { initModal }        from './modules/modal.js';
import { initSmoothScroll } from './modules/smoothScroll.js';
import { initBackgrounds }  from './modules/background.js';
import { initHeroCanvas }   from './modules/heroCanvas.js';
import './modules/form.js';  // side-effect: attaches window.handleFormSubmit

// Bootstrap all modules when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initMagnetic();
  initTilt();
  initTypewriter();
  initReveal();
  initCounters();
  initActiveNav();
  initParallax();
  initModal();
  initSmoothScroll();
  initBackgrounds();
  initHeroCanvas();

  console.log('%c⚡ Manoj Dahal Portfolio', 'color:#00f0ff;font-size:18px;font-weight:bold;');
  console.log('%cBuilt with passion · 2026', 'color:#b400ff;font-size:12px;');
});
