/**
 * Project Model
 * CRUD operations for projects table
 */

import db from './index.js';

export class ProjectModel {
  static findAll({ status = 'published', featured, limit = 50, offset = 0 } = {}) {
    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = {};

    if (status) { sql += ' AND status = @status'; params.status = status; }
    if (featured !== undefined) { sql += ' AND featured = @featured'; params.featured = featured ? 1 : 0; }

    sql += ' ORDER BY order_index ASC, created_at DESC LIMIT @limit OFFSET @offset';
    params.limit = limit;
    params.offset = offset;

    return db.query(sql, params);
  }

  static findBySlug(slug) {
    return db.get('SELECT * FROM projects WHERE slug = ?', [slug]);
  }

  static findById(id) {
    return db.get('SELECT * FROM projects WHERE id = ?', [id]);
  }

  static findByUuid(uuid) {
    return db.get('SELECT * FROM projects WHERE uuid = ?', [uuid]);
  }

  static findWithDetails(id) {
    const project = this.findById(id);
    if (!project) return null;

    project.tags = db.query(`
      SELECT t.* FROM tags t
      INNER JOIN project_tags pt ON pt.tag_id = t.id
      WHERE pt.project_id = ?
      ORDER BY t.name
    `, [id]);

    project.highlights = db.query(`
      SELECT * FROM project_highlights
      WHERE project_id = ?
      ORDER BY order_index ASC
    `, [id]);

    return project;
  }

  static create(data) {
    const sql = `
      INSERT INTO projects (slug, title, subtitle, description, icon, category, year, status, featured, order_index, meta_title, meta_desc, og_image, author_id)
      VALUES (@slug, @title, @subtitle, @description, @icon, @category, @year, @status, @featured, @order_index, @meta_title, @meta_desc, @og_image, @author_id)
    `;
    const result = db.run(sql, {
      slug: data.slug,
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      icon: data.icon || null,
      category: data.category || null,
      year: data.year || new Date().getFullYear(),
      status: data.status || 'draft',
      featured: data.featured ? 1 : 0,
      order_index: data.order_index || 0,
      meta_title: data.meta_title || null,
      meta_desc: data.meta_desc || null,
      og_image: data.og_image || null,
      author_id: data.author_id || null
    });
    return this.findById(result.lastInsertRowid);
  }

  static update(id, data) {
    const allowed = ['title','subtitle','description','icon','category','year','status','featured','order_index','meta_title','meta_desc','og_image'];
    const sets = [];
    const params = { id };

    for (const key of allowed) {
      if (key in data) {
        sets.push(`${key} = @${key}`);
        params[key] = data[key];
      }
    }
    if (sets.length === 0) return this.findById(id);

    const sql = `UPDATE projects SET ${sets.join(', ')} WHERE id = @id`;
    db.run(sql, params);
    return this.findById(id);
  }

  static publish(id) {
    db.run(`UPDATE projects SET status = 'published', published_at = datetime('now') WHERE id = ?`, [id]);
    return this.findById(id);
  }

  static incrementViews(id) {
    db.run(`UPDATE projects SET view_count = view_count + 1 WHERE id = ?`, [id]);
  }

  static delete(id) {
    return db.run('DELETE FROM projects WHERE id = ?', [id]);
  }

  static getStats() {
    return db.get(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'draft'     THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN featured = 1         THEN 1 ELSE 0 END) as featured,
        SUM(view_count) as total_views
      FROM projects
    `);
  }
}
