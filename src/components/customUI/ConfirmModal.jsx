import { AlertTriangle, X } from 'lucide-react'
import '../../styles/Modal.css'

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = '确认', 
  cancelText = '取消',
  type = 'danger',
  isDark = false
}) {
  if (!isOpen) return null

  const typeStyles = {
    danger: {
      icon: 'danger',
      button: 'modal-btn-danger'
    },
    warning: {
      icon: 'warning',
      button: 'modal-btn-warning'
    },
    info: {
      icon: 'info',
      button: 'modal-btn-info'
    }
  }

  const currentStyle = typeStyles[type]

  return (
    <div className="modal-overlay">
      <div className={`modal ${isDark ? 'dark' : ''}`}>
        <div className={`modal-header ${isDark ? 'dark' : ''}`}>
          <div className="modal-header-with-icon">
            <div className={`modal-header-icon ${currentStyle.icon}`}>
              <AlertTriangle size={20} />
            </div>
            <h3 className={`modal-title ${isDark ? 'dark' : ''}`}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            className={`modal-close-btn ${isDark ? 'dark' : ''}`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p className={`modal-message ${isDark ? 'dark' : ''}`}>{message}</p>
          
          <div className="modal-footer">
            <button
              onClick={onClose}
              className={`modal-btn modal-btn-secondary ${isDark ? 'dark' : ''}`}
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`modal-btn ${currentStyle.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}