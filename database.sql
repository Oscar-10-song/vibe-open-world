-- ============================================================
-- Vibe Open World — Full Database Setup
-- Copy & paste into Neon SQL Editor and execute
-- ============================================================

-- ============================================================
-- PART 1: Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(60) NOT NULL,
  slug VARCHAR(60) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Tools
CREATE TABLE IF NOT EXISTS ai_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(60) NOT NULL,
  slug VARCHAR(60) NOT NULL UNIQUE,
  website VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Authors
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  website VARCHAR(255),
  twitter VARCHAR(100),
  github VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  tagline VARCHAR(160) NOT NULL,
  description TEXT,
  url VARCHAR(255) NOT NULL,
  github_url VARCHAR(255),
  screenshot_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
  dev_duration VARCHAR(20),
  is_profitable BOOLEAN NOT NULL DEFAULT false,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Project ↔ AI Tools (many-to-many)
CREATE TABLE IF NOT EXISTS project_ai_tools (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  ai_tool_id UUID NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, ai_tool_id)
);

-- Project ↔ Tech Stack (one-to-many)
CREATE TABLE IF NOT EXISTS project_tech_stack (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tech_name VARCHAR(60) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_author ON projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_views ON projects(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON ai_tools(slug);

-- ============================================================
-- PART 2: Seed Data
-- ============================================================

-- 2a. Categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('SaaS', 'saas', 'Software as a Service projects', '☁️', 1),
  ('Productivity', 'productivity', 'Tools that boost productivity', '⚡', 2),
  ('Finance', 'finance', 'Finance and fintech projects', '💰', 3),
  ('Education', 'education', 'Learning and education tools', '📚', 4),
  ('AI Tools', 'ai-tools', 'AI-powered applications', '🤖', 5),
  ('Games', 'games', 'Games and interactive experiences', '🎮', 6),
  ('Mobile Apps', 'mobile-apps', 'Mobile applications', '📱', 7),
  ('Developer Tools', 'developer-tools', 'Tools for developers', '🛠️', 8),
  ('Other', 'other', 'Everything else', '📦', 9)
ON CONFLICT (slug) DO NOTHING;

-- 2b. AI Tools
INSERT INTO ai_tools (name, slug, website) VALUES
  ('Claude Code', 'claude-code', 'https://claude.ai'),
  ('Cursor', 'cursor', 'https://cursor.sh'),
  ('Bolt', 'bolt', 'https://bolt.new'),
  ('Lovable', 'lovable', 'https://lovable.dev'),
  ('v0', 'v0', 'https://v0.dev'),
  ('Windsurf', 'windsurf', 'https://codeium.com/windsurf'),
  ('GitHub Copilot', 'github-copilot', 'https://github.com/features/copilot'),
  ('Replit Agent', 'replit-agent', 'https://replit.com'),
  ('Devin', 'devin', 'https://devin.ai'),
  ('Tempo', 'tempo', 'https://tempo.new'),
  ('Cline', 'cline', 'https://cline.bot'),
  ('Aider', 'aider', 'https://aider.chat'),
  ('Other', 'other', NULL)
ON CONFLICT (slug) DO NOTHING;

-- 2c. Demo Authors
INSERT INTO authors (name, twitter, github) VALUES
  ('Sarah Chen', '@sarahchen', 'sarahchen'),
  ('Marcus Rivera', '@marcusdev', 'marcusrivera'),
  ('Alex Kim', '@alexkim', 'alexkim'),
  ('Priya Sharma', '@priyacodes', 'priyasharma'),
  ('Tom Baker', '@tombaker', 'tombaker'),
  ('Lena Müller', '@lenacodes', 'lenamueller');

-- 2d. Demo Projects
INSERT INTO projects (title, slug, tagline, description, url, github_url, screenshot_url, category_id, author_id, status, dev_duration, is_profitable, view_count, published_at) VALUES
  (
    'HabitForge', 'habitforge',
    'AI-powered habit tracker that learns your patterns and adapts reminders',
    'HabitForge uses Claude Code to build a smart habit tracking system that analyzes your behavior patterns and suggests optimal times for habit formation. Built entirely with AI assistance in just 3 weeks.',
    'https://habitforge.app', 'https://github.com/sarahchen/habitforge',
    'https://placehold.co/1200x750/FFF7ED/F97316?text=HabitForge',
    (SELECT id FROM categories WHERE slug = 'productivity'),
    (SELECT id FROM authors WHERE github = 'sarahchen'),
    'featured', '3 weeks', true, 1240, NOW() - INTERVAL '7 days'
  ),
  (
    'DevRelay', 'devrelay',
    'Real-time developer collaboration tool with AI code review',
    'DevRelay connects developers in real-time with AI-powered code review. Built with Cursor and Claude Code.',
    'https://devrelay.io', 'https://github.com/marcusrivera/devrelay',
    'https://placehold.co/1200x750/EEF2FF/4F46E5?text=DevRelay',
    (SELECT id FROM categories WHERE slug = 'developer-tools'),
    (SELECT id FROM authors WHERE github = 'marcusrivera'),
    'featured', '2 months', false, 890, NOW() - INTERVAL '5 days'
  ),
  (
    'FinSight', 'finsight',
    'Personal finance dashboard with AI spending predictions',
    'A beautiful personal finance dashboard that uses AI to predict your spending patterns and suggest budget optimizations.',
    'https://finsight.co', NULL,
    'https://placehold.co/1200x750/ECFDF5/10B981?text=FinSight',
    (SELECT id FROM categories WHERE slug = 'finance'),
    (SELECT id FROM authors WHERE github = 'alexkim'),
    'featured', '1 month', true, 2100, NOW() - INTERVAL '14 days'
  ),
  (
    'LingoSpark', 'lingospark',
    'Learn languages through AI-generated interactive stories',
    'LingoSpark creates personalized language learning experiences through AI-generated stories that adapt to your proficiency level.',
    'https://lingospark.com', 'https://github.com/priyasharma/lingospark',
    'https://placehold.co/1200x750/FEF3C7/F59E0B?text=LingoSpark',
    (SELECT id FROM categories WHERE slug = 'education'),
    (SELECT id FROM authors WHERE github = 'priyasharma'),
    'approved', '2 days', false, 340, NOW() - INTERVAL '3 days'
  ),
  (
    'PixelQuest', 'pixelquest',
    'AI-generated pixel art RPG with infinite quests',
    'An RPG where every quest, character, and dialogue is generated by AI. Explore infinite worlds created on the fly.',
    'https://pixelquest.game', 'https://github.com/tombaker/pixelquest',
    'https://placehold.co/1200x750/FCE7F3/EC4899?text=PixelQuest',
    (SELECT id FROM categories WHERE slug = 'games'),
    (SELECT id FROM authors WHERE github = 'tombaker'),
    'approved', '3 months', false, 560, NOW() - INTERVAL '10 days'
  ),
  (
    'MailMuse', 'mailmuse',
    'AI email assistant that drafts replies in your voice',
    'MailMuse analyzes your email writing style and drafts replies that sound exactly like you. Built in a single weekend.',
    'https://mailmuse.app', NULL,
    'https://placehold.co/1200x750/EEF2FF/6366F1?text=MailMuse',
    (SELECT id FROM categories WHERE slug = 'ai-tools'),
    (SELECT id FROM authors WHERE github = 'lenamueller'),
    'approved', '2 days', true, 780, NOW() - INTERVAL '2 days'
  ),
  (
    'SaaSBoilerplate', 'saasboilerplate',
    'Next.js SaaS starter with auth, payments, and AI integration',
    'A production-ready SaaS boilerplate with Next.js, Supabase, Stripe, and AI integration. Built to help solo developers ship faster.',
    'https://saasboilerplate.dev', 'https://github.com/sarahchen/saasboilerplate',
    'https://placehold.co/1200x750/F8FAFC/0F172A?text=SaaSBoilerplate',
    (SELECT id FROM categories WHERE slug = 'saas'),
    (SELECT id FROM authors WHERE github = 'sarahchen'),
    'approved', '1 month', true, 3200, NOW() - INTERVAL '20 days'
  ),
  (
    'WeatherVane', 'weathervane',
    'Hyper-local weather app with AI-powered activity recommendations',
    'WeatherVane combines hyper-local weather data with AI to recommend outdoor activities, what to wear, and when to plan events.',
    'https://weathervane.app', NULL,
    'https://placehold.co/1200x750/E0F2FE/0284C7?text=WeatherVane',
    (SELECT id FROM categories WHERE slug = 'mobile-apps'),
    (SELECT id FROM authors WHERE github = 'tombaker'),
    'approved', '1 week', false, 150, NOW() - INTERVAL '1 days'
  );

-- 2e. Project ↔ AI Tools
INSERT INTO project_ai_tools (project_id, ai_tool_id)
SELECT p.id, t.id FROM projects p, ai_tools t WHERE p.slug = 'habitforge' AND t.slug = 'claude-code';

INSERT INTO project_ai_tools (project_id, ai_tool_id)
SELECT p.id, t.id FROM projects p, ai_tools t WHERE p.slug = 'devrelay' AND t.slug IN ('cursor', 'claude-code');

INSERT INTO project_ai_tools (project_id, ai_tool_id)
SELECT p.id, t.id FROM projects p, ai_tools t WHERE p.slug = 'finsight' AND t.slug IN ('bolt', 'windsurf');

INSERT INTO project_ai_tools (project_id, ai_tool_id)
SELECT p.id, t.id FROM projects p, ai_tools t WHERE p.slug = 'lingospark' AND t.slug = 'lovable';

INSERT INTO project_ai_tools (project_id, ai_tool_id)
SELECT p.id, t.id FROM projects p, ai_tools t WHERE p.slug = 'pixelquest' AND t.slug IN ('cursor', 'claude-code');

INSERT INTO project_ai_tools (project_id, ai_tool_id)
SELECT p.id, t.id FROM projects p, ai_tools t WHERE p.slug = 'mailmuse' AND t.slug IN ('claude-code', 'v0');

INSERT INTO project_ai_tools (project_id, ai_tool_id)
SELECT p.id, t.id FROM projects p, ai_tools t WHERE p.slug = 'saasboilerplate' AND t.slug = 'cursor';

INSERT INTO project_ai_tools (project_id, ai_tool_id)
SELECT p.id, t.id FROM projects p, ai_tools t WHERE p.slug = 'weathervane' AND t.slug = 'windsurf';

-- 2f. Project ↔ Tech Stack
INSERT INTO project_tech_stack (project_id, tech_name) VALUES
  ((SELECT id FROM projects WHERE slug = 'habitforge'), 'Next.js'),
  ((SELECT id FROM projects WHERE slug = 'habitforge'), 'Supabase'),
  ((SELECT id FROM projects WHERE slug = 'habitforge'), 'Tailwind CSS'),
  ((SELECT id FROM projects WHERE slug = 'devrelay'), 'React'),
  ((SELECT id FROM projects WHERE slug = 'devrelay'), 'Node.js'),
  ((SELECT id FROM projects WHERE slug = 'devrelay'), 'PostgreSQL'),
  ((SELECT id FROM projects WHERE slug = 'devrelay'), 'WebSocket'),
  ((SELECT id FROM projects WHERE slug = 'finsight'), 'Vue.js'),
  ((SELECT id FROM projects WHERE slug = 'finsight'), 'Python'),
  ((SELECT id FROM projects WHERE slug = 'finsight'), 'FastAPI'),
  ((SELECT id FROM projects WHERE slug = 'lingospark'), 'Svelte'),
  ((SELECT id FROM projects WHERE slug = 'lingospark'), 'OpenAI'),
  ((SELECT id FROM projects WHERE slug = 'pixelquest'), 'Phaser.js'),
  ((SELECT id FROM projects WHERE slug = 'pixelquest'), 'Node.js'),
  ((SELECT id FROM projects WHERE slug = 'mailmuse'), 'Next.js'),
  ((SELECT id FROM projects WHERE slug = 'mailmuse'), 'Gmail API'),
  ((SELECT id FROM projects WHERE slug = 'mailmuse'), 'OpenAI'),
  ((SELECT id FROM projects WHERE slug = 'saasboilerplate'), 'Next.js'),
  ((SELECT id FROM projects WHERE slug = 'saasboilerplate'), 'Supabase'),
  ((SELECT id FROM projects WHERE slug = 'saasboilerplate'), 'Stripe'),
  ((SELECT id FROM projects WHERE slug = 'weathervane'), 'React Native'),
  ((SELECT id FROM projects WHERE slug = 'weathervane'), 'Expo');
