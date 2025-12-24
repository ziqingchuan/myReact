export default function ArticleSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* 文章标题骨架 */}
      <div className="mb-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        
        {/* 元信息骨架 */}
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>

      {/* 文章内容骨架 */}
      <div className="space-y-4">
        {/* 段落 1 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>

        {/* 标题 */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-8"></div>

        {/* 段落 2 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
        </div>

        {/* 代码块骨架 */}
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>

        {/* 段落 3 */}
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>

        {/* 标题 */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-8"></div>

        {/* 段落 4 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>

        {/* 列表骨架 */}
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10/12"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
        </div>
      </div>
    </div>
  )
}
