/**
 * Main Server Entry Point
 * Express + SQLite + static files
 *
 * Run:  node server/app.js
 * Or:   npm run server
 */

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import projectsRouter  from '../api/v1/projects.js';
import contactRouter   from '../api/v1/contact.js';
import analyticsRouter from '../api/v1/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..', '..');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:    ["'self'", "https://fonts.gstatic.com"],
      scriptSrc:  ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", "data:"]
    }
  }
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Trust proxy (for accurate IPs behind nginx/cloudflare)
app.set('trust proxy', 1);

// ---------- API routes ----------
app.use('/api/v1/projects',  projectsRouter);
app.use('/api/v1/contact',   contactRouter);
app.use('/api/v1/analytics', analyticsRouter);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- Static files ----------
app.use(express.static(ROOT, {
  maxAge: '1y',
  immutable: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

// ---------- Error handling ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error:   err.message || 'Internal Server Error',
    request: req.id
  });
});

app.listen(PORT, () => {
  console.log(`\n  🚀 Portfolio server running:`);
  console.log(`     http://localhost:${PORT}`);
  console.log(`     API: http://localhost:${PORT}/api/v1\n`);
});
