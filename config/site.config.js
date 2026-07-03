/**
 * Site Configuration
 * Central place to update content that appears in multiple places.
 * Used by main.js, build scripts, and SEO generators.
 */
export const siteConfig = {
  name: 'Manoj Dahal',
  shortName: 'Manoj Dahal',
  title: 'Manoj Dahal — AI Engineer · Software · Game · UI/UX',
  tagline: 'Building the future of intelligence',
  description: 'AI systems, immersive 3D experiences, futuristic OS concepts, and next-generation digital products.',
  url: 'https://manoj-dahal.com.np',
  author: 'Manoj Dahal',
  email: 'info@manoj-dahal.com.np',
  phone: '+977 9761463134',
  location: 'Nepal',
  copyrightYear: 2026,

  // Social links
  social: {
    github:   'https://github.com/manojdahal',
    linkedin: 'https://linkedin.com/in/manojdahal',
    twitter:  'https://twitter.com/manojdahal',
    dribbble: 'https://dribbble.com/manojdahal'
  },

  // Sections shown in nav (order matters)
  navSections: [
    { id: 'home',     label: 'Home' },
    { id: 'about',    label: 'About' },
    { id: 'skills',   label: 'Skills' },
    { id: 'projects', label: 'Work' },
    { id: 'process',  label: 'Process' },
    { id: 'contact',  label: 'Contact' }
  ],

  // Hero roles cycled by the typewriter
  roles: [
    'AI Engineer',
    'Software Developer',
    'Game Developer',
    'Algorithm Designer',
    'UI/UX Designer',
    'Ethical Hacker'
  ],

  // Stat counters (target values)
  stats: {
    projects: 50,
    domains: 6,
    technologies: 30,
    passion: 100
  },

  // Loader timing (ms)
  loader: {
    hideAfter: 2500
  },

  // Animation timing (ms)
  animation: {
    counterDuration: 2000,
    typewriterDelay: 2700
  },

  // Feature flags
  features: {
    customCursor: true,
    magneticHover: true,
    tilt3D: true,
    particleBackground: true,
    lightning: true,
    smoothScroll: true,
    activeNav: true,
    parallax: true
  }
};

// Make available globally for non-module scripts
if (typeof window !== 'undefined') {
  window.siteConfig = siteConfig;
}
