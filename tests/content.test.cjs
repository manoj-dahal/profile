/**
 * Content sanity tests
 * Verifies key content is present in the project.
 *
 * Run:  node tests/content.test.js
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

function read(p) {
  return fs.readFileSync(path.join(ROOT, p), 'utf8');
}

console.log('\n🧪 Content Sanity Tests\n');

// Identity
test('Contains full name "Manoj Dahal"',           () => { if (!read('index.html').includes('Manoj Dahal')) throw new Error('not found'); });
test('Contains headline roles',                    () => {
  const html = read('index.html');
  ['AI Engineer', 'Software Developer', 'Game Developer', 'UI/UX Designer', 'Ethical Hacker'].forEach(r => {
    if (!html.includes(r)) throw new Error(`Missing role: ${r}`);
  });
});

// Contact
test('Contains email',  () => { if (!read('index.html').includes('info@manoj-dahal.com.np')) throw new Error('not found'); });
test('Contains phone',  () => { if (!read('index.html').includes('+977 9761463134')) throw new Error('not found'); });
test('Contains website', () => { if (!read('index.html').includes('manoj-dahal.com.np')) throw new Error('not found'); });

// Sections
test('Has all 6 nav sections', () => {
  const html = read('index.html');
  ['#home', '#about', '#skills', '#projects', '#process', '#contact'].forEach(s => {
    if (!html.includes(`href="${s}"`)) throw new Error(`Missing section: ${s}`);
  });
});

// Project data
test('js/data.js has 6 projects', () => {
  const data = read('js/data.js');
  const keys = ['ai', 'os', 'game', 'vision', 'sec', 'ux'];
  keys.forEach(k => {
    if (!data.includes(`${k}:`)) throw new Error(`Missing project: ${k}`);
  });
});

// Skills
test('Has at least 4 skill categories', () => {
  const html = read('index.html');
  const matches = html.match(/class="skills-category/g) || [];
  if (matches.length < 4) throw new Error(`Only ${matches.length} categories`);
});

test('Has at least 30 skill tags', () => {
  const html = read('index.html');
  const matches = html.match(/class="skill">/g) || [];
  if (matches.length < 30) throw new Error(`Only ${matches.length} skills`);
});

// SEO
test('Has meta description', () => {
  if (!read('index.html').includes('name="description"')) throw new Error('not found');
});
test('Has Open Graph tags', () => {
  // OG tags may be in the SEO config rather than inline; check both places
  const html = read('index.html');
  const seo  = fs.existsSync(path.join(ROOT, 'config/seo.json'))
    ? read('config/seo.json') : '';
  const hasInline = html.includes('og:title') && html.includes('og:description');
  const hasConfig = seo.includes('"og"') && seo.includes('"title"');
  if (!hasInline && !hasConfig) throw new Error('OG tags missing in both HTML and config');
});

// Accessibility
test('Has lang attribute on html', () => {
  if (!read('index.html').includes('<html lang=')) throw new Error('not found');
});
test('Has aria-label on social icons', () => {
  if (!read('index.html').includes('aria-label="GitHub"')) throw new Error('not found');
});

// Footer
test('Footer has copyright', () => {
  if (!read('index.html').includes('© 2026 Manoj Dahal')) throw new Error('not found');
});

console.log(`\n  📊 Results: ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
