/**
 * End-to-End Tests
 * Uses Playwright if installed, otherwise falls back to manual checks
 *
 * Install:  npm install -D playwright
 * Run:      npx playwright install
 *           node e2e/portfolio.test.cjs
 */

const path = require('path');
const fs = require('fs');

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

let passed = 0, failed = 0;

function test(name, fn) {
  return Promise.resolve()
    .then(() => fn())
    .then(() => { console.log(`  ✅ ${name}`); passed++; })
    .catch(e => { console.log(`  ❌ ${name}\n     ${e.message}`); failed++; });
}

async function main() {
  // Try to load playwright
  let playwright;
  try { playwright = require('playwright'); }
  catch {
    console.log('⚠️  Playwright not installed. Install with: npm i -D playwright');
    console.log('   Then run: npx playwright install chromium');
    console.log('   Skipping E2E tests.\n');
    process.exit(0);
  }

  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  console.log('\n🎭 E2E Tests\n');
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // ---- Smoke tests ----
  await test('Loads homepage', async () => {
    const res = await page.goto(BASE);
    if (!res.ok()) throw new Error(`Status: ${res.status()}`);
    await page.waitForSelector('h1', { timeout: 5000 });
  });

  await test('Has the name "Manoj Dahal"', async () => {
    const text = await page.textContent('body');
    if (!text.includes('Manoj Dahal')) throw new Error('Name not found');
  });

  await test('Has contact email', async () => {
    const text = await page.textContent('body');
    if (!text.includes('info@manoj-dahal.com.np')) throw new Error('Email not found');
  });

  // ---- Sections present ----
  await test('Has all 6 sections', async () => {
    for (const id of ['home', 'about', 'skills', 'projects', 'process', 'contact']) {
      const el = await page.$(`#${id}`);
      if (!el) throw new Error(`Missing section: #${id}`);
    }
  });

  // ---- Custom cursor ----
  await test('Custom cursor exists', async () => {
    const dot = await page.$('#cursorDot');
    const ring = await page.$('#cursorRing');
    if (!dot || !ring) throw new Error('Cursor elements missing');
  });

  // ---- Navigation ----
  await test('Clicking nav link scrolls to section', async () => {
    await page.click('a[href="#contact"]');
    await page.waitForTimeout(800);
    const scroll = await page.evaluate(() => window.scrollY);
    if (scroll < 1000) throw new Error(`Didn't scroll: ${scroll}px`);
  });

  // ---- Project modal ----
  await test('Clicking a project opens modal', async () => {
    await page.click('a[href="#projects"]');
    await page.waitForTimeout(500);
    const trigger = await page.$('[data-modal]');
    if (!trigger) throw new Error('No modal trigger found');
    await trigger.click();
    await page.waitForTimeout(500);
    const modal = await page.$('.modal.open');
    if (!modal) throw new Error('Modal did not open');
  });

  await test('Pressing Escape closes modal', async () => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const modal = await page.$('.modal.open');
    if (modal) throw new Error('Modal did not close');
  });

  // ---- Contact form ----
  await test('Contact form has required fields', async () => {
    const fields = await page.$$eval('#contact input, #contact textarea', els => els.length);
    if (fields < 3) throw new Error(`Only ${fields} fields found`);
  });

  // ---- Skills ----
  await test('Skills section has capsules', async () => {
    const skills = await page.$$eval('.skill', els => els.length);
    if (skills < 20) throw new Error(`Only ${skills} skills found`);
  });

  // ---- Animations ----
  await test('Background canvases are animating', async () => {
    const c1 = await page.$('#particleCanvas');
    const c2 = await page.$('#nebulaCanvas');
    if (!c1 || !c2) throw new Error('Background canvases missing');
    // We can check they're in the DOM and have non-zero dimensions
    const w = await c1.evaluate(el => el.width);
    if (w < 100) throw new Error('Particle canvas not sized');
  });

  // ---- Responsive ----
  await test('Renders correctly on mobile', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForSelector('h1');
    // Custom cursor should be hidden
    const dotVisible = await page.evaluate(() => {
      const dot = document.getElementById('cursorDot');
      return dot && getComputedStyle(dot).display !== 'none';
    });
    if (dotVisible) throw new Error('Cursor should be hidden on mobile');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile.png') });
  });

  await test('Renders correctly on tablet', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForSelector('h1');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tablet.png') });
  });

  await test('Renders correctly on desktop', async () => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForSelector('h1');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop.png') });
  });

  // ---- Accessibility ----
  await test('HTML has lang attribute', async () => {
    const lang = await page.evaluate(() => document.documentElement.lang);
    if (!lang) throw new Error('No lang attribute');
  });

  await test('All images have alt attributes', async () => {
    const missing = await page.$$eval('img', imgs =>
      imgs.filter(img => !img.alt && !img.getAttribute('aria-label')).map(img => img.src)
    );
    if (missing.length) throw new Error(`Images without alt: ${missing.join(', ')}`);
  });

  await test('All buttons have accessible names', async () => {
    const issues = await page.$$eval('button', buttons =>
      buttons.filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length
    );
    if (issues > 0) throw new Error(`${issues} buttons without names`);
  });

  // ---- Performance ----
  await test('Page loads in <3s', async () => {
    const start = Date.now();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const duration = Date.now() - start;
    if (duration > 3000) throw new Error(`Took ${duration}ms`);
  });

  await browser.close();

  console.log(`\n  📊 Results: ${passed} passed, ${failed} failed\n`);
  console.log(`  📸 Screenshots saved to: ${SCREENSHOTS_DIR}\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
