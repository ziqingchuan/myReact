import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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
        }
      } catch (error) {
        console.error('加载文章失败:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadArticle()
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
