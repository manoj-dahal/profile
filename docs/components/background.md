# Animated Background System

> Four stacked canvases create the cosmic AI-themed background.

## 📂 Files

| File | Purpose |
|---|---|
| `css/sections/background.css` | Container + aurora blob styles |
| `js/modules/background.js`   | All four canvas render loops |

## 🎨 Layer Composition

The `.bg-stack` div holds everything, `position: fixed; z-index: -1`:

```html
<div class="bg-stack">
  <canvas id="nebulaCanvas"></canvas>     <!-- 1. drifting color clouds -->
  <canvas id="gridCanvas"></canvas>       <!-- 2. mouse-reactive grid -->
  <canvas id="particleCanvas"></canvas>   <!-- 3. particles + neural lines -->
  <canvas id="lightningCanvas"></canvas>  <!-- 4. random lightning -->
  <div class="aurora a1"></div>            <!-- 5-8. blur orbs -->
  <div class="aurora a2"></div>
  <div class="aurora a3"></div>
  <div class="aurora a4"></div>
  <div class="noise"></div>                <!-- 9. film grain -->
</div>
```

## 🌀 Canvas 1: Nebula (slowest)

- 4 large radial gradients
- Each drifts along a unique sine path
- 0.003 rad/frame rotation
- Adds the colored "fog" effect

## 🟦 Canvas 2: AI Grid (interactive)

- 60px square grid
- Drifts ±20px based on mouse position
- Intersection points glow brighter near the cursor
- Creates a "data" feel

## ✨ Canvas 3: Particles (the hero)

- 120 particles
- 3 colors: electric blue, purple, pink
- Connect to nearby particles (`dist < 120`) with thin lines
- Connect to mouse (`dist < 150`) with purple lines
- Slow random walk: `±0.4px/frame`

## ⚡ Canvas 4: Lightning (rare)

- Triggers every 5-10 seconds (50% chance)
- Recursive branching: depth 4, 2 child branches each
- Cyan glow, white-blue color
- Adds drama without overwhelming

## 🎯 Aurora Blobs (CSS only)

Four large, heavily-blurred circles that float in the background:

```css
.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);     /* the magic */
  opacity: 0.5;
  mix-blend-mode: screen;  /* adds to underlying colors */
  animation: float 20s ease-in-out infinite;
}
```

`mix-blend-mode: screen` makes them add light without obscuring content.

## 🔊 Noise Overlay

Inline SVG turbulence filter, 4% opacity, 0.4s steps animation:

```css
.noise {
  background-image: url("data:image/svg+xml,...");
  animation: noiseShift 0.4s steps(4) infinite;
}
```

Adds a film-grain feel.

## 📊 Performance

- 4 separate `requestAnimationFrame` loops (not nested)
- All operations are O(n²) max for particles (120² = 14,400 checks)
- Browser pauses animation when tab is hidden
- GPU does the heavy lifting for CSS aurora + noise
- Total CPU usage: ~3-5% on a modern laptop

## 🛠 Disabling Layers

To disable a specific layer, comment out its `animate*` call in `initBackgrounds()`:

```js
// animateParticles();   // ← comment to disable particles
drawGrid();
drawNebula();
lightningLoop();
```

Or hide a canvas in CSS:

```css
#particleCanvas { display: none; }
```
