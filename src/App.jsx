import Sidebar from './components/Sidebar'
import Header from './components/Header'
import MainContent from './components/MainContent'
import MobileSidebar from './components/MobileSidebar'
import TableOfContents from './components/TableOfContents'
import ArticleFormModal from './components/customUI/ArticleFormModal'
import DirectoryFormModal from './components/customUI/DirectoryFormModal'
import { useAppState } from './hooks/useAppState'
import { useArticleOperations } from './hooks/useArticleOperations'
import { useDirectoryOperations } from './hooks/useDirectoryOperations'
import './App.css'

function App() {
  const appState = useAppState()
  
  const articleOps = useArticleOperations({
    setFormLoading: appState.setFormLoading,
    loadFirstArticle: appState.loadFirstArticle,
    loadDirectories: appState.loadDirectories,
    setFormData: appState.setFormData,
    setEditingArticle: appState.setEditingArticle,
    setShowCreateForm: appState.setShowCreateForm
  })

  const directoryOps = useDirectoryOperations({
    setFormLoading: appState.setFormLoading,
    loadDirectories: appState.loadDirectories,
    setDirFormData: appState.setDirFormData,
    setEditingDirectory: appState.setEditingDirectory,
    setShowCreateDirForm: appState.setShowCreateDirForm
  })

  const handleReturnHome = () => {
    appState.setArticleNotFound(false)
    appState.loadFirstArticle()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        isMobile={appState.isMobile} 
        onMenuClick={() => appState.setSidebarOpen(true)} 
      />
      
      <div className="flex relative">
        {/* 桌面端侧边栏 */}
        {!appState.isMobile && (
          <div className={`${appState.sidebarCollapsed ? 'w-12' : 'w-80'} flex-shrink-0`}>
            <Sidebar 
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
        />
        
        {/* 主内容区域 */}
        <MainContent
          loading={appState.loading}
          articleLoading={appState.articleLoading}
          articleNotFound={appState.articleNotFound}
          selectedArticle={appState.selectedArticle}
          onReturnHome={handleReturnHome}
        />

        {/* 右侧文章目录 */}
        {!appState.isMobile && appState.selectedArticle && !appState.articleNotFound && (
          <div className={`${appState.tocCollapsed ? 'w-12' : 'w-64'} flex-shrink-0`}>
            <TableOfContents
              content={appState.selectedArticle.content}
              collapsed={appState.tocCollapsed}
              onToggleCollapse={() => appState.setTocCollapsed(!appState.tocCollapsed)}
            />
          </div>
        )}

        {/* 文章编辑表单 */}
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
        />

        {/* 目录创建/编辑表单 */}
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
        />
      </div>
    </div>
  )
}

export default App