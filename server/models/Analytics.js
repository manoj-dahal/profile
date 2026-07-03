/**
 * Analytics Model
 * Tracks page views and custom events
 */

import db from './index.js';

export class AnalyticsModel {
  static recordView({ path, ip_hash, user_agent, country, referrer, session_id, user_id }) {
    const today = new Date().toISOString().split('T')[0];
    db.run(`
      INSERT INTO page_views (path, view_date, view_count, unique_visitors)
      VALUES (?, ?, 1, 1)
      ON CONFLICT(path, view_date)
      DO UPDATE SET view_count = view_count + 1
    `, [path, today]);

    return db.get('SELECT * FROM page_views WHERE path = ? AND view_date = ?', [path, today]);
  }

  static recordEvent({ event_type, event_name, session_id, user_id, url, referrer, ip_hash, user_agent, country, device, browser, os, duration_ms, metadata }) {
    const result = db.run(`
      INSERT INTO analytics_events (
        event_type, event_name, session_id, user_id, url, referrer,
        ip_hash, user_agent, country, device, browser, os, duration_ms, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [event_type, event_name, session_id, user_id, url, referrer, ip_hash, user_agent, country, device, browser, os, duration_ms, JSON.stringify(metadata || {})]);
    return result.lastInsertRowid;
  }

  static getDailyTraffic(days = 30) {
    return db.query(`
      SELECT * FROM v_daily_traffic LIMIT ?
    `, [days]);
  }

  static getTopPages(days = 30, limit = 10) {
    return db.query(`
      SELECT path, SUM(view_count) as views, SUM(unique_visitors) as visitors
      FROM page_views
      WHERE view_date >= date('now', ?)
      GROUP BY path
      ORDER BY views DESC
      LIMIT ?
    `, [`-${days} days`, limit]);
  }

  static getTopReferrers(days = 30, limit = 10) {
    return db.query(`
      SELECT referrer, COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'pageview'
        AND referrer IS NOT NULL
        AND referrer != ''
        AND created_at >= datetime('now', ?)
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT ?
    `, [`-${days} days`, limit]);
  }

  static getTopCountries(days = 30, limit = 10) {
    return db.query(`
      SELECT country, COUNT(*) as count
      FROM analytics_events
      WHERE country IS NOT NULL
        AND created_at >= datetime('now', ?)
      GROUP BY country
      ORDER BY count DESC
      LIMIT ?
    `, [`-${days} days`, limit]);
  }

  static getDeviceBreakdown(days = 30) {
    return db.query(`
      SELECT
        device,
        browser,
        os,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= datetime('now', ?)
      GROUP BY device, browser, os
      ORDER BY count DESC
      LIMIT 20
    `, [`-${days} days`]);
  }

  static getRealtimeVisitors() {
    return db.query(`
      SELECT session_id, url, MAX(created_at) as last_seen
      FROM analytics_events
      WHERE created_at >= datetime('now', '-5 minutes')
      GROUP BY session_id
      ORDER BY last_seen DESC
    `);
  }

  static getSummary(days = 30) {
    const views    = db.get(`SELECT SUM(view_count) as total FROM page_views WHERE view_date >= date('now', ?)`, [`-${days} days`]);
    const visitors = db.get(`SELECT SUM(unique_visitors) as total FROM page_views WHERE view_date >= date('now', ?)`, [`-${days} days`]);
    const events   = db.get(`SELECT COUNT(*) as total FROM analytics_events WHERE created_at >= datetime('now', ?)`, [`-${days} days`]);

    return {
      pageviews: views?.total || 0,
      visitors:  visitors?.total || 0,
      events:    events?.total || 0,
      period:    `${days} days`
    };
  }
}
