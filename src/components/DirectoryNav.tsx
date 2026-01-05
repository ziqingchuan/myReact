import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, PanelLeftClose, PanelLeftOpen, Edit, Trash2, Plus, FolderPlus } from 'lucide-react'
import { db, Article, DirectoryTree } from '../lib/supabase'
import ConfirmModal from './customUI/ConfirmModal'
import DirectorySkeleton from './customUI/DirectorySkeleton'
import '../styles/DirectoryNav.css'

interface ConfirmModalState {
  isOpen: boolean
  type: 'danger' | 'warning' | 'info'
  title: string
  message: string
  onConfirm: (() => Promise<void>) | null
}

interface DirectoryNavProps {
  onItemClick?: () => void
  collapsed: boolean
  onToggleCollapse: () => void
  onEditArticle?: (article: Article) => void
  onCreateArticle?: (directoryId: string) => void
  onEditDirectory?: (directory: DirectoryTree) => void
  onCreateDirectory?: () => void
  directories?: DirectoryTree[]
  directoriesLoading?: boolean
  onLoadDirectories: (force?: boolean) => Promise<void>
  selectedArticle?: Article | null
  isAuthenticated?: boolean
  isDark?: boolean
}

export default function DirectoryNav({ 
  onItemClick, 
  collapsed, 
  onToggleCollapse, 
  onEditArticle, 
  onCreateArticle, 
  onEditDirectory, 
  onCreateDirectory,
  directories = [],
  directoriesLoading = false,
  onLoadDirectories,
  selectedArticle = null,
  isAuthenticated = false,
  isDark = false
}: DirectoryNavProps) {
  const navigate = useNavigate()
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [operationLoading, setOperationLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    onConfirm: null
  })

  useEffect(() => {
    if (directories.length > 0) {
      const allDirIds = new Set<string>()
      const collectDirIds = (dirs: DirectoryTree[]) => {
        dirs.forEach(dir => {
          allDirIds.add(dir.id)
          if (dir.children && dir.children.length > 0) {
            collectDirIds(dir.children)
          }
        })
      }
      collectDirIds(directories)
      setExpandedDirs(allDirIds)
      console.log('ArticleNav: 目录数据已加载', directories)
    }
  }, [directories])

  const toggleDirectory = (dirId: string) => {
    const newExpanded = new Set(expandedDirs)
    if (newExpanded.has(dirId)) {
      newExpanded.delete(dirId)
    } else {
      newExpanded.add(dirId)
    }
    setExpandedDirs(newExpanded)
  }

  const handleDeleteArticle = (articleId: string, articleTitle: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: '删除文章',
      message: `是否要删除文章"${articleTitle}"？`,
      onConfirm: async () => {
        setOperationLoading(true)
        try {
          await db.deleteArticle(articleId)
          await onLoadDirectories(true)
          window.dispatchEvent(new CustomEvent('articleDeleted', { detail: { articleId } }))
        } catch (error) {
          console.error('删除文章失败:', error)
          alert('删除失败: ' + (error as Error).message)
        } finally {
          setOperationLoading(false)
        }
      }
    })
  }

  const handleDeleteDirectory = (directory: DirectoryTree) => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: '删除目录',
      message: `该操作会删除目录"${directory.name}"及其中全部文章，是否继续？`,
      onConfirm: async () => {
        setOperationLoading(true)
        try {
          await db.deleteDirectory(directory.id)
          await onLoadDirectories(true)
          window.dispatchEvent(new CustomEvent('directoryDeleted', { detail: { directoryId: directory.id } }))
        } catch (error) {
          console.error('删除目录失败:', error)
          alert('删除失败: ' + (error as Error).message)
        } finally {
          setOperationLoading(false)
        }
      }
    })
  }

  const handleEditArticle = async (article: Article) => {
    try {
      const fullArticle = await db.getArticle(article.id)
      onEditArticle && onEditArticle(fullArticle as Article)
    } catch (error) {
      console.error('加载文章失败:', error)
      alert('加载文章失败: ' + (error as Error).message)
    }
  }

  const renderDirectory = (dir: DirectoryTree, level = 0) => {
    const isExpanded = expandedDirs.has(dir.id)
    const hasArticles = dir.articles && dir.articles.length > 0
    const hasChildren = dir.children && dir.children.length > 0
    const hasContent = hasArticles || hasChildren
    
    return (
      <div key={dir.id} className="select-none">
        <div
          className="article-nav-directory-item"
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          <div 
            className="article-nav-directory-content"
            onClick={() => hasContent && toggleDirectory(dir.id)}
          >
            {hasContent ? (
              <>
                {isExpanded ? (
                  <ChevronDown size={16} className="article-nav-directory-icon" />
                ) : (
                  <ChevronRight size={16} className="article-nav-directory-icon" />
                )}
                {isExpanded ? (
                  <FolderOpen size={16} className="article-nav-directory-icon" />
                ) : (
                  <Folder size={16} className="article-nav-directory-icon" />
                )}
              </>
            ) : (
              <>
                <div className="w-4 mr-1" />
                <Folder size={16} className="article-nav-directory-icon" />
              </>
            )}
            
            <span className="article-nav-directory-name" title={dir.name}>
              {dir.name}
            </span>
          </div>
          
          {isAuthenticated && (
            <div className="article-nav-article-actions">
              <button
                onClick={() => onEditDirectory && onEditDirectory(dir)}
                className="article-nav-action-icon-btn"
                title="编辑目录"
              >
                <Edit size={12} />
              </button>
              <button
                onClick={() => onCreateArticle && onCreateArticle(dir.id)}
                className="article-nav-action-icon-btn"
                title="在此目录下新建文章"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => handleDeleteDirectory(dir)}
                className="article-nav-action-icon-btn delete"
                title="删除目录"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <div>
            {hasArticles && dir.articles!.map((article) => {
              const isActive = selectedArticle && selectedArticle.id === article.id
              return (
                <div
                  key={article.id}
                  className={`article-nav-article-item ${isActive ? 'active' : ''}`}
                  style={{ paddingLeft: `${28 + level * 16}px` }}
                >
                  <button
                    onClick={() => {
                      console.log('点击文章按钮，文章ID:', article.id)
                      console.log('即将导航到:', `/article/${article.id}`)
                      navigate(`/article/${article.id}`)
                      console.log('导航已调用')
                      onItemClick && onItemClick()
                    }}
                    className={`article-nav-article-btn ${isActive ? 'active' : ''}`}
                    title={article.title}
                  >
                    <FileText size={14} className="article-nav-article-icon" />
                    <span className="article-nav-article-title">{article.title}</span>
                  </button>
                  
                  {isAuthenticated && (
                    <div className="article-nav-article-actions">
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="article-nav-action-icon-btn"
                        title="编辑文章"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id, article.title)}
                        className="article-nav-action-icon-btn delete"
                        title="删除文章"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
            
            {hasChildren && dir.children!.map((child) => renderDirectory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (collapsed) {
    return (
      <nav className={`article-nav collapsed ${isDark ? 'dark' : ''}`}>
        <div className="article-nav-header">
          <button
            onClick={onToggleCollapse}
            className="article-nav-collapsed-btn"
            title="展开目录"
          >
            <PanelLeftOpen size={16} />
          </button>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className={`article-nav ${isDark ? 'dark' : ''}`}>
        <div className="article-nav-header">
          <div className="article-nav-header-content">
            <h2 className="article-nav-title">文章目录</h2>
            <div className="article-nav-header-actions">
              {isAuthenticated && (
                <button
                  onClick={() => onCreateDirectory && onCreateDirectory()}
                  className="article-nav-action-btn"
                  title="新建目录"
                >
                  <FolderPlus size={16} />
                </button>
              )}
              <button
                onClick={onToggleCollapse}
                className="article-nav-action-btn"
                title="收起目录"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="article-nav-content custom-scrollbar">
          <div>
            {directoriesLoading ? (
              <DirectorySkeleton isDark={isDark} />
            ) : directories.length === 0 ? (
              <div className="article-nav-empty">
                <p>暂无目录</p>
                <button
                  onClick={() => onCreateDirectory && onCreateDirectory()}
                  className="article-nav-empty-btn"
                >
                  创建第一个目录
                </button>
              </div>
            ) : (
              directories.map((dir) => renderDirectory(dir))
            )}
          </div>
        </div>
      </nav>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm!}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        isDark={isDark}
      />

      {operationLoading && (
        <div className="article-nav-loading-overlay">
          <div className={`article-nav-loading-content ${isDark ? 'dark' : ''}`}>
            <div className="article-nav-loading-inner">
              <div className="article-nav-loading-spinner"></div>
              <p className="article-nav-loading-text">处理中...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
