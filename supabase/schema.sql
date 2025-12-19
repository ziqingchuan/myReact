-- 创建目录表
CREATE TABLE IF NOT EXISTS directories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES directories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    directory_id UUID REFERENCES directories(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_directories_parent_id ON directories(parent_id);
CREATE INDEX IF NOT EXISTS idx_articles_directory_id ON articles(directory_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);

-- 创建搜索索引
CREATE INDEX IF NOT EXISTS idx_articles_title_text ON articles(title);
CREATE INDEX IF NOT EXISTS idx_articles_content_text ON articles(content);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加更新时间触发器
CREATE TRIGGER update_directories_updated_at BEFORE UPDATE ON directories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据
INSERT INTO directories (id, name, parent_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'React 基础', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'React Hooks', NULL),
('550e8400-e29b-41d4-a716-446655440003', '高级概念', NULL);

INSERT INTO articles (id, title, content, directory_id, is_published) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'React 简介', '# React 简介

React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发并维护。它采用组件化的开发方式，让开发者能够构建可复用的 UI 组件。

## 为什么选择 React？

### 1. 组件化开发
React 将 UI 拆分成独立的、可复用的组件，每个组件都有自己的状态和逻辑。

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

### 2. 虚拟 DOM
React 使用虚拟 DOM 来提高性能，只更新实际发生变化的部分。

### 3. 单向数据流
数据从父组件流向子组件，使应用的数据流更加可预测。

### 4. 丰富的生态系统
React 拥有庞大的社区和丰富的第三方库。

## 核心概念

- **组件 (Components)**: UI 的基本构建块
- **JSX**: JavaScript 的语法扩展
- **Props**: 组件的属性
- **State**: 组件的状态

## 开始学习

准备好开始你的 React 之旅了吗？让我们从创建第一个组件开始！', '550e8400-e29b-41d4-a716-446655440001', true),

('650e8400-e29b-41d4-a716-446655440002', '创建第一个组件', '# 创建第一个组件

在 React 中，组件是构建用户界面的基本单位。让我们学习如何创建和使用组件。

## 函数组件

最简单的组件是函数组件：

```jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}
```

## 使用组件

创建组件后，你可以像使用 HTML 标签一样使用它：

```jsx
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  );
}
```

## 带参数的组件

组件可以接收参数（称为 props）：

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
    </div>
  );
}
```

## JSX 规则

1. 必须返回单个根元素
2. 使用 `className` 而不是 `class`
3. 所有标签必须闭合
4. 使用驼峰命名法

```jsx
function MyComponent() {
  return (
    <div className="container">
      <img src="image.jpg" alt="Description" />
      <input type="text" />
    </div>
  );
}
```', '550e8400-e29b-41d4-a716-446655440001', true),

('650e8400-e29b-41d4-a716-446655440003', 'useState Hook', '# useState Hook

`useState` 是 React 中最常用的 Hook，用于在函数组件中添加状态。

## 基本用法

```jsx
import { useState } from ''react'';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## 状态更新

### 直接设置新值
```jsx
const [name, setName] = useState('''');
setName(''Alice'');
```

### 基于前一个状态更新
```jsx
const [count, setCount] = useState(0);
setCount(prevCount => prevCount + 1);
```

## 注意事项

1. 状态更新是异步的
2. 不要直接修改状态对象
3. 使用函数式更新避免闭包问题', '550e8400-e29b-41d4-a716-446655440002', true);