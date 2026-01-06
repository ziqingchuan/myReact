import { create } from 'zustand'
import { db, DirectoryTree } from '../lib/supabase'

const CACHE_KEY = 'directories_cache'
const CACHE_TIME_KEY = 'directories_cache_time'
const CACHE_DURATION = 120000 // 120秒缓存

interface DirFormData {
  name: string
  parent_id: string
}

interface DirectoryStore {
  // 状态
  directories: DirectoryTree[]
  directoriesLoading: boolean
  
  // 表单状态
  editingDirectory: DirectoryTree | null
  showCreateDirForm: boolean
  dirFormData: DirFormData
  formLoading: boolean

  // 操作
  loadDirectories: (showLoading?: boolean, forceRefresh?: boolean) => Promise<void>
  invalidateCache: () => void
  
  // 目录 CRUD
  createDirectory: (data: DirFormData) => Promise<void>
  updateDirectory: (id: string, data: DirFormData) => Promise<void>
  deleteDirectory: (id: string) => Promise<void>
  
  // 表单操作
  setEditingDirectory: (directory: DirectoryTree | null) => void
  setShowCreateDirForm: (show: boolean) => void
  setDirFormData: (data: DirFormData) => void
  resetDirectoryForm: () => void
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

let loadingRef = false

export const useDirectoryStore = create<DirectoryStore>((set, get) => ({
  // 初始状态
  directories: [],
  directoriesLoading: true,
  editingDirectory: null,
  showCreateDirForm: false,
  dirFormData: {
    name: '',
    parent_id: ''
  },
  formLoading: false,

  // 操作
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

  // 目录 CRUD
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
    } catch (error) {
      throw error
    }
  },

  // 表单操作
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
  })
}))
