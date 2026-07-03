/**
 * Contact Submission Model
 */

import db from './index.js';

export class ContactModel {
  static findAll({ status, limit = 50, offset = 0 } = {}) {
    let sql = 'SELECT * FROM contact_submissions WHERE 1=1';
    const params = { limit, offset };

    if (status) { sql += ' AND status = @status'; params.status = status; }
    sql += ' ORDER BY created_at DESC LIMIT @limit OFFSET @offset';
    return db.query(sql, params);
  }

  static findById(id) {
    return db.get('SELECT * FROM contact_submissions WHERE id = ?', [id]);
  }

  static create({ name, email, subject, message, ip_address, user_agent, referrer }) {
    const result = db.run(`
      INSERT INTO contact_submissions (name, email, subject, message, ip_address, user_agent, referrer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, email, subject, message, ip_address, user_agent, referrer]);
    return this.findById(result.lastInsertRowid);
  }

  static markRead(id) {
    db.run(`UPDATE contact_submissions SET status = 'read', read_at = datetime('now') WHERE id = ?`, [id]);
    return this.findById(id);
  }

  static markReplied(id) {
    db.run(`UPDATE contact_submissions SET status = 'replied', replied_at = datetime('now') WHERE id = ?`, [id]);
    return this.findById(id);
  }

  static toggleStar(id) {
    db.run(`UPDATE contact_submissions SET is_starred = 1 - is_starred WHERE id = ?`, [id]);
    return this.findById(id);
  }

  static archive(id) {
    db.run(`UPDATE contact_submissions SET status = 'archived' WHERE id = ?`, [id]);
  }

  static markSpam(id) {
    db.run(`UPDATE contact_submissions SET status = 'spam' WHERE id = ?`, [id]);
  }

  static delete(id) {
    return db.run('DELETE FROM contact_submissions WHERE id = ?', [id]);
  }

  static getStats() {
    return db.get(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new'     THEN 1 ELSE 0 END) as new_count,
        SUM(CASE WHEN status = 'read'    THEN 1 ELSE 0 END) as read_count,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_count,
        SUM(CASE WHEN status = 'spam'    THEN 1 ELSE 0 END) as spam_count
      FROM contact_submissions
    `);
  }
}
