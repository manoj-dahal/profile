/**
 * Performance budget tests
 * Verifies the project meets size and count targets.
 *
 * Run:  node tests/performance.test.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
  }
}

function getSize(p) {
  return fs.statSync(path.join(ROOT, p)).size;
}

function getDirSize(dir) {
  let total = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += getDirSize(full);
    else if (entry.isFile()) total += fs.statSync(full).size;
  }
  return total;
}

function expectMax(actual, max, msg) {
  if (actual > max) throw new Error(`${msg}: ${actual} > max ${max}`);
}

function expectMin(actual, min, msg) {
  if (actual < min) throw new Error(`${msg}: ${actual} < min ${min}`);
}

console.log('\n🧪 Performance Budget Tests\n');

// CSS budget
const cssSize = getDirSize(path.join(ROOT, 'css'));
test(`css/ total ≤ 50KB (actual: ${(cssSize/1024).toFixed(1)}KB)`, () => {
  expectMax(cssSize, 50 * 1024, 'CSS size');
});

// JS budget
const jsSize = getDirSize(path.join(ROOT, 'js'));
test(`js/ total ≤ 50KB (actual: ${(jsSize/1024).toFixed(1)}KB)`, () => {
  expectMax(jsSize, 50 * 1024, 'JS size');
});

// index.html budget
test(`index.html ≤ 50KB`, () => {
  const size = getSize('index.html');
  expectMax(size, 50 * 1024, 'index.html');
});

// Single CSS file import depth
test('css/styles.css exists and is not empty', () => {
  const size = getSize('css/styles.css');
  if (size < 100) throw new Error('css/styles.css too small');
});

// Module count is reasonable
test('js/modules/ has between 10 and 20 files', () => {
  const modules = fs.readdirSync(path.join(ROOT, 'js/modules')).filter(f => f.endsWith('.js'));
  if (modules.length < 10) throw new Error(`Only ${modules.length} modules`);
  if (modules.length > 20) throw new Error(`Too many modules: ${modules.length}`);
});

// Total project size
const totalSize = getDirSize(ROOT);
test(`Total project size ≤ 1MB (actual: ${(totalSize/1024).toFixed(1)}KB)`, () => {
  expectMax(totalSize, 1024 * 1024, 'Total project size');
});

// Fonts: only 3 Google Fonts
test('Only 3 Google Font families requested', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const matches = html.match(/family=([^"&]+)/g) || [];
  const families = new Set(matches.map(m => m.replace('family=', '').split(':')[0]));
  // We expect: Space+Grotesk, JetBrains+Mono, Sora
  if (families.size > 3) throw new Error(`Too many font families: ${families.size}`);
});

console.log(`\n  📊 Results: ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
