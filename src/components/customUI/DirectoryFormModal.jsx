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
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md transition-colors">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {editingDirectory ? '编辑目录' : '新建目录'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              目录名称 *
            </label>
            <input
              type="text"
              value={dirFormData.name}
              onChange={(e) => onFormDataChange({ ...dirFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 dark:focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={formLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-gray-900 dark:bg-blue-600 text-white rounded-md hover:bg-gray-800 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
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