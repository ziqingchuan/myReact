import { useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import ArticleNotFound from '../components/customUI/ArticleNotFound'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { isDark } = useOutletContext()

  const handleReturnHome = () => {
    navigate('/home')
  }

  return (
    <ArticleNotFound 
      onReturnHome={handleReturnHome}
      isDark={isDark}
    />
  )
}
