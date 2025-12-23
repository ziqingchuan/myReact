import { Menu, Sun, Moon, Key, LogOut } from 'lucide-react'
import reactSvg from '../assets/react.svg'

export default function Header({ isMobile, onMenuClick, isDark, onToggleDarkMode, isAuthenticated, onAuthClick, onLogout }) {
  return (
    <header className="bg-[#001529] dark:bg-gray-900 border-b border-gray-700 dark:border-gray-800 sticky top-0 z-30 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-md text-white transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img 
                  src={reactSvg} 
                  alt="logo" 
                  className="mx-auto"
                />
              </div>
              <span className="text-xl font-bold text-white">React 日记</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* 权限按钮 */}
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-md text-green-400 transition-colors"
                title="退出编辑模式"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-md text-white transition-colors"
                title="开启编辑权限"
              >
                <Key size={20} />
              </button>
            )}

            {/* 暗黑模式切换按钮 */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-md text-white transition-colors"
              title={isDark ? '切换到明亮模式' : '切换到暗黑模式'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}