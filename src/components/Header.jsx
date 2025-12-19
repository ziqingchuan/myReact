import { Menu } from 'lucide-react'
import reactSvg from '../assets/react.svg'

export default function Header({ isMobile, onMenuClick }) {
  return (
    <header className="bg-[#001529] border-b border-gray-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-gray-700 rounded-md text-white"
              >
                <Menu size={20} />
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img 
                src={reactSvg} 
                alt="logo" 
                className="mx-auto"
              />
              </div>
              <span className="text-xl font-bold text-white">React 日记</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}