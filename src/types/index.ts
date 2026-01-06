import React, { ReactNode } from 'react'
// 表单数据类型

export interface ArticleFormData {
  title: string
  content: string
  directory_id: string
  is_published: boolean
}

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

export interface ArticleViewProps {
  article: Article | null
  isDark?: boolean
}

export interface Heading {
  id: string
  text: string
  level: number
}

export interface ArticleNavProps {
  content: string
  collapsed: boolean
  onToggleCollapse: () => void
  isDark: boolean
}

export interface DirectoryFormData {
  name: string
  parent_id: string
}

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

// 选项类型
export interface SelectOption {
  value: string
  label: string
}

export interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options?: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
  isDark?: boolean
}

// 错误类型
export interface AppError {
  message: string
  code?: string
  details?: unknown
}


export interface Directory {
  id: string
  name: string
  parent_id: string | null
  created_at: string
  updated_at: string
  articles?: Article[]
  children?: Directory[]
}

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

export interface DirectoryTree extends Directory {
  articles: Article[]
  children?: DirectoryTree[]
}

export interface LayoutSidebarProps {
  onEditArticle: (article: Article) => void
  onCreateArticle: (directoryId: string) => void
  onEditDirectory: (directory: any) => void
  onCreateDirectory: (parentId?: string) => void
}
export interface LayoutModalsProps {
  onSubmitArticle: (e: React.FormEvent) => void
  onSubmitDirectory: (e: React.FormEvent) => void
}

export interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  directories?: DirectoryTree[]
  directoriesLoading?: boolean
  onLoadDirectories: (force?: boolean) => Promise<void>
  selectedArticle?: Article | null
  isDark: boolean
}

export interface MarkdownRendererProps {
  content: string
  isDark?: boolean
}

export interface HeaderProps {
  isMobile: boolean
  onMenuClick: () => void
  isDark: boolean
  onToggleDarkMode: () => void
  isAuthenticated: boolean
  onAuthClick: () => void
  onLogout: () => void
}

export interface ErrorProps {
  children: ReactNode
  fallback?: ReactNode
}

export interface ErrorState {
  hasError: boolean
  error?: Error
}

export interface ConfirmModalState {
  isOpen: boolean
  type: 'danger' | 'warning' | 'info'
  title: string
  message: string
  onConfirm: (() => Promise<void>) | null
}

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
}

export interface Feature {
  title: string
  description: string
  color: string
}

export interface WelcomePageProps {
  onArticleSelect: (articleId: string) => void
  isDark?: boolean
}

export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  isDark?: boolean
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onClose: (id: string) => void
}

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration?: number
}

type SpinnerSize = 'sm' | 'md' | 'lg'

export interface LoadingSpinnerProps {
  size?: SpinnerSize
  className?: string
  isDark?: boolean
}

export interface LoadingOverlayProps {
  message?: string
  className?: string
  isDark?: boolean
}

export interface SkeletonProps {
  isDark?: boolean
}

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

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (secret: string) => Promise<void>
  isDark?: boolean
}

export interface ArticleNotFoundProps {
  onReturnHome: () => void
  isDark?: boolean
}


// Store的类型

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

export interface AuthStore {
  // 状态
  isAuthenticated: boolean

  // 操作
  login: (password: string) => Promise<void>
  logout: () => void
}

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
