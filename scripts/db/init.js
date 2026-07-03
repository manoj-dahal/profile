#!/usr/bin/env node
/**
 * Database init script
 * Creates the SQLite database and applies schema + seeds
 *
 * Run:  node scripts/db/init.js [--reset] [--no-seed]
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DB   = path.join(ROOT, 'database', 'portfolio.db');
const SCHEMA = path.join(ROOT, 'database', 'schema.sql');
const SEED   = path.join(ROOT, 'database', 'seeds', 'seed.sql');

if (process.argv.includes('--reset') && fs.existsSync(DB)) {
  fs.unlinkSync(DB);
  console.log('🗑  Removed existing database');
}

if (fs.existsSync(DB)) {
  console.log('⚠️  Database already exists. Use --reset to recreate.');
  process.exit(0);
}

// Check sqlite3
const check = spawnSync('sqlite3', ['--version']);
if (check.status !== 0) {
  console.error('❌ sqlite3 CLI not found. Install with:');
  console.error('   macOS:  brew install sqlite3');
  console.error('   Ubuntu: sudo apt install sqlite3');
  process.exit(1);
}

console.log('📦 Creating database...');
try {
  execSync(`sqlite3 "${DB}" < "${SCHEMA}"`, { stdio: 'inherit' });
  console.log('✅ Schema applied');

  if (!process.argv.includes('--no-seed')) {
    execSync(`sqlite3 "${DB}" < "${SEED}"`, { stdio: 'inherit' });
    console.log('✅ Seed data inserted');
  }

  // Verify
  const tables = execSync(`sqlite3 "${DB}" ".tables"`).toString();
  console.log('\n📋 Tables created:');
  console.log(tables.split(/\s+/).filter(Boolean).sort().join(', '));

  console.log(`\n✅ Database ready: ${DB}`);
} catch (e) {
  console.error('❌ Init failed:', e.message);
  process.exit(1);
}
