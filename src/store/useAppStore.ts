import { create } from 'zustand'
import { db, DirectoryTree, Article } from '../lib/supabase'

const CACHE_KEY = 'directories_cache'
const CACHE_TIME_KEY = 'directories_cache_time'
const CACHE_DURATION = 120000 // 120秒缓存

interface FormData {
  title: string
  content: string
  directory_id: string
  is_published: boolean
}

interface DirFormData {
  name: string
  parent_id: string
}

interface AppStore {
  // UI 状态
  sidebarOpen: boolean
  isMobile: boolean
  sidebarCollapsed: boolean
  tocCollapsed: boolean
  loading: boolean
  articleLoading: boolean
  articleNotFound: boolean
  formLoading: boolean
  directoriesLoading: boolean
  isDark: boolean

  // 数据状态
  selectedArticle: Article | null
  directories: DirectoryTree[]

  // 表单状态
  editingArticle: Article | null
  showCreateForm: boolean
  showCreateDirForm: boolean
  editingDirectory: DirectoryTree | null
  formData: FormData
  dirFormData: DirFormData

  // 认证状态
  isAuthenticated: boolean

  // UI 操作
  setSidebarOpen: (open: boolean) => void
  setIsMobile: (mobile: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTocCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapse: () => void
  toggleTocCollapse: () => void
  toggleDarkMode: () => void

  // 数据操作
  loadDirectories: (showLoading?: boolean, forceRefresh?: boolean) => Promise<void>
  loadArticle: (articleId: string) => Promise<void>
  clearSelectedArticle: () => void
  invalidateCache: () => void

  // 文章操作
  createArticle: (data: FormData) => Promise<string>
  updateArticle: (id: string, data: FormData) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
  setEditingArticle: (article: Article | null) => void
  setShowCreateForm: (show: boolean) => void
  setFormData: (data: FormData) => void
  resetArticleForm: () => void

  // 目录操作
  createDirectory: (data: DirFormData) => Promise<void>
  updateDirectory: (id: string, data: DirFormData) => Promise<void>
  deleteDirectory: (id: string) => Promise<void>
  setEditingDirectory: (directory: DirectoryTree | null) => void
  setShowCreateDirForm: (show: boolean) => void
  setDirFormData: (data: DirFormData) => void
  resetDirectoryForm: () => void

  // 认证操作
  login: (password: string) => Promise<void>
  logout: () => void
}

// 缓存辅助函数
const getCachedDirectories = (): DirectoryTree[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const cacheTime = localStorage.getItem(CACHE_TIME_KEY)
    
    if (cached && cacheTime && (Date.now() - parseInt(cacheTime, 10)) < CACHE_DURATION) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error('读取缓存失败:', error)
  }
  return null
}

const saveCachedDirectories = (data: DirectoryTree[]): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString())
  } catch (error) {
    console.error('保存缓存失败:', error)
  }
}

