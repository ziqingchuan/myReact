import { db } from '../lib/supabase'

export function useArticleOperations({
  setFormLoading,
  loadFirstArticle,
  loadDirectories,
  setFormData,
  setEditingArticle,
  setShowCreateForm
}) {
  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      directory_id: article.directory_id || '',
      is_published: article.is_published
    })
    setShowCreateForm(true)
  }

  const handleSubmitArticle = async (e, formData, editingArticle) => {
    e.preventDefault()
    
    setFormLoading(true)
    try {
      if (editingArticle) {
        await db.updateArticle(editingArticle.id, formData)
      } else {
        await db.createArticle(formData)
      }
      
      resetForm()
      // 立即刷新目录数据，显示加载状态
      await loadDirectories(true)
      await loadFirstArticle()
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const resetForm = () => {
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