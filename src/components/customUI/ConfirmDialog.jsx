import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = '确认', 
  cancelText = '取消',
  type = 'danger' // 'danger' | 'warning' | 'info'
}) {
  if (!isOpen) return null

  const typeStyles = {
    danger: {
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    },
    warning: {
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    },
    info: {
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  }

  const currentStyle = typeStyles[type]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full transition-colors">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${currentStyle.icon}`}>
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`px-4 py-2 text-white rounded-md focus:ring-2 focus:border-transparent ${currentStyle.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}