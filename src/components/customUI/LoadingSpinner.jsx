export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          border-2 border-gray-200 border-t-gray-600 
          rounded-full animate-spin
        `}
      />
    </div>
  )
}

export function LoadingOverlay({ message = '加载中...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size="lg" className="mb-3" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  )
}