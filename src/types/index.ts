// ============================================================
// Vibe Open World — TypeScript 类型定义
// ============================================================

// ---- Enums ----
export type ProjectStatus = 'pending' | 'approved' | 'rejected' | 'featured';

// ---- 数据库行类型 ----
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface AiTool {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  website: string | null;
  twitter: string | null;
  github: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string | null;
  url: string;
  github_url: string | null;
  screenshot_url: string;
  category_id: string | null;
  author_id: string;
  status: ProjectStatus;
  dev_duration: string | null;
  is_profitable: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

// 关联查询类型（JOIN 后的完整项目）
export interface ProjectWithRelations extends Project {
  category: Category | null;
  author: Author;
  ai_tools: AiTool[];
  tech_stack: string[];
}

// ---- 表单类型 ----
export interface SubmitProjectForm {
  // 必填
  title: string;
  tagline: string;
  url: string;
  screenshot_url: string;
  author_name: string;

  // 选填
  description?: string;
  github_url?: string;
  category_slug?: string;
  ai_tool_ids?: string[];
  tech_stack?: string[];
  dev_duration?: string;
  is_profitable?: boolean;

  // 作者选填
  author_email?: string;
  author_twitter?: string;
  author_github?: string;
  author_website?: string;
}

// ---- 分页 ----
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ---- 首页数据类型 ----
export interface HomePageData {
  featured: ProjectWithRelations[];
  latest: ProjectWithRelations[];
  popular: ProjectWithRelations[];
  categories: Category[];
  stats: {
    total_projects: number;
    total_builders: number;
    total_categories: number;
  };
}

// ---- 分类页数据类型 ----
export interface CategoryPageData {
  category: Category;
  projects: ProjectWithRelations[];
  total: number;
}

// ---- 管理后台 ----
export interface AdminProjectListItem extends Project {
  category: Category | null;
  author: Author;
}
