#!/usr/bin/env node
/**
 * Test runner — runs all test files in this directory
 * Usage:  node tests/run-all.js
 */

const fs   = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const tests = fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.test.cjs') && f !== 'run-all.cjs');

let totalPassed = 0, totalFailed = 0;

console.log('\n═══════════════════════════════════════════════');
console.log('  🧪 Manoj Dahal Portfolio — Test Suite');
console.log('═══════════════════════════════════════════════\n');

for (const test of tests) {
  console.log(`\n── ${test} ──`);
  const result = spawnSync('node', [path.join(__dirname, test)], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  if (result.status === 0) totalPassed++;
  else totalFailed++;
}

console.log('\n═══════════════════════════════════════════════');
console.log(`  📊 Overall: ${totalPassed} suites passed, ${totalFailed} failed`);
console.log('═══════════════════════════════════════════════\n');

process.exit(totalFailed === 0 ? 0 : 1);
