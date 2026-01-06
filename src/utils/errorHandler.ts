import type { AppError } from '../types'

/**
 * 统一错误处理函数
 * @param error - 错误对象
 * @param userMessage - 用户友好的错误提示
 */
export const handleError = (error: unknown, userMessage?: string): void => {
  // 开发环境打印详细错误
  if (import.meta.env.DEV) {
    console.error('Error details:', error)
  }
  
  // 提取错误信息
  let message = userMessage
  
  if (!message) {
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    } else {
      message = '操作失败，请重试'
    }
  }
  
  // 显示用户提示
  window.toast?.error(message)
}

/**
 * 创建应用错误对象
 */
export const createAppError = (
  message: string, 
  code?: string, 
  details?: unknown
): AppError => ({
  message,
  code,
  details
})

/**
 * 判断是否为网络错误
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('network') || 
           error.message.includes('fetch') ||
           error.message.includes('timeout')
  }
  return false
}

/**
 * 判断是否为认证错误
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('401') || 
           error.message.includes('unauthorized') ||
           error.message.includes('authentication')
  }
  return false
}
