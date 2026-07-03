/**
 * API Routes — Analytics
 */

import express from 'express';
import { AnalyticsModel } from '../../server/models/Analytics.js';
import { hashIp } from '../../server/middleware/auth.js';
import { rateLimit } from '../../server/middleware/rateLimit.js';

const router = express.Router();

// Public: track pageview
router.post('/pageview', rateLimit({ max: 30, windowMs: 60000 }), async (req, res) => {
  const { path, referrer, country, device, browser, os, session_id, user_id } = req.body;
  const ip_hash = hashIp(req.ip);

  AnalyticsModel.recordView({ path, ip_hash, user_agent: req.headers['user-agent'], referrer, session_id, user_id, country });
  AnalyticsModel.recordEvent({
    event_type: 'pageview',
    url:        path,
    referrer,
    ip_hash,
    user_agent: req.headers['user-agent'],
    country, device, browser, os,
    session_id, user_id
  });

  res.status(204).send();
});

// Public: track event
router.post('/event', rateLimit({ max: 60, windowMs: 60000 }), async (req, res) => {
  const { event_type, event_name, url, metadata, session_id, user_id, duration_ms, country, device, browser, os } = req.body;
  const ip_hash = hashIp(req.ip);

  AnalyticsModel.recordEvent({
    event_type, event_name, url, metadata, session_id, user_id, duration_ms,
    ip_hash, user_agent: req.headers['user-agent'], country, device, browser, os
  });

  res.status(204).send();
});

// Admin: dashboard data
router.get('/summary',     async (req, res) => res.json({ data: AnalyticsModel.getSummary() }));
router.get('/daily',       async (req, res) => res.json({ data: AnalyticsModel.getDailyTraffic(parseInt(req.query.days) || 30) }));
router.get('/top-pages',   async (req, res) => res.json({ data: AnalyticsModel.getTopPages(parseInt(req.query.days) || 30) }));
router.get('/top-referrers', async (req, res) => res.json({ data: AnalyticsModel.getTopReferrers(parseInt(req.query.days) || 30) }));
router.get('/top-countries', async (req, res) => res.json({ data: AnalyticsModel.getTopCountries(parseInt(req.query.days) || 30) }));
router.get('/devices',     async (req, res) => res.json({ data: AnalyticsModel.getDeviceBreakdown(parseInt(req.query.days) || 30) }));
router.get('/realtime',    async (req, res) => res.json({ data: AnalyticsModel.getRealtimeVisitors() }));

export default router;
