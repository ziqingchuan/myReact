import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

interface DirectoryOption {
  value: string
  label: string
}

export function useAppState() {
  const navigate = useNavigate()
  
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [tocCollapsed, setTocCollapsed] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [articleLoading, setArticleLoading] = useState<boolean>(false)
  const [articleNotFound, setArticleNotFound] = useState<boolean>(false)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [directoriesLoading, setDirectoriesLoading] = useState<boolean>(true)

  // 数据状态
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [directories, setDirectories] = useState<DirectoryTree[]>([])

  // 表单状态
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false)
  const [showCreateDirForm, setShowCreateDirForm] = useState<boolean>(false)
  const [editingDirectory, setEditingDirectory] = useState<DirectoryTree | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    directory_id: '',
    is_published: true
  })
  const [dirFormData, setDirFormData] = useState<DirFormData>({
    name: '',
    parent_id: ''
  })

  // 防止重复加载
  const loadingRef = useRef<boolean>(false)

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
      console.log('useAppState: 初始化应用')
      
      // 加载目录（强制刷新，不使用缓存）
      loadDirectories(true, true)
      
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 监听删除事件
  useEffect(() => {
    const handleArticleDeleted = (event: Event) => {
      const customEvent = event as CustomEvent<{ articleId: string }>
      const { articleId } = customEvent.detail
      setSelectedArticle(current => {
        if (current && current.id === articleId) {
          setArticleNotFound(true)
          localStorage.removeItem('lastArticleId')
          navigate('/home')
          return null
        }
        return current
      })
      invalidateCache()
    }

    const handleDirectoryDeleted = (event: Event) => {
      const customEvent = event as CustomEvent<{ directoryId: string }>
      const { directoryId } = customEvent.detail
      setSelectedArticle(current => {
        if (current && current.directory_id === directoryId) {
          setArticleNotFound(true)
          localStorage.removeItem('lastArticleId')
          navigate('/home')
          return null
        }
        return current
      })
      invalidateCache()
    }

    window.addEventListener('articleDeleted', handleArticleDeleted)
    window.addEventListener('directoryDeleted', handleDirectoryDeleted)

    return () => {
      window.removeEventListener('articleDeleted', handleArticleDeleted)
      window.removeEventListener('directoryDeleted', handleDirectoryDeleted)
    }
  }, [navigate])

  // 从 localStorage 读取缓存
  const getCachedDirectories = (): DirectoryTree[] | null => {
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
  const saveCachedDirectories = (data: DirectoryTree[]): void => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString())
    } catch (error) {
      console.error('保存缓存失败:', error)
    }
  }

  // 清除缓存
  const invalidateCache = useCallback((): void => {
    try {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TIME_KEY)
    } catch (error) {
      console.error('清除缓存失败:', error)
    }
  }, [])

  // 数据加载函数 - 带 localStorage 缓存
  const loadDirectories = useCallback(async (showLoading: boolean = false, forceRefresh: boolean = false): Promise<void> => {
    console.log('useAppState: loadDirectories 被调用', { showLoading, forceRefresh, loadingRef: loadingRef.current })
    
    // 防止重复加载（除非强制刷新）
    if (!forceRefresh && loadingRef.current) {
      console.log('useAppState: 已在加载中，跳过')
      return
    }

    // 如果不是强制刷新，先尝试从 localStorage 读取缓存
    if (!forceRefresh) {
      const cached = getCachedDirectories()
      if (cached) {
        console.log('useAppState: 使用缓存数据', cached)
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
      console.log('useAppState: 开始从数据库加载目录')
      const data = await db.getDirectoryTree()
      console.log('useAppState: 目录数据加载成功', data)
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

  const handleArticleSelect = async (articleId: string): Promise<void> => {
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
  const getDirectoryOptions = (dirs: DirectoryTree[], level: number = 0): DirectoryOption[] => {
    let options: DirectoryOption[] = []
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
    handleArticleSelect,
    getDirectoryOptions,
    invalidateCache
  }
}
