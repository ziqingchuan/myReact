import '../../styles/LoadingSpinner.css'
import { LoadingSpinnerProps, LoadingOverlayProps } from '../../types'

export default function LoadingSpinner({ size = 'md', className = '', isDark = false }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner size-${size} ${isDark ? 'dark' : ''} ${className}`}>
      <div className="loading-spinner-spinner" />
    </div>
  )
}

export function LoadingOverlay({ message = '加载中...', className = '', isDark = false }: LoadingOverlayProps) {
  return (
    <div className={`loading-overlay ${isDark ? 'dark' : ''} ${className}`}>
      <LoadingSpinner size="lg" isDark={isDark} />
      <p className="loading-overlay-text">{message}</p>
    </div>
  )
}
