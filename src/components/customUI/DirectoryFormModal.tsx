import { X } from 'lucide-react'
import CustomSelect from './CustomSelect'
import LoadingSpinner from './LoadingSpinner'
import '../../styles/Modal.css'
import { DirectoryFormModalProps } from '../../types'

export default function DirectoryFormModal({
  isOpen,
  editingDirectory,
  dirFormData,
  directories,
  formLoading,
  onClose,
  onSubmit,
  onFormDataChange,
  getDirectoryOptions,
  isDark = false
}: DirectoryFormModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className={`modal ${isDark ? 'dark' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingDirectory ? '编辑目录' : '新建目录'}
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">
              目录名称 *
            </label>
            <input
              type="text"
              value={dirFormData.name}
              onChange={(e) => onFormDataChange({ ...dirFormData, name: e.target.value })}
              className={`modal-form-input ${isDark ? 'dark' : ''}`}
              required
            />
          </div>
          
          <div className="modal-form-group">
            <label className="modal-form-label">
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
              isDark={isDark}
            />
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={formLoading}
              className={`modal-btn modal-btn-secondary ${isDark ? 'dark' : ''}`}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className={`modal-btn modal-btn-primary ${isDark ? 'dark' : ''}`}
            >
              <span className="modal-btn-content">
                {formLoading && <LoadingSpinner size="sm" />}
                <span>{editingDirectory ? '更新' : '创建'}</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
