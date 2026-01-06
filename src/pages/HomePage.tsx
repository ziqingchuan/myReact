import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import WelcomePage from '../components/customUI/WelcomePage'

export default function HomePage() {
  console.log('HomePage: 组件开始渲染')
  const navigate = useNavigate()
  const isDark = useAppStore(state => state.isDark)
  const clearSelectedArticle = useAppStore(state => state.clearSelectedArticle)

  useEffect(() => {
    console.log('HomePage: 清除选中文章')
    clearSelectedArticle()
  }, [clearSelectedArticle])

  const handleArticleSelect = (articleId: string) => {
    console.log('HomePage: 选择文章，ID:', articleId)
    navigate(`/article/${articleId}`)
  }

  console.log('HomePage: 即将渲染 WelcomePage')
  return (
    <WelcomePage onArticleSelect={handleArticleSelect} isDark={isDark} />
  )
}
