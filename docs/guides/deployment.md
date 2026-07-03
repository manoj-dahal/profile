# Deployment Guide

> Deploy your portfolio to the world.

## 🚀 Vercel (Recommended — easiest)

### Option A: Git Integration
1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Click **Deploy** — done!

### Option B: CLI
```bash
npm i -g vercel
cd portfolio/
vercel
```

The included `vercel.json` configures:
- Static build via `@vercel/static`
- Security headers (CSP, XSS protection, etc.)
- 1-year cache for CSS/JS/SVG assets

### Custom Domain
1. In Vercel dashboard → Settings → Domains
2. Add `manoj-dahal.com.np`
3. Update DNS per Vercel's instructions

## 🌐 Netlify

### Option A: Drag & Drop
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `portfolio/` folder onto the page
3. Done — instant preview URL

### Option B: Git Integration
1. Push to GitHub
2. Connect in Netlify dashboard
3. Build command: `echo "static"` (or leave empty)
4. Publish directory: `.`

The included `netlify.toml` sets up:
- Cache headers per file type
- Security headers
- HTTPS redirect
- www → non-www redirect (configurable)

## 📄 GitHub Pages

1. Push to a GitHub repo
2. Settings → Pages → Source: **GitHub Actions**
3. The included `.github/workflows/deploy.yml` will:
   - Validate file structure
   - Deploy to `gh-pages` branch
   - Auto-deploy on every push to `main`

Your site will be at: `https://USERNAME.github.io/REPO/`

## ☁️ Cloudflare Pages

1. Push to Git
2. In Cloudflare dashboard → Workers & Pages → Create
3. Connect repo
4. Build command: (empty — static)
5. Build output: `/`
6. Deploy

## 🪣 AWS S3 + CloudFront

```bash
# Build (nothing to compile)
# Sync to S3
aws s3 sync . s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

## 🔥 Firebase Hosting

```bash
npm i -g firebase-tools
firebase init hosting    # public dir: . (current dir)
firebase deploy
```

## 📡 Surge.sh (simplest CLI)

```bash
npm i -g surge
cd portfolio/
surge
# Pick a domain or use the auto-generated one
```

## 🌊 Any Other Static Host

The site is 100% static — no server-side code required. Just upload every file (except dotfiles) to any web host:

- Render.com
- Vercel
- Netlify
- Cloudflare Pages
- Render
- Railway
- Fly.io
- Glitch
- Codeberg Pages
- GitLab Pages
- Even a Raspberry Pi with nginx!

## ✅ Pre-deployment Checklist

- [ ] Update `public/sitemap.xml` with your real domain
- [ ] Update `public/robots.txt` Sitemap URL
- [ ] Update `public/manifest.json` start_url if using a subpath
- [ ] Update `config/seo.json` with your real URLs
- [ ] Update `index.html` `<title>`, meta description, OG tags
- [ ] Update `vercel.json` / `netlify.toml` with your domain
- [ ] Test in production build locally first
- [ ] Run `npm test` — all tests should pass
- [ ] Run Lighthouse audit (aim for 90+ on all categories)
- [ ] Verify on real mobile device

## 🔒 Production Headers

Recommended headers (already in `vercel.json` / `netlify.toml`):

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; ...
```

For a strict CSP, you may need to allow Google Fonts domains:
```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
```
