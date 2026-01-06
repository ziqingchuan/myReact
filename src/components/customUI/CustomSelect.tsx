import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import '../../styles/CustomSelect.css'
import { CustomSelectProps } from '../../types'

export default function CustomSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "请选择...", 
  className = "",
  disabled = false,
  isDark = true
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`custom-select ${isDark ? 'dark' : ''} ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`custom-select-btn ${isOpen ? 'open' : ''}`}
      >
        <span className={selectedOption ? 'custom-select-value' : 'custom-select-placeholder'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`custom-select-icon ${isOpen ? 'open' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className={`custom-select-dropdown custom-scrollbar ${isDark ? 'dark' : ''}`}>
          {options.length === 0 ? (
            <div className={`custom-select-empty ${isDark ? 'dark' : ''}`}>暂无选项</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check size={14} className="custom-select-option-check" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
