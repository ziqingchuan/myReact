import { X } from 'lucide-react'
import DirectoryNav from './DirectoryNav'
import '../styles/MobileSidebar.css'
import { MobileSidebarProps } from '../types'

export default function MobileSidebar({ 
  isOpen, 
  onClose, 
  directories,
  directoriesLoading,
  onLoadDirectories,
  selectedArticle,
  isDark
}: MobileSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      <div 
        className="mobile-sidebar-overlay"
        onClick={onClose}
      />
      
      <div className={`mobile-sidebar ${isDark ? 'dark' : ''}`}>
        <div className="mobile-sidebar-header">
          <h2 className="mobile-sidebar-title">目录</h2>
          <button
            onClick={onClose}
            className="mobile-sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>
        <DirectoryNav
          collapsed={false}
          onToggleCollapse={() => {}}
          onItemClick={onClose}
          directories={directories}
          directoriesLoading={directoriesLoading}
          onLoadDirectories={onLoadDirectories}
          selectedArticle={selectedArticle}
          isDark={isDark}
          isMobile={true}
        />
      </div>
    </>
  )
}
