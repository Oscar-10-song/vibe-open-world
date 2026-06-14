# 🚀 Vibe Open World — 部署指南

## 0. 前置准备

- [Neon](https://console.neon.tech) 账号（免费数据库）
- [Vercel](https://vercel.com) 账号（托管 + 自动部署）
- [GitHub](https://github.com) 账号（代码仓库）

---

## 1. 创建 GitHub 仓库

```bash
cd vibe-open-world
git init
git add .
git commit -m "MVP: Vibe Open World — AI project showcase directory"
```

在 GitHub 创建新仓库，然后推送：

```bash
git remote add origin https://github.com/YOUR_USERNAME/vibe-open-world.git
git branch -M main
git push -u origin main
```

---

## 2. 创建 Neon 数据库

1. 打开 [console.neon.tech](https://console.neon.tech)
2. 点击 **Create project**
   - Name: `vibe-open-world`
   - Region: **US East (Ohio)** — 离 Vercel 最近
3. 创建后，进入 **SQL Editor**
4. 复制 [`database.sql`](database.sql) 的全部内容
5. 粘贴到 SQL Editor → **Run**
6. 确认输出：`9 categories, 13 AI tools, 6 authors, 8 projects`

7. 回到 **Dashboard** → **Connection Details** → 复制连接字符串
   - 选择 **Prisma / PgBouncer** 模式（适用于 Serverless）
   - 格式类似：`postgresql://vibe-open-world_owner:xxx@ep-xxx.us-east-2.aws.neon.tech/vibe-open-world?sslmode=require`

---

## 3. 部署到 Vercel

### 3.1 导入项目
1. 打开 [vercel.com/new](https://vercel.com/new)
2. Import 你的 GitHub 仓库 `vibe-open-world`
3. Framework: **Next.js**（自动检测）
4. Root Directory: `./`（默认）

### 3.2 设置环境变量
在 Vercel 项目设置 → **Environment Variables** 添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DATABASE_URL` | Neon 连接字符串 | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.vercel.app` | Production |
| `ADMIN_PASSWORD` | 你的管理密码 | Production |
| `ADMIN_USERNAME` | `admin` | Production |

### 3.3 部署
点击 **Deploy** → 等待 1-2 分钟 → 🎉 上线！

部署后 Vercel 会分配一个 `*.vercel.app` 域名。

---

## 4. 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入实际值

# 3. 启动开发服务器
npm run dev
# → http://localhost:3000

# 4. 构建生产版本
npm run build
```

> **不连数据库也能开发**：所有页面都有 mock 数据回退，首页会显示 8 个演示项目。

---

## 5. 访问管理后台

1. 打开 `https://yourdomain.vercel.app/admin/login`
2. 输入你设置的用户名和密码
3. 审核提交的项目：Approve / Feature / Reject

---

## 6. 可选：绑定自定义域名

1. 在 Vercel 项目 → **Settings** → **Domains**
2. 添加你的域名（如 `vibeopenworld.com`）
3. 按照提示配置 DNS 记录
4. 更新 `NEXT_PUBLIC_SITE_URL` 环境变量

---

## 项目结构速览

```
vibe-open-world/
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── page.tsx      # 首页
│   │   ├── submit/       # 提交项目
│   │   ├── projects/     # 项目详情页
│   │   ├── categories/   # 分类列表
│   │   ├── about/        # 关于页
│   │   ├── admin/        # 管理后台
│   │   └── api/          # API 路由
│   ├── components/       # UI 组件
│   │   ├── ui/           # 通用 UI (Button, Input, Badge, etc.)
│   │   ├── layout/       # 布局组件 (Header, Footer)
│   │   ├── home/         # 首页专用组件
│   │   ├── projects/     # 项目卡片/网格
│   │   ├── forms/        # 表单组件
│   │   └── admin/        # 后台组件
│   ├── lib/              # 工具库
│   │   ├── db.ts         # 数据库客户端
│   │   ├── mock-data.ts  # Mock 数据回退
│   │   ├── validators.ts # Zod 验证
│   │   ├── constants.ts  # 常量/配置
│   │   ├── seo.ts        # SEO 元数据
│   │   └── utils.ts      # 辅助函数
│   └── types/            # TypeScript 类型
├── database.sql          # 数据库 Schema + Seed
├── docs/                 # 架构文档
└── package.json
```
