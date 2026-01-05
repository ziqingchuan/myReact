import { lazy, Suspense, useState, useEffect } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import ArticleNav from '../components/ArticleNav'
import Header from '../components/Header'
import MobileSidebar from '../components/MobileSidebar'
import HeadingNav from '../components/HeadingNav'
import { useAppState } from '../hooks/useAppState'
import { useArticleOperations } from '../hooks/useArticleOperations'
import { useDirectoryOperations } from '../hooks/useDirectoryOperations'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../hooks/useAuth'
import '../App.css'

const ArticleFormModal = lazy(() => import('../components/customUI/ArticleFormModal'))
const DirectoryFormModal = lazy(() => import('../components/customUI/DirectoryFormModal'))
const AuthModal = lazy(() => import('../components/customUI/AuthModal'))

export function useLayoutContext() {
  return useOutletContext()
}

export default function Layout() {
  const appState = useAppState()
  const { isDark, toggleDarkMode } = useDarkMode()
  const { isAuthenticated, login, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const articleOps = useArticleOperations({
    setFormLoading: appState.setFormLoading,
    loadDirectories: appState.loadDirectories,
    setFormData: appState.setFormData,
    setEditingArticle: appState.setEditingArticle,
    setShowCreateForm: appState.setShowCreateForm,
    invalidateCache: appState.invalidateCache,
    handleArticleSelect: appState.handleArticleSelect
  })

  const directoryOps = useDirectoryOperations({
    setFormLoading: appState.setFormLoading,
    loadDirectories: appState.loadDirectories,
    setDirFormData: appState.setDirFormData,
    setEditingDirectory: appState.setEditingDirectory,
    setShowCreateDirForm: appState.setShowCreateDirForm,
    invalidateCache: appState.invalidateCache
  })

  useEffect(() => {
    const handleArticleLoaded = (event) => {
      const { article } = event.detail
      appState.setSelectedArticle(article)
      appState.setArticleNotFound(false)
    }

    const handleClearSelectedArticle = () => {
      console.log('Layout: 收到清除选中文章事件')
      appState.setSelectedArticle(null)
    }

    window.addEventListener('articleLoaded', handleArticleLoaded)
    window.addEventListener('clearSelectedArticle', handleClearSelectedArticle)
    
    return () => {
      window.removeEventListener('articleLoaded', handleArticleLoaded)
      window.removeEventListener('clearSelectedArticle', handleClearSelectedArticle)
    }
  }, [])

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <Header 
        isMobile={appState.isMobile} 
        onMenuClick={() => appState.setSidebarOpen(true)}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        isAuthenticated={isAuthenticated}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={logout}
      />
      
      <div className="flex relative">
        {!appState.isMobile && (
          <div style={{ width: appState.sidebarCollapsed ? '3rem' : '20rem', flexShrink: 0 }}>
            <ArticleNav 
              collapsed={appState.sidebarCollapsed}
              onToggleCollapse={() => appState.setSidebarCollapsed(!appState.sidebarCollapsed)}
              onEditArticle={articleOps.handleEditArticle}
              onCreateArticle={(directoryId) => {
                appState.setFormData({ ...appState.formData, directory_id: directoryId })
                appState.setShowCreateForm(true)
              }}
              onEditDirectory={directoryOps.handleEditDirectory}
              onCreateDirectory={directoryOps.handleCreateDirectory}
              directories={appState.directories}
              directoriesLoading={appState.directoriesLoading}
              onLoadDirectories={appState.loadDirectories}
              selectedArticle={appState.selectedArticle}
              isAuthenticated={isAuthenticated}
              isDark={isDark}
            />
          </div>
        )}
        
        <MobileSidebar
          isOpen={appState.sidebarOpen}
          onClose={() => appState.setSidebarOpen(false)}
          directories={appState.directories}
          directoriesLoading={appState.directoriesLoading}
          onLoadDirectories={appState.loadDirectories}
          selectedArticle={appState.selectedArticle}
          isDark={isDark}
        />
        
        <main className="flex-1 overflow-auto custom-scrollbar main-content">
          <Outlet context={{ isDark }} />
        </main>

        {!appState.isMobile && appState.selectedArticle && !appState.articleNotFound && (
          <div style={{ width: appState.tocCollapsed ? '3rem' : '20rem', flexShrink: 0 }}>
            <HeadingNav
              content={appState.selectedArticle.content}
              collapsed={appState.tocCollapsed}
              onToggleCollapse={() => appState.setTocCollapsed(!appState.tocCollapsed)}
              isDark={isDark}
            />
          </div>
        )}

        <Suspense fallback={null}>
          <ArticleFormModal
            isOpen={appState.showCreateForm}
            editingArticle={appState.editingArticle}
            formData={appState.formData}
            directories={appState.directories}
            formLoading={appState.formLoading}
            onClose={articleOps.resetForm}
            onSubmit={(e) => articleOps.handleSubmitArticle(e, appState.formData, appState.editingArticle)}
            onFormDataChange={appState.setFormData}
            getDirectoryOptions={appState.getDirectoryOptions}
            isDark={isDark}
          />
        </Suspense>

        <Suspense fallback={null}>
          <DirectoryFormModal
            isOpen={appState.showCreateDirForm}
            editingDirectory={appState.editingDirectory}
            dirFormData={appState.dirFormData}
            directories={appState.directories}
            formLoading={appState.formLoading}
            onClose={directoryOps.resetDirForm}
            onSubmit={(e) => directoryOps.handleSubmitDirectory(e, appState.dirFormData, appState.editingDirectory)}
            onFormDataChange={appState.setDirFormData}
            getDirectoryOptions={appState.getDirectoryOptions}
            isDark={isDark}
          />
        </Suspense>

        <Suspense fallback={null}>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSubmit={login}
            isDark={isDark}
          />
        </Suspense>
      </div>
    </div>
  )
}
