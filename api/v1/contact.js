/**
 * API Routes — Contact Submissions
 */

import express from 'express';
import { ContactModel } from '../../server/models/Contact.js';
import { AnalyticsModel } from '../../server/models/Analytics.js';
import { hashIp } from '../../server/middleware/auth.js';
import { rateLimit } from '../../server/middleware/rateLimit.js';
import { sendNotification } from '../../server/services/email.js';
import { validateContact } from '../../api/validators/contact.js';

const router = express.Router();

// Public: submit form
router.post('/', rateLimit({ max: 5, windowMs: 60000 }), async (req, res) => {
  const errors = validateContact(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const ip = hashIp(req.ip);

  const submission = ContactModel.create({
    ...req.body,
    ip_address: ip,
    user_agent: req.headers['user-agent'],
    referrer:   req.headers.referer
  });

  AnalyticsModel.recordEvent({
    event_type: 'contact.submit',
    event_name: submission.subject || 'contact',
    session_id: req.sessionID,
    user_id:    null,
    url:        req.originalUrl,
    ip_hash:    ip,
    user_agent: req.headers['user-agent']
  });

  // Fire-and-forget notification
  sendNotification(submission).catch(console.error);

  res.status(201).json({ data: { id: submission.id, uuid: submission.uuid } });
});

// Admin: list
router.get('/', (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'Auth required' });
  next();
}, async (req, res) => {
  const { status, limit, offset } = req.query;
  const submissions = ContactModel.findAll({
    status:  status,
    limit:   parseInt(limit)  || 50,
    offset:  parseInt(offset) || 0
  });
  res.json({ data: submissions, count: submissions.length });
});

router.patch('/:id/read',    async (req, res) => { res.json({ data: ContactModel.markRead(req.params.id) }); });
router.patch('/:id/replied', async (req, res) => { res.json({ data: ContactModel.markReplied(req.params.id) }); });
router.patch('/:id/star',    async (req, res) => { res.json({ data: ContactModel.toggleStar(req.params.id) }); });
router.patch('/:id/archive', async (req, res) => { ContactModel.archive(req.params.id); res.status(204).send(); });
router.patch('/:id/spam',    async (req, res) => { ContactModel.markSpam(req.params.id); res.status(204).send(); });
router.delete('/:id',        async (req, res) => { ContactModel.delete(req.params.id); res.status(204).send(); });

router.get('/meta/stats', async (req, res) => {
  res.json({ data: ContactModel.getStats() });
});

export default router;
