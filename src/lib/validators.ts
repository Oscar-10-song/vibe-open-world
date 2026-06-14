import { z } from 'zod';

// ============================================================
// 提交项目表单验证
// ============================================================

export const submitProjectSchema = z.object({
  // 必填字段
  title: z
    .string()
    .min(2, 'Project name is too short')
    .max(100, 'Project name is too long'),
  tagline: z
    .string()
    .min(10, 'Tagline must be at least 10 characters')
    .max(160, 'Tagline must be under 160 characters'),
  url: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'Project URL is required'),
  screenshot_url: z
    .string()
    .url('Please enter a valid image URL')
    .min(1, 'Screenshot URL is required'),
  author_name: z
    .string()
    .min(2, 'Author name is too short')
    .max(60, 'Author name is too long'),

  // 选填字段
  description: z
    .string()
    .max(5000, 'Description must be under 5000 characters')
    .optional()
    .or(z.literal('')),
  github_url: z
    .string()
    .url('Please enter a valid GitHub URL')
    .optional()
    .or(z.literal('')),
  category_id: z.string().uuid('Invalid category').optional(),
  ai_tool_ids: z.array(z.string().uuid()).optional().default([]),
  tech_stack: z
    .array(z.string().max(30))
    .max(15, 'Maximum 15 tech stack items')
    .optional()
    .default([]),
  dev_duration: z.string().optional(),
  is_profitable: z.boolean().optional().default(false),

  // 作者选填
  author_email: z.string().email('Invalid email').optional().or(z.literal('')),
  author_twitter: z.string().optional().or(z.literal('')),
  author_github: z.string().optional().or(z.literal('')),
  author_website: z.string().url().optional().or(z.literal('')),
});

export type SubmitProjectInput = z.infer<typeof submitProjectSchema>;

// ============================================================
// 管理后台：项目编辑验证
// ============================================================

export const adminEditProjectSchema = submitProjectSchema.extend({
  id: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'rejected', 'featured']),
});

export type AdminEditProjectInput = z.infer<typeof adminEditProjectSchema>;

// ============================================================
// 管理员登录
// ============================================================

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
