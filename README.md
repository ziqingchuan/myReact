# React 学习网站

一个基于 React + Vite + Supabase 构建的现代化学习平台，专为 React 学习者设计。支持文章管理、目录组织、Markdown 渲染等功能。

## 功能特性

- **文章管理**: 创建、编辑、删除学习文章
- **目录组织**: 层级目录结构，便于内容分类
- **Markdown 支持**: 完整的 Markdown 渲染，支持代码高亮
- **代码复制**: 一键复制代码块功能
- **响应式设计**: 完美适配桌面端和移动端
- **实时数据**: 基于 Supabase 的实时数据同步
- **搜索功能**: 快速查找文章内容

## 技术栈

### 前端
- **React 18**: 现代化的用户界面库
- **Vite**: 快速的构建工具
- **Tailwind CSS**: 实用优先的 CSS 框架
- **React Markdown**: Markdown 内容渲染
- **Lucide React**: 现代化图标库

### 后端
- **Supabase**: 开源的 Firebase 替代方案
- **PostgreSQL**: 关系型数据库
- **实时订阅**: 数据变更实时同步

### 开发工具
- **ESLint**: 代码质量检查
- **PostCSS**: CSS 处理工具
- **Autoprefixer**: CSS 自动前缀

## 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd react-learning-website
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 配置：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **数据库设置**
在 Supabase 控制台中执行 `supabase/schema.sql` 文件来创建数据表。

5. **启动开发服务器**
```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

## 项目结构

```
src/
├── components/          # React 组件
│   ├── customUI/       # 自定义 UI 组件
│   ├── ArticleView.jsx # 文章查看组件
│   ├── Header.jsx      # 头部组件
│   ├── Sidebar.jsx     # 侧边栏组件
│   └── ...
├── hooks/              # 自定义 Hooks
│   ├── useAppState.js  # 应用状态管理
│   ├── useArticleOperations.js
│   └── useDirectoryOperations.js
├── lib/                # 工具库
│   └── supabase.js     # Supabase 客户端
├── data/               # 数据相关
│   └── mockData.js     # 模拟数据
└── App.jsx             # 主应用组件
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint 检查
- `npm run deploy` - 部署到 GitHub Pages

## 数据库结构

### directories 表
- `id`: 主键 (UUID)
- `name`: 目录名称
- `parent_id`: 父目录 ID（支持嵌套）
- `created_at`: 创建时间
- `updated_at`: 更新时间

### articles 表
- `id`: 主键 (UUID)
- `title`: 文章标题
- `content`: 文章内容 (Markdown)
- `directory_id`: 所属目录 ID
- `is_published`: 发布状态
- `created_at`: 创建时间
- `updated_at`: 更新时间

## 核心功能

### 文章管理
- 支持 Markdown 格式编写
- 代码语法高亮
- 一键复制代码功能
- 文章分类管理

### 目录系统
- 无限层级嵌套
- 拖拽排序（计划中）
- 批量操作（计划中）

### 用户体验
- 响应式布局
- 移动端优化
- 加载状态提示
- 错误处理

## 部署

### GitHub Pages
```bash
npm run deploy
```

### 其他平台
1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到你的服务器

## 环境变量

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | 是 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 是 |

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发起 Discussion
- 邮件联系

## 更新日志

### v0.0.0 (当前版本)
- 初始版本发布
- 基础文章管理功能
- 目录组织系统
- Markdown 渲染支持
- 响应式设计