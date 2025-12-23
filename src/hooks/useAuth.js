import { useState, useEffect } from 'react'

const AUTH_KEY = 'admin_authenticated'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 检查 localStorage 中是否已认证
    const authStatus = localStorage.getItem(AUTH_KEY)
    setIsAuthenticated(authStatus === 'true')
  }, [])

  const login = (secret) => {
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET
    if (secret === adminSecret) {
      localStorage.setItem(AUTH_KEY, 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    login,
    logout
  }
}
