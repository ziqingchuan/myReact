import { X } from 'lucide-react'
import Sidebar from './Sidebar'

export default function MobileSidebar({ 
  isOpen, 
  onClose, 
  onArticleSelect 
}) {
  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* 侧边栏 */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">目录</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar onArticleSelect={onArticleSelect} />
      </div>
    </>
  )
}