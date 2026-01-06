import { createRoot } from 'react-dom/client'
import { useState, useCallback } from 'react'
import Toast from './Toast'
import { ToastItem, ToastType } from '../../types'


let toastRoot: any = null
let toastContainer: HTMLDivElement | null = null

function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, type, message, duration }])
    return id
  }, [])

  if (typeof window !== 'undefined') {
    (window as any).toast = {
      success: (message: string, duration?: number) => addToast('success', message, duration),
      error: (message: string, duration?: number) => addToast('error', message, duration),
      warning: (message: string, duration?: number) => addToast('warning', message, duration),
      info: (message: string, duration?: number) => addToast('info', message, duration)
    }
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

export function initToast() {
  if (toastContainer) return

  toastContainer = document.createElement('div')
  document.body.appendChild(toastContainer)
  toastRoot = createRoot(toastContainer)
  toastRoot.render(<ToastContainer />)
}

declare global {
  interface Window {
    toast?: {
      success: (message: string, duration?: number) => string
      error: (message: string, duration?: number) => string
      warning: (message: string, duration?: number) => string
      info: (message: string, duration?: number) => string
    }
  }
}
