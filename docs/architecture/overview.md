# Architecture Overview

> How the Manoj Dahal portfolio is organized and why.

## 🎯 Design Principles

1. **Zero build step** — Plain HTML/CSS/JS, run anywhere
2. **Modular by default** — Every feature is a self-contained module
3. **Progressive enhancement** — Works without JS, enhanced with JS
4. **60fps target** — All animations use GPU-accelerated transforms
5. **Mobile-first** — Designed for touch, enhanced for desktop

## 📁 Directory Layout

```
portfolio/
├── index.html              ← Single-page application shell
├── css/                    ← Compiled CSS (production-ready)
│   ├── styles.css          ← Main entry, imports below
│   ├── variables.css       ← Design tokens
│   ├── base.css            ← Reset + typography
│   └── sections/           ← One file per section
│
├── js/                     ← ES6 modules
│   ├── main.js             ← Entry: bootstraps all features
│   ├── data.js             ← Static data (projects, etc.)
│   └── modules/            ← One file per feature
│
├── scss/                   ← SCSS source (optional)
│
├── assets/                 ← Static binary/SVG assets
│
├── public/                 ← Files served as-is (robots, sitemap)
│
├── config/                 ← Centralized config (JSON + JS)
│
├── scripts/                ← Node.js tooling
│
└── tests/                  ← Validation tests
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────┐
│                  index.html                     │
│  (static markup + canvas/cursor placeholders)   │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  css/styles  │ ← imports all section CSS
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   js/main    │ ← entry: DOMContentLoaded
              └──────┬───────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ cursor  │  │ bg canv │  │ modal   │  ...etc
   └─────────┘  └─────────┘  └─────────┘
        │            │            │
        └────────────┴────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Browser DOM   │
            │  (animated)    │
            └────────────────┘
```

## 🎨 Styling Strategy

### Design Tokens (CSS Variables)
All colors, shadows, timing live in `css/variables.css`. Change one variable → restyle everywhere.

```css
:root {
  --electric: #00f0ff;   /* change this to retheme */
  --purple:   #b400ff;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Per-section CSS
Each major section has its own file. Loading order matters — declared in `styles.css`:

```css
@import url('variables.css');    /* tokens first */
@import url('base.css');         /* reset */
@import url('sections/global.css');
@import url('sections/background.css');
/* ... etc */
@import url('sections/responsive.css');  /* last */
```

## ⚡ JavaScript Architecture

### Module Pattern
Every feature exports a single `init*` function. `main.js` calls them all on `DOMContentLoaded`:

```js
// js/main.js
import { initCursor }    from './modules/cursor.js';
import { initBackgrounds } from './modules/background.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initBackgrounds();
});
```

### Why ES Modules?
- Native browser support (no bundler needed)
- Tree-shakeable for future build steps
- Standard import/export syntax
- Async by default

## 🖼 Background System

The most complex piece. Four `<canvas>` elements stacked in a fixed `.bg-stack` div, each running an independent render loop:

| Canvas | Module | Purpose |
|---|---|---|
| `particleCanvas` | `background.js` | 120 particles + neural connections |
| `gridCanvas`     | `background.js` | Mouse-reactive AI grid |
| `nebulaCanvas`   | `background.js` | Slow drifting color clouds |
| `lightningCanvas`| `background.js` | Random rare bolts |

All loops run independently via `requestAnimationFrame`. Mouse position is shared between them.

## 🎬 Animation Strategy

| Effect | Technique | Performance |
|---|---|---|
| Cursor | `transform: translate3d` | GPU |
| Reveals | `IntersectionObserver` | Cheap |
| Counters | `requestAnimationFrame` | Cheap |
| Tilt | `transform: rotate3d` | GPU |
| Particles | `requestAnimationFrame` + Canvas | CPU, but cheap |
| Loader | CSS `@keyframes` | GPU |
| Marquee | CSS `@keyframes translateX` | GPU |

## 📱 Responsive Strategy

Mobile-first is mostly inverted here — designed for desktop then condensed for mobile. Two breakpoints:
- **≤ 1024px** — tablet (2-col → 1-col grids)
- **≤ 720px** — mobile (hide cursor, compress navbar)

## 🚀 Performance Budget

| Resource | Target | Actual |
|---|---|---|
| HTML | < 50 KB | ~30 KB |
| CSS  | < 50 KB | ~40 KB |
| JS   | < 50 KB | ~27 KB |
| **Total** | **< 200 KB** | **~170 KB** |
| Fonts | 3 families | 3 |
| HTTP requests | < 20 | ~12 |

## 🛠 Future Migrations

- **TypeScript** — types in `types/index.d.ts` ready to adopt
- **SCSS** — source in `scss/` compiles to `css/`
- **Build step** — add Vite/Rollup for minification
- **CMS** — swap `index.html` for templated output, keep CSS/JS as-is
