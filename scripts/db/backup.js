#!/usr/bin/env node
/**
 * Database backup script
 * Creates a timestamped copy of the SQLite database
 *
 * Run:  node scripts/db/backup.js [--upload]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DB   = path.join(ROOT, 'database', 'portfolio.db');
const DIR  = path.join(ROOT, 'database', 'backups');

if (!fs.existsSync(DB)) {
  console.error('❌ No database found at', DB);
  process.exit(1);
}

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
const backupFile = path.join(DIR, `portfolio_${timestamp}.db`);

console.log(`📦 Backing up database...`);
console.log(`   ${DB}`);
console.log(`   → ${backupFile}`);

try {
  // Use sqlite3's backup command (safe, atomic)
  execSync(`sqlite3 "${DB}" ".backup '${backupFile}'"`, { stdio: 'inherit' });

  // Verify
  const stats = fs.statSync(backupFile);
  console.log(`✅ Backup complete (${(stats.size / 1024).toFixed(1)} KB)`);

  // Optional: gzip
  if (process.argv.includes('--gzip')) {
    execSync(`gzip "${backupFile}"`);
    console.log(`✅ Compressed`);
  }

  // Optional: upload to S3
  if (process.argv.includes('--upload')) {
    try {
      const s3Path = `s3://${process.env.S3_BUCKET || 'portfolio-backups'}/${path.basename(backupFile)}`;
      execSync(`aws s3 cp "${backupFile}" "${s3Path}"`, { stdio: 'inherit' });
      console.log(`✅ Uploaded to ${s3Path}`);
    } catch (e) {
      console.error('❌ Upload failed:', e.message);
    }
  }

  // Cleanup old backups (keep last 30)
  const backups = fs.readdirSync(DIR)
    .filter(f => f.startsWith('portfolio_') && f.endsWith('.db'))
    .map(f => ({ name: f, time: fs.statSync(path.join(DIR, f)).mtime }))
    .sort((a, b) => b.time - a.time);

  if (backups.length > 30) {
    const toDelete = backups.slice(30);
    for (const b of toDelete) {
      fs.unlinkSync(path.join(DIR, b.name));
      console.log(`🗑 Deleted old backup: ${b.name}`);
    }
  }
} catch (e) {
  console.error('❌ Backup failed:', e.message);
  process.exit(1);
}
