# Supabase 数据库配置指南

本文档详细说明如何设置和配置 Supabase 数据库。

## 🚀 快速开始

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 点击 "New Project" 
3. 选择组织并填写项目信息：
   - Project name: `react-learning-website`
   - Database password: 设置一个强密码
   - Region: 选择离你最近的区域
4. 点击 "Create new project" 并等待初始化完成

### 2. 执行数据库脚本

1. 在 Supabase Dashboard 中，点击左侧菜单的 "SQL Editor"
2. 点击 "New Query" 创建新查询
3. 复制 `schema.sql` 文件的全部内容
4. 粘贴到查询编辑器中
5. 点击 "Run" 执行脚本

### 3. 获取 API 配置

1. 点击左侧菜单的 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (很长的字符串)
3. 将这些信息配置到项目的 `.env` 文件中

## 📊 数据库结构说明

### 核心表结构

#### directories (目录表)
存储学习目录的层级结构：

```sql
CREATE TABLE directories (
    id UUID PRIMARY KEY,           -- 目录唯一标识
    name VARCHAR(255) NOT NULL,    -- 目录名称
    path VARCHAR(500) NOT NULL,    -- 目录路径 (如: /react-basics/components)
    parent_id UUID,                -- 父目录ID (支持无限层级)
    sort_order INTEGER DEFAULT 0,  -- 排序顺序
    description TEXT,              -- 目录描述
    created_at TIMESTAMP,          -- 创建时间
    updated_at TIMESTAMP           -- 更新时间
);
```

#### articles (文章表)
存储所有学习文章：

```sql
CREATE TABLE articles (
    id UUID PRIMARY KEY,           -- 文章唯一标识
    title VARCHAR(500) NOT NULL,   -- 文章标题
    slug VARCHAR(500) UNIQUE,      -- URL别名 (如: react-introduction)
    description TEXT,              -- 文章简介
    content TEXT NOT NULL,         -- 文章内容 (Markdown格式)
    directory_id UUID,             -- 所属目录
    is_published BOOLEAN,          -- 是否发布
    sort_order INTEGER DEFAULT 0,  -- 排序顺序
    created_at TIMESTAMP,          -- 创建时间
    updated_at TIMESTAMP           -- 更新时间
);
```

#### tags (标签表)
文章标签系统：

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY,           -- 标签唯一标识
    name VARCHAR(100) UNIQUE,      -- 标签名称
    color VARCHAR(7) DEFAULT '#3B82F6', -- 标签颜色
    created_at TIMESTAMP           -- 创建时间
);
```

#### article_tags (文章标签关联表)
多对多关系表：

```sql
CREATE TABLE article_tags (
    article_id UUID,               -- 文章ID
    tag_id UUID,                   -- 标签ID
    PRIMARY KEY (article_id, tag_id)
);
```

### 索引优化

为了提高查询性能，创建了以下索引：

```sql
-- 目录相关索引
CREATE INDEX idx_directories_parent_id ON directories(parent_id);
CREATE INDEX idx_directories_sort_order ON directories(sort_order);

