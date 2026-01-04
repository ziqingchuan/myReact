import { lazy, Suspense, useState } from 'react'
import ArticleNav from './components/ArticleNav'
import Header from './components/Header'
import MainContent from './components/MainContent'
import MobileSidebar from './components/MobileSidebar'
import HeadingNav from './components/HeadingNav'
import { useAppState } from './hooks/useAppState'
import { useArticleOperations } from './hooks/useArticleOperations'
import { useDirectoryOperations } from './hooks/useDirectoryOperations'
import { useDarkMode } from './hooks/useDarkMode'
import { useAuth } from './hooks/useAuth'
import './App.css'

// 懒加载表单组件（不常用）
const ArticleFormModal = lazy(() => import('./components/customUI/ArticleFormModal'))
const DirectoryFormModal = lazy(() => import('./components/customUI/DirectoryFormModal'))
const AuthModal = lazy(() => import('./components/customUI/AuthModal'))

function App() {
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

  const handleReturnHome = () => {
    appState.setArticleNotFound(false)
    appState.loadFirstArticle()
  }

  const handleLogoClick = () => {
    appState.setSelectedArticle(null)
    appState.setArticleNotFound(false)
    localStorage.removeItem('lastArticleId')
  }

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
        onLogoClick={handleLogoClick}
      />
      
      <div className="flex relative">
        {/* 桌面端侧边栏 */}
        {!appState.isMobile && (
          <div style={{ width: appState.sidebarCollapsed ? '3rem' : '20rem', flexShrink: 0 }}>
            <ArticleNav 
              onArticleSelect={appState.handleArticleSelect}
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
        
        {/* 移动端侧边栏 */}
        <MobileSidebar
          isOpen={appState.sidebarOpen}
          onClose={() => appState.setSidebarOpen(false)}
          onArticleSelect={appState.handleArticleSelect}
          directories={appState.directories}
          directoriesLoading={appState.directoriesLoading}
          onLoadDirectories={appState.loadDirectories}
          selectedArticle={appState.selectedArticle}
          isDark={isDark}
        />
        
        {/* 主内容区域 */}
        <MainContent
          loading={appState.loading}
          articleLoading={appState.articleLoading}
          articleNotFound={appState.articleNotFound}
          selectedArticle={appState.selectedArticle}
          onReturnHome={handleReturnHome}
          onArticleSelect={appState.handleArticleSelect}
          isDark={isDark}
        />

        {/* 右侧文章目录 */}
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

        {/* 文章编辑表单 - 懒加载 */}
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

        {/* 目录创建/编辑表单 - 懒加载 */}
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

        {/* 权限验证弹窗 */}
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

export default App