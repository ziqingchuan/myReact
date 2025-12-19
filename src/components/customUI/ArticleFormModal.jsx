import { X } from 'lucide-react'
import CustomSelect from './CustomSelect'
import LoadingSpinner from './LoadingSpinner'

export default function ArticleFormModal({
  isOpen,
  editingArticle,
  formData,
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
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingArticle ? '编辑文章' : '新建文章'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              所属目录
            </label>
            <CustomSelect
              value={formData.directory_id}
              onChange={(value) => onFormDataChange({ ...formData, directory_id: value })}
              options={[
                { value: '', label: '选择目录' },
                ...getDirectoryOptions(directories)
              ]}
              placeholder="选择目录"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章内容 (Markdown) *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => onFormDataChange({ ...formData, content: e.target.value })}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent font-mono text-sm"
              placeholder="使用 Markdown 格式编写文章内容..."
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => onFormDataChange({ ...formData, is_published: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="is_published" className="text-sm text-gray-700">
              立即发布
            </label>
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
              <span>{editingArticle ? '更新' : '创建'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}