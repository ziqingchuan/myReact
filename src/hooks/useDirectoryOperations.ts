import { DirectoryTree } from '../lib/supabase'
import { db } from '../lib/supabase'
interface UseDirectoryOperationsProps {
  setFormLoading: (loading: boolean) => void
  loadDirectories: (showLoading?: boolean, forceRefresh?: boolean) => Promise<void>
  setDirFormData: (data: any) => void
  setEditingDirectory: (dir: DirectoryTree | null) => void
  setShowCreateDirForm: (show: boolean) => void
  invalidateCache: () => void
}

interface DirFormData {
  name: string
  parent_id: string
}

export function useDirectoryOperations({
  setFormLoading,
  loadDirectories,
  setDirFormData,
  setEditingDirectory,
  setShowCreateDirForm,
  invalidateCache
}: UseDirectoryOperationsProps) {
  const handleCreateDirectory = (): void => {
    setEditingDirectory(null)
    setDirFormData({
      name: '',
      parent_id: ''
    })
    setShowCreateDirForm(true)
  }

  const handleEditDirectory = (directory: DirectoryTree): void => {
    setEditingDirectory(directory)
    setDirFormData({
      name: directory.name,
      parent_id: directory.parent_id || ''
    })
    setShowCreateDirForm(true)
  }

  const handleSubmitDirectory = async (e: React.FormEvent, dirFormData: DirFormData, editingDirectory: DirectoryTree | null): Promise<void> => {
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
      alert('保存目录失败: ' + (error as Error).message)
    } finally {
      setFormLoading(false)
    }
  }

  const resetDirForm = (): void => {
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
