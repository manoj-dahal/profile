/**
 * Reusable Recipes
 * Copy-paste examples for common customizations.
 */

// ============================================
// Recipe 1: Change the typewriter roles
// ============================================
// Edit js/modules/typewriter.js:
//
//   const roles = [
//     'AI Engineer',           // ← keep
//     'Software Developer',    // ← keep
//     'YOUR ROLE HERE',        // ← add yours
//   ];

// ============================================
// Recipe 2: Add a new project
// ============================================
// Edit js/data.js:
//
//   export const projectData = {
//     newKey: {
//       title: 'My Project',
//       icon: 'NP',
//       desc: 'Project description...',
//       tags: ['Tag1', 'Tag2'],
//       highlights: [
//         '🎯 Highlight one',
//         '⚡ Highlight two'
//       ]
//     }
//   };
//
// Then in index.html, add a project card:
//   <div class="project-card magnetic reveal" data-project="newKey">
//     <div class="project-visual"><span>NP</span></div>
//     <div class="project-tags">
//       <span class="project-tag">Tag1</span>
//     </div>
//     <h3 class="project-title">My Project</h3>
//     <p class="project-desc">Project description...</p>
//     <a class="project-link" data-modal="newKey">Explore project →</a>
//   </div>

// ============================================
// Recipe 3: Change the theme color
// ============================================
// Edit css/variables.css:
//
//   --electric: #YOUR_COLOR_HERE;
//
// All accents will update automatically.

// ============================================
// Recipe 4: Disable the loader
// ============================================
// Edit js/main.js, comment out:
//   initLoader();
//
// Or change the timing in config/site.config.js:
//   loader: { hideAfter: 0 }

// ============================================
// Recipe 5: Add a new skill
// ============================================
// In index.html, find a .skills-category and add:
//   <span class="skill"><span class="dot"></span>New Skill</span>

// ============================================
// Recipe 6: Track form submissions
// ============================================
// Edit js/modules/form.js, replace the function body with:
//
//   export function handleFormSubmit(form) {
//     const data = Object.fromEntries(new FormData(form));
//     console.log('Form submission:', data);
//
//     // Send to your backend:
//     fetch('/api/contact', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//
//     // ... existing success UI logic
//   };

// ============================================
// Recipe 7: Add Google Analytics
// ============================================
// In index.html, just before </head>:
//
//   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
//   <script>
//     window.dataLayer = window.dataLayer || [];
//     function gtag(){dataLayer.push(arguments);}
//     gtag('js', new Date());
//     gtag('config', 'GA_ID');
//   </script>

// ============================================
// Recipe 8: Customize the hero stats
// ============================================
// In index.html, find .hero-stats and update:
//
//   <div class="stat-num" data-count="100">0</div>
//   <div class="stat-label">Custom Stat</div>
//
// (Note: values of 100 get a "%" suffix automatically.)

// ============================================
// Recipe 9: Use a different font
// ============================================
// In index.html, replace the Google Fonts link with your own,
// then update css/variables.css:
//
//   --font-display: 'Your Font', sans-serif;
//   --font-body:    'Your Body Font', sans-serif;

// ============================================
// Recipe 10: Make the contact form actually send email
// ============================================
// Option A: Use a service like Formspree, Netlify Forms, or Web3Forms.
// Option B: Wire up your own backend.
//
// Replace the body of js/modules/form.js handleFormSubmit() with:
//
//   export async function handleFormSubmit(form) {
//     const data = Object.fromEntries(new FormData(form));
//     const res = await fetch('https://formspree.io/f/YOUR_ID', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     if (res.ok) {
//       // show success
//     } else {
//       // show error
//     }
//   };

export const recipes = { version: '1.0.0' };
