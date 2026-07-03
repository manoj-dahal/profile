/**
 * File structure validation tests
 * Verifies all expected files and directories exist.
 *
 * Run:  node tests/structure.test.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

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

function expectFile(p) {
  if (!fs.existsSync(path.join(ROOT, p))) {
    throw new Error(`Missing file: ${p}`);
  }
}

function expectDir(p) {
  const full = path.join(ROOT, p);
  if (!fs.existsSync(full) || !fs.statSync(full).isDirectory()) {
    throw new Error(`Missing directory: ${p}`);
  }
}

function expectFileContains(p, needle) {
  const content = fs.readFileSync(path.join(ROOT, p), 'utf8');
  if (!content.includes(needle)) {
    throw new Error(`File ${p} does not contain "${needle}"`);
  }
}

console.log('\n🧪 File Structure Tests\n');

// ----- Root files -----
test('index.html exists', () => expectFile('index.html'));
test('package.json exists', () => expectFile('package.json'));
test('README.md exists', () => expectFile('README.md'));
test('LICENSE exists', () => expectFile('LICENSE'));
test('CHANGELOG.md exists', () => expectFile('CHANGELOG.md'));

// ----- CSS -----
test('css/ directory exists', () => expectDir('css'));
test('css/styles.css exists', () => expectFile('css/styles.css'));
test('css/variables.css exists', () => expectFile('css/variables.css'));
test('css/base.css exists', () => expectFile('css/base.css'));
test('css/sections/ directory exists', () => expectDir('css/sections'));
test('css/sections/hero.css exists', () => expectFile('css/sections/hero.css'));
test('css/sections/nav.css exists', () => expectFile('css/sections/nav.css'));

// ----- JS -----
test('js/ directory exists', () => expectDir('js'));
test('js/main.js exists', () => expectFile('js/main.js'));
test('js/data.js exists', () => expectFile('js/data.js'));
test('js/modules/ directory exists', () => expectDir('js/modules'));
test('js/modules/cursor.js exists', () => expectFile('js/modules/cursor.js'));
test('js/modules/background.js exists', () => expectFile('js/modules/background.js'));

// ----- Assets -----
test('assets/ directory exists', () => expectDir('assets'));
test('assets/favicon.svg exists', () => expectFile('assets/favicon.svg'));

// ----- Public -----
test('public/robots.txt exists', () => expectFile('public/robots.txt'));
test('public/sitemap.xml exists', () => expectFile('public/sitemap.xml'));

// ----- Config -----
test('config/seo.json exists', () => expectFile('config/seo.json'));

// ----- Content checks -----
test('index.html contains Manoj Dahal', () => expectFileContains('index.html', 'Manoj Dahal'));
test('index.html contains email', () => expectFileContains('index.html', 'info@manoj-dahal.com.np'));
test('index.html references css/styles.css', () => expectFileContains('index.html', 'css/styles.css'));
test('index.html references js/main.js', () => expectFileContains('index.html', 'js/main.js'));
test('package.json has name field', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  if (!pkg.name) throw new Error('package.json missing "name"');
});

// ----- JSON validity -----
test('config/seo.json is valid JSON', () => {
  JSON.parse(fs.readFileSync(path.join(ROOT, 'config/seo.json'), 'utf8'));
});
test('public/manifest.json is valid JSON', () => {
  JSON.parse(fs.readFileSync(path.join(ROOT, 'public/manifest.json'), 'utf8'));
});
test('package.json is valid JSON', () => {
  JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
});

// ----- Summary -----
console.log(`\n  📊 Results: ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
