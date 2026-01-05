import { Menu, Sun, Moon, Key, LogOut, Github } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import reactSvg from '../assets/react.svg'
import '../styles/Header.css'

interface HeaderProps {
  isMobile: boolean
  onMenuClick: () => void
  isDark: boolean
  onToggleDarkMode: () => void
  isAuthenticated: boolean
  onAuthClick: () => void
  onLogout: () => void
}

export default function Header({ isMobile, onMenuClick, isDark, onToggleDarkMode, isAuthenticated, onAuthClick, onLogout }: HeaderProps) {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    console.log('Header: 点击logo，即将导航到 /home')
    navigate('/home')
    console.log('Header: navigate 已调用')
  }

  return (
    <header className={`header ${isDark ? 'dark' : ''}`}>
      <div className="header-content">
        <div className="header-inner">
          <div className="header-left">
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="header-menu-btn"
              >
                <Menu size={20} />
              </button>
            )}
            
            <button 
              onClick={handleLogoClick}
              className="header-logo-btn"
            >
              <div className="header-logo-img">
                <img 
                  src={reactSvg} 
                  alt="logo" 
                  className="mx-auto"
                />
              </div>
              <span className="header-title">React 日记</span>
            </button>
          </div>

          <div className="header-right">
            <a
              href="https://github.com/ziqingchuan"
              target="_blank"
              rel="noopener noreferrer"
              className="header-icon-btn github-link"
              title="访问 GitHub"
            >
              <Github size={20} />
            </a>

            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className={`header-icon-btn auth-btn authenticated ${isDark ? 'dark' : ''}`}
                title="退出编辑模式"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className={`header-icon-btn auth-btn ${isDark ? 'dark' : ''}`}
                title="开启编辑权限"
              >
                <Key size={20} />
              </button>
            )}

            <button
              onClick={onToggleDarkMode}
              className={`header-icon-btn theme-btn ${isDark ? 'dark' : ''}`}
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
