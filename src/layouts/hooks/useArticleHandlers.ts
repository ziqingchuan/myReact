import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticleStore, useDirectoryStore } from '../../store'
import { Article } from '../../types'
import { handleError } from '../../utils/errorHandler'

/**
 * 文章操作 Handlers Hook
 * 
 * 提供文章创建、编辑和提交的处理函数
 * 使用 Zustand 状态管理来处理文章数据和表单状态
 */
export function useArticleHandlers() {
  const navigate = useNavigate()
  
  const editingArticle = useArticleStore(state => state.editingArticle)
  const formData = useArticleStore(state => state.formData)
  const setEditingArticle = useArticleStore(state => state.setEditingArticle)
  const setShowCreateForm = useArticleStore(state => state.setShowCreateForm)
  const setFormData = useArticleStore(state => state.setFormData)
  const createArticle = useArticleStore(state => state.createArticle)
  const updateArticle = useArticleStore(state => state.updateArticle)
  const resetArticleForm = useArticleStore(state => state.resetArticleForm)
  
  const invalidateDirectoryCache = useDirectoryStore(state => state.invalidateCache)
  const loadDirectories = useDirectoryStore(state => state.loadDirectories)

  /**
   * 处理创建文章操作
   * 
   * @param directoryId - 目录ID，文章将被创建到该目录下
   */
  const handleCreateArticle = useCallback((directoryId: string) => {
    setFormData({ ...formData, directory_id: directoryId })
    setShowCreateForm(true)
  }, [formData, setFormData, setShowCreateForm])

  /**
   * 处理编辑文章操作
   * 
   * @param article - 要编辑的文章对象
   */
  const handleEditArticle = useCallback((article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      directory_id: article.directory_id || '',
      is_published: article.is_published
    })
    setShowCreateForm(true)
  }, [setEditingArticle, setFormData, setShowCreateForm])

  /**
   * 处理文章提交操作
   * 
   * @param e - 表单提交事件对象
   * @returns Promise<void>
   */
  const handleSubmitArticle = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let articleId: string
      
      if (editingArticle) {
        // 编辑现有文章
        await updateArticle(editingArticle.id, formData)
        articleId = editingArticle.id
      } else {
        // 创建新文章
        articleId = await createArticle(formData)
      }
      
      // 刷新目录（因为文章数量可能变化）
      invalidateDirectoryCache()
      await loadDirectories(true, true)
      
      resetArticleForm()
      window.toast?.success(editingArticle ? '文章更新成功' : '文章创建成功')
      
      // 跳转到文章页面（无论是新建还是编辑）
      navigate(`/article/${articleId}`)
    } catch (error) {
      handleError(error, '保存文章失败')
    }
  }, [editingArticle, formData, updateArticle, createArticle, invalidateDirectoryCache, loadDirectories, resetArticleForm, navigate])

  return {
    handleCreateArticle,
    handleEditArticle,
    handleSubmitArticle
  }
}
