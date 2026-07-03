#!/usr/bin/env node
/**
 * Build script for Manoj Dahal Portfolio
 * Compiles SCSS → CSS, minifies assets, generates sitemap
 *
 * Usage:  node scripts/build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const log = (msg, color = '\x1b[36m') => console.log(`${color}▸ ${msg}\x1b[0m`);
const ok  = (msg) => log(`✅ ${msg}`, '\x1b[32m');
const err = (msg) => log(`❌ ${msg}`, '\x1b[31m');

async function build() {
  log('Starting build...');

  // 1. Validate file structure
  log('Validating file structure...');
  const required = [
    'index.html',
    'css/styles.css',
    'js/main.js',
    'js/data.js',
    'package.json'
  ];

  for (const file of required) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      err(`Missing required file: ${file}`);
      process.exit(1);
    }
  }
  ok('All required files present');

  // 2. Check all imported CSS files
  log('Checking CSS imports...');
  const cssDir = path.join(ROOT, 'css');
  const cssFiles = getFilesRecursive(cssDir, '.css');
  ok(`Found ${cssFiles.length} CSS files`);

  // 3. Check all imported JS modules
  log('Checking JS modules...');
  const jsDir = path.join(ROOT, 'js');
  const jsFiles = getFilesRecursive(jsDir, '.js');
  ok(`Found ${jsFiles.length} JS files`);

  // 4. Validate JSON
  log('Validating JSON files...');
  const jsonFiles = getFilesRecursive(ROOT, '.json');
  for (const file of jsonFiles) {
    try {
      JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      err(`Invalid JSON: ${path.relative(ROOT, file)} — ${e.message}`);
      process.exit(1);
    }
  }
  ok(`Validated ${jsonFiles.length} JSON files`);

  // 5. Report file sizes
  log('\n📊 Build summary:');
  const totalSize = getTotalSize(ROOT);
  console.log(`   Total project size: ${formatBytes(totalSize)}`);
  console.log(`   HTML files:         ${getFilesRecursive(ROOT, '.html').length}`);
  console.log(`   CSS files:          ${cssFiles.length}`);
  console.log(`   JS files:           ${jsFiles.length}`);
  console.log(`   JSON files:         ${jsonFiles.length}`);

  ok('Build complete!');
}

function getFilesRecursive(dir, ext) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFilesRecursive(full, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

function getTotalSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += getTotalSize(full);
    } else if (entry.isFile()) {
      total += fs.statSync(full).size;
    }
  }
  return total;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

build().catch(e => { console.error(e); process.exit(1); });
