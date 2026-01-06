import DirectoryNav from '../../components/DirectoryNav'
import MobileSidebar from '../../components/MobileSidebar'
import { useUIStore, useAuthStore, useDirectoryStore, useArticleStore } from '../../store'
import { LayoutSidebarProps } from '../../types'


export function LayoutSidebar({
  onEditArticle,
  onCreateArticle,
  onEditDirectory,
  onCreateDirectory
}: LayoutSidebarProps) {
  // UI Store
  const isMobile = useUIStore(state => state.isMobile)
  const sidebarOpen = useUIStore(state => state.sidebarOpen)
  const sidebarCollapsed = useUIStore(state => state.sidebarCollapsed)
  const isDark = useUIStore(state => state.isDark)
  const setSidebarOpen = useUIStore(state => state.setSidebarOpen)
  const toggleSidebarCollapse = useUIStore(state => state.toggleSidebarCollapse)
  
  // Auth Store
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  
  // Directory Store
  const directories = useDirectoryStore(state => state.directories)
  const directoriesLoading = useDirectoryStore(state => state.directoriesLoading)
  const loadDirectories = useDirectoryStore(state => state.loadDirectories)
  
  // Article Store
  const selectedArticle = useArticleStore(state => state.selectedArticle)

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <>
      {!isMobile && (
        <div style={{ width: sidebarCollapsed ? '3rem' : '18rem', flexShrink: 0 }}>
          <DirectoryNav 
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            onEditArticle={onEditArticle}
            onCreateArticle={onCreateArticle}
            onEditDirectory={onEditDirectory}
            onCreateDirectory={onCreateDirectory}
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
    </>
  )
}
