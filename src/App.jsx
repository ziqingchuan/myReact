import { Routes, Route, Navigate, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import ArticleNotFound from './components/customUI/ArticleNotFound'

function NotFoundWrapper() {
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

function App() {
  const location = useLocation()
  console.log('App: 当前路径', location.pathname)
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="article/:id" element={<ArticlePage />} />
        <Route path="404" element={<NotFoundWrapper />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}

export default App
