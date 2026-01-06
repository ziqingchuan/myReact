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

  /**
   * 处理目录编辑操作
   * 
   * @param directory - 要编辑的目录对象，包含名称和父级ID等信息
   */
  const handleEditDirectory = useCallback((directory: any) => {
    setEditingDirectory(directory)
    setDirFormData({
      name: directory.name,
      parent_id: directory.parent_id || ''
    })
    setShowCreateDirForm(true)
  }, [setEditingDirectory, setDirFormData, setShowCreateDirForm])

  /**
   * 处理目录创建操作
   * 
   * @param parentId - 父级目录ID，默认为空字符串表示顶级目录
   */
  const handleCreateDirectory = useCallback((parentId: string = '') => {
    setDirFormData({ name: '', parent_id: parentId })
    setShowCreateDirForm(true)
  }, [setDirFormData, setShowCreateDirForm])

  /**
   * 处理目录表单提交操作
   * 
   * @param e - 表单提交事件对象
   * @returns Promise<void>
   * 
   * @description
   * 根据当前是否有编辑中的目录，决定执行更新或创建操作。
   * 成功后重置表单并显示成功提示，失败时处理错误。
   */
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
