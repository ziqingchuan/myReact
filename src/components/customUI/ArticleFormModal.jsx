import { X } from 'lucide-react'
import CustomSelect from './CustomSelect'
import LoadingSpinner from './LoadingSpinner'
import ToggleSwitch from './ToggleSwitch'
import '../../styles/Modal.css'

export default function ArticleFormModal({
  isOpen,
  editingArticle,
  formData,
  directories,
  formLoading,
  onClose,
  onSubmit,
  onFormDataChange,
  getDirectoryOptions,
  isDark = false
}) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className={`modal large custom-scrollbar ${isDark ? 'dark' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingArticle ? '编辑文章' : '新建文章'}
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">
              文章标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              className={`modal-form-input ${isDark ? 'dark' : ''}`}
              required
            />
          </div>
          
          <div className="modal-form-group">
            <label className="modal-form-label">
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
              isDark={isDark}
            />
          </div>
          
          <div className="modal-form-group">
            <label className="modal-form-label">
              文章内容 (Markdown) *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => onFormDataChange({ ...formData, content: e.target.value })}
              rows={20}
              className={`modal-form-textarea ${isDark ? 'dark' : ''}`}
              placeholder="使用 Markdown 格式编写文章内容..."
              required
            />
          </div>
          
          <div className="modal-divider">
            <ToggleSwitch
              checked={formData.is_published}
              onChange={(value) => onFormDataChange({ ...formData, is_published: value })}
              label="立即发布"
              description="开启后文章将在网站上可见，关闭则仅保存到数据库"
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
                <span>{editingArticle ? '更新' : '创建'}</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}