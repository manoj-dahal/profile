/**
 * API Routes — Projects
 * Public read, admin write
 */

import express from 'express';
import { ProjectModel } from '../../server/models/Project.js';
import { requireAuth, requireRole } from '../../server/middleware/auth.js';
import { rateLimit } from '../../server/middleware/rateLimit.js';
import { auditLog } from '../../server/utils/audit.js';

const router = express.Router();

// List all projects
router.get('/', rateLimit({ max: 100 }), async (req, res) => {
  const { status, featured, limit, offset } = req.query;
  const projects = ProjectModel.findAll({
    status:     status     || 'published',
    featured:   featured === 'true' ? true : featured === 'false' ? false : undefined,
    limit:      parseInt(limit)  || 50,
    offset:     parseInt(offset) || 0
  });
  res.json({ data: projects, count: projects.length });
});

// Get single project by slug
router.get('/:slug', rateLimit({ max: 200 }), async (req, res) => {
  const project = ProjectModel.findBySlug(req.params.slug);
  if (!project) return res.status(404).json({ error: 'Not found' });

  ProjectModel.incrementViews(project.id);
  const detailed = ProjectModel.findWithDetails(project.id);
  res.json({ data: detailed });
});

// Create project (admin only)
router.post('/', requireAuth, requireRole('admin','editor'), async (req, res) => {
  const project = ProjectModel.create({ ...req.body, author_id: req.user.id });
  auditLog(req.user.id, 'project.create', 'project', project.id);
  res.status(201).json({ data: project });
});

// Update project
router.patch('/:id', requireAuth, requireRole('admin','editor'), async (req, res) => {
  const project = ProjectModel.update(parseInt(req.params.id), req.body);
  if (!project) return res.status(404).json({ error: 'Not found' });
  auditLog(req.user.id, 'project.update', 'project', project.id, req.body);
  res.json({ data: project });
});

// Publish project
router.post('/:id/publish', requireAuth, requireRole('admin','editor'), async (req, res) => {
  const project = ProjectModel.publish(parseInt(req.params.id));
  auditLog(req.user.id, 'project.publish', 'project', project.id);
  res.json({ data: project });
});

// Delete project
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  ProjectModel.delete(parseInt(req.params.id));
  auditLog(req.user.id, 'project.delete', 'project', req.params.id);
  res.status(204).send();
});

// Stats
router.get('/meta/stats', requireAuth, async (req, res) => {
  res.json({ data: ProjectModel.getStats() });
});

export default router;
