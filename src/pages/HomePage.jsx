import { useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { useEffect } from 'react'
import WelcomePage from '../components/customUI/WelcomePage'

export default function HomePage() {
  console.log('HomePage: 组件开始渲染')
  const navigate = useNavigate()
  const { isDark } = useOutletContext()

  useEffect(() => {
    console.log('HomePage: 触发清除选中文章事件，隐藏右侧目录')
    window.dispatchEvent(new CustomEvent('clearSelectedArticle'))
  }, [])

  const handleArticleSelect = (articleId) => {
    console.log('HomePage: 选择文章，ID:', articleId)
    navigate(`/article/${articleId}`)
  }

  console.log('HomePage: 即将渲染 WelcomePage')
  return (
    <WelcomePage onArticleSelect={handleArticleSelect} isDark={isDark} />
  )
}
