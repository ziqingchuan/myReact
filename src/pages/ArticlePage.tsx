import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppState } from '../hooks/useAppState'
import ArticleView from '../components/customUI/ArticleView'
import ArticleNotFound from '../components/customUI/ArticleNotFound'
import ArticleSkeleton from '../components/customUI/ArticleSkeleton'
import { db, type Article } from '../lib/supabase'

interface OutletContext {
  isDark: boolean
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isDark } = useOutletContext<OutletContext>()
  const appState = useAppState()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // 从数据库加载文章（当id变化时）
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        setNotFound(false)
        console.log('正在加载文章，ID:', id)

        const data = await db.getArticle(id!)
        console.log('加载到的文章数据:', data)

        if (!data) {
          console.log('文章未找到，ID:', id)
          setNotFound(true)
        } else {
          console.log('文章加载成功:', data.title)
          setArticle(data)
          localStorage.setItem('lastArticleId', id!)
        }
      } catch (error) {
        console.error('加载文章失败:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      loadArticle()
    }
  }, [id])

  // 监听全局状态中的文章更新（当文章被编辑后）
  useEffect(() => {
    if (appState.selectedArticle && appState.selectedArticle.id === id) {
      console.log('检测到全局状态中的文章更新，同步本地状态')
      setArticle(appState.selectedArticle)
    }
  }, [appState.selectedArticle, id])

  // 监听文章更新事件，强制重新加载
  useEffect(() => {
    const handleArticleUpdated = async (event: Event) => {
      const customEvent = event as CustomEvent<{ articleId: string }>
      const { articleId } = customEvent.detail
      
      if (articleId === id) {
        console.log('检测到文章更新事件，强制重新加载文章')
        try {
           setLoading(true)
          const data = await db.getArticle(id!)
          if (data) {
            setArticle(data)
          }
        } catch (error) {
          console.error('重新加载文章失败:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    window.addEventListener('articleUpdated', handleArticleUpdated)
    return () => {
      window.removeEventListener('articleUpdated', handleArticleUpdated)
    }
  }, [id])

  useEffect(() => {
    if (article) {
      window.dispatchEvent(new CustomEvent('articleLoaded', { detail: { article } }))
    }
  }, [article])


  const handleReturnHome = () => {
    navigate('/home')
  }

  if (loading) {
    return <ArticleSkeleton isDark={isDark} />
  }

  if (notFound) {
    return (
      <ArticleNotFound 
        onReturnHome={handleReturnHome}
        isDark={isDark}
      />
    )
  }

  return (
    <ArticleView
      article={article}
      isDark={isDark}
    />
  )
}
