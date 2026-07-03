/**
 * Database connection wrapper
 * Singleton pattern — one connection pool for the whole app
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const DB_PATH    = process.env.DB_PATH || path.join(__dirname, '..', '..', 'database', 'portfolio.db');

class DB {
  constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
  }

  query(sql, params = []) {
    return this.db.prepare(sql).all(params);
  }

  get(sql, params = []) {
    return this.db.prepare(sql).get(params);
  }

  run(sql, params = []) {
    return this.db.prepare(sql).run(params);
  }

  transaction(fn) {
    return this.db.transaction(fn);
  }

  close() {
    this.db.close();
  }
}

export default new DB();
