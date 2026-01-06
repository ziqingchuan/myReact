import { create } from 'zustand'
import { db } from '../lib/supabase'
import { CACHE } from '../constants'
import type { DirectoryTree, DirectoryStore } from '../types'

// 缓存辅助函数
const getCachedDirectories = (): DirectoryTree[] | null => {
  try {
    const cached = localStorage.getItem(CACHE.KEYS.DIRECTORIES)
    const cacheTime = localStorage.getItem(CACHE.KEYS.DIRECTORIES_TIME)
    
    if (cached && cacheTime && (Date.now() - parseInt(cacheTime, 10)) < CACHE.DURATION) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error('读取缓存失败:', error)
  }
  return null
}

const saveCachedDirectories = (data: DirectoryTree[]): void => {
  try {
    localStorage.setItem(CACHE.KEYS.DIRECTORIES, JSON.stringify(data))
    localStorage.setItem(CACHE.KEYS.DIRECTORIES_TIME, Date.now().toString())
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
      localStorage.removeItem(CACHE.KEYS.DIRECTORIES)
      localStorage.removeItem(CACHE.KEYS.DIRECTORIES_TIME)
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
