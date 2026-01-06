import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticleStore, useDirectoryStore } from '../../store'
import { Article } from '../../lib/supabase'
import { handleError } from '../../utils/errorHandler'

/**
 * 文章操作 Handlers Hook
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

  const handleCreateArticle = useCallback((directoryId: string) => {
    setFormData({ ...formData, directory_id: directoryId })
    setShowCreateForm(true)
  }, [formData, setFormData, setShowCreateForm])

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
