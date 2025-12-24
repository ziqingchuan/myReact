import { Calendar, Clock, User } from 'lucide-react'
import MarkdownRenderer from '../MarkdownRenderer'

export default function ArticleView({ article }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">文章不存在</h2>
        <p className="text-gray-600 dark:text-gray-400">请选择其他文章</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto min-h-full">
      {/* 文章头部 */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {article.title}
        </h1>
        
        {article.description && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{article.description}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>发布于 {formatDate(article.created_at)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>阅读时间 {calculateReadTime(article.content)} 分钟</span>
          </div>
        </div>
      </header>

      {/* 文章内容 */}
      <article className="prose max-w-none pb-8">
        <MarkdownRenderer content={article.content} />
      </article>

      {/* 文章底部信息 */}
      <footer className="mt-8 pt-8 pb-10 border-t border-gray-200 dark:border-gray-700 flex flex-col items-end gap-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={14} className="mr-2" />
          <span>最后更新于: {formatDate(article.updated_at)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <User size={14} className="mr-2" />
          <span>作者: Qingchuan Zi</span>
        </div>
      </footer>
    </div>
  )
}