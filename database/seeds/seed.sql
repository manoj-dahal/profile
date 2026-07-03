-- =================================================
-- SEED DATA
-- Initial data for the portfolio
-- Run AFTER schema.sql:  sqlite3 portfolio.db < database/seeds/seed.sql
-- =================================================

-- =================================================
-- TAGS
-- =================================================
INSERT OR IGNORE INTO tags (slug, name, kind, color) VALUES
  ('python',         'Python',         'language',   '#3776ab'),
  ('cpp',            'C++',            'language',   '#00599c'),
  ('rust',           'Rust',           'language',   '#dea584'),
  ('typescript',     'TypeScript',     'language',   '#3178c6'),
  ('javascript',     'JavaScript',     'language',   '#f7df1e'),
  ('go',             'Go',             'language',   '#00add8'),
  ('pytorch',        'PyTorch',        'framework',  '#ee4c2c'),
  ('tensorflow',     'TensorFlow',     'framework',  '#ff6f00'),
  ('react',          'React',          'framework',  '#61dafb'),
  ('nextjs',         'Next.js',        'framework',  '#000000'),
  ('three-js',       'Three.js',       'framework',  '#049ef4'),
  ('webgl',          'WebGL',          'tech',       '#990000'),
  ('opencv',         'OpenCV',         'framework',  '#5c3ee8'),
  ('ai',             'AI',             'topic',      '#00f0ff'),
  ('ml',             'Machine Learning', 'topic',    '#b400ff'),
  ('dl',             'Deep Learning',  'topic',      '#ff00aa'),
  ('llm',            'LLMs',           'topic',      '#7a00ff'),
  ('computer-vision','Computer Vision','topic',      '#3a7bff'),
  ('cybersecurity',  'Cybersecurity',  'topic',      '#00ff88'),
  ('game-dev',       'Game Development','topic',     '#ff8800'),
  ('ui-ux',          'UI/UX',          'topic',      '#ff00aa'),
  ('robotics',       'Robotics',       'topic',      '#888888');

-- =================================================
-- SKILLS
-- =================================================
INSERT OR IGNORE INTO skills (slug, name, category, level, order_index) VALUES
  -- AI category
  ('ai',                  'AI',                  'ai',      95, 1),
  ('agi',                 'AGI Research',        'ai',      88, 2),
  ('ai-brain',            'AI Brain Architecture','ai',      85, 3),
  ('ml',                  'Machine Learning',     'ai',      92, 4),
  ('dl',                  'Deep Learning',        'ai',      90, 5),
  ('llm',                 'LLMs',                 'ai',      87, 6),
  ('voice-ai',            'Voice AI',             'ai',      80, 7),
  ('cv',                  'Computer Vision',      'ai',      88, 8),
  ('neural-nets',         'Neural Networks',      'ai',      90, 9),
  ('automation',          'Automation',           'ai',      92, 10),

  -- Systems category
  ('algorithms',          'Algorithm Design',     'systems', 95, 1),
  ('chip-arch',           'Chip Architecture',    'systems', 78, 2),
  ('energy-core',         'Energy Core Systems',  'systems', 80, 3),
  ('os-design',           'Operating System Design','systems',82, 4),
  ('cloud',               'Cloud Computing',      'systems', 85, 5),
  ('robotics',            'Robotics',             'systems', 75, 6),
  ('python-sys',          'Python',               'systems', 95, 7),
  ('cpp-sys',             'C++',                  'systems', 90, 8),
  ('java-sys',            'Java',                 'systems', 80, 9),
  ('nodejs-sys',          'Node.js',              'systems', 85, 10),

  -- Build category
  ('software',            'Software Development', 'build',   95, 1),
  ('game-dev',            'Game Development',     'build',   90, 2),
  ('graphics',            'Graphics Programming', 'build',   88, 3),
  ('3d-dev',              '3D Development',       'build',   85, 4),
  ('three-js',            'Three.js',             'build',   90, 5),
  ('react',               'React',                'build',   90, 6),
  ('nextjs',              'Next.js',              'build',   85, 7),
  ('typescript',          'TypeScript',           'build',   88, 8),
  ('fullstack',           'Full Stack',           'build',   92, 9),
  ('webgl',               'WebGL',                'build',   82, 10),

  -- Craft category
  ('ui-ux',               'UI/UX Design',         'craft',   90, 1),
  ('graphic',             'Graphic Design',       'craft',   80, 2),
  ('motion',              'Motion Graphics',      'craft',   82, 3),
  ('security',            'Cyber Security',       'craft',   85, 4),
  ('hacking',             'Ethical Hacking',      'craft',   82, 5),
  ('figma',               'Figma',                'craft',   88, 6),
  ('prototyping',         'Prototyping',          'craft',   85, 7),
  ('design-systems',      'Design Systems',       'craft',   80, 8);

-- =================================================
-- EXPERIENCE (Timeline)
-- =================================================
INSERT OR IGNORE INTO experiences (id, period_start, period_end, is_current, title, description, order_index) VALUES
  (1, '2026-01', NULL,        1, 'Independent AI & Software Engineer', 'Designing AI systems, game engines, OS concepts, and futuristic UI/UX experiences for clients worldwide.', 1),
  (2, '2024-01', '2025-12',   0, 'Full Stack · AI · Game Development', 'Built production-grade apps, custom algorithms, neural networks, and 3D interactive experiences.', 2),
  (3, '2022-01', '2023-12',   0, 'Cybersecurity & Algorithm Research', 'Explored ethical hacking, advanced algorithms, optimization theory, and chip architecture concepts.', 3);

