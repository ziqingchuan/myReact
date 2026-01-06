import React, { lazy, Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import DirectoryNav from './DirectoryNav'
import Header from '../components/Header'
import MobileSidebar from '../components/MobileSidebar'
import ArticleNav from './ArticleNav'
import { useAppStore } from '../store/useAppStore'
import { getDirectoryOptions } from '../utils'
import { Article } from '../lib/supabase'
import '../App.css'

const ArticleFormModal = lazy(() => import('./customUI/ArticleFormModal'))
const DirectoryFormModal = lazy(() => import('./customUI/DirectoryFormModal'))
const AuthModal = lazy(() => import('./customUI/AuthModal'))

export default function Layout() {
  // UI 状态
  const isMobile = useAppStore(state => state.isMobile)
  const sidebarOpen = useAppStore(state => state.sidebarOpen)
  const sidebarCollapsed = useAppStore(state => state.sidebarCollapsed)
  const tocCollapsed = useAppStore(state => state.tocCollapsed)
  const isDark = useAppStore(state => state.isDark)
  const articleNotFound = useAppStore(state => state.articleNotFound)
  
  // 数据状态
  const selectedArticle = useAppStore(state => state.selectedArticle)
  const directories = useAppStore(state => state.directories)
  const directoriesLoading = useAppStore(state => state.directoriesLoading)
  
  // 表单状态
  const showCreateForm = useAppStore(state => state.showCreateForm)
  const showCreateDirForm = useAppStore(state => state.showCreateDirForm)
  const editingArticle = useAppStore(state => state.editingArticle)
  const editingDirectory = useAppStore(state => state.editingDirectory)
  const formData = useAppStore(state => state.formData)
  const dirFormData = useAppStore(state => state.dirFormData)
  const formLoading = useAppStore(state => state.formLoading)
  
  // 认证状态
  const isAuthenticated = useAppStore(state => state.isAuthenticated)
  
  // 操作方法
  const setIsMobile = useAppStore(state => state.setIsMobile)
  const setSidebarOpen = useAppStore(state => state.setSidebarOpen)
  const toggleSidebarCollapse = useAppStore(state => state.toggleSidebarCollapse)
  const toggleTocCollapse = useAppStore(state => state.toggleTocCollapse)
  const toggleDarkMode = useAppStore(state => state.toggleDarkMode)
  const loadDirectories = useAppStore(state => state.loadDirectories)
  const setFormData = useAppStore(state => state.setFormData)
  const setEditingArticle = useAppStore(state => state.setEditingArticle)
  const setShowCreateForm = useAppStore(state => state.setShowCreateForm)
  const setEditingDirectory = useAppStore(state => state.setEditingDirectory)
  const setShowCreateDirForm = useAppStore(state => state.setShowCreateDirForm)
  const setDirFormData = useAppStore(state => state.setDirFormData)
  const createArticle = useAppStore(state => state.createArticle)
  const updateArticle = useAppStore(state => state.updateArticle)
  const resetArticleForm = useAppStore(state => state.resetArticleForm)
  const createDirectory = useAppStore(state => state.createDirectory)
  const updateDirectory = useAppStore(state => state.updateDirectory)
  const resetDirectoryForm = useAppStore(state => state.resetDirectoryForm)
  const login = useAppStore(state => state.login)
  const logout = useAppStore(state => state.logout)
  const loadArticle = useAppStore(state => state.loadArticle)

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
            formLoading={formLoading}
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
