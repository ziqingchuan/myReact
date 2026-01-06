import ArticleNav from '../../components/ArticleNav'
import { useUIStore, useArticleStore } from '../../store'

export function LayoutArticleNav() {
  // UI Store
  const isMobile = useUIStore(state => state.isMobile)
  const tocCollapsed = useUIStore(state => state.tocCollapsed)
  const isDark = useUIStore(state => state.isDark)
  const toggleTocCollapse = useUIStore(state => state.toggleTocCollapse)
  
  // Article Store
  const selectedArticle = useArticleStore(state => state.selectedArticle)
  const articleNotFound = useArticleStore(state => state.articleNotFound)

  if (isMobile || !selectedArticle || articleNotFound) {
    return null
  }

  return (
    <div style={{ width: tocCollapsed ? '3rem' : '18rem', flexShrink: 0 }}>
      <ArticleNav 
        content={selectedArticle.content}
        collapsed={tocCollapsed}
        onToggleCollapse={toggleTocCollapse}
        isDark={isDark}
      />
    </div>
  )
}
