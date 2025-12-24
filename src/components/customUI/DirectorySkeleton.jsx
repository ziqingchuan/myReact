export default function DirectorySkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {/* 第一个目录 */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 py-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        {/* 子项 */}
        <div className="ml-6 space-y-2">
          <div className="flex items-center space-x-2 py-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          </div>
          <div className="flex items-center space-x-2 py-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
          </div>
        </div>
      </div>

      {/* 第二个目录 */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 py-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
        </div>
        {/* 子项 */}
        <div className="ml-6 space-y-2">
          <div className="flex items-center space-x-2 py-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-44"></div>
          </div>
          <div className="flex items-center space-x-2 py-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <div className="flex items-center space-x-2 py-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-38"></div>
          </div>
        </div>
      </div>

      {/* 第三个目录 */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 py-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
        </div>
        {/* 子项 */}
        <div className="ml-6 space-y-2">
          <div className="flex items-center space-x-2 py-1">
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          </div>
        </div>
      </div>

      {/* 第四个目录 */}
      <div className="flex items-center space-x-2 py-2">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-30"></div>
      </div>
    </div>
  )
}
