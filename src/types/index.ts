import React, { ReactNode } from 'react'

/**
 * 文章表单数据类型
 * 
 * 用于创建或编辑文章时的表单数据结构
 */
export interface ArticleFormData {
  title: string
  content: string
  directory_id: string
  is_published: boolean
}

/**
 * 文章表单模态框组件属性
 * 
 * 定义文章创建/编辑表单模态框所需的属性
 */
export interface ArticleFormModalProps {
  isOpen: boolean
  editingArticle: Article | null
  formData: ArticleFormData
  directories: DirectoryTree[]
  formLoading: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onFormDataChange: (data: ArticleFormData) => void
  getDirectoryOptions: (dirs: DirectoryTree[]) => { value: string; label: string }[]
  isDark?: boolean
}

/**
 * 文章视图组件属性
 * 
 * 定义文章展示视图组件所需的属性
 */
export interface ArticleViewProps {
  article: Article | null
  isDark?: boolean
}

/**
 * 标题类型
 * 
 * 表示文章中的标题元素，用于生成目录导航
 */
export interface Heading {
  id: string
  text: string
  level: number
}

/**
 * 文章目录导航组件属性
 * 
 * 定义文章目录侧边栏所需的属性
 */
export interface ArticleNavProps {
  content: string
  collapsed: boolean
  onToggleCollapse: () => void
  isDark: boolean
}

/**
 * 目录表单数据类型
 * 
 * 用于创建或编辑目录时的表单数据结构
 */
export interface DirectoryFormData {
  name: string
  parent_id: string
}

/**
 * 目录表单模态框组件属性
 * 
 * 定义目录创建/编辑表单模态框所需的属性
 */
export interface DirectoryFormModalProps {
  isOpen: boolean
  editingDirectory: DirectoryTree | null
  dirFormData: DirectoryFormData
  directories: DirectoryTree[]
  formLoading: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onFormDataChange: (data: DirectoryFormData) => void
  getDirectoryOptions: (dirs: DirectoryTree[]) => { value: string; label: string }[]
  isDark?: boolean
}

/**
 * 下拉选择选项类型
 * 
 * 定义下拉选择框的选项结构
 */
export interface SelectOption {
  value: string
  label: string
}

/**
 * 自定义下拉选择器组件属性
 * 
 * 定义自定义下拉选择框组件所需的属性
 */
export interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options?: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
  isDark?: boolean
}

/**
 * 应用错误类型
 * 
 * 定义应用中统一使用的错误信息结构
 */
export interface AppError {
  message: string
  code?: string
  details?: unknown
}


/**
 * 目录类型
 * 
 * 表示文章目录的基本数据结构
 */
export interface Directory {
  id: string
  name: string
  parent_id: string | null
  created_at: string
  updated_at: string
  articles?: Article[]
  children?: Directory[]
}

/**
 * 文章类型
 * 
 * 表示文章的基本数据结构
 */
export interface Article {
  id: string
  title: string
  content: string
  directory_id: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  directories?: Directory | null
}

/**
 * 目录树类型
 * 
 * 扩展自Directory，表示带有层级结构的目录树
 */
export interface DirectoryTree extends Directory {
  articles: Article[]
  children?: DirectoryTree[]
}

/**
 * 布局侧边栏组件属性
 * 
 * 定义主布局侧边栏所需的属性和回调函数
 */
export interface LayoutSidebarProps {
  onEditArticle: (article: Article) => void
  onCreateArticle: (directoryId: string) => void
  onEditDirectory: (directory: any) => void
  onCreateDirectory: (parentId?: string) => void
}
/**
 * 布局模态框组件属性
 * 
 * 定义主布局中模态框所需的属性和回调函数
 */
export interface LayoutModalsProps {
  onSubmitArticle: (e: React.FormEvent) => void
  onSubmitDirectory: (e: React.FormEvent) => void
}

/**
 * 移动端侧边栏组件属性
 * 
 * 定义移动端侧边栏所需的属性
 */
export interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  directories?: DirectoryTree[]
  directoriesLoading?: boolean
  onLoadDirectories: (force?: boolean) => Promise<void>
  selectedArticle?: Article | null
  isDark: boolean
}

/**
 * Markdown渲染器组件属性
 * 
 * 定义Markdown内容渲染组件所需的属性
 */
export interface MarkdownRendererProps {
  content: string
  isDark?: boolean
}

/**
 * 头部组件属性
 * 
 * 定义应用头部导航栏所需的属性和回调函数
 */
export interface HeaderProps {
  isMobile: boolean
  onMenuClick: () => void
  isDark: boolean
  onToggleDarkMode: () => void
  isAuthenticated: boolean
  onAuthClick: () => void
  onLogout: () => void
}

/**
 * 错误边界组件属性
 * 
 * 定义错误边界组件所需的属性
 */
export interface ErrorProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * 错误状态类型
 * 
 * 定义错误边界组件的内部状态结构
 */
export interface ErrorState {
  hasError: boolean
  error?: Error
}

/**
 * 确认模态框状态类型
 * 
 * 定义确认对话框的状态结构
 */
export interface ConfirmModalState {
  isOpen: boolean
  type: 'danger' | 'warning' | 'info'
  title: string
  message: string
  onConfirm: (() => Promise<void>) | null
}

/**
 * 目录导航组件属性
 * 
 * 定义目录导航侧边栏所需的属性和回调函数
 */
