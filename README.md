# 🌌 Manoj Dahal — Futuristic Portfolio

> A premium, AI-themed personal portfolio website that feels like a next-generation operating system. Built with cinematic animations, custom cursors, 3D particle systems, and glassmorphic UI.

![Status](https://img.shields.io/badge/status-live-00f0ff?style=for-the-badge)
![Performance](https://img.shields.io/badge/performance-60fps-00f0ff?style=for-the-badge)
![Theme](https://img.shields.io/badge/theme-futuristic-b400ff?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-ff00aa?style=for-the-badge)
![Deps](https://img.shields.io/badge/dependencies-zero-success?style=for-the-badge)

---

## ✨ Features

- 🎬 **Cinematic loader** — triple-ring AI loader with progress bar
- 🖱 **Custom cursor** — dot + ring + glow + 8-trail particle chain + click ripples
- 🌌 **Multi-layer background** — aurora blobs, particle network, AI grid, nebula clouds, lightning bolts, noise overlay
- 🧭 **Floating glass dock** — macOS-style animated border navbar
- 🚀 **Hero section** — 6-role typewriter, gradient shine name, parallax 3D energy core
- 📖 **About + timeline + animated stats**
- 🧠 **Skills** — 40+ glowing capsules in 4 categories
- 🪟 **Projects** — 6 cards with 3D mouse tilt, glass borders, modal details
- ⚙️ **Process** — 4-step workflow visualization
- 📬 **Contact** — glass form with floating labels + 4 contact cards
- 🦶 **Minimal footer** with social icons
- 📱 **Fully responsive** desktop → tablet → mobile
- ♿ **Accessible** with ARIA labels and keyboard nav
- 🔍 **SEO-ready** with sitemap, robots.txt, manifest

---

## 🚀 Quick Start

### Option 1: Direct Open
```bash
open index.html
```

### Option 2: Local Server (recommended)
```bash
# Using the included dev server (with proper MIME types)
npm start
# → http://localhost:3000

# Or use Python
python3 -m http.server 8000
# → http://localhost:8000

# Or any static server
npx serve .
```

---

## 📁 Project Structure

```
portfolio/
├── index.html                  # Main HTML entry point
├── package.json                # Project metadata & scripts
├── README.md                   # You are here
├── CHANGELOG.md                # Version history
├── CONTRIBUTING.md             # How to contribute
├── SECURITY.md                 # Security policy
├── LICENSE                     # MIT license
│
├── css/                        # Compiled CSS (ready to ship)
│   ├── styles.css              # Main entry (imports all)
│   ├── variables.css           # Design tokens
│   ├── base.css                # Reset + typography
│   └── sections/               # 14 per-section files
│
├── scss/                       # SCSS source (optional)
│   ├── styles.scss             # Main entry
│   ├── variables.scss          # Variables + mixins
│   ├── base.scss
│   └── sections/               # Mirrors css/sections
│
├── js/                         # ES6 modules
│   ├── main.js                 # Bootstrap
│   ├── data.js                 # Project content
│   └── modules/                # 14 feature modules
│
├── assets/                     # 3 SVG assets
│   ├── favicon.svg
│   ├── logo.svg
│   └── og-image.svg
│
├── public/                     # Static, served as-is
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── manifest.json
│   └── _redirects
│
├── config/                     # Centralized configuration
│   ├── seo.json                # SEO metadata
│   └── site.config.js          # Site config (used by JS)
│
├── scripts/                    # Build/dev tooling
│   ├── dev-server.js           # Lightweight dev server
│   ├── build.js                # Build orchestrator
│   └── validate.js             # Validates all file refs
│
└── .github/                    # GitHub integration
    ├── workflows/
    │   └── deploy.yml          # CI/CD to GitHub Pages
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    ├── pull_request_template.md
    └── FUNDING.yml
```

---

## 🛠 Available Commands

| Command            | What it does                                |
|--------------------|---------------------------------------------|
| `npm start`        | Start the dev server at `localhost:3000`    |
| `npm run serve`    | Python dev server at `localhost:8000`       |
| `npm run build`    | Validate + report file structure            |
| `npm run validate` | Check all HTML/CSS/JS references are valid  |
| `npm run watch:scss` | Watch & recompile SCSS → CSS (needs `sass`)|

---

## 🎨 Design System

### Color Palette
| Name        | Hex       | Usage                    |
|-------------|-----------|--------------------------|
| Background  | `#050816` | Page base                |
| Electric    | `#00f0ff` | Primary accent           |
| Cyan        | `#00d4ff` | Secondary accent         |
| Royal Blue  | `#3a7bff` | Tertiary accent          |
| Purple      | `#b400ff` | Highlight                |
| Pink        | `#ff00aa` | Hover / warning          |

### Typography
- **Display**: `Sora` (700, 800) — Headings, hero name
- **Body**: `Space Grotesk` (400, 500) — Paragraphs
- **Mono**: `JetBrains Mono` (400) — Tags, code, labels

---

## 🛠 Tech Stack

- **HTML5** semantic markup
- **CSS3** with custom properties, grid, flexbox, animations
- **Vanilla JavaScript (ES6 modules)** — zero runtime dependencies
- **Canvas API** for particle systems
- **IntersectionObserver API** for scroll reveals
- **Google Fonts** for typography
- **SCSS** (optional preprocessor source available)

---

## 🚀 Deployment

### Vercel
Just push to a Git repo and import — `vercel.json` is already configured with security headers and caching.

### Netlify
Same — `netlify.toml` is ready. Just drag the folder onto Netlify Drop.

### GitHub Pages
Push to `main` and the included `.github/workflows/deploy.yml` will auto-deploy.

### Any Static Host
Upload the entire folder to S3, Cloudflare Pages, Firebase Hosting, Surge, etc.

---

## 📞 Contact

**Manoj Dahal**
- 📧 Email: `info@manoj-dahal.com.np`
- 📱 Phone: `+977 9761463134`
- 🌐 Website: `manoj-dahal.com.np`

---

## 📄 License

MIT © 2026 Manoj Dahal — see [LICENSE](LICENSE) for details.
