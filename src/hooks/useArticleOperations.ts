import { Article } from '../lib/supabase'
import { db } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface UseArticleOperationsProps {
  setFormLoading: (loading: boolean) => void
  loadDirectories: (showLoading?: boolean, forceRefresh?: boolean) => Promise<void>
  setFormData: (data: any) => void
  setEditingArticle: (article: Article | null) => void
  setShowCreateForm: (show: boolean) => void
  invalidateCache: () => void
  handleArticleSelect: (articleId: string) => Promise<void>
}

interface FormData {
  title: string
  content: string
  directory_id: string
  is_published: boolean
}

export function useArticleOperations({
  setFormLoading,
  loadDirectories,
  setFormData,
  setEditingArticle,
  setShowCreateForm,
  invalidateCache,
  handleArticleSelect
}: UseArticleOperationsProps) {
  const navigate = useNavigate()

  const handleEditArticle = (article: Article): void => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      directory_id: article.directory_id || '',
      is_published: article.is_published
    })
    setShowCreateForm(true)
  }

  const handleSubmitArticle = async (e: React.FormEvent, formData: FormData, editingArticle: Article | null): Promise<void> => {
    e.preventDefault()
    
    setFormLoading(true)
    try {
      let articleId: string | undefined
      
      if (editingArticle) {
        await db.updateArticle(editingArticle.id, formData)
        articleId = editingArticle.id
      } else {
        const newArticle = await db.createArticle(formData)
        articleId = newArticle.id
      }
      
      resetForm()
      
      invalidateCache()
      
      await loadDirectories(true, true)
      
      if (articleId) {
        // 确保数据库更新完成后再加载文章
        // 添加短暂延迟以确保数据一致性
        await new Promise(resolve => setTimeout(resolve, 100))
        await handleArticleSelect(articleId)
        
        // 如果是编辑现有文章，触发强制刷新事件
        if (editingArticle) {
          window.dispatchEvent(new CustomEvent('articleUpdated', { 
            detail: { articleId } 
          }))
        }
        
        navigate(`/article/${articleId}`)
      }
    } catch (error) {
      console.error('保存失败:', error)
      window.toast?.error('保存失败: ' + (error as Error).message)
    } finally {
      setFormLoading(false)
    }
  }

  const resetForm = (): void => {
    setFormData({
      title: '',
      content: '',
      directory_id: '',
      is_published: true
    })
    setEditingArticle(null)
    setShowCreateForm(false)
  }

  return {
    handleEditArticle,
    handleSubmitArticle,
    resetForm
  }
}
