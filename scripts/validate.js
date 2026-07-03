#!/usr/bin/env node
/**
 * Validates that every file referenced from HTML/CSS/JS actually exists.
 * Catches broken links and missing assets before deployment.
 *
 * Usage:  node scripts/validate.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let errors = 0;

function exists(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function check(file, ref) {
  const full = path.resolve(path.dirname(file), ref.split('?')[0].split('#')[0]);
  if (!exists(full)) {
    console.log(`  ❌ ${path.relative(ROOT, file)} → ${ref}`);
    errors++;
  } else {
    console.log(`  ✅ ${path.relative(ROOT, file)} → ${ref}`);
  }
}

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');

  // Match src="..." and href="..." in HTML
  if (file.endsWith('.html')) {
    const re = /(?:src|href)=["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(content))) {
      const ref = m[1];
      if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('#')) continue;
      check(file, ref);
    }
  }

  // Match url(...) and @import "..." in CSS
  if (file.endsWith('.css')) {
    const urlRe = /url\(["']?([^"')]+)["']?\)/g;
    let m;
    while ((m = urlRe.exec(content))) {
      const ref = m[1];
      if (ref.startsWith('http') || ref.startsWith('data:')) continue;
      check(file, ref);
    }
    const importRe = /@import\s+["']([^"']+)["']/g;
    while ((m = importRe.exec(content))) check(file, m[1]);
  }

  // Match import "..." in JS
  if (file.endsWith('.js') || file.endsWith('.mjs')) {
    const importRe = /(?:import|export)\s+(?:[^'"]+from\s+)?["']([^"']+)["']/g;
    let m;
    while ((m = importRe.exec(content))) {
      const ref = m[1];
      if (ref.startsWith('http') || ref.startsWith('.')) check(file, ref);
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html|css|js|mjs)$/.test(entry.name)) scanFile(full);
  }
}

console.log('🔍 Validating file references...\n');
walk(ROOT);

console.log(`\n${errors === 0 ? '✅' : '❌'} ${errors === 0 ? 'All references valid' : `${errors} broken reference(s) found`}`);
process.exit(errors === 0 ? 0 : 1);