-- =================================================
-- PROJECTS
-- =================================================
INSERT OR IGNORE INTO projects (id, slug, title, subtitle, description, icon, category, year, status, featured, order_index, meta_title, meta_desc) VALUES
  (1, 'agi-core',  'AGI Core',  'Neural Reasoning Engine', 'A research-driven project exploring next-generation reasoning systems that combine energy-efficient neural pathways, self-improving agent loops, and symbolic-neural hybrid architectures.', 'AI', 'ai',  2026, 'published', 1, 1, 'AGI Core — Neural Reasoning Engine', 'Custom reasoning architecture for next-gen AI.'),
  (2, 'nexus-os',  'NEXUS OS',  'Vision Pro Inspired UI',  'A futuristic operating system concept that reimagines how humans interact with computers.',                                                        'OS', 'systems', 2026, 'published', 1, 2, 'NEXUS OS', 'Futuristic OS concept with glass UI.'),
  (3, 'aether',    'AETHER',    'Immersive 3D Game Engine','Browser-native 3D game engine pushing the limits of WebGL with real-time ray tracing.',                                                          '3D', 'graphics', 2025, 'published', 1, 3, 'AETHER Engine', 'Browser 3D game engine.'),
  (4, 'argus',     'ARGUS',     'Vision Intelligence',     'Real-time computer vision pipeline for object detection, tracking, and scene understanding on edge devices.',                                'CV', 'ai',     2025, 'published', 0, 4, 'ARGUS Vision', 'Real-time CV on edge devices.'),
  (5, 'cipher',    'CIPHER',    'Ethical Hacking Toolkit', 'A modular security framework for penetration testing, network auditing, and vulnerability research.',                                            '🛡', 'security', 2024, 'published', 0, 5, 'CIPHER Toolkit', 'Security research toolkit.'),
  (6, 'hologram',  'HOLOGRAM',  'Futuristic UI Kit',       'A complete design system inspired by Apple Vision Pro, Nothing OS, and sci-fi interfaces.',                                                  'UX', 'design',   2024, 'published', 0, 6, 'HOLOGRAM UI', 'Design system + components.');

-- =================================================
-- PROJECT_TAGS
-- =================================================
INSERT OR IGNORE INTO project_tags (project_id, tag_id) VALUES
  (1, (SELECT id FROM tags WHERE slug='python')),
  (1, (SELECT id FROM tags WHERE slug='pytorch')),
  (1, (SELECT id FROM tags WHERE slug='llm')),
  (2, (SELECT id FROM tags WHERE slug='cpp')),
  (2, (SELECT id FROM tags WHERE slug='rust')),
  (3, (SELECT id FROM tags WHERE slug='three-js')),
  (3, (SELECT id FROM tags WHERE slug='webgl')),
  (4, (SELECT id FROM tags WHERE slug='python')),
  (4, (SELECT id FROM tags WHERE slug='opencv')),
  (4, (SELECT id FROM tags WHERE slug='computer-vision')),
  (5, (SELECT id FROM tags WHERE slug='python')),
  (5, (SELECT id FROM tags WHERE slug='cybersecurity')),
  (6, (SELECT id FROM tags WHERE slug='react')),
  (6, (SELECT id FROM tags WHERE slug='ui-ux'));

-- =================================================
-- PROJECT_HIGHLIGHTS
-- =================================================
INSERT OR IGNORE INTO project_highlights (project_id, icon, text, order_index) VALUES
  (1, '🧠', 'Custom reasoning module with chain-of-thought + memory replay', 1),
  (1, '⚡', 'Energy-aware inference routing for low-power edge deployment',   2),
  (1, '🔁', 'Self-improvement loop with human-in-the-loop feedback',          3),
  (1, '🛡', 'Built-in alignment checks and interpretability tooling',         4),
  (1, '📊', 'Real-time monitoring dashboard for agent behavior',              5),
  (2, '🪟', 'Holographic, depth-aware window system',                          1),
  (2, '✋', 'Gesture & gaze control layer',                                    2),
  (2, '🤖', 'System-wide AI copilot with on-device inference',                3),
  (3, '✨', 'Real-time ray-traced reflections & soft shadows',                  1),
  (3, '🤖', 'NPCs with neural-network-driven decision making',                 2),
  (3, '🌍', 'Procedural world generation with biome system',                   3),
  (4, '👁', '60fps multi-object detection on edge devices',                    1),
  (4, '📐', 'Depth estimation with monocular input',                           2),
  (4, '🎯', 'Tracking with Kalman + Hungarian algorithm',                      3),
  (5, '🔍', 'Automated reconnaissance & OSINT',                                 1),
  (5, '🛠', 'Modular exploit framework with safety checks',                    2),
  (5, '🌐', 'Network auditing with custom packet crafting',                    3),
  (6, '🪟', '200+ glass, neon, and holographic components',                    1),
  (6, '🎬', 'Motion library with 50+ signature animations',                    2),
  (6, '🎨', 'Adaptive theming: dark, cyberpunk, light',                        3);

-- =================================================
-- ADMIN USER
-- (password: admin123 — change immediately after first login!)
-- Hash: bcrypt $2a$10$placeholder_replace_with_real_hash
-- =================================================
INSERT OR IGNORE INTO users (id, email, username, password_hash, full_name, role, email_verified) VALUES
  (1, 'admin@manoj-dahal.com.np', 'admin', '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH', 'Site Administrator', 'admin', 1);

-- =================================================
-- DONE
-- =================================================
SELECT 'Seed data inserted successfully' AS status;
