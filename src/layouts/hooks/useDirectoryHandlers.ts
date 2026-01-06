import { useCallback } from 'react'
import { useDirectoryStore } from '../../store'
import { handleError } from '../../utils/errorHandler'

/**
 * 目录操作 Handlers Hook
 */
export function useDirectoryHandlers() {
  const editingDirectory = useDirectoryStore(state => state.editingDirectory)
  const dirFormData = useDirectoryStore(state => state.dirFormData)
  const setEditingDirectory = useDirectoryStore(state => state.setEditingDirectory)
  const setShowCreateDirForm = useDirectoryStore(state => state.setShowCreateDirForm)
  const setDirFormData = useDirectoryStore(state => state.setDirFormData)
  const createDirectory = useDirectoryStore(state => state.createDirectory)
  const updateDirectory = useDirectoryStore(state => state.updateDirectory)
  const resetDirectoryForm = useDirectoryStore(state => state.resetDirectoryForm)

  const handleEditDirectory = useCallback((directory: any) => {
    setEditingDirectory(directory)
    setDirFormData({
      name: directory.name,
      parent_id: directory.parent_id || ''
    })
    setShowCreateDirForm(true)
  }, [setEditingDirectory, setDirFormData, setShowCreateDirForm])

  const handleCreateDirectory = useCallback((parentId: string = '') => {
    setDirFormData({ name: '', parent_id: parentId })
    setShowCreateDirForm(true)
  }, [setDirFormData, setShowCreateDirForm])

  const handleSubmitDirectory = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingDirectory) {
        await updateDirectory(editingDirectory.id, dirFormData)
      } else {
        await createDirectory(dirFormData)
      }
      
      resetDirectoryForm()
      window.toast?.success(editingDirectory ? '目录更新成功' : '目录创建成功')
    } catch (error) {
      handleError(error, '保存目录失败')
    }
  }, [editingDirectory, dirFormData, updateDirectory, createDirectory, resetDirectoryForm])

  return {
    handleEditDirectory,
    handleCreateDirectory,
    handleSubmitDirectory
  }
}
