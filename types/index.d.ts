/**
 * TypeScript Type Definitions
 * Reference types for the portfolio. Allows migration to TypeScript.
 *
 * Usage:  import type { Project, SiteConfig } from './types/index.d.ts';
 */

// ============================================
// Site Configuration
// ============================================
export interface SiteConfig {
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
  author: string;
  email: string;
  phone: string;
  location: string;
  copyrightYear: number;
  social: SocialLinks;
  navSections: NavSection[];
  roles: string[];
  stats: StatTargets;
  loader: LoaderConfig;
  animation: AnimationConfig;
  features: FeatureFlags;
}

export interface SocialLinks {
  github:   string;
  linkedin: string;
  twitter:  string;
  dribbble: string;
}

export interface NavSection {
  id: string;
  label: string;
}

export interface StatTargets {
  projects:    number;
  domains:     number;
  technologies: number;
  passion:     number;
}

export interface LoaderConfig {
  hideAfter: number;
}

export interface AnimationConfig {
  counterDuration: number;
  typewriterDelay: number;
}

export interface FeatureFlags {
  customCursor:      boolean;
  magneticHover:     boolean;
  tilt3D:            boolean;
  particleBackground: boolean;
  lightning:         boolean;
  smoothScroll:      boolean;
  activeNav:         boolean;
  parallax:          boolean;
}

// ============================================
// Project Domain
// ============================================
export interface Project {
  title: string;
  icon: string;
  desc: string;
  tags: string[];
  highlights: string[];
}

export type ProjectKey = 'ai' | 'os' | 'game' | 'vision' | 'sec' | 'ux';

export type ProjectsMap = Record<ProjectKey, Project>;

// ============================================
// Skills Domain
// ============================================
export type SkillCategory = 'ai' | 'systems' | 'build' | 'craft';

export interface SkillsCategory {
  id: SkillCategory;
  icon: string;
  title: string;
  sub: string;
  skills: string[];
}

export type SkillsByCategory = Record<SkillCategory, SkillsCategory>;

// ============================================
// Contact Domain
// ============================================
export type ContactKind = 'phone' | 'email' | 'website' | 'location';

export interface ContactInfo {
  kind:     ContactKind;
  label:    string;
  value:    string;
  href?:    string;
  iconPath: string;
}

export interface FormState {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

// ============================================
// Component Prop Types
// ============================================
export interface ButtonProps {
  variant?:    'primary' | 'ghost' | 'neon';
  magnetic?:   boolean;
  href?:       string;
  onClick?:    (e: MouseEvent) => void;
  children:    string | Node;
}

export interface SkillProps {
  label: string;
  magnetic?: boolean;
}

export interface ProjectCardProps {
  project:  Project;
  onOpen:   (key: ProjectKey) => void;
}

export interface ModalProps {
  open:    boolean;
  onClose: () => void;
  project?: Project;
}

// ============================================
// Cursor System
// ============================================
export interface CursorPosition {
  x: number;
  y: number;
}

export interface ParticleData {
  x:       number;
  y:       number;
  size:    number;
  speedX:  number;
  speedY:  number;
  opacity: number;
  color:   string;
}

export interface RippleData {
  id:      number;
  x:       number;
  y:       number;
  size:    number;
  delay:   number;
}

// ============================================
// Canvas / Animation
// ============================================
export interface CanvasContext {
  ctx:     CanvasRenderingContext2D;
  width:   number;
  height:  number;
}

export interface MousePosition {
  x: number;
  y: number;
}
