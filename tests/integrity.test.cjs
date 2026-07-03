/**
 * HTML reference integrity tests
 * Verifies that every href, src, and @import in the project
 * points to a file that actually exists.
 *
 * Run:  node tests/integrity.test.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let passed = 0, failed = 0;
const errors = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
    errors.push({ name, error: e.message });
  }
}

function fileExists(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function resolveRef(fromFile, ref) {
  ref = ref.split('?')[0].split('#')[0];
  if (!ref) return null;
  return path.resolve(path.dirname(fromFile), ref);
}

function checkHtml(file) {
  const content = fs.readFileSync(file, 'utf8');
  const re = /(?:src|href)=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(content))) {
    const ref = m[1];
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:') ||
        ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('#')) continue;
    const resolved = resolveRef(file, ref);
    if (!fileExists(resolved)) {
      throw new Error(`${path.relative(ROOT, file)} → ${ref} (not found)`);
    }
  }
}

function checkCss(file) {
  const content = fs.readFileSync(file, 'utf8');
  const urlRe = /url\(["']?([^"')]+)["']?\)/g;
  let m;
  while ((m = urlRe.exec(content))) {
    const ref = m[1];
    // Skip data URIs, hashes, and URL-encoded fragments (inside SVG data URIs)
    if (ref.startsWith('http') || ref.startsWith('data:') || ref.startsWith('#')) continue;
    if (ref.includes('%23')) continue; // fragment inside encoded SVG
    const resolved = resolveRef(file, ref);
    if (!fileExists(resolved)) {
      throw new Error(`${path.relative(ROOT, file)} → url(${ref}) (not found)`);
    }
  }
  const importRe = /@import\s+["']([^"']+)["']/g;
  while ((m = importRe.exec(content))) {
    const resolved = resolveRef(file, m[1]);
    if (!fileExists(resolved)) {
      throw new Error(`${path.relative(ROOT, file)} → @import "${m[1]}" (not found)`);
    }
  }
}

function checkJs(file) {
  const content = fs.readFileSync(file, 'utf8');
  // Match import/export statements with literal string paths
  const re = /(?:import|export)\s+(?:[^'"]+from\s+)?["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(content))) {
    const ref = m[1];
    if (ref.startsWith('http') || ref.startsWith('//')) continue;
    if (!ref.startsWith('.')) continue;
    // Only check relative paths that look like real files (must have extension)
    if (!/\.[a-z]+$/i.test(ref)) continue;
    const resolved = resolveRef(file, ref);
    if (!fileExists(resolved)) {
      throw new Error(`${path.relative(ROOT, file)} → import "${ref}" (not found)`);
    }
  }
}

function walk(dir, ext, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'tests') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, ext, callback);
    else if (entry.name.endsWith(ext)) callback(full);
  }
}

console.log('\n🧪 Reference Integrity Tests\n');

test('All HTML references resolve', () => walk(ROOT, '.html', checkHtml));
test('All CSS references resolve',   () => walk(ROOT, '.css', checkCss));
test('All JS references resolve',    () => walk(ROOT, '.js',  checkJs));

console.log(`\n  📊 Results: ${passed} passed, ${failed} failed\n`);
if (errors.length) {
  console.log('  Errors:');
  errors.forEach(({ name, error }) => console.log(`    - ${name}: ${error}`));
  console.log();
}
process.exit(failed === 0 ? 0 : 1);