-- 文章相关索引
CREATE INDEX idx_articles_directory_id ON articles(directory_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(is_published);
CREATE INDEX idx_articles_created_at ON articles(created_at);

-- 全文搜索索引
CREATE INDEX idx_articles_search ON articles 
USING gin(to_tsvector('chinese', title || ' ' || COALESCE(description, '') || ' ' || content));
```

## 🔍 查询示例

### 获取目录树结构

```sql
-- 获取所有目录及其文章
SELECT 
    d.*,
    json_agg(
        json_build_object(
            'id', a.id,
            'title', a.title,
            'slug', a.slug,
            'created_at', a.created_at
        ) ORDER BY a.sort_order
    ) FILTER (WHERE a.id IS NOT NULL) as articles
FROM directories d
LEFT JOIN articles a ON d.id = a.directory_id AND a.is_published = true
GROUP BY d.id
ORDER BY d.sort_order;
```

### 搜索文章

```sql
-- 文本搜索 (使用 LIKE 查询，支持中文)
SELECT 
    a.*,
    d.name as directory_name
FROM articles a
LEFT JOIN directories d ON a.directory_id = d.id
WHERE 
    a.is_published = true
    AND (
        a.title ILIKE '%搜索关键词%' 
        OR COALESCE(a.description, '') ILIKE '%搜索关键词%'
        OR a.content ILIKE '%搜索关键词%'
    )
ORDER BY a.created_at DESC;
```

### 获取文章详情

```sql
-- 获取文章及其标签
SELECT 
    a.*,
    d.name as directory_name,
    d.path as directory_path,
    json_agg(
        json_build_object(
            'id', t.id,
            'name', t.name,
            'color', t.color
        )
    ) FILTER (WHERE t.id IS NOT NULL) as tags
FROM articles a
LEFT JOIN directories d ON a.directory_id = d.id
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.slug = 'article-slug'
GROUP BY a.id, d.name, d.path;
```

## 🔐 安全配置

### 行级安全 (RLS)

如果需要用户认证和权限控制，可以启用 RLS：

```sql
-- 启用 RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE directories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Public read access" ON articles
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access" ON directories
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON tags
    FOR SELECT USING (true);
```

### 管理员权限

如果需要管理员功能，可以添加用户表和权限控制：

```sql
-- 创建用户角色表
CREATE TABLE user_roles (
    user_id UUID REFERENCES auth.users(id),
    role VARCHAR(50) NOT NULL DEFAULT 'reader',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 管理员写入策略
CREATE POLICY "Admin write access" ON articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );
```

## 🔧 维护操作

### 数据备份

```sql
-- 导出所有数据
COPY directories TO '/tmp/directories.csv' WITH CSV HEADER;
COPY articles TO '/tmp/articles.csv' WITH CSV HEADER;
COPY tags TO '/tmp/tags.csv' WITH CSV HEADER;
COPY article_tags TO '/tmp/article_tags.csv' WITH CSV HEADER;
```

### 性能监控

```sql
-- 查看表大小
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 查看索引使用情况
SELECT 
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public';
```

### 清理操作

```sql
-- 清理未发布的旧文章 (超过30天)
DELETE FROM articles 
WHERE is_published = false 
AND created_at < NOW() - INTERVAL '30 days';

-- 清理未使用的标签
DELETE FROM tags 
WHERE id NOT IN (
    SELECT DISTINCT tag_id 
    FROM article_tags
);
```

## 📈 扩展功能

### 添加文章统计

```sql
-- 添加阅读量字段
ALTER TABLE articles ADD COLUMN view_count INTEGER DEFAULT 0;

-- 创建阅读记录表
CREATE TABLE article_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id),
    user_ip INET,
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT NOW()
);
```

### 添加评论系统

```sql
-- 创建评论表
CREATE TABLE comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id),
    author_name VARCHAR(100),
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 添加文章版本控制

```sql
-- 创建文章版本表
CREATE TABLE article_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id),
    title VARCHAR(500),
    content TEXT,
    version_number INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚨 故障排除

### 常见问题

1. **连接失败**
   - 检查 API URL 和密钥是否正确
   - 确认网络连接正常
   - 检查 Supabase 项目状态

2. **查询超时**
   - 检查索引是否正确创建
   - 优化查询语句
   - 考虑分页查询

3. **权限错误**
   - 检查 RLS 策略配置
   - 确认用户认证状态
   - 验证 API 密钥权限

### 调试技巧

```sql
-- 查看当前连接
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- 查看慢查询
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- 检查表约束
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'articles'::regclass;
```

## 📞 获取帮助

- [Supabase 官方文档](https://supabase.com/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [GitHub Issues](https://github.com/your-repo/issues)

---

配置完成后，你的 React 学习网站就可以正常运行了！🎉