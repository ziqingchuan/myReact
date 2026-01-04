import '../../styles/Skeleton.css'

export default function DirectorySkeleton({ isDark = false }) {
  return (
    <div className={`directory-skeleton ${isDark ? 'dark' : ''}`}>
      <div className="directory-skeleton-group">
        <div className="directory-skeleton-item">
          <div className="directory-skeleton-icon"></div>
          <div className="directory-skeleton-text w-32"></div>
        </div>
        <div className="directory-skeleton-sub">
          <div className="directory-skeleton-group">
            <div className="directory-skeleton-item">
              <div className="directory-skeleton-icon"></div>
              <div className="directory-skeleton-text w-40"></div>
            </div>
            <div className="directory-skeleton-item">
              <div className="directory-skeleton-icon"></div>
              <div className="directory-skeleton-text w-36"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="directory-skeleton-group">
        <div className="directory-skeleton-item">
          <div className="directory-skeleton-icon"></div>
          <div className="directory-skeleton-text w-28"></div>
        </div>
        <div className="directory-skeleton-sub">
          <div className="directory-skeleton-group">
            <div className="directory-skeleton-item">
              <div className="directory-skeleton-icon"></div>
              <div className="directory-skeleton-text w-44"></div>
            </div>
            <div className="directory-skeleton-item">
              <div className="directory-skeleton-icon"></div>
              <div className="directory-skeleton-text w-32"></div>
            </div>
            <div className="directory-skeleton-item">
              <div className="directory-skeleton-icon"></div>
              <div className="directory-skeleton-text w-36"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="directory-skeleton-group">
        <div className="directory-skeleton-item">
          <div className="directory-skeleton-icon"></div>
          <div className="directory-skeleton-text w-36"></div>
        </div>
        <div className="directory-skeleton-sub">
          <div className="directory-skeleton-group">
            <div className="directory-skeleton-item">
              <div className="directory-skeleton-icon"></div>
              <div className="directory-skeleton-text w-40"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="directory-skeleton-item">
        <div className="directory-skeleton-icon"></div>
        <div className="directory-skeleton-text w-30"></div>
      </div>
    </div>
  )
}
