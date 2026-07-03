/**
 * Authentication Middleware
 * JWT-based with optional API key fallback
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-please';
const API_KEY    = process.env.API_KEY    || 'change-me-in-production-please';

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
}

export function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex') === hash);
    });
  });
}

export function hashIp(ip) {
  return crypto.createHash('sha256').update(ip + 'salt').digest('hex');
}

/**
 * Middleware: require authentication
 */
export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Bearer token
  if (auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = payload;
    return next();
  }

  // API key
  if (auth === `ApiKey ${API_KEY}`) {
    req.user = { id: 0, role: 'admin', apiKey: true };
    return next();
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}

/**
 * Middleware: require specific role
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
