import { useState, useEffect, useCallback, useRef } from 'react'
import { db } from '../lib/supabase'

const CACHE_KEY = 'directories_cache'
const CACHE_TIME_KEY = 'directories_cache_time'
const CACHE_DURATION = 120000 // 120秒缓存

export function useAppState() {
  // UI 状态
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [tocCollapsed, setTocCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [articleLoading, setArticleLoading] = useState(false)
  const [articleNotFound, setArticleNotFound] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [directoriesLoading, setDirectoriesLoading] = useState(true)

  // 数据状态
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [directories, setDirectories] = useState([])

  // 表单状态
  const [editingArticle, setEditingArticle] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCreateDirForm, setShowCreateDirForm] = useState(false)
  const [editingDirectory, setEditingDirectory] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    directory_id: '',
    is_published: true
  })
  const [dirFormData, setDirFormData] = useState({
    name: '',
    parent_id: ''
  })

  // 防止重复加载
  const loadingRef = useRef(false)

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 初始化数据
  useEffect(() => {
    const initializeApp = async () => {
      // 加载目录
      loadDirectories(true)
      
      // 尝试从 localStorage 恢复上次阅读的文章
      const lastArticleId = localStorage.getItem('lastArticleId')
      if (lastArticleId) {
        setArticleLoading(true)
        setArticleNotFound(false)
        try {
          const article = await db.getArticle(lastArticleId)
          setSelectedArticle(article)
        } catch (error) {
          console.error('恢复上次文章失败:', error)
          localStorage.removeItem('lastArticleId')
        } finally {
          setArticleLoading(false)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  // 监听删除事件
  useEffect(() => {
    const handleArticleDeleted = (event) => {
      const { articleId } = event.detail
      setSelectedArticle(current => {
        if (current && current.id === articleId) {
          setArticleNotFound(true)
          localStorage.removeItem('lastArticleId')
          return null
        }
        return current
      })
      // 清除缓存
      invalidateCache()
    }

    const handleDirectoryDeleted = (event) => {
      const { directoryId } = event.detail
      setSelectedArticle(current => {
        if (current && current.directory_id === directoryId) {
          setArticleNotFound(true)
          localStorage.removeItem('lastArticleId')
          return null
        }
        return current
      })
      // 清除缓存
      invalidateCache()
    }

    window.addEventListener('articleDeleted', handleArticleDeleted)
    window.addEventListener('directoryDeleted', handleDirectoryDeleted)

    return () => {
      window.removeEventListener('articleDeleted', handleArticleDeleted)
      window.removeEventListener('directoryDeleted', handleDirectoryDeleted)
    }
  }, [])

  // 从 localStorage 读取缓存
  const getCachedDirectories = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const cacheTime = localStorage.getItem(CACHE_TIME_KEY)
      
      if (cached && cacheTime) {
        const now = Date.now()
        const age = now - parseInt(cacheTime, 10)
        
        if (age < CACHE_DURATION) {
          return JSON.parse(cached)
        }
      }
    } catch (error) {
      console.error('读取缓存失败:', error)
    }
    return null
  }

  // 保存到 localStorage
  const saveCachedDirectories = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString())
    } catch (error) {
      console.error('保存缓存失败:', error)
    }
  }

  // 清除缓存
  const invalidateCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TIME_KEY)
    } catch (error) {
      console.error('清除缓存失败:', error)
    }
  }, [])

  // 数据加载函数 - 带 localStorage 缓存
  const loadDirectories = useCallback(async (showLoading = false, forceRefresh = false) => {
    // 防止重复加载（除非强制刷新）
    if (!forceRefresh && loadingRef.current) {
      return
    }

    // 如果不是强制刷新，先尝试从 localStorage 读取缓存
    if (!forceRefresh) {
      const cached = getCachedDirectories()
      if (cached) {
        setDirectories(cached)
        setDirectoriesLoading(false)
        return
      }
    }

    loadingRef.current = true
    if (showLoading) {
      setDirectoriesLoading(true)
    }

    try {
      const data = await db.getDirectoryTree()
      setDirectories(data)
      // 保存到 localStorage
      saveCachedDirectories(data)
    } catch (error) {
      console.error('加载目录失败:', error)
    } finally {
      setDirectoriesLoading(false)
      loadingRef.current = false
    }
  }, [])

  const loadFirstArticle = async () => {
    setArticleLoading(true)
    try {
      const articles = await db.searchArticles('')
      if (articles && articles.length > 0) {
        setSelectedArticle(articles[0])
      }
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setLoading(false)
      setArticleLoading(false)
    }
  }

  const handleArticleSelect = async (articleId) => {
    setArticleLoading(true)
    setArticleNotFound(false)
    try {
      const article = await db.getArticle(articleId)
      setSelectedArticle(article)
      
      // 保存到 localStorage
      localStorage.setItem('lastArticleId', articleId)
      
      if (isMobile) {
        setSidebarOpen(false)
      }
    } catch (error) {
      console.error('加载文章失败:', error)
      setArticleNotFound(true)
      
      // 如果加载失败，清除 localStorage 中的记录
      localStorage.removeItem('lastArticleId')
    } finally {
      setArticleLoading(false)
      setLoading(false)
    }
  }

  // 工具函数
  const getDirectoryOptions = (dirs, level = 0) => {
    let options = []
    dirs.forEach(dir => {
      const prefix = '　'.repeat(level)
      options.push({
        value: dir.id,
        label: prefix + dir.name
      })
      if (dir.children && dir.children.length > 0) {
        options = options.concat(getDirectoryOptions(dir.children, level + 1))
      }
    })
    return options
  }

  return {
    // 状态
    sidebarOpen,
    setSidebarOpen,
    isMobile,
    sidebarCollapsed,
    setSidebarCollapsed,
    tocCollapsed,
    setTocCollapsed,
    loading,
    articleLoading,
    articleNotFound,
    setArticleNotFound,
    formLoading,
    setFormLoading,
    directoriesLoading,
    selectedArticle,
    setSelectedArticle,
    directories,
    editingArticle,
    setEditingArticle,
    showCreateForm,
    setShowCreateForm,
    showCreateDirForm,
    setShowCreateDirForm,
    editingDirectory,
    setEditingDirectory,
    formData,
    setFormData,
    dirFormData,
    setDirFormData,

    // 函数
    loadDirectories,
    loadFirstArticle,
    handleArticleSelect,
    getDirectoryOptions,
    invalidateCache
  }
}