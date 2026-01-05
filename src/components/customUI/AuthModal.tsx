import { useState } from 'react'
import { X, Key } from 'lucide-react'
import '../../styles/Modal.css'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (secret: string) => boolean
  isDark?: boolean
}

export default function AuthModal({ isOpen, onClose, onSubmit, isDark = false }: AuthModalProps) {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!secret.trim()) {
      setError('请输入密钥')
      return
    }

    const success = onSubmit(secret)
    if (success) {
      setSecret('')
      setError('')
      onClose()
    } else {
      setError('密钥错误，请重试')
      setSecret('')
    }
  }

  const handleClose = () => {
    setSecret('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className={`modal ${isDark ? 'dark' : ''}`}>
        <div className="modal-header">
          <div className="modal-header-with-icon">
            <Key size={20} className="modal-header-icon info" />
            <h2 className="modal-title">
              身份验证
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">
              请输入管理员密钥
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => {
                setSecret(e.target.value)
                setError('')
              }}
              placeholder="输入密钥以开启编辑权限"
              className={`modal-form-input ${isDark ? 'dark' : ''}`}
              autoFocus
            />
            {error && (
              <p className={`modal-form-error ${isDark ? 'dark' : ''}`}>{error}</p>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className={`modal-btn modal-btn-secondary ${isDark ? 'dark' : ''}`}
            >
              取消
            </button>
            <button
              type="submit"
              className={`modal-btn modal-btn-info ${isDark ? 'dark' : ''}`}
            >
              验证
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
