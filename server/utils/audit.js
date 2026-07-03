/**
 * Audit Logger
 * Records all admin actions for compliance / debugging
 */

import db from '../models/index.js';

export function auditLog(userId, action, resource, resourceId, changes) {
  return db.run(`
    INSERT INTO audit_log (user_id, action, resource, resource_id, changes, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    userId,
    action,
    resource,
    String(resourceId || ''),
    changes ? JSON.stringify(changes) : null,
    null
  ]);
}

export function getRecentLogs(limit = 100) {
  return db.query(`
    SELECT al.*, u.email as user_email
    FROM audit_log al
    LEFT JOIN users u ON u.id = al.user_id
    ORDER BY al.created_at DESC
    LIMIT ?
  `, [limit]);
}
