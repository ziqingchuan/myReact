import notFoundSvg from '../../assets/notfound.svg'
import '../../styles/ArticleNotFound.css'

interface ArticleNotFoundProps {
  onReturnHome: () => void
  isDark?: boolean
}

export default function ArticleNotFound({ onReturnHome, isDark = false }: ArticleNotFoundProps) {
  return (
    <div className={`article-not-found ${isDark ? 'dark' : ''}`}>
      <div className="article-not-found-image">
        <img 
          src={notFoundSvg} 
          alt="文章未找到" 
        />
      </div>
      <h2 className="article-not-found-title">糟糕，该文章不见了</h2>
      <p className="article-not-found-text">您正在查看的文章已被删除或移动</p>
      <button
        onClick={onReturnHome}
        className="article-not-found-btn"
      >
        返回首页
      </button>
    </div>
  )
}
