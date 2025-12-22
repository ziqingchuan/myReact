import { db } from '../lib/supabase'

export function useDirectoryOperations({
  setFormLoading,
  loadDirectories,
  setDirFormData,
  setEditingDirectory,
  setShowCreateDirForm,
  invalidateCache
}) {
  const handleCreateDirectory = () => {
    setEditingDirectory(null)
    setDirFormData({
      name: '',
      parent_id: ''
    })
    setShowCreateDirForm(true)
  }

  const handleEditDirectory = (directory) => {
    setEditingDirectory(directory)
    setDirFormData({
      name: directory.name,
      parent_id: directory.parent_id || ''
    })
    setShowCreateDirForm(true)
  }

  const handleSubmitDirectory = async (e, dirFormData, editingDirectory) => {
    e.preventDefault()
    
    if (!dirFormData.name.trim()) {
      alert('请输入目录名称')
      return
    }
    
    setFormLoading(true)
    try {
      const dirData = {
        name: dirFormData.name.trim(),
        parent_id: dirFormData.parent_id || null
      }
      
      if (editingDirectory) {
        await db.updateDirectory(editingDirectory.id, dirData)
      } else {
        await db.createDirectory(dirData)
      }
      
      resetDirForm()
      
      // 清除缓存
      invalidateCache()
      
      // 强制刷新目录数据，显示加载状态
      await loadDirectories(true, true)
    } catch (error) {
      console.error('保存目录失败:', error)
      alert('保存目录失败: ' + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const resetDirForm = () => {
    setDirFormData({
      name: '',
      parent_id: ''
    })
    setEditingDirectory(null)
    setShowCreateDirForm(false)
  }

  return {
    handleCreateDirectory,
    handleEditDirectory,
    handleSubmitDirectory,
    resetDirForm
  }
}