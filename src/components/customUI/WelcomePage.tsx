import { useState, useEffect } from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'
import reactSvg from '../../assets/welcome-logo.svg'
import '../../styles/WelcomePage.css'

interface Feature {
  title: string
  description: string
  color: string
}

interface WelcomePageProps {
  onArticleSelect: (articleId: string) => void
  isDark?: boolean
}

export default function WelcomePage({ onArticleSelect, isDark = false }: WelcomePageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleStartLearning = () => {
    if (onArticleSelect) {
      onArticleSelect('16754dea-2ebd-45c8-a8ec-a7516796f5ab')
    }
  }

  const features: Feature[] = [
    {
      title: '声明式编程',
      description: '按状态设计视图，数据变动时高效更新渲染组件',
      color: 'blue'
    },
    {
      title: '组件化开发',
      description: '封装组件并组合，通过JavaScript传递管理数据',
      color: 'purple'
    },
    {
      title: '一次学习，随处编写',
      description: '兼容现有技术栈，支持服务端渲染和原生开发',
      color: 'green'
    },
    {
      title: 'Hooks 特性',
      description: '无需类组件即可使用state，支持自定义Hook',
      color: 'orange'
    },
    {
      title: '虚拟 DOM',
      description: '最小化真实DOM交互，计算最小变更提升性能',
      color: 'cyan'
    },
    {
      title: '丰富的生态系统',
      description: '社区庞大，拥有各类成熟的第三方解决方案',
      color: 'pink'
    }
  ]

  return (
    <div className={`welcome-page ${isDark ? 'dark' : ''}`}>
      <div className="welcome-page-content">
        <div 
          className={`welcome-hero ${isVisible ? 'visible' : 'hidden'}`}
        >
          <div className="welcome-hero-left">
            <h1 className="welcome-title">
              React
            </h1>
            <h2 className="welcome-subtitle">
              用于构建用户界面的 JavaScript 库
            </h2>
            <p className="welcome-description">
              从左侧目录选择文章开始学习 React 的核心概念、最佳实践和高级特性
            </p>

            <div className="welcome-buttons">
              <button 
                onClick={handleStartLearning}
                className="welcome-btn welcome-btn-primary"
              >
                <BookOpen className="icon" />
                开始学习
              </button>
              <a 
                href="https://react.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="welcome-btn welcome-btn-secondary"
              >
                官方文档
                <ExternalLink className="icon" />
              </a>
            </div>
          </div>

          <div className="welcome-logo">
            <div className="welcome-logo-container">
              <img 
                src={reactSvg} 
                alt="React Logo" 
                className="welcome-logo-img"
              />
            </div>
          </div>
        </div>

        <div className="welcome-features">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`welcome-feature ${isVisible ? 'visible' : 'hidden'}`}
              style={{
                transitionDelay: `${(index + 1) * 60}ms`
              }}
            >
              <div className="welcome-feature-header">
                <div className={`welcome-feature-dot ${feature.color}`}></div>
                <h3 className="welcome-feature-title">
                  {feature.title}
                </h3>
              </div>

              <p className="welcome-feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
