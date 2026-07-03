-- Migration Tracker
-- Run this to check which migrations have been applied

CREATE TABLE IF NOT EXISTS _migrations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT UNIQUE NOT NULL,
  applied_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- To apply a migration manually:
--   INSERT INTO _migrations (name) VALUES ('001_initial.sql');
--   sqlite3 portfolio.db < database/migrations/001_initial.sql
