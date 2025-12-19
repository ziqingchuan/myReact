// 模拟数据，用于开发和测试
export let mockDirectories = [
  {
    id: '1',
    name: 'React 基础',
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    articles: [
      {
        id: '1',
        title: 'React 简介',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: '创建第一个组件',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'React Hooks',
    parent_id: null,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    articles: [
      {
        id: '3',
        title: 'useState Hook',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z'
      }
    ]
  },
  {
    id: '3',
    name: '高级概念',
    parent_id: null,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    articles: []
  }
]

export let mockArticles = [
  {
    id: '1',
    title: 'React 简介',
    content: `# React 简介

React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发并维护。它采用组件化的开发方式，让开发者能够构建可复用的 UI 组件。

## 为什么选择 React？

### 1. 组件化开发
React 将 UI 拆分成独立的、可复用的组件，每个组件都有自己的状态和逻辑。

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

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

准备好开始你的 React 之旅了吗？让我们从创建第一个组件开始！`,
    directory_id: '1',
    is_published: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    directories: {
      id: '1',
      name: 'React 基础'
    }
  },
  {
    id: '2',
    title: '创建第一个组件',
    content: `# 创建第一个组件

在 React 中，组件是构建用户界面的基本单位。让我们学习如何创建和使用组件。

## 函数组件

最简单的组件是函数组件：

\`\`\`jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}
\`\`\`

## 使用组件

创建组件后，你可以像使用 HTML 标签一样使用它：

\`\`\`jsx
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  );
}
\`\`\`

## 带参数的组件

组件可以接收参数（称为 props）：

\`\`\`jsx
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
\`\`\`

## JSX 规则

1. 必须返回单个根元素
2. 使用 \`className\` 而不是 \`class\`
3. 所有标签必须闭合
4. 使用驼峰命名法

\`\`\`jsx
function MyComponent() {
  return (
    <div className="container">
      <img src="image.jpg" alt="Description" />
      <input type="text" />
    </div>
  );
}
\`\`\``,
    directory_id: '1',
    is_published: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    directories: {
      id: '1',
      name: 'React 基础'
    }
  },
  {
    id: '3',
    title: 'useState Hook',
    content: `# useState Hook

\`useState\` 是 React 中最常用的 Hook，用于在函数组件中添加状态。

## 基本用法

\`\`\`jsx
import { useState } from 'react';

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
\`\`\`

## 状态更新

### 直接设置新值
\`\`\`jsx
const [name, setName] = useState('');
setName('Alice');
\`\`\`

### 基于前一个状态更新
\`\`\`jsx
const [count, setCount] = useState(0);
setCount(prevCount => prevCount + 1);
\`\`\`

## 注意事项

1. 状态更新是异步的
2. 不要直接修改状态对象
3. 使用函数式更新避免闭包问题`,
    directory_id: '2',
    is_published: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    directories: {
      id: '2',
      name: 'React Hooks'
    }
  }
]