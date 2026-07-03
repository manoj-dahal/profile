# Custom Cursor System

> Replaces the default OS cursor with a futuristic dot + ring + glow + trail.

## 📂 Files

| File | Purpose |
|---|---|
| `css/sections/cursor.css` | Styles for dot, ring, glow, trail, ripple |
| `js/modules/cursor.js`   | Animation logic + event handlers |

## 🎯 How It Works

```
┌─────────────────────────────────────┐
│  Browser mousemove event            │
└──────────────┬──────────────────────┘
               │
   ┌───────────┼───────────┐
   ▼           ▼           ▼
┌──────┐  ┌──────┐  ┌────────┐
│ Dot  │  │ Ring │  │ Glow   │
│ instant│ lerp(0.18) │ lerp(0.08)
└──────┘  └──────┘  └────────┘
   + 8 trail particles
   + 3 click ripples
```

- **Dot** moves instantly (1:1 with mouse)
- **Ring** lerps (smooth follow, factor 0.18)
- **Glow** lerps slower (factor 0.08) for parallax
- **Trail** = 8 particles chained, each lerping toward the previous

## 🎨 Visual Layers

```html
<div class="cursor-glow" id="cursorGlow"></div>  ← 300px radial blur
<div class="cursor-ring" id="cursorRing"></div>  ← 36px outlined ring
<div class="cursor-dot"  id="cursorDot"></div>   ← 6px solid dot
```

All positioned `fixed`, `top:0; left:0`, transformed with `translate(-50%, -50%)`.

## 🎬 Hover States

The cursor grows + changes color when hovering interactive elements:

```js
document.querySelectorAll('a, button, .skill, ...').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.classList.add('hover');   // grows 36px → 60px
    cursorDot.classList.add('hover');    // turns pink
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('hover');
    cursorDot.classList.remove('hover');
  });
});
```

## 💧 Click Ripples

On every click, three concentric ripples spawn at the mouse position:

```js
document.addEventListener('click', (e) => {
  for (let i = 0; i < 3; i++) {
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    // ... random size, staggered animation
  }
});
```

## 📱 Mobile

Disabled on touch devices via CSS media query:

```css
@media (max-width: 720px) {
  .cursor-dot, .cursor-ring, .cursor-glow, .cursor-trail { display: none; }
  body { cursor: auto; }  /* restore default */
}
```

## 🔧 Customization

To change the cursor color, edit `css/sections/cursor.css`:

```css
.cursor-dot {
  background: #YOUR_COLOR;
  box-shadow: 0 0 10px #YOUR_COLOR, 0 0 20px #YOUR_COLOR;
}

.cursor-ring {
  border-color: rgba(R, G, B, 0.6);
}
```

To change the smoothness, edit `js/modules/cursor.js`:

```js
ringX += (mouseX - ringX) * 0.18;  // 0.0 = no follow, 1.0 = instant
```

## 🧪 Performance

- All transforms use GPU (`translate3d`, `will-change: transform`)
- Trail particles use simple arithmetic, not Canvas
- Animation loop runs at 60fps via `requestAnimationFrame`
- No layout thrashing — all DOM updates are transform-only
