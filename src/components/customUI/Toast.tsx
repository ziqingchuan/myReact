import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'
import '../../styles/Toast.css'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

export default function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  const Icon = icons[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        <Icon size={20} />
      </div>
      <div className="toast-message">{message}</div>
      <button
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="关闭"
      >
        <X size={16} />
      </button>
    </div>
  )
}
