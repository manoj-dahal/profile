/**
 * GraphQL Resolvers
 * Bridges GraphQL operations to the data models
 */

import { GraphQLScalarType, Kind } from 'graphql';
import { ProjectModel } from '../../server/models/Project.js';
import { ContactModel } from '../../server/models/Contact.js';
import { AnalyticsModel } from '../../server/models/Analytics.js';
import db from '../../server/models/index.js';
import { validateContact } from '../../api/validators/contact.js';
import { requireAuth } from '../../server/middleware/auth.js';

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize: (v) => v instanceof Date ? v.toISOString() : v,
  parseValue: (v) => new Date(v),
  parseLiteral: (ast) => ast.kind === Kind.STRING ? new Date(ast.value) : null
});

const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  serialize: (v) => v,
  parseValue: (v) => v,
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING:  return ast.value;
      case Kind.BOOLEAN: return ast.value;
      case Kind.INT:     return parseInt(ast.value);
      case Kind.FLOAT:   return parseFloat(ast.value);
      case Kind.OBJECT:  return parseObjectLit(ast);
      default: return null;
    }
  }
});

function parseObjectLit(ast) {
  const obj = {};
  ast.fields.forEach(f => {
    obj[f.name.value] = f.value.kind === Kind.STRING ? f.value.value : null;
  });
  return obj;
}

export const resolvers = {
  DateTime,
  JSON: JSONScalar,

  Query: {
    health: () => 'ok',

    projects: (_, { status, featured, limit, offset }) =>
      ProjectModel.findAll({
        status: status ? status.toLowerCase() : 'published',
        featured: featured === null ? undefined : featured,
        limit, offset
      }),

    project: (_, { slug }) => ProjectModel.findWithDetails(ProjectModel.findBySlug(slug)?.id),

    projectById: (_, { id }) => ProjectModel.findWithDetails(parseInt(id)),

    featuredProjects: () => ProjectModel.findAll({ status: 'published', featured: true, limit: 10 }),

    projectStats: () => ProjectModel.getStats(),

    skills: (_, { category }) => {
      const sql = category
        ? 'SELECT * FROM skills WHERE category = ? AND is_active = 1 ORDER BY order_index'
        : 'SELECT * FROM skills WHERE is_active = 1 ORDER BY category, order_index';
      return db.query(sql, category ? [category.toLowerCase()] : []);
    },

    skillsByCategory: () => {
      const skills = db.query('SELECT * FROM skills WHERE is_active = 1 ORDER BY order_index');
      const grouped = {};
      for (const s of skills) {
        if (!grouped[s.category]) grouped[s.category] = [];
        grouped[s.category].push(s);
      }
      return grouped;
    },

    experiences: () => db.query('SELECT * FROM experiences ORDER BY order_index'),

    contactSubmissions: (_, { status, limit, offset }) =>
      ContactModel.findAll({ status: status?.toLowerCase(), limit, offset }),

    analyticsSummary: (_, { days }) => AnalyticsModel.getSummary(days),
    analyticsTopPages:  (_, { days, limit }) => AnalyticsModel.getTopPages(days, limit),
    analyticsTopReferrers: (_, { days, limit }) => AnalyticsModel.getTopReferrers(days, limit),
    analyticsTopCountries: (_, { days, limit }) => AnalyticsModel.getTopCountries(days, limit),
    analyticsDaily: (_, { days }) => AnalyticsModel.getDailyTraffic(days)
  },

  Mutation: {
    submitContact: (_, { input }) => {
      const errors = validateContact(input);
      if (errors.length) throw new Error(JSON.stringify(errors));
      return ContactModel.create(input);
    },

    createProject: (_, { input }, ctx) => {
      requireAuth(ctx); // throws if not authed
      return ProjectModel.create(input);
    },

    updateProject: (_, { id, input }, ctx) => {
      requireAuth(ctx);
      return ProjectModel.update(parseInt(id), input);
    },

    publishProject: (_, { id }, ctx) => {
      requireAuth(ctx);
      return ProjectModel.publish(parseInt(id));
    },

    deleteProject: (_, { id }, ctx) => {
      requireAuth(ctx);
      ProjectModel.delete(parseInt(id));
      return true;
    },

    markContactRead: (_, { id }) => ContactModel.markRead(parseInt(id)),
    markContactReplied: (_, { id }) => ContactModel.markReplied(parseInt(id)),
    archiveContact: (_, { id }) => { ContactModel.archive(parseInt(id)); return true; },
    markContactSpam: (_, { id }) => { ContactModel.markSpam(parseInt(id)); return true; },

    trackPageview: (_, { input }, ctx) => {
      AnalyticsModel.recordView(input);
      return true;
    },

    trackEvent: (_, { input }, ctx) => {
      AnalyticsModel.recordEvent(input);
      return true;
    }
  },

  // Field resolvers
  Project: {
    tags: (parent) => db.query(`
      SELECT t.* FROM tags t
      INNER JOIN project_tags pt ON pt.tag_id = t.id
      WHERE pt.project_id = ?
    `, [parent.id]),
    highlights: (parent) => db.query(`
      SELECT * FROM project_highlights WHERE project_id = ? ORDER BY order_index
    `, [parent.id]),
    author: (parent) => parent.author_id ? db.get('SELECT * FROM users WHERE id = ?', [parent.author_id]) : null
  }
};
