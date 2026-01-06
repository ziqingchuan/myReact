import { create } from 'zustand'
import { db, Article } from '../lib/supabase'
import { useUIStore } from './useUIStore'

interface FormData {
  title: string
  content: string
  directory_id: string
  is_published: boolean
}

interface ArticleStore {
  // 状态
  selectedArticle: Article | null
  articleLoading: boolean
  articleNotFound: boolean
  
  // 表单状态
  editingArticle: Article | null
  showCreateForm: boolean
  formData: FormData
  formLoading: boolean

  // 操作
  loadArticle: (articleId: string) => Promise<void>
  clearSelectedArticle: () => void
  
  // 文章 CRUD
  createArticle: (data: FormData) => Promise<string>
  updateArticle: (id: string, data: FormData) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
  
  // 表单操作
  setEditingArticle: (article: Article | null) => void
  setShowCreateForm: (show: boolean) => void
  setFormData: (data: FormData) => void
  resetArticleForm: () => void
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  // 初始状态
  selectedArticle: null,
  articleLoading: false,
  articleNotFound: false,
  editingArticle: null,
  showCreateForm: false,
  formData: {
    title: '',
    content: '',
    directory_id: '',
    is_published: true
  },
  formLoading: false,

  // 操作
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
      
      // 移动端关闭侧边栏
      const isMobile = useUIStore.getState().isMobile
      if (isMobile) {
        useUIStore.getState().setSidebarOpen(false)
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

  // 文章 CRUD
  createArticle: async (data) => {
    set({ formLoading: true })
    try {
      // 将空字符串转换为 null
      const articleData = {
        ...data,
        directory_id: data.directory_id || null
      }
      const newArticle = await db.createArticle(articleData)
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
      
      if (get().selectedArticle?.id === id) {
        get().clearSelectedArticle()
      }
    } catch (error) {
      throw error
    }
  },

  // 表单操作
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
  })
}))
