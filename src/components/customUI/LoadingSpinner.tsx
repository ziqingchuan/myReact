import '../../styles/LoadingSpinner.css'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface LoadingSpinnerProps {
  size?: SpinnerSize
  className?: string
  isDark?: boolean
}

export default function LoadingSpinner({ size = 'md', className = '', isDark = false }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner size-${size} ${isDark ? 'dark' : ''} ${className}`}>
      <div className="loading-spinner-spinner" />
    </div>
  )
}

interface LoadingOverlayProps {
  message?: string
  className?: string
  isDark?: boolean
}

export function LoadingOverlay({ message = '加载中...', className = '', isDark = false }: LoadingOverlayProps) {
  return (
    <div className={`loading-overlay ${isDark ? 'dark' : ''} ${className}`}>
      <LoadingSpinner size="lg" isDark={isDark} />
      <p className="loading-overlay-text">{message}</p>
    </div>
  )
}
