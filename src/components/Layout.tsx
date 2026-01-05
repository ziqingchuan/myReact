import { lazy, Suspense, useState, useEffect, useMemo, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import DirectoryNav from './DirectoryNav'
import Header from '../components/Header'
import MobileSidebar from '../components/MobileSidebar'
import ArticleNav from './ArticleNav'
import { useAppState, getDirectoryOptions } from '../hooks/useAppState'
import { useArticleOperations } from '../hooks/useArticleOperations'
import { useDirectoryOperations } from '../hooks/useDirectoryOperations'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../hooks/useAuth'
import '../App.css'

const ArticleFormModal = lazy(() => import('./customUI/ArticleFormModal'))
const DirectoryFormModal = lazy(() => import('./customUI/DirectoryFormModal'))
const AuthModal = lazy(() => import('./customUI/AuthModal'))

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
    const handleArticleLoaded = (event: Event) => {
      const customEvent = event as CustomEvent
      const { article } = customEvent.detail
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
  }, [appState.setSelectedArticle, appState.setArticleNotFound])

  const handleMenuClick = useCallback(() => {
    appState.setSidebarOpen(true)
  }, [appState])

  const handleToggleSidebarCollapse = useCallback(() => {
    appState.setSidebarCollapsed(!appState.sidebarCollapsed)
  }, [appState.sidebarCollapsed, appState])

  const handleCreateArticle = useCallback((directoryId: string) => {
    appState.setFormData({ ...appState.formData, directory_id: directoryId })
    appState.setShowCreateForm(true)
  }, [appState])

  const handleSidebarClose = useCallback(() => {
    appState.setSidebarOpen(false)
  }, [appState])

  const handleToggleTocCollapse = useCallback(() => {
    appState.setTocCollapsed(!appState.tocCollapsed)
  }, [appState.tocCollapsed, appState])

  const handleAuthClick = useCallback(() => {
    setShowAuthModal(true)
  }, [])

  const handleAuthModalClose = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  const directoryNavProps = useMemo(() => ({
    collapsed: appState.sidebarCollapsed,
    onToggleCollapse: handleToggleSidebarCollapse,
    onEditArticle: articleOps.handleEditArticle,
    onCreateArticle: handleCreateArticle,
    onEditDirectory: directoryOps.handleEditDirectory,
    onCreateDirectory: directoryOps.handleCreateDirectory,
    directories: appState.directories,
    directoriesLoading: appState.directoriesLoading,
    onLoadDirectories: appState.loadDirectories,
    selectedArticle: appState.selectedArticle,
    isAuthenticated,
    isDark
  }), [
    appState.sidebarCollapsed,
    handleToggleSidebarCollapse,
    articleOps.handleEditArticle,
    handleCreateArticle,
    directoryOps.handleEditDirectory,
    directoryOps.handleCreateDirectory,
    appState.directories,
    appState.directoriesLoading,
    appState.loadDirectories,
    appState.selectedArticle,
    isAuthenticated,
    isDark
  ])

  const mobileSidebarProps = useMemo(() => ({
    isOpen: appState.sidebarOpen,
    onClose: handleSidebarClose,
    directories: appState.directories,
    directoriesLoading: appState.directoriesLoading,
    onLoadDirectories: appState.loadDirectories,
    selectedArticle: appState.selectedArticle,
    isDark
  }), [
    appState.sidebarOpen,
    handleSidebarClose,
    appState.directories,
    appState.directoriesLoading,
    appState.loadDirectories,
    appState.selectedArticle,
    isDark
  ])

  const articleNavProps = useMemo(() => ({
    content: appState.selectedArticle?.content || '',
    collapsed: appState.tocCollapsed,
    onToggleCollapse: handleToggleTocCollapse,
    isDark
  }), [
    appState.selectedArticle?.content,
    appState.tocCollapsed,
    handleToggleTocCollapse,
    isDark
  ])

  const articleFormModalProps = useMemo(() => ({
    isOpen: appState.showCreateForm,
    editingArticle: appState.editingArticle,
    formData: appState.formData,
    directories: appState.directories,
    formLoading: appState.formLoading,
    onClose: articleOps.resetForm,
    onSubmit: (e: React.FormEvent) => articleOps.handleSubmitArticle(e, appState.formData, appState.editingArticle),
    onFormDataChange: appState.setFormData,
    getDirectoryOptions,
    isDark
  }), [
    appState.showCreateForm,
    appState.editingArticle,
    appState.formData,
    appState.directories,
    appState.formLoading,
    articleOps.resetForm,
    articleOps.handleSubmitArticle,
    appState.setFormData,
    isDark
  ])

  const directoryFormModalProps = useMemo(() => ({
    isOpen: appState.showCreateDirForm,
    editingDirectory: appState.editingDirectory,
    dirFormData: appState.dirFormData,
    directories: appState.directories,
    formLoading: appState.formLoading,
    onClose: directoryOps.resetDirForm,
    onSubmit: (e: React.FormEvent) => directoryOps.handleSubmitDirectory(e, appState.dirFormData, appState.editingDirectory),
    onFormDataChange: appState.setDirFormData,
    getDirectoryOptions,
    isDark
  }), [
    appState.showCreateDirForm,
    appState.editingDirectory,
    appState.dirFormData,
    appState.directories,
    appState.formLoading,
    directoryOps.resetDirForm,
    directoryOps.handleSubmitDirectory,
    appState.setDirFormData,
    isDark
  ])

  const authModalProps = useMemo(() => ({
    isOpen: showAuthModal,
    onClose: handleAuthModalClose,
    onSubmit: login,
    isDark
  }), [showAuthModal, handleAuthModalClose, login, isDark])

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <Header 
        isMobile={appState.isMobile} 
        onMenuClick={handleMenuClick}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        isAuthenticated={isAuthenticated}
        onAuthClick={handleAuthClick}
        onLogout={logout}
      />
      
      <div className="flex relative">
        {!appState.isMobile && (
          <div style={{ width: appState.sidebarCollapsed ? '3rem' : '18rem', flexShrink: 0 }}>
            <DirectoryNav {...directoryNavProps} />
          </div>
        )}
        
        <MobileSidebar {...mobileSidebarProps} />
        
        <main className="flex-1 overflow-auto custom-scrollbar main-content">
          <Outlet context={{ isDark }} />
        </main>

        {!appState.isMobile && appState.selectedArticle && !appState.articleNotFound && (
          <div style={{ width: appState.tocCollapsed ? '3rem' : '18rem', flexShrink: 0 }}>
            <ArticleNav {...articleNavProps} />
          </div>
        )}

        <Suspense fallback={null}>
          <ArticleFormModal {...articleFormModalProps} />
        </Suspense>

        <Suspense fallback={null}>
          <DirectoryFormModal {...directoryFormModalProps} />
        </Suspense>

        <Suspense fallback={null}>
          <AuthModal {...authModalProps} />
        </Suspense>
      </div>
    </div>
  )
}
