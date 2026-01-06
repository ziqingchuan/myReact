# React 学习平台

一个现代化的 React 学习网站，采用 TypeScript + Vite + Supabase 构建，支持文章管理、目录组织和 Markdown 内容展示。

## 核心功能

### 内容管理
- **多级目录结构** - 支持无限层级目录嵌套
- **Markdown 文章** - 完整的 Markdown 支持，代码语法高亮
- **实时编辑** - 快速创建和编辑文章内容
- **文章导航** - 侧边栏目录导航和文章目录快速跳转

### 用户体验
- **响应式设计** - 完美适配桌面端和移动端
- **深色模式** - 支持明暗主题切换
- **平滑动画** - 现代化的交互动效
- **加载优化** - 智能缓存和懒加载机制

### 技术特性
- **TypeScript** - 完整的类型安全保障
- **状态管理** - 自定义 Hooks 管理应用状态
- **数据缓存** - localStorage 级别缓存优化性能
- **模块化设计** - 组件化架构，易于维护

## 技术栈

### 前端技术
- **React 18** + **TypeScript** - 现代化前端开发
- **Vite** - 极速构建工具
- **Tailwind CSS** - 实用优先的样式框架
- **React Router** - 单页面应用路由

### 后端服务
- **Supabase** - 开源后端即服务
- **PostgreSQL** - 关系型数据库
- **REST API** - 标准化的数据接口

### 开发工具
- **ESLint** - 代码质量检查
- **PostCSS** - CSS 后处理器

## 快速开始

### 环境要求
- Node.js 16.0+
- npm 或 yarn

### 安装与运行

1. **克隆项目**
```bash
git clone https://github.com/your-username/myReact.git
cd myReact
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
# 复制环境变量模板
cp .env.example .env
```

编辑 `.env` 文件，配置 Supabase 连接：
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_SECRET=admin_access_secret
```

4. **数据库初始化**
执行 `supabase/schema.sql` 脚本创建数据表结构。

5. **启动开发服务器**
```bash
npm run dev
```

访问 `http://localhost:3000` 开始使用！

## 项目结构

```
src/
├── components/           # React 组件
│   ├── customUI/        # 模态框和表单组件
│   │   ├── ArticleFormModal.tsx
│   │   ├── DirectoryFormModal.tsx
│   │   └── AuthModal.tsx
│   ├── ArticleNav.tsx   # 文章目录导航
│   ├── DirectoryNav.tsx # 侧边栏目录导航
│   ├── Header.tsx       # 页面头部
│   └── Layout.tsx       # 主布局组件
├── hooks/               # 自定义 Hooks
│   ├── useAppState.ts   # 全局状态管理
│   ├── useArticleOperations.ts
│   ├── useDirectoryOperations.ts
│   ├── useAuth.ts       # 认证管理
│   └── useDarkMode.ts   # 主题管理
├── lib/
│   └── supabase.ts      # Supabase 客户端封装
├── pages/               # 页面组件
│   ├── HomePage.tsx
│   └── ArticlePage.tsx
├── data/
│   └── mockData.ts      # 模拟数据
└── styles/              # 样式文件
```

## 核心组件说明

### useAppState - 应用状态管理
统一管理应用全局状态，包括：
- 目录和文章数据
- 界面状态（侧边栏、模态框）
- 加载状态和缓存管理

### 表单操作 Hooks
- `useArticleOperations` - 文章 CRUD 操作
- `useDirectoryOperations` - 目录管理操作

### 界面组件
- **Layout** - 主布局，包含路由和模态框管理
- **DirectoryNav** - 可折叠的侧边栏目录树
- **ArticleNav** - 文章内部目录导航

## 数据模型

### 目录结构 (DirectoryTree)
```typescript
interface DirectoryTree {
  id: string
  name: string
  parent_id: string | null
  articles: Article[]
  children?: DirectoryTree[]
}
```

### 文章模型 (Article)
```typescript
interface Article {
  id: string
  title: string
  content: string
  directory_id: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}
```

## 开发脚本

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

## 配置说明

### 缓存设置
- 目录数据缓存：120秒
- 用户偏好持久化存储
- 智能缓存失效机制

### 响应式断点
- 移动端：< 768px
- 平板端：768px - 1024px
- 桌面端：> 1024px

## 贡献指南

欢迎贡献代码！请遵循以下流程：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建 Pull Request
