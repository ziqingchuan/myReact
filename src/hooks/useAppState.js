import { useState, useEffect } from 'react'
import { db } from '../lib/supabase'

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
          // 如果加载失败，清除 localStorage 中的记录
          localStorage.removeItem('lastArticleId')
        } finally {
          setArticleLoading(false)
          setLoading(false)
        }
      } else {
        setLoading(false) // 没有上次阅读记录，显示欢迎页
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
          // 清除 localStorage 中的记录
          localStorage.removeItem('lastArticleId')
          return null
        }
        return current
      })
    }

    const handleDirectoryDeleted = (event) => {
      const { directoryId } = event.detail
      setSelectedArticle(current => {
        if (current && current.directory_id === directoryId) {
          setArticleNotFound(true)
          // 清除 localStorage 中的记录
          localStorage.removeItem('lastArticleId')
          return null
        }
        return current
      })
    }

    window.addEventListener('articleDeleted', handleArticleDeleted)
    window.addEventListener('directoryDeleted', handleDirectoryDeleted)

    return () => {
      window.removeEventListener('articleDeleted', handleArticleDeleted)
      window.removeEventListener('directoryDeleted', handleDirectoryDeleted)
    }
  }, [])

  // 数据加载函数
  const loadDirectories = async (showLoading = false) => {
    if (showLoading) {
      setDirectoriesLoading(true)
    }
    try {
      // console.log('开始加载目录...')
      const data = await db.getDirectoryTree()
      // console.log('加载到的目录数据:', data)
      setDirectories(data)
    } catch (error) {
      console.error('加载目录失败:', error)
    } finally {
      // 总是设置加载完成状态
      setDirectoriesLoading(false)
    }
  }

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
    getDirectoryOptions
  }
}