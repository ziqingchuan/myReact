import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, PanelLeftClose, PanelLeftOpen, Edit, Trash2, Plus, FolderPlus } from 'lucide-react'
import { db } from '../lib/supabase'
import ConfirmDialog from './customUI/ConfirmDialog'


export default function Sidebar({ 
  onItemClick, 
  onArticleSelect, 
  collapsed, 
  onToggleCollapse, 
  onEditArticle, 
  onCreateArticle, 
  onEditDirectory, 
  onCreateDirectory,
  directories = [],
  directoriesLoading = false,
  onLoadDirectories,
  selectedArticle = null
}) {
  const [expandedDirs, setExpandedDirs] = useState(new Set())
  const [operationLoading, setOperationLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    onConfirm: null
  })

  // 默认展开所有目录
  useEffect(() => {
    if (directories.length > 0) {
      const allDirIds = new Set()
      const collectDirIds = (dirs) => {
        dirs.forEach(dir => {
          allDirIds.add(dir.id)
          if (dir.children && dir.children.length > 0) {
            collectDirIds(dir.children)
          }
        })
      }
      collectDirIds(directories)
      setExpandedDirs(allDirIds)
    }
  }, [directories])

  const toggleDirectory = (dirId) => {
    const newExpanded = new Set(expandedDirs)
    if (newExpanded.has(dirId)) {
      newExpanded.delete(dirId)
    } else {
      newExpanded.add(dirId)
    }
    setExpandedDirs(newExpanded)
  }

  const handleDeleteArticle = (articleId, articleTitle) => {
    setConfirmDialog({
      isOpen: true,
      type: 'danger',
      title: '删除文章',
      message: `是否要删除文章"${articleTitle}"？`,
      onConfirm: async () => {
        setOperationLoading(true)
        try {
          await db.deleteArticle(articleId)
          // 立即刷新目录数据
          await onLoadDirectories(true)
          // 通知主组件文章被删除
          window.dispatchEvent(new CustomEvent('articleDeleted', { detail: { articleId } }))
        } catch (error) {
          console.error('删除文章失败:', error)
          alert('删除失败: ' + error.message)
        } finally {
          setOperationLoading(false)
        }
      }
    })
  }

  const handleDeleteDirectory = (directory) => {
    setConfirmDialog({
      isOpen: true,
      type: 'danger',
      title: '删除目录',
      message: `该操作会删除目录"${directory.name}"及其中全部文章，是否继续？`,
      onConfirm: async () => {
        setOperationLoading(true)
        try {
          await db.deleteDirectory(directory.id)
          // 立即刷新目录数据
          await onLoadDirectories(true)
          // 通知主组件目录被删除
          window.dispatchEvent(new CustomEvent('directoryDeleted', { detail: { directoryId: directory.id } }))
        } catch (error) {
          console.error('删除目录失败:', error)
          alert('删除失败: ' + error.message)
        } finally {
          setOperationLoading(false)
        }
      }
    })
  }

  const handleEditArticle = async (article) => {
    try {
      // 加载完整的文章数据
      const fullArticle = await db.getArticle(article.id)
      onEditArticle && onEditArticle(fullArticle)
    } catch (error) {
      console.error('加载文章失败:', error)
      alert('加载文章失败: ' + error.message)
    }
  }

  const renderDirectory = (dir, level = 0) => {
    const isExpanded = expandedDirs.has(dir.id)
    const hasArticles = dir.articles && dir.articles.length > 0
    const hasChildren = dir.children && dir.children.length > 0
    const hasContent = hasArticles || hasChildren // 有文章或有子目录
    
    return (
      <div key={dir.id} className="select-none">
        <div
          className="group flex items-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          <div 
            className="flex items-center flex-1 cursor-pointer"
            onClick={() => hasContent && toggleDirectory(dir.id)}
          >
            {hasContent ? (
              <>
                {isExpanded ? (
                  <ChevronDown size={16} className="text-gray-400 mr-1" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400 mr-1" />
                )}
                {isExpanded ? (
                  <FolderOpen size={16} className="text-gray-600 mr-2" />
                ) : (
                  <Folder size={16} className="text-gray-600 mr-2" />
                )}
              </>
            ) : (
              <>
                <div className="w-4 mr-1" />
                <Folder size={16} className="text-gray-600 mr-2" />
              </>
            )}
            
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-1" title={dir.name}>
              {dir.name}
            </span>
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-2">
            <button
              onClick={() => onEditDirectory && onEditDirectory(dir)}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
              title="编辑目录"
            >
              <Edit size={12} />
            </button>
            <button
              onClick={() => onCreateArticle && onCreateArticle(dir.id)}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
              title="在此目录下新建文章"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => handleDeleteDirectory(dir)}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600"
              title="删除目录"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div>
            {/* 渲染文章 */}
            {hasArticles && dir.articles.map((article) => {
              const isActive = selectedArticle && selectedArticle.id === article.id
              return (
                <div
                  key={article.id}
                  className={`group flex items-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/30 border-l-2 border-blue-600' : ''
                  }`}
                  style={{ paddingLeft: `${28 + level * 16}px` }}
                >
                  <button
                    onClick={() => {
                      onArticleSelect && onArticleSelect(article.id)
                      onItemClick && onItemClick()
                    }}
                    className={`flex-1 flex items-center text-left min-w-0 ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    title={article.title}
                  >
                    <FileText size={14} className={`mr-2 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className="text-sm truncate">{article.title}</span>
                  </button>
                  
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditArticle(article)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
                      title="编辑文章"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-red-600"
                      title="删除文章"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
            
            {/* 渲染子目录 */}
            {hasChildren && dir.children.map((child) => renderDirectory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  // 加载状态组件 - 灰色方块闪烁动画
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded"></div>
      ))}
    </div>
  )

  if (collapsed) {
    return (
      <nav className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 fixed left-0 top-16 z-20 w-12 transition-colors" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="p-2">
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 flex items-center text-gray-600 justify-center hover:bg-gray-100 rounded"
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
      <nav className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 fixed left-0 top-16 z-20 w-80 flex flex-col transition-colors" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">文章目录</h2>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onCreateDirectory && onCreateDirectory()}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                title="新建目录"
              >
                <FolderPlus size={16} />
              </button>
              <button
                onClick={onToggleCollapse}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
                title="收起目录"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {directoriesLoading ? (
              <LoadingSkeleton />
            ) : directories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>暂无目录</p>
                <button
                  onClick={() => onCreateDirectory && onCreateDirectory()}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />

      {/* 操作加载遮罩 */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">处理中...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}