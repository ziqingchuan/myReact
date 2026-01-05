import { Calendar, Clock, User } from 'lucide-react'
import MarkdownRenderer from '../MarkdownRenderer'
import { formatDate, calculateReadTime } from '../../utils'
import '../../styles/ArticleView.css'

export default function ArticleView({ article, isDark = false }) {
  if (!article) {
    return (
      <div className={`article-view-empty ${isDark ? 'dark' : ''}`}>
        <h2 className="article-view-empty-title">文章不存在</h2>
        <p className="article-view-empty-text">请选择其他文章</p>
      </div>
    )
  }

  return (
    <div className={`article-view ${isDark ? 'dark' : ''}`}>
      <header className="article-view-header">
        <h1 className="article-view-title">
          {article.title}
        </h1>
        
        {article.description && (
          <p className="article-view-description">{article.description}</p>
        )}
        
        <div className="article-view-meta">
          <div className="article-view-meta-item">
            <Calendar size={16} className="article-view-meta-icon" />
            <span>发布于 {formatDate(article.created_at)}</span>
          </div>
          
          <div className="article-view-meta-item">
            <Clock size={16} className="article-view-meta-icon" />
            <span>阅读时间 {calculateReadTime(article.content)} 分钟</span>
          </div>
        </div>
      </header>

      <article className="article-view-content">
        <MarkdownRenderer content={article.content} isDark={isDark} />
      </article>

      <footer className="article-view-footer">
        <div className="article-view-footer-item">
          <Calendar size={14} className="article-view-footer-icon" />
          <span>最后更新于: {formatDate(article.updated_at)}</span>
        </div>
        <div className="article-view-footer-item">
          <User size={14} className="article-view-footer-icon" />
          <span>作者: Qingchuan Zi</span>
        </div>
      </footer>
    </div>
  )
}