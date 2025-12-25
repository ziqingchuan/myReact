import { useState, useEffect } from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'
import reactSvg from '../../assets/welcome-logo.svg'

export default function WelcomePage({ onArticleSelect }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleStartLearning = () => {
    if (onArticleSelect) {
      onArticleSelect('16754dea-2ebd-45c8-a8ec-a7516796f5ab')
    }
  }

  const features = [
    {
      title: '声明式编程',
      description: '按状态设计视图，数据变动时高效更新渲染组件',
      color: 'bg-blue-500'
    },
    {
      title: '组件化开发',
      description: '封装组件并组合，通过JavaScript传递管理数据',
      color: 'bg-purple-500'
    },
    {
      title: '一次学习，随处编写',
      description: '兼容现有技术栈，支持服务端渲染和原生开发',
      color: 'bg-green-500'
    },
    {
      title: 'Hooks 特性',
      description: '无需类组件即可使用state，支持自定义Hook',
      color: 'bg-orange-500'
    },
    {
      title: '虚拟 DOM',
      description: '最小化真实DOM交互，计算最小变更提升性能',
      color: 'bg-cyan-500'
    },
    {
      title: '丰富的生态系统',
      description: '社区庞大，拥有各类成熟的第三方解决方案',
      color: 'bg-pink-500'
    }
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-4 overflow-hidden flex items-center justify-center">
      <div className="max-w-6xl mx-auto">
        {/* Hero 区域 */}
        <div 
          className={`flex flex-col lg:flex-row items-center justify-between gap-12 mb-24 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* 左侧内容 */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-bold mb-6">
              React
            </h1>
            <h2 className="text-gray-800 dark:text-gray-200 text-2xl md:text-2xl font-semibold mb-6">
              用于构建用户界面的 JavaScript 库
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-xl">
              从左侧目录选择文章开始学习 React 的核心概念、最佳实践和高级特性
            </p>

            {/* 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={handleStartLearning}
                className="px-8 py-3 bg-[#001529] dark:bg-gray-800 border-2 dark:border-gray-600 border-gray-300 hover:border-blue-800 dark:hover:border-blue-500 text-white dark:text-gray-300 dark:hover:text-blue-400 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <BookOpen className="w-5 h-5" />
                开始学习
              </button>
              <a 
                href="https://react.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                官方文档
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 右侧 Logo */}
          <div className="flex-shrink-0">
            <div className="w-64 h-64 md:w-60 md:h-60 flex items-center justify-center">
              <img 
                src={reactSvg} 
                alt="React Logo" 
                className="w-full h-full animate-spin-slow opacity-90"
              />
            </div>
          </div>
        </div>

        {/* 特性网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${(index + 1) * 60}ms`
              }}
            >
              {/* 圆点图标 */}
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${feature.color}`}></div>
                <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
                  {feature.title}
                </h3>
              </div>

              {/* 描述 */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
