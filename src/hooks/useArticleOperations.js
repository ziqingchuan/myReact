import { db } from '../lib/supabase'

export function useArticleOperations({
  setFormLoading,
  loadDirectories,
  setFormData,
  setEditingArticle,
  setShowCreateForm,
  invalidateCache,
  handleArticleSelect
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
      let articleId
      
      if (editingArticle) {
        // 更新文章
        await db.updateArticle(editingArticle.id, formData)
        articleId = editingArticle.id
      } else {
        // 创建新文章
        const newArticle = await db.createArticle(formData)
        articleId = newArticle.id
      }
      
      resetForm()
      
      // 清除缓存
      invalidateCache()
      
      // 强制刷新目录数据
      await loadDirectories(true, true)
      
      // 加载刚刚保存/创建的文章
      if (articleId) {
        await handleArticleSelect(articleId)
      }
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