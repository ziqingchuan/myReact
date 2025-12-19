import ArticleView from './ArticleView'
import ArticleNotFound from './ArticleNotFound'
import WelcomePage from './WelcomePage'
import { LoadingOverlay } from './customUI/LoadingSpinner'

export default function MainContent({ 
  loading, 
  articleLoading, 
  articleNotFound, 
  selectedArticle, 
  onReturnHome 
}) {
  return (
    <main className="flex-1 min-w-0 overflow-auto h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
        {loading ? (
          <LoadingOverlay message="正在加载..." />
        ) : articleLoading ? (
          <LoadingOverlay message="正在加载文章..." />
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