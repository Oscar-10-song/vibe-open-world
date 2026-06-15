import { Category, AiTool } from '@/types';

// ============================================================
// 预置分类
// ============================================================
export const CATEGORIES: Omit<Category, 'id' | 'created_at'>[] = [
  { name: 'SaaS', slug: 'saas', description: 'Software as a Service projects', icon: '☁️', sort_order: 1 },
  { name: 'Productivity', slug: 'productivity', description: 'Tools that boost productivity', icon: '⚡', sort_order: 2 },
  { name: 'Finance', slug: 'finance', description: 'Finance and fintech projects', icon: '💰', sort_order: 3 },
  { name: 'Education', slug: 'education', description: 'Learning and education tools', icon: '📚', sort_order: 4 },
  { name: 'AI Tools', slug: 'ai-tools', description: 'AI-powered applications', icon: '🤖', sort_order: 5 },
  { name: 'Games', slug: 'games', description: 'Games and interactive experiences', icon: '🎮', sort_order: 6 },
  { name: 'Mobile Apps', slug: 'mobile-apps', description: 'Mobile applications', icon: '📱', sort_order: 7 },
  { name: 'Developer Tools', slug: 'developer-tools', description: 'Tools for developers', icon: '🛠️', sort_order: 8 },
  { name: 'Other', slug: 'other', description: 'Everything else', icon: '📦', sort_order: 9 },
];

// ============================================================
// 预置 AI 工具列表
// ============================================================
export const AI_TOOLS: Omit<AiTool, 'id' | 'created_at'>[] = [
  { name: 'Claude Code', slug: 'claude-code', website: 'https://claude.ai' },
  { name: 'Cursor', slug: 'cursor', website: 'https://cursor.sh' },
  { name: 'Bolt', slug: 'bolt', website: 'https://bolt.new' },
  { name: 'Lovable', slug: 'lovable', website: 'https://lovable.dev' },
  { name: 'v0', slug: 'v0', website: 'https://v0.dev' },
  { name: 'Windsurf', slug: 'windsurf', website: 'https://codeium.com/windsurf' },
  { name: 'GitHub Copilot', slug: 'github-copilot', website: 'https://github.com/features/copilot' },
  { name: 'Replit Agent', slug: 'replit-agent', website: 'https://replit.com' },
  { name: 'Devin', slug: 'devin', website: 'https://devin.ai' },
  { name: 'Tempo', slug: 'tempo', website: 'https://tempo.new' },
  { name: 'Cline', slug: 'cline', website: 'https://cline.bot' },
  { name: 'Aider', slug: 'aider', website: 'https://aider.chat' },
  { name: 'Other', slug: 'other', website: null },
];

// ============================================================
// 开发耗时选项
// ============================================================
export const DEV_DURATION_OPTIONS = [
  { value: 'hours', label: 'A few hours' },
  { value: 'days', label: 'A few days' },
  { value: 'week', label: 'About a week' },
  { value: 'weeks', label: 'A few weeks' },
  { value: 'month', label: 'About a month' },
  { value: 'months', label: 'Several months' },
];

// ============================================================
// 站点配置
// ============================================================
export const SITE_CONFIG = {
  name: 'Vibe Open World',
  tagline: 'Explore AI Creations Around The World',
  description: 'Discover AI-generated artworks, videos, music, games and projects created by creators worldwide. A global showcase for AI-powered creativity.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeopenworld.com',
  ogImage: '/images/og-default.png',
  twitter: '@vibeopenworld',
  author: 'Vibe Open World',
};

// ============================================================
// 常用标签
// ============================================================
export const POPULAR_TECH_STACKS = [
  'Next.js', 'React', 'Vue', 'Svelte', 'TypeScript', 'JavaScript',
  'Python', 'Go', 'Rust', 'Ruby on Rails', 'Laravel', 'Django',
  'Supabase', 'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL',
  'Tailwind CSS', 'shadcn/ui', 'Vercel', 'Cloudflare', 'AWS',
  'Docker', 'Stripe', 'OpenAI', 'Replicate', 'Stable Diffusion',
];
