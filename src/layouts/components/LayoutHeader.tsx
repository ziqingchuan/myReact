import { useState } from 'react'
import { lazy, Suspense } from 'react'
import Header from '../../components/Header'
import { useUIStore, useAuthStore } from '../../store'

const AuthModal = lazy(() => import('../../components/customUI/AuthModal'))

export function LayoutHeader() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // UI Store - 使用单独的选择器
  const isMobile = useUIStore(state => state.isMobile)
  const isDark = useUIStore(state => state.isDark)
  const toggleDarkMode = useUIStore(state => state.toggleDarkMode)
  const setSidebarOpen = useUIStore(state => state.setSidebarOpen)
  
  // Auth Store
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const login = useAuthStore(state => state.login)
  const logout = useAuthStore(state => state.logout)

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleAuthClick = () => {
    setShowAuthModal(true)
  }

  const handleAuthModalClose = () => {
    setShowAuthModal(false)
  }

  return (
    <>
      <Header 
        isMobile={isMobile} 
        onMenuClick={handleMenuClick}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        isAuthenticated={isAuthenticated}
        onAuthClick={handleAuthClick}
        onLogout={logout}
      />
      
      <Suspense fallback={null}>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={handleAuthModalClose}
          onSubmit={login}
          isDark={isDark}
        />
      </Suspense>
    </>
  )
}
