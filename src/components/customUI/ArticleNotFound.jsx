import notFoundSvg from '../../assets/notfound.svg'

export default function ArticleNotFound({ onReturnHome }) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <img 
          src={notFoundSvg} 
          alt="文章未找到" 
          className="w-64 h-64 mx-auto"
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">糟糕，该文章不见了</h2>
      <p className="text-gray-600 mb-6">您正在查看的文章已被删除或移动</p>
      <button
        onClick={onReturnHome}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
      >
        返回首页
      </button>
    </div>
  )
}