#!/usr/bin/env node
/**
 * Database migration runner
 * Applies any unapplied migrations from database/migrations/
 *
 * Run:  node scripts/db/migrate.js
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DB   = path.join(ROOT, 'database', 'portfolio.db');
const MIGRATIONS_DIR = path.join(ROOT, 'database', 'migrations');
const TRACKER = path.join(MIGRATIONS_DIR, '_tracker.sql');

if (!fs.existsSync(DB)) {
  console.error('❌ Database not initialized. Run: node scripts/db/init.js');
  process.exit(1);
}

// Initialize tracker if not present
execSync(`sqlite3 "${DB}" < "${TRACKER}"`, { stdio: 'ignore' });

// Get applied migrations
const applied = execSync(`sqlite3 "${DB}" "SELECT name FROM _migrations ORDER BY name"`, { stdio: ['ignore', 'pipe', 'ignore'] })
  .toString().trim().split('\n').filter(Boolean);

// Get all migration files
const all = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.endsWith('.sql') && f !== '_tracker.sql')
  .sort();

const pending = all.filter(m => !applied.includes(m));

if (!pending.length) {
  console.log('✅ No pending migrations');
  process.exit(0);
}

console.log(`📦 Applying ${pending.length} migration(s)...`);

for (const file of pending) {
  console.log(`  → ${file}`);
  try {
    execSync(`sqlite3 "${DB}" < "${path.join(MIGRATIONS_DIR, file)}"`, { stdio: 'inherit' });
    const safeName = file.replace(/'/g, "''");
    execSync(`sqlite3 "${DB}" "INSERT INTO _migrations (name) VALUES ('${safeName}')"`, { stdio: 'ignore' });
    console.log(`  ✅ Applied`);
  } catch (e) {
    console.error(`  ❌ Failed: ${e.message}`);
    process.exit(1);
  }
}

console.log(`\n✅ Migrations complete`);
