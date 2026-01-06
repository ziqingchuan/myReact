import React, { lazy, Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import DirectoryNav from './DirectoryNav'
import Header from '../components/Header'
import MobileSidebar from '../components/MobileSidebar'
import ArticleNav from './ArticleNav'
import { useUIStore, useAuthStore, useDirectoryStore, useArticleStore } from '../store'
import { getDirectoryOptions } from '../utils'
import { Article } from '../lib/supabase'
import '../App.css'

const ArticleFormModal = lazy(() => import('./customUI/ArticleFormModal'))
const DirectoryFormModal = lazy(() => import('./customUI/DirectoryFormModal'))
const AuthModal = lazy(() => import('./customUI/AuthModal'))

export default function Layout() {
  // UI Store
  const isMobile = useUIStore(state => state.isMobile)
  const sidebarOpen = useUIStore(state => state.sidebarOpen)
  const sidebarCollapsed = useUIStore(state => state.sidebarCollapsed)
  const tocCollapsed = useUIStore(state => state.tocCollapsed)
  const isDark = useUIStore(state => state.isDark)
  const setIsMobile = useUIStore(state => state.setIsMobile)
  const setSidebarOpen = useUIStore(state => state.setSidebarOpen)
  const toggleSidebarCollapse = useUIStore(state => state.toggleSidebarCollapse)
  const toggleTocCollapse = useUIStore(state => state.toggleTocCollapse)
  const toggleDarkMode = useUIStore(state => state.toggleDarkMode)
  
  // Auth Store
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const login = useAuthStore(state => state.login)
  const logout = useAuthStore(state => state.logout)
  
  // Directory Store
  const directories = useDirectoryStore(state => state.directories)
  const directoriesLoading = useDirectoryStore(state => state.directoriesLoading)
  const loadDirectories = useDirectoryStore(state => state.loadDirectories)
  const editingDirectory = useDirectoryStore(state => state.editingDirectory)
  const showCreateDirForm = useDirectoryStore(state => state.showCreateDirForm)
  const dirFormData = useDirectoryStore(state => state.dirFormData)
  const dirFormLoading = useDirectoryStore(state => state.formLoading)
  const setEditingDirectory = useDirectoryStore(state => state.setEditingDirectory)
  const setShowCreateDirForm = useDirectoryStore(state => state.setShowCreateDirForm)
  const setDirFormData = useDirectoryStore(state => state.setDirFormData)
  const createDirectory = useDirectoryStore(state => state.createDirectory)
  const updateDirectory = useDirectoryStore(state => state.updateDirectory)
  const resetDirectoryForm = useDirectoryStore(state => state.resetDirectoryForm)
  const invalidateDirectoryCache = useDirectoryStore(state => state.invalidateCache)
  
  // Article Store
  const selectedArticle = useArticleStore(state => state.selectedArticle)
  const articleNotFound = useArticleStore(state => state.articleNotFound)
  const editingArticle = useArticleStore(state => state.editingArticle)
  const showCreateForm = useArticleStore(state => state.showCreateForm)
  const formData = useArticleStore(state => state.formData)
  const formLoading = useArticleStore(state => state.formLoading)
  const setEditingArticle = useArticleStore(state => state.setEditingArticle)
  const setShowCreateForm = useArticleStore(state => state.setShowCreateForm)
  const setFormData = useArticleStore(state => state.setFormData)
  const createArticle = useArticleStore(state => state.createArticle)
  const updateArticle = useArticleStore(state => state.updateArticle)
  const resetArticleForm = useArticleStore(state => state.resetArticleForm)
  const loadArticle = useArticleStore(state => state.loadArticle)

  const [showAuthModal, setShowAuthModal] = React.useState(false)

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsMobile, setSidebarOpen])

  // 初始化数据
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Layout: 初始化应用')
      
      // 加载目录
      loadDirectories(true, true)
      
      // 尝试从 localStorage 恢复上次阅读的文章
      const lastArticleId = localStorage.getItem('lastArticleId')
      if (lastArticleId) {
        loadArticle(lastArticleId)
      }
    }

    initializeApp()
  }, [loadDirectories, loadArticle])

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCreateArticle = (directoryId: string) => {
    setFormData({ ...formData, directory_id: directoryId })
    setShowCreateForm(true)
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      directory_id: article.directory_id || '',
      is_published: article.is_published
    })
    setShowCreateForm(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  const handleAuthClick = () => {
    setShowAuthModal(true)
  }

  const handleAuthModalClose = () => {
    setShowAuthModal(false)
  }

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, formData)
      } else {
        const newArticleId = await createArticle(formData)
        // 导航到新文章
        window.location.href = `#/article/${newArticleId}`
      }
      
      // 刷新目录（因为文章数量可能变化）
      invalidateDirectoryCache()
      await loadDirectories(true, true)
      
      resetArticleForm()
      window.toast?.success(editingArticle ? '文章更新成功' : '文章创建成功')
    } catch (error) {
      console.error('保存失败:', error)
      window.toast?.error('保存失败: ' + (error as Error).message)
    }
  }

  const handleEditDirectory = (directory: any) => {
    setEditingDirectory(directory)
    setDirFormData({
      name: directory.name,
      parent_id: directory.parent_id || ''
    })
    setShowCreateDirForm(true)
  }

  const handleCreateDirectory = (parentId: string = '') => {
    setDirFormData({ name: '', parent_id: parentId })
    setShowCreateDirForm(true)
  }

  const handleSubmitDirectory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingDirectory) {
        await updateDirectory(editingDirectory.id, dirFormData)
      } else {
        await createDirectory(dirFormData)
      }
      
      resetDirectoryForm()
      window.toast?.success(editingDirectory ? '目录更新成功' : '目录创建成功')
    } catch (error) {
      console.error('保存失败:', error)
      window.toast?.error('保存失败: ' + (error as Error).message)
    }
  }

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <Header 
        isMobile={isMobile} 
        onMenuClick={handleMenuClick}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        isAuthenticated={isAuthenticated}
        onAuthClick={handleAuthClick}
        onLogout={logout}
      />
      
      <div className="flex relative">
        {!isMobile && (
          <div style={{ width: sidebarCollapsed ? '3rem' : '18rem', flexShrink: 0 }}>
            <DirectoryNav 
              collapsed={sidebarCollapsed}
              onToggleCollapse={toggleSidebarCollapse}
              onEditArticle={handleEditArticle}
              onCreateArticle={handleCreateArticle}
              onEditDirectory={handleEditDirectory}
              onCreateDirectory={handleCreateDirectory}
              directories={directories}
              directoriesLoading={directoriesLoading}
              onLoadDirectories={loadDirectories}
              selectedArticle={selectedArticle}
              isAuthenticated={isAuthenticated}
              isDark={isDark}
            />
          </div>
        )}
        
        <MobileSidebar 
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          directories={directories}
          directoriesLoading={directoriesLoading}
          onLoadDirectories={loadDirectories}
          selectedArticle={selectedArticle}
          isDark={isDark}
        />
        
        <main className="flex-1 overflow-auto custom-scrollbar main-content">
          <Outlet />
        </main>

        {!isMobile && selectedArticle && !articleNotFound && (
          <div style={{ width: tocCollapsed ? '3rem' : '18rem', flexShrink: 0 }}>
            <ArticleNav 
              content={selectedArticle.content}
              collapsed={tocCollapsed}
              onToggleCollapse={toggleTocCollapse}
              isDark={isDark}
            />
          </div>
        )}

        <Suspense fallback={null}>
          <ArticleFormModal 
            isOpen={showCreateForm}
            editingArticle={editingArticle}
            formData={formData}
            directories={directories}
            formLoading={formLoading}
            onClose={resetArticleForm}
            onSubmit={handleSubmitArticle}
            onFormDataChange={setFormData}
            getDirectoryOptions={getDirectoryOptions}
            isDark={isDark}
          />
        </Suspense>

        <Suspense fallback={null}>
          <DirectoryFormModal 
            isOpen={showCreateDirForm}
            editingDirectory={editingDirectory}
            dirFormData={dirFormData}
            directories={directories}
            formLoading={dirFormLoading}
            onClose={resetDirectoryForm}
            onSubmit={handleSubmitDirectory}
            onFormDataChange={setDirFormData}
            getDirectoryOptions={getDirectoryOptions}
            isDark={isDark}
          />
        </Suspense>

        <Suspense fallback={null}>
          <AuthModal 
            isOpen={showAuthModal}
            onClose={handleAuthModalClose}
            onSubmit={login}
            isDark={isDark}
          />
        </Suspense>
      </div>
    </div>
  )
}
