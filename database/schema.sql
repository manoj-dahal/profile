-- =================================================
-- DATABASE SCHEMA
-- SQLite 3 — drop-in compatible with PostgreSQL/MySQL
-- Run:  sqlite3 portfolio.db < database/schema.sql
-- =================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- =================================================
-- USERS
-- =================================================
CREATE TABLE IF NOT EXISTS users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid            TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  email           TEXT UNIQUE NOT NULL,
  username        TEXT UNIQUE,
  password_hash   TEXT NOT NULL,
  full_name       TEXT,
  role            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','editor','user')),
  avatar_url      TEXT,
  bio             TEXT,
  email_verified  INTEGER DEFAULT 0,
  is_active       INTEGER DEFAULT 1,
  last_login_at   TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- =================================================
-- SESSIONS
-- =================================================
CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ip_address    TEXT,
  user_agent    TEXT,
  payload       TEXT,
  last_activity INTEGER NOT NULL,
  expires_at    TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- =================================================
-- PROJECTS
-- =================================================
CREATE TABLE IF NOT EXISTS projects (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid            TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  subtitle        TEXT,
  description     TEXT,
  icon            TEXT,
  category        TEXT,
  year            INTEGER,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  featured        INTEGER DEFAULT 0,
  order_index     INTEGER DEFAULT 0,
  meta_title      TEXT,
  meta_desc       TEXT,
  og_image        TEXT,
  view_count      INTEGER DEFAULT 0,
  author_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  published_at    TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_projects_slug     ON projects(slug);
CREATE INDEX idx_projects_status   ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_year     ON projects(year);

-- =================================================
-- TAGS
-- =================================================
CREATE TABLE IF NOT EXISTS tags (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  kind       TEXT DEFAULT 'tech' CHECK (kind IN ('tech','topic','language','framework')),
  color      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_tags_kind ON tags(kind);

-- =================================================
-- PROJECT_TAGS (pivot)
-- =================================================
CREATE TABLE IF NOT EXISTS project_tags (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- =================================================
-- PROJECT_HIGHLIGHTS
-- =================================================
CREATE TABLE IF NOT EXISTS project_highlights (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  icon       TEXT,
  text       TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

CREATE INDEX idx_highlights_project_id ON project_highlights(project_id);

-- =================================================
-- SKILLS
-- =================================================
CREATE TABLE IF NOT EXISTS skills (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('ai','systems','build','craft')),
  level       INTEGER DEFAULT 80 CHECK (level BETWEEN 0 AND 100),
  icon        TEXT,
  order_index INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1
);

CREATE INDEX idx_skills_category ON skills(category);

-- =================================================
-- EXPERIENCE (Timeline)
-- =================================================
CREATE TABLE IF NOT EXISTS experiences (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  period_start TEXT NOT NULL,
  period_end   TEXT,
  is_current   INTEGER DEFAULT 0,
  title        TEXT NOT NULL,
  company      TEXT,
  location     TEXT,
  description  TEXT,
  order_index  INTEGER DEFAULT 0
);

-- =================================================
-- CONTACT_SUBMISSIONS
-- =================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid         TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(16)))),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  subject      TEXT,
  message      TEXT NOT NULL,
  ip_address   TEXT,
  user_agent   TEXT,
  referrer     TEXT,
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','archived','spam')),
  is_starred   INTEGER DEFAULT 0,
  metadata     TEXT,  -- JSON
  read_at      TEXT,
  replied_at   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_contact_status     ON contact_submissions(status);
CREATE INDEX idx_contact_created_at ON contact_submissions(created_at);
CREATE INDEX idx_contact_email      ON contact_submissions(email);

-- =================================================
-- ANALYTICS_EVENTS
-- =================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type  TEXT NOT NULL,
  event_name  TEXT,
  session_id  TEXT,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  url         TEXT,
  referrer    TEXT,
  ip_hash     TEXT,  -- hashed, not raw
  user_agent  TEXT,
  country     TEXT,
  device      TEXT,
  browser     TEXT,
  os          TEXT,
  duration_ms INTEGER,
  metadata    TEXT,  -- JSON
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_events_type      ON analytics_events(event_type);
CREATE INDEX idx_events_created   ON analytics_events(created_at);
CREATE INDEX idx_events_session   ON analytics_events(session_id);
CREATE INDEX idx_events_user      ON analytics_events(user_id);

-- =================================================
-- PAGE_VIEWS (denormalized for fast dashboards)
-- =================================================
CREATE TABLE IF NOT EXISTS page_views (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  path        TEXT NOT NULL,
  view_date   TEXT NOT NULL,
  view_count  INTEGER DEFAULT 1,
  unique_visitors INTEGER DEFAULT 1,
  UNIQUE(path, view_date)
);

CREATE INDEX idx_pageviews_date ON page_views(view_date);

-- =================================================
-- SETTINGS (key-value)
-- =================================================
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  type        TEXT DEFAULT 'string' CHECK (type IN ('string','number','boolean','json')),
  description TEXT,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- =================================================
-- AUDIT_LOG
-- =================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  resource    TEXT,
  resource_id TEXT,
  changes     TEXT,  -- JSON diff
  ip_address  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_audit_user  ON audit_log(user_id);
CREATE INDEX idx_audit_date  ON audit_log(created_at);
CREATE INDEX idx_audit_action ON audit_log(action);

-- =================================================
-- TRIGGERS — auto-update updated_at
-- =================================================
CREATE TRIGGER IF NOT EXISTS trg_users_updated
  AFTER UPDATE ON users
  BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS trg_projects_updated
  AFTER UPDATE ON projects
  BEGIN
    UPDATE projects SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

-- =================================================
-- VIEWS — pre-computed for dashboards
-- =================================================
CREATE VIEW IF NOT EXISTS v_project_stats AS
SELECT
  p.id,
  p.slug,
  p.title,
  p.status,
  COUNT(DISTINCT pt.tag_id) as tag_count,
  COUNT(DISTINCT ph.id)    as highlight_count,
  p.view_count,
  p.published_at
FROM projects p
LEFT JOIN project_tags     pt ON pt.project_id = p.id
LEFT JOIN project_highlights ph ON ph.project_id = p.id
GROUP BY p.id;

CREATE VIEW IF NOT EXISTS v_daily_traffic AS
SELECT
  view_date,
  SUM(view_count)       AS total_views,
  SUM(unique_visitors)  AS total_visitors,
  COUNT(DISTINCT path)  AS unique_pages
FROM page_views
WHERE view_date >= date('now', '-30 days')
GROUP BY view_date
ORDER BY view_date DESC;

-- =================================================
-- INITIAL DATA
-- =================================================
INSERT OR IGNORE INTO settings (key, value, type, description) VALUES
  ('site.name',          'Manoj Dahal Portfolio', 'string', 'Site name'),
  ('site.email',         'info@manoj-dahal.com.np', 'string', 'Contact email'),
  ('site.timezone',      'Asia/Katmandu', 'string', 'Default timezone'),
  ('analytics.enabled',  'true', 'boolean', 'Enable analytics tracking'),
  ('contact.notifications', 'true', 'boolean', 'Email on new contact submissions'),
  ('cache.ttl',          '3600', 'number', 'Default cache TTL in seconds');
