import { X } from 'lucide-react'
import DirectoryNav from './DirectoryNav'
import '../styles/MobileSidebar.css'

export default function MobileSidebar({ 
  isOpen, 
  onClose, 
  onArticleSelect,
  directories,
  directoriesLoading,
  onLoadDirectories,
  selectedArticle,
  isDark
}) {
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
          onArticleSelect={onArticleSelect}
          onItemClick={onClose}
          directories={directories}
          directoriesLoading={directoriesLoading}
          onLoadDirectories={onLoadDirectories}
          selectedArticle={selectedArticle}
          isDark={isDark}
        />
      </div>
    </>
  )
}