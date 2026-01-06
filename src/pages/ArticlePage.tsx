import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import ArticleView from '../components/customUI/ArticleView'
import ArticleNotFound from '../components/customUI/ArticleNotFound'
import ArticleSkeleton from '../components/customUI/ArticleSkeleton'

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const isDark = useAppStore(state => state.isDark)
  const article = useAppStore(state => state.selectedArticle)
  const loading = useAppStore(state => state.articleLoading)
  const notFound = useAppStore(state => state.articleNotFound)
  const loadArticle = useAppStore(state => state.loadArticle)

  // 当 id 变化时加载文章
  useEffect(() => {
    if (id) {
      console.log('正在加载文章，ID:', id)
      loadArticle(id)
    }
  }, [id, loadArticle])

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
