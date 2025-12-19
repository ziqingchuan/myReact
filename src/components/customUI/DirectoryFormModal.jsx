import { X } from 'lucide-react'
import CustomSelect from './CustomSelect'
import LoadingSpinner from './LoadingSpinner'

export default function DirectoryFormModal({
  isOpen,
  editingDirectory,
  dirFormData,
  directories,
  formLoading,
  onClose,
  onSubmit,
  onFormDataChange,
  getDirectoryOptions
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingDirectory ? '编辑目录' : '新建目录'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目录名称 *
            </label>
            <input
              type="text"
              value={dirFormData.name}
              onChange={(e) => onFormDataChange({ ...dirFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              父目录
            </label>
            <CustomSelect
              value={dirFormData.parent_id}
              onChange={(value) => onFormDataChange({ ...dirFormData, parent_id: value })}
              options={[
                { value: '', label: '根目录' },
                ...getDirectoryOptions(
                  directories.filter((dir) => !editingDirectory || dir.id !== editingDirectory.id)
                )
              ]}
              placeholder="选择父目录"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={formLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {formLoading && <LoadingSpinner size="sm" />}
              <span>{editingDirectory ? '更新' : '创建'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}