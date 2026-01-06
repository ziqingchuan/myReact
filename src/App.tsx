import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import ArticleNotFound from './components/customUI/ArticleNotFound'
import { useUIStore } from './store'

function NotFoundWrapper() {
  const navigate = useNavigate()
  const isDark = useUIStore(state => state.isDark)
  
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
      <Route path="/" element={<MainLayout />}>
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
