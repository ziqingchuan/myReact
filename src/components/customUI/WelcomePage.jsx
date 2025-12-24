import { BookOpen, ExternalLink } from 'lucide-react'
import reactSvg from '../../assets/react.svg'

export default function WelcomePage() {
  const links = [
    {
      name: 'QCloud 文件云盘',
      url: 'https://try-catch.life/QCloud',
      description: '个人文件云存储服务',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: '个人博客',
      url: 'https://try-catch.life',
      description: '技术分享与生活记录',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'DailyUp 日报系统',
      url: 'https://try-catch.life/DailyUp',
      description: '每日工作记录与总结',
      color: 'from-green-500 to-green-600'
    },
    {
      name: '素笔 Markdown',
      url: 'https://marklite.cn',
      description: '简洁优雅的 Markdown 编辑器',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* 主标题区域 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-6 shadow-lg">
            <img 
              src={reactSvg} 
              alt="logo" 
              className="w-10 h-10 text-white"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 dark:text-gray-100">
            React 日记
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-500">
            从左侧目录选择文章开始学习
          </p>
        </div>

        {/* 友情链接 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">友情链接</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${link.color} mr-2`}></div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {link.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {link.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            💡 提示：点击左上角图标可以展开/收起侧边栏
          </p>
        </div>
      </div>
    </div>
  )
}