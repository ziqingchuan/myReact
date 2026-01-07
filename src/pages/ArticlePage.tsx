import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useArticleStore, useUIStore } from '../store'
import ArticleView from '../components/customUI/ArticleView'
import ArticleSkeleton from '../components/customUI/ArticleSkeleton'

/**
 * 文章页面组件
 * 
 * 根据URL参数中的文章ID加载并显示对应的文章内容。
 * 处理文章加载状态、404状态和正常显示三种场景：
 * - 加载中：显示骨架屏
 * - 文章不存在：自动跳转回首页
 * - 正常情况：显示文章内容
 * 
 * @returns {JSX.Element} 文章页面组件
 */
export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const isDark = useUIStore(state => state.isDark)
  const article = useArticleStore(state => state.selectedArticle)
  const loading = useArticleStore(state => state.articleLoading)
  const notFound = useArticleStore(state => state.articleNotFound)
  const loadArticle = useArticleStore(state => state.loadArticle)

  // 当 id 变化时加载文章
  useEffect(() => {
    if (id) {
      console.log('正在加载文章，ID:', id)
      loadArticle(id)
    }
  }, [id, loadArticle])

  // 文章不存在时自动跳转回首页
  useEffect(() => {
    if (notFound) {
      navigate('/home')
    }
  }, [notFound, navigate])

  if (loading) {
    return <ArticleSkeleton isDark={isDark} />
  }

  return (
    <ArticleView
      article={article}
      isDark={isDark}
    />
  )
}