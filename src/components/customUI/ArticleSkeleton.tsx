import '../../styles/Skeleton.css'
import { SkeletonProps } from '../../types'


export default function ArticleSkeleton({ isDark = false }: SkeletonProps) {
  return (
    <div className={`article-skeleton ${isDark ? 'dark' : ''}`}>
      <div className="article-skeleton-header">
        <div className="article-skeleton-title"></div>
        <div className="article-skeleton-subtitle"></div>
        
        <div className="article-skeleton-meta">
          <div className="article-skeleton-meta-item w-32"></div>
          <div className="article-skeleton-meta-item w-24"></div>
        </div>
      </div>

      <div className="article-skeleton-content">
        <div className="article-skeleton-paragraph">
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line w-5/6"></div>
        </div>

        <div className="article-skeleton-heading w-2/3"></div>

        <div className="article-skeleton-paragraph">
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line w-4/5"></div>
        </div>

        <div className="article-skeleton-code"></div>

        <div className="article-skeleton-paragraph">
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line w-3/4"></div>
        </div>

        <div className="article-skeleton-heading w-1/2"></div>

        <div className="article-skeleton-paragraph">
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line"></div>
          <div className="article-skeleton-line w-5/6"></div>
        </div>

        <div className="article-skeleton-list">
          <div className="article-skeleton-line w-11/12"></div>
          <div className="article-skeleton-line w-10/12"></div>
          <div className="article-skeleton-line w-11/12"></div>
        </div>
      </div>
    </div>
  )
}
