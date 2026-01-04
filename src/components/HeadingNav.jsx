import { useState, useEffect, useRef } from 'react'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import '../styles/HeadingNav.css'

export default function HeadingNav({ content, collapsed, onToggleCollapse, isDark }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const observerRef = useRef(null)
  const isScrollingRef = useRef(false)
  const tocContainerRef = useRef(null)
  const activeItemRef = useRef(null)

  const generateId = (text) => {
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    return id || 'heading'
  }

  useEffect(() => {
    if (!content) {
      setHeadings([])
      return
    }

    const headingRegex = /^(#{1,3})\s+(.+)$/gm
    const matches = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = generateId(text)
      
      matches.push({
        id,
        text,
        level
      })
    }

    setHeadings(matches)
  }, [content])

  useEffect(() => {
    if (headings.length === 0 || collapsed) return

    const initializeActiveHeading = () => {
      const mainContent = document.querySelector('main')
      if (!mainContent) return

      const allHeadingElements = headings
        .map(h => document.getElementById(h.id))
        .filter(Boolean)

      if (allHeadingElements.length === 0) return

      let targetHeading = allHeadingElements[0]
      for (const element of allHeadingElements) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100) {
          targetHeading = element
        } else {
          break
        }
      }

      setActiveId(targetHeading.id)
    }

    const timer = setTimeout(() => {
      const mainContent = document.querySelector('main')
      if (!mainContent) return

      initializeActiveHeading()
      
      const observer = new IntersectionObserver(
        (entries) => {
          if (isScrollingRef.current) return

          const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => {
              const aTop = a.boundingClientRect.top
              const bTop = b.boundingClientRect.top
              return aTop - bTop
            })

          if (visibleEntries.length > 0) {
            const topEntry = visibleEntries[0]
            setActiveId(topEntry.target.id)
          }
        },
        {
          root: mainContent,
          rootMargin: '-10% 0% -80% 0%',
          threshold: [0, 0.25, 0.5, 0.75, 1]
        }
      )

      observerRef.current = observer

      headings.forEach(heading => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.observe(element)
        }
      })
    }, 500)

    return () => {
      clearTimeout(timer)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headings, collapsed])

  useEffect(() => {
    if (!activeId || collapsed || !tocContainerRef.current || !activeItemRef.current) return

    requestAnimationFrame(() => {
      if (!activeItemRef.current || !tocContainerRef.current) return

      const container = tocContainerRef.current
      const activeItem = activeItemRef.current

      const containerRect = container.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()

      const itemTop = itemRect.top - containerRect.top + container.scrollTop
      const itemBottom = itemTop + itemRect.height

      const containerScrollTop = container.scrollTop
      const containerHeight = container.clientHeight

      if (itemTop < containerScrollTop) {
        container.scrollTo({
          top: itemTop - 20,
          behavior: 'smooth'
        })
      } else if (itemBottom > containerScrollTop + containerHeight) {
        container.scrollTo({
          top: itemBottom - containerHeight + 20,
          behavior: 'smooth'
        })
      }
    })
  }, [activeId, collapsed])

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
      setActiveId(id)
      isScrollingRef.current = true
      
      const mainContent = document.querySelector('main')
      if (mainContent) {
        const elementTop = element.offsetTop
        const headerHeight = 80
        mainContent.scrollTo({
          top: elementTop - headerHeight,
          behavior: 'smooth'
        })
        
        setTimeout(() => {
          isScrollingRef.current = false
        }, 1000)
      } else {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
        
        setTimeout(() => {
          isScrollingRef.current = false
        }, 1000)
      }
    } else {
      console.warn('找不到标题元素:', id)
    }
  }

  const renderHeading = (heading) => {
    const isActive = activeId === heading.id
    const paddingLeft = (heading.level - 1) * 16 + 12

    return (
      <button
        key={heading.id}
        ref={isActive ? activeItemRef : null}
        onClick={() => scrollToHeading(heading.id)}
        className={`heading-nav-item ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        title={heading.text}
      >
        <span className="heading-nav-item-text">{heading.text}</span>
      </button>
    )
  }

  if (collapsed) {
    return (
      <div className={`heading-nav collapsed ${isDark ? 'dark' : ''}`}>
        <div className="heading-nav-p-2">
          <button
            onClick={onToggleCollapse}
            className="heading-nav-collapsed-btn"
            title="展开目录"
          >
            <PanelRightOpen size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`heading-nav ${isDark ? 'dark' : ''}`}>
      <div className="heading-nav-header">
        <div className="heading-nav-header-content">
          <h3 className="heading-nav-title">标题目录</h3>
          <button
            onClick={onToggleCollapse}
            className="heading-nav-toggle-btn"
            title="收起目录"
          >
            <PanelRightClose size={16} />
          </button>
        </div>
      </div>
      
      <div ref={tocContainerRef} className="heading-nav-content custom-scrollbar">
        {headings.length === 0 ? (
          <div className="heading-nav-empty">
            <p>当前文章无标题</p>
          </div>
        ) : (
          <div className="heading-nav-space-y-1">
            {headings.map(renderHeading)}
          </div>
        )}
      </div>
    </div>
  )
}
