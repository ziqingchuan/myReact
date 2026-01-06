import { useEffect } from 'react'
import { useUIStore, useDirectoryStore, useArticleStore } from '../../store'
import { CACHE } from '../../constants'

/**
 * 布局初始化自定义Hook
 * 
 * 该Hook负责应用布局的初始化工作，包括：
 * - 响应式布局检测（移动端/桌面端）
 * - 侧边栏状态管理
 * - 应用数据初始化（目录加载、文章恢复）
 * 
 * 主要功能：
 * 1. 监听窗口大小变化，自动切换移动端/桌面端布局
 * 2. 桌面端默认关闭侧边栏，移动端保持响应式布局
 * 3. 初始化时加载目录数据
 * 4. 尝试从localStorage恢复上次阅读的文章
 * 
 * @remarks
 * - 使用useEffect进行副作用处理
 * - 依赖window.innerWidth进行移动端检测
 * - 使用localStorage持久化文章阅读记录
 */
export function useLayoutInit() {
  const setIsMobile = useUIStore(state => state.setIsMobile)
  const setSidebarOpen = useUIStore(state => state.setSidebarOpen)
  const loadDirectories = useDirectoryStore(state => state.loadDirectories)
  const loadArticle = useArticleStore(state => state.loadArticle)

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768
      setIsMobile(isMobile)
      if (!isMobile) {
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
      const lastArticleId = localStorage.getItem(CACHE.KEYS.LAST_ARTICLE)
      if (lastArticleId) {
        loadArticle(lastArticleId)
      }
    }

    initializeApp()
  }, [loadDirectories, loadArticle])
}
