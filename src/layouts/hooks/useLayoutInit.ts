import { useEffect } from 'react'
import { useUIStore, useDirectoryStore, useArticleStore } from '../../store'
import { CACHE } from '../../constants'

/**
 * Layout 初始化 Hook
 * 处理移动端检测和数据初始化
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
