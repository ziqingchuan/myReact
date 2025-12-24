import ArticleView from './ArticleView'
import ArticleNotFound from './ArticleNotFound'
import WelcomePage from './WelcomePage'
import ArticleSkeleton from './ArticleSkeleton'

export default function MainContent({ 
  loading, 
  articleLoading, 
  articleNotFound, 
  selectedArticle, 
  onReturnHome 
}) {
  return (
    <main className="flex-1 min-w-0 overflow-auto h-screen bg-white dark:bg-gray-900 transition-colors custom-scrollbar">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
        {loading ? (
          <ArticleSkeleton />
        ) : articleLoading ? (
          <ArticleSkeleton />
        ) : articleNotFound ? (
          <ArticleNotFound onReturnHome={onReturnHome} />
        ) : selectedArticle ? (
          <ArticleView article={selectedArticle} />
        ) : (
          <WelcomePage />
        )}
      </div>
    </main>
  )
}