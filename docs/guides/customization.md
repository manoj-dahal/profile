# Customization Guide

> Make the portfolio yours.

## 🎨 Change the Color Theme

Edit `css/variables.css`:

```css
:root {
  --electric: #00f0ff;   /* change to your primary brand color */
  --cyan:     #00d4ff;
  --purple:   #b400ff;
  --pink:     #ff00aa;
}
```

Every accent color throughout the site will update automatically.

**Popular alternatives:**
- **Emerald AI**: `--electric: #00ff88; --purple: #00b4ff;`
- **Sunset**: `--electric: #ff8800; --purple: #ff0066;`
- **Mono**: `--electric: #ffffff; --purple: #888888;`

## ✍️ Change the Hero Roles

Edit `js/modules/typewriter.js`:

```js
const roles = [
  'AI Engineer',
  'Your Role Here',  // ← add or change
  'Another Role'
];
```

## 📊 Change the Stats

In `index.html`, find `<div class="hero-stats">`:

```html
<div class="stat">
  <div class="stat-num" data-count="50">0</div>  <!-- target value -->
  <div class="stat-label">Projects Built</div>   <!-- label -->
</div>
```

The value of 100 gets a `%` suffix automatically. Other values get a `+` suffix.

## 🖼 Change the Hero Visual

The hero visual is the animated 3D particle sphere. To replace it with a static image:

1. Edit `index.html` — find `<div class="hero-visual">`
2. Replace the contents with:
   ```html
   <div class="hero-visual">
     <img src="assets/your-image.png" alt="Hero" style="width:100%; height:100%; object-fit:contain;">
   </div>
   ```

## 📝 Change Site Title & Description

In `index.html`, update the `<head>`:

```html
<title>Your Name — Your Title</title>
<meta name="description" content="Your description...">
```

Or use the config files:
- `config/seo.json` — for SEO metadata
- `config/site.config.js` — for runtime config

## 🔤 Change the Fonts

1. Edit the Google Fonts `<link>` in `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
   ```

2. Update `css/variables.css`:
   ```css
   --font-display: 'Playfair Display', serif;
   --font-body:    'Inter', sans-serif;
   --font-mono:    'JetBrains Mono', monospace;
   ```

## 🎬 Disable Specific Animations

Comment out the `init*()` calls in `js/main.js`:

```js
document.addEventListener('DOMContentLoaded', () => {
  // initLoader();        // ← skip the loading screen
  initCursor();
  // initBackgrounds();   // ← skip the 4-canvas background
  initMagnetic();
  // ... etc
});
```

## 🔗 Update Social Links

In `index.html`, find `<div class="socials">`:

```html
<a href="https://github.com/YOUR_USERNAME" class="social-icon magnetic">
  <svg>...</svg>
</a>
```

Or in `config/site.config.js`:

```js
social: {
  github:   'https://github.com/YOUR_USERNAME',
  linkedin: 'https://linkedin.com/in/YOUR_USERNAME',
  twitter:  'https://twitter.com/YOUR_USERNAME',
  dribbble: 'https://dribbble.com/YOUR_USERNAME'
}
```

## 🌐 Add a New Section

1. Add the HTML in `index.html`:
   ```html
   <section id="newSection">
     <div class="container">
       <div class="reveal"><span class="section-tag">// New Section</span></div>
       <h2 class="section-title reveal reveal-delay-1">Section <span class="grad">Title</span></h2>
       <p class="section-sub reveal reveal-delay-2">Subtitle...</p>
       <!-- content -->
     </div>
   </section>
   ```

2. Add a nav link:
   ```html
   <a href="#newSection" data-nav><span class="dot"></span>New</a>
   ```

3. (Optional) Create a CSS file for it:
   - Add `css/sections/new-section.css`
   - Import it from `css/styles.css`

4. (Optional) Add a JS module:
   - Add `js/modules/newFeature.js`
   - Import + call `initNewFeature()` from `main.js`

## 🛠 Use as a Starter for a Different Project

1. Copy the folder
2. Edit `index.html` (content)
3. Edit `config/site.config.js` (meta)
4. Edit `js/data.js` (data)
5. Replace colors in `css/variables.css`
6. Ship!

## ⚡ Performance Tuning

### Reduce particle count
Edit `js/modules/background.js`:
```js
for (let i = 0; i < 120; i++) particles.push(new Particle());  // ← reduce to 60
```

### Disable lightning
```js
function lightningLoop() {
  // ... empty or remove the call
}
```

### Lazy-load below-the-fold canvases
```js
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) initBackgrounds();
});
observer.observe(document.getElementById('about'));
```