// 初始化暗色模式
const getInitialDarkMode = (): boolean => {
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    return saved === 'true'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 初始化认证状态
const getInitialAuth = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

let loadingRef = false

export const useAppStore = create<AppStore>((set, get) => ({
  // 初始状态
  sidebarOpen: false,
  isMobile: false,
  sidebarCollapsed: false,
  tocCollapsed: false,
  loading: true,
  articleLoading: false,
  articleNotFound: false,
  formLoading: false,
  directoriesLoading: true,
  isDark: getInitialDarkMode(),

  selectedArticle: null,
  directories: [],

  editingArticle: null,
  showCreateForm: false,
  showCreateDirForm: false,
  editingDirectory: null,
  formData: {
    title: '',
    content: '',
    directory_id: '',
    is_published: true
  },
  dirFormData: {
    name: '',
    parent_id: ''
  },

  isAuthenticated: getInitialAuth(),

  // UI 操作
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setTocCollapsed: (collapsed) => set({ tocCollapsed: collapsed }),
  
  toggleSidebarCollapse: () => set((state) => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
  
  toggleTocCollapse: () => set((state) => ({ 
    tocCollapsed: !state.tocCollapsed 
  })),

  toggleDarkMode: () => {
    const newDarkMode = !get().isDark
    set({ isDark: newDarkMode })
    localStorage.setItem('darkMode', String(newDarkMode))
    document.documentElement.classList.toggle('dark', newDarkMode)
  },

  // 数据操作
  invalidateCache: () => {
    try {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TIME_KEY)
    } catch (error) {
      console.error('清除缓存失败:', error)
    }
  },

  loadDirectories: async (showLoading = false, forceRefresh = false) => {
    if (!forceRefresh && loadingRef) {
      return
    }

    if (!forceRefresh) {
      const cached = getCachedDirectories()
      if (cached) {
        set({ directories: cached, directoriesLoading: false })
        return
      }
    }

    loadingRef = true
    if (showLoading) {
      set({ directoriesLoading: true })
    }

    try {
      const data = await db.getDirectoryTree()
      set({ directories: data, directoriesLoading: false })
      saveCachedDirectories(data)
    } catch (error) {
      console.error('加载目录失败:', error)
      set({ directoriesLoading: false })
    } finally {
      loadingRef = false
    }
  },

  loadArticle: async (articleId: string) => {
    set({ articleLoading: true, articleNotFound: false })
    try {
      const article = await db.getArticle(articleId)
      set({ 
        selectedArticle: article, 
        articleLoading: false,
        articleNotFound: false
      })
      localStorage.setItem('lastArticleId', articleId)
      
      if (get().isMobile) {
        set({ sidebarOpen: false })
      }
    } catch (error) {
      console.error('加载文章失败:', error)
      set({ 
        articleNotFound: true, 
        articleLoading: false,
        selectedArticle: null
      })
      localStorage.removeItem('lastArticleId')
    }
  },

  clearSelectedArticle: () => {
    set({ selectedArticle: null, articleNotFound: false })
    localStorage.removeItem('lastArticleId')
  },

  // 文章操作
  createArticle: async (data) => {
    set({ formLoading: true })
    try {
      // 将空字符串转换为 null
      const articleData = {
        ...data,
        directory_id: data.directory_id || null
      }
      const newArticle = await db.createArticle(articleData)
      get().invalidateCache()
      await get().loadDirectories(true, true)
      set({ formLoading: false })
      return newArticle.id
    } catch (error) {
      set({ formLoading: false })
      throw error
    }
  },

  updateArticle: async (id, data) => {
    set({ formLoading: true })
    try {
      // 将空字符串转换为 null
      const articleData = {
        ...data,
        directory_id: data.directory_id || null
      }
      await db.updateArticle(id, articleData)
      get().invalidateCache()
      await get().loadDirectories(true, true)
      
      // 等待数据库更新完成
      await new Promise(resolve => setTimeout(resolve, 100))
      await get().loadArticle(id)
      
      set({ formLoading: false })
    } catch (error) {
      set({ formLoading: false })
      throw error
    }
  },

  deleteArticle: async (id) => {
    try {
      await db.deleteArticle(id)
      get().invalidateCache()
      await get().loadDirectories(true, true)
      
      if (get().selectedArticle?.id === id) {
        get().clearSelectedArticle()
      }
    } catch (error) {
      throw error
    }
  },

  setEditingArticle: (article) => set({ editingArticle: article }),
  setShowCreateForm: (show) => set({ showCreateForm: show }),
  setFormData: (data) => set({ formData: data }),

  resetArticleForm: () => set({
    formData: {
      title: '',
      content: '',
      directory_id: '',
      is_published: true
    },
    editingArticle: null,
    showCreateForm: false
  }),

  // 目录操作
  createDirectory: async (data) => {
    set({ formLoading: true })
    try {
      // 将空字符串转换为 null
      const directoryData = {
        ...data,
        parent_id: data.parent_id || null
      }
      await db.createDirectory(directoryData)
      get().invalidateCache()
      await get().loadDirectories(true, true)
      set({ formLoading: false })
    } catch (error) {
      set({ formLoading: false })
      throw error
    }
  },

  updateDirectory: async (id, data) => {
    set({ formLoading: true })
    try {
      // 将空字符串转换为 null
      const directoryData = {
        ...data,
        parent_id: data.parent_id || null
      }
      await db.updateDirectory(id, directoryData)
      get().invalidateCache()
      await get().loadDirectories(true, true)
      set({ formLoading: false })
    } catch (error) {
      set({ formLoading: false })
      throw error
    }
  },

  deleteDirectory: async (id) => {
    try {
      await db.deleteDirectory(id)
      get().invalidateCache()
      await get().loadDirectories(true, true)
      
      if (get().selectedArticle?.directory_id === id) {
        get().clearSelectedArticle()
      }
    } catch (error) {
      throw error
    }
  },

  setEditingDirectory: (directory) => set({ editingDirectory: directory }),
  setShowCreateDirForm: (show) => set({ showCreateDirForm: show }),
  setDirFormData: (data) => set({ dirFormData: data }),

  resetDirectoryForm: () => set({
    dirFormData: {
      name: '',
      parent_id: ''
    },
    editingDirectory: null,
    showCreateDirForm: false
  }),

  // 认证操作
  login: async (password) => {
    const correctPassword = import.meta.env.VITE_ADMIN_SECRET
    if (password === correctPassword) {
      set({ isAuthenticated: true })
      localStorage.setItem('isAuthenticated', 'true')
    } else {
      throw new Error('密码错误')
    }
  },

  logout: () => {
    set({ isAuthenticated: false })
    localStorage.removeItem('isAuthenticated')
  }
}))

// 初始化暗色模式
if (getInitialDarkMode()) {
  document.documentElement.classList.add('dark')
}
