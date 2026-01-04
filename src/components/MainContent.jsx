import ArticleView from './customUI/ArticleView'
import ArticleNotFound from './customUI/ArticleNotFound'
import WelcomePage from './customUI/WelcomePage'
import ArticleSkeleton from './customUI/ArticleSkeleton'
import '../styles/MainContent.css'

export default function MainContent({ 
  loading, 
  articleLoading, 
  articleNotFound, 
  selectedArticle, 
  onReturnHome,
  onArticleSelect,
  isDark
}) {
  return (
    <main className={`main-content custom-scrollbar ${isDark ? 'dark' : ''}`}>
      <div className="main-content-inner">
        {loading ? (
          <ArticleSkeleton isDark={isDark} />
        ) : articleLoading ? (
          <ArticleSkeleton isDark={isDark} />
        ) : articleNotFound ? (
          <ArticleNotFound onReturnHome={onReturnHome} isDark={isDark} />
        ) : selectedArticle ? (
          <ArticleView article={selectedArticle} isDark={isDark} />
        ) : (
          <WelcomePage onArticleSelect={onArticleSelect} isDark={isDark} />
        )}
      </div>
    </main>
  )
}