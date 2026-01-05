import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // 从 localStorage 读取用户偏好
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    // 如果没有保存的偏好，使用系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // 更新 HTML 元素的 class
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // 保存到 localStorage
    localStorage.setItem('darkMode', isDark.toString())
  }, [isDark])

  const toggleDarkMode = (): void => {
    setIsDark(prev => !prev)
  }

  return { isDark, toggleDarkMode }
}
