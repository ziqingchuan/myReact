import { create } from 'zustand'
import { CACHE, DEFAULTS } from '../constants'

interface AuthStore {
  // 状态
  isAuthenticated: boolean

  // 操作
  login: (password: string) => Promise<void>
  logout: () => void
}

// 初始化认证状态
const getInitialAuth = (): boolean => {
  return localStorage.getItem(CACHE.KEYS.AUTH) === 'true'
}

export const useAuthStore = create<AuthStore>((set) => ({
  // 初始状态
  isAuthenticated: getInitialAuth(),

  // 操作
  login: async (password) => {
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || DEFAULTS.ADMIN_PASSWORD
    
    if (password === correctPassword) {
      set({ isAuthenticated: true })
      localStorage.setItem(CACHE.KEYS.AUTH, 'true')
    } else {
      throw new Error('密码错误')
    }
  },

  logout: () => {
    set({ isAuthenticated: false })
    localStorage.removeItem(CACHE.KEYS.AUTH)
  }
}))
