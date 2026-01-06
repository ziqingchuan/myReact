import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useArticleStore, useUIStore } from '../store'
import WelcomePage from '../components/customUI/WelcomePage'

/**
 * 首页组件，负责处理文章选择导航和主题状态管理
 * 
 * 该组件在渲染时会清除已选中的文章状态，确保每次进入首页时都处于干净状态。
 * 它接收主题状态并将其传递给WelcomePage组件，同时处理文章选择事件。
 * 
 * @param onArticleSelect - 文章选择回调函数，接收文章ID作为参数
 * @param isDark - 当前主题状态，表示是否为暗黑模式
 */
export default function HomePage() {
  console.log('HomePage: 组件开始渲染')
  const navigate = useNavigate()
  const isDark = useUIStore(state => state.isDark)
  const clearSelectedArticle = useArticleStore(state => state.clearSelectedArticle)

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
