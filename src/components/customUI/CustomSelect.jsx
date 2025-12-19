import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function CustomSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "请选择...", 
  className = "",
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md 
          focus:ring-2 focus:ring-gray-500 dark:focus:ring-blue-500 focus:border-transparent
          flex items-center justify-between transition-colors
          ${disabled ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-gray-500 dark:ring-blue-500 border-transparent' : ''}
        `}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">暂无选项</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 
                  flex items-center justify-between transition-colors
                  ${value === option.value ? 'bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}
                `}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check size={14} className="text-gray-600 dark:text-gray-400" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}