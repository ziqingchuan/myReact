import { Outlet } from 'react-router-dom'
import { useUIStore } from '../store'
import { LayoutHeader } from './components/LayoutHeader'
import { LayoutSidebar } from './components/LayoutSidebar'
import { LayoutArticleNav } from './components/LayoutArticleNav'
import { LayoutModals } from './components/LayoutModals'
import { useLayoutInit } from './hooks/useLayoutInit'
import { useArticleHandlers } from './hooks/useArticleHandlers'
import { useDirectoryHandlers } from './hooks/useDirectoryHandlers'
import '../App.css'

/**
 * 主布局组件
 * 
 * 优化点：
 * 1. 使用 shallow 比较减少不必要的重渲染
 * 2. 拆分成多个子组件，每个组件只订阅需要的状态
 * 3. 使用自定义 hooks 封装逻辑
 * 4. 减少 props 传递层级
 */
export default function MainLayout() {
  const isDark = useUIStore(state => state.isDark)
  
  // 初始化
  useLayoutInit()
  
  // 文章操作
  const {
    handleCreateArticle,
    handleEditArticle,
    handleSubmitArticle
  } = useArticleHandlers()
  
  // 目录操作
  const {
    handleEditDirectory,
    handleCreateDirectory,
    handleSubmitDirectory
  } = useDirectoryHandlers()

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <LayoutHeader />
      
      <div className="flex relative">
        <LayoutSidebar 
          onEditArticle={handleEditArticle}
          onCreateArticle={handleCreateArticle}
          onEditDirectory={handleEditDirectory}
          onCreateDirectory={handleCreateDirectory}
        />
        
        <main className="flex-1 overflow-auto custom-scrollbar main-content">
          <Outlet />
        </main>

        <LayoutArticleNav />

        <LayoutModals 
          onSubmitArticle={handleSubmitArticle}
          onSubmitDirectory={handleSubmitDirectory}
        />
      </div>
    </div>
  )
}
