import { create } from 'zustand'
import { CACHE } from '../constants'
import { UIStore } from '../types'

// 初始化暗色模式
const getInitialDarkMode = (): boolean => {
  const saved = localStorage.getItem(CACHE.KEYS.DARK_MODE)
  if (saved !== null) {
    return saved === 'true'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useUIStore = create<UIStore>((set, get) => ({
  // 初始状态
  sidebarOpen: false,
  isMobile: false,
  sidebarCollapsed: false,
  tocCollapsed: false,
  isDark: getInitialDarkMode(),

  // 操作
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setTocCollapsed: (collapsed) => set({ tocCollapsed: collapsed }),
  
  toggleSidebarCollapse: () => set((state) => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
  
  toggleTocCollapse: () => set((state) => ({ 
    tocCollapsed: !state.tocCollapsed 
  })),

  toggleDarkMode: () => {
    const newDarkMode = !get().isDark
    set({ isDark: newDarkMode })
    localStorage.setItem(CACHE.KEYS.DARK_MODE, String(newDarkMode))
    document.documentElement.classList.toggle('dark', newDarkMode)
  }
}))

// 初始化暗色模式
if (getInitialDarkMode()) {
  document.documentElement.classList.add('dark')
}