export interface DirectoryNavProps {
  onItemClick?: () => void
  collapsed: boolean
  onToggleCollapse: () => void
  onEditArticle?: (article: Article) => void
  onCreateArticle?: (directoryId: string) => void
  onEditDirectory?: (directory: DirectoryTree) => void
  onCreateDirectory?: () => void
  directories?: DirectoryTree[]
  directoriesLoading?: boolean
  onLoadDirectories: (showLoading?: boolean, force?: boolean) => Promise<void>
  selectedArticle?: Article | null
  isAuthenticated?: boolean
  isDark?: boolean
  isMobile?: boolean
}

/**
 * 功能特性类型
 * 
 * 定义欢迎页面展示的功能特性结构
 */
export interface Feature {
  title: string
  description: string
  color: string
}

/**
 * 欢迎页面组件属性
 * 
 * 定义欢迎页面所需的属性
 */
export interface WelcomePageProps {
  onArticleSelect: (articleId: string) => void
  isDark?: boolean
}

/**
 * 切换开关组件属性
 * 
 * 定义切换开关组件所需的属性
 */
export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  isDark?: boolean
}

/**
 * 消息提示类型
 * 
 * 定义消息提示的类型枚举
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/**
 * 消息提示组件属性
 * 
 * 定义消息提示组件所需的属性
 */
export interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onClose: (id: string) => void
}

/**
 * 消息项类型
 * 
 * 定义消息队列中单条消息的数据结构
 */
export interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration?: number
}

/**
 * 加载器尺寸类型
 * 
 * 定义加载旋转器的尺寸选项
 */
type SpinnerSize = 'sm' | 'md' | 'lg'

/**
 * 加载旋转器组件属性
 * 
 * 定义加载旋转器组件所需的属性
 */
export interface LoadingSpinnerProps {
  size?: SpinnerSize
  className?: string
  isDark?: boolean
}

/**
 * 加载遮罩组件属性
 * 
 * 定义加载遮罩层组件所需的属性
 */
export interface LoadingOverlayProps {
  message?: string
  className?: string
  isDark?: boolean
}

/**
 * 骨架屏组件属性
 * 
 * 定义骨架屏加载占位组件所需的属性
 */
export interface SkeletonProps {
  isDark?: boolean
}

/**
 * 确认模态框组件属性
 * 
 * 定义确认对话框组件所需的属性
 */
export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  isDark?: boolean
}

/**
 * 认证模态框组件属性
 * 
 * 定义用户认证登录对话框所需的属性
 */
export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (secret: string) => Promise<void>
  isDark?: boolean
}

/**
 * 文章未找到页面组件属性
 * 
 * 定义文章不存在时的404页面所需的属性
 */
export interface ArticleNotFoundProps {
  onReturnHome: () => void
  isDark?: boolean
}


/**
 * 文章状态管理Store类型
 * 
 * 定义文章相关的全局状态和操作方法，包括文章数据、表单状态和CRUD操作
 */
export interface ArticleStore {
  // 状态
  selectedArticle: Article | null
  articleLoading: boolean
  articleNotFound: boolean
  
  // 表单状态
  editingArticle: Article | null
  showCreateForm: boolean
  formData: ArticleFormData
  formLoading: boolean

  // 操作
  loadArticle: (articleId: string) => Promise<void>
  clearSelectedArticle: () => void
  
  // 文章 CRUD
  createArticle: (data: ArticleFormData) => Promise<string>
  updateArticle: (id: string, data: ArticleFormData) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
  
  // 表单操作
  setEditingArticle: (article: Article | null) => void
  setShowCreateForm: (show: boolean) => void
  setFormData: (data: ArticleFormData) => void
  resetArticleForm: () => void
}

/**
 * 认证状态管理Store类型
 * 
 * 定义用户认证相关的全局状态和操作方法
 */
export interface AuthStore {
  // 状态
  isAuthenticated: boolean

  // 操作
  login: (password: string) => Promise<void>
  logout: () => void
}

/**
 * 目录状态管理Store类型
 * 
 * 定义目录相关的全局状态和操作方法，包括目录树数据、表单状态和CRUD操作
 */
export interface DirectoryStore {
  // 状态
  directories: DirectoryTree[]
  directoriesLoading: boolean
  
  // 表单状态
  editingDirectory: DirectoryTree | null
  showCreateDirForm: boolean
  dirFormData: DirectoryFormData
  formLoading: boolean

  // 操作
  loadDirectories: (showLoading?: boolean, forceRefresh?: boolean) => Promise<void>
  invalidateCache: () => void
  
  // 目录 CRUD
  createDirectory: (data: DirectoryFormData) => Promise<void>
  updateDirectory: (id: string, data: DirectoryFormData) => Promise<void>
  deleteDirectory: (id: string) => Promise<void>
  
  // 表单操作
  setEditingDirectory: (directory: DirectoryTree | null) => void
  setShowCreateDirForm: (show: boolean) => void
  setDirFormData: (data: DirectoryFormData) => void
  resetDirectoryForm: () => void
}

/**
 * UI状态管理Store类型
 * 
 * 定义界面UI相关的全局状态和操作方法，包括侧边栏、主题、移动端适配等
 */
export interface UIStore {
  // 状态
  sidebarOpen: boolean
  isMobile: boolean
  sidebarCollapsed: boolean
  tocCollapsed: boolean
  isDark: boolean

  // 操作
  setSidebarOpen: (open: boolean) => void
  setIsMobile: (mobile: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTocCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapse: () => void
  toggleTocCollapse: () => void
  toggleDarkMode: () => void
}
