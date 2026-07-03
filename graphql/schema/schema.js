/**
 * GraphQL Schema
 * SDL (Schema Definition Language) for the portfolio
 *
 * Tools this enables:
 *   - Apollo Server, GraphQL Yoga, Mercurius, express-graphql
 *   - Codegen for typed clients
 *   - GraphiQL playground at /graphql
 */

export const typeDefs = /* GraphQL */ `
  scalar DateTime
  scalar JSON

  # ---------- Enums ----------
  enum ProjectStatus { DRAFT PUBLISHED ARCHIVED }
  enum ProjectCategory { AI SYSTEMS GRAPHICS SECURITY DESIGN }
  enum SkillCategory { AI SYSTEMS BUILD CRAFT }
  enum UserRole { ADMIN EDITOR USER }
  enum ContactStatus { NEW READ REPLIED ARCHIVED SPAM }
  enum EventType { PAGEVIEW CLICK SCROLL SUBMIT CUSTOM }

  # ---------- Types ----------
  type User {
    id: ID!
    uuid: String!
    email: String!
    username: String
    fullName: String
    role: UserRole!
    avatarUrl: String
    bio: String
    lastLoginAt: DateTime
    createdAt: DateTime!
  }

  type Tag {
    id: ID!
    slug: String!
    name: String!
    kind: String
    color: String
  }

  type ProjectHighlight {
    id: ID!
    icon: String
    text: String!
    orderIndex: Int!
  }

  type Project {
    id: ID!
    uuid: String!
    slug: String!
    title: String!
    subtitle: String
    description: String
    icon: String
    category: ProjectCategory
    year: Int
    status: ProjectStatus!
    featured: Boolean!
    orderIndex: Int!
    metaTitle: String
    metaDesc: String
    ogImage: String
    viewCount: Int!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    tags: [Tag!]!
    highlights: [ProjectHighlight!]!
    author: User
  }

  type Skill {
    id: ID!
    slug: String!
    name: String!
    category: SkillCategory!
    level: Int!
    icon: String
    orderIndex: Int!
  }

  type Experience {
    id: ID!
    periodStart: String!
    periodEnd: String
    isCurrent: Boolean!
    title: String!
    company: String
    location: String
    description: String
  }

  type ContactSubmission {
    id: ID!
    uuid: String!
    name: String!
    email: String!
    subject: String
    message: String!
    status: ContactStatus!
    isStarred: Boolean!
    readAt: DateTime
    repliedAt: DateTime
    createdAt: DateTime!
  }

  type AnalyticsEvent {
    id: ID!
    eventType: EventType!
    eventName: String
    url: String
    referrer: String
    country: String
    device: String
    browser: String
    os: String
    durationMs: Int
    metadata: JSON
    createdAt: DateTime!
  }

  type ProjectStats {
    total: Int!
    published: Int!
    draft: Int!
    featured: Int!
    totalViews: Int!
  }

  type AnalyticsSummary {
    pageviews: Int!
    visitors: Int!
    events: Int!
    period: String!
  }

  # ---------- Queries ----------
  type Query {
    # Health
    health: String!

    # Projects
    projects(status: ProjectStatus, featured: Boolean, limit: Int = 50, offset: Int = 0): [Project!]!
    project(slug: String!): Project
    projectById(id: ID!): Project
    featuredProjects: [Project!]!
    projectStats: ProjectStats!

    # Skills
    skills(category: SkillCategory): [Skill!]!
    skillsByCategory: JSON!

    # Experience
    experiences: [Experience!]!

    # Contact (admin)
    contactSubmissions(status: ContactStatus, limit: Int = 50, offset: Int = 0): [ContactSubmission!]!

    # Analytics (admin)
    analyticsSummary(days: Int = 30): AnalyticsSummary!
    analyticsTopPages(days: Int = 30, limit: Int = 10): JSON!
    analyticsTopReferrers(days: Int = 30, limit: Int = 10): JSON!
    analyticsTopCountries(days: Int = 30, limit: Int = 10): JSON!
    analyticsDaily(days: Int = 30): JSON!
  }

  # ---------- Mutations ----------
  type Mutation {
    # Contact
    submitContact(input: ContactInput!): ContactSubmission!

    # Projects (admin)
    createProject(input: ProjectInput!): Project!
    updateProject(id: ID!, input: ProjectInput!): Project!
    publishProject(id: ID!): Project!
    deleteProject(id: ID!): Boolean!

    # Contact management (admin)
    markContactRead(id: ID!): ContactSubmission!
    markContactReplied(id: ID!): ContactSubmission!
    archiveContact(id: ID!): Boolean!
    markContactSpam(id: ID!): Boolean!

    # Analytics tracking
    trackPageview(input: PageviewInput!): Boolean!
    trackEvent(input: EventInput!): Boolean!
  }

  # ---------- Inputs ----------
  input ContactInput {
    name: String!
    email: String!
    subject: String
    message: String!
  }

  input ProjectInput {
    slug: String!
    title: String!
    subtitle: String
    description: String
    icon: String
    category: ProjectCategory
    year: Int
    status: ProjectStatus
    featured: Boolean
    orderIndex: Int
    metaTitle: String
    metaDesc: String
    ogImage: String
    tagIds: [ID!]
    highlights: [HighlightInput!]
  }

  input HighlightInput {
    icon: String
    text: String!
    orderIndex: Int
  }

  input PageviewInput {
    path: String!
    referrer: String
    country: String
    device: String
    browser: String
    os: String
    sessionId: String
  }

  input EventInput {
    eventType: EventType!
    eventName: String
    url: String
    sessionId: String
    metadata: JSON
    durationMs: Int
  }
`;
