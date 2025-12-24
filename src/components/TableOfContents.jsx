import { useState, useEffect, useRef } from 'react'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'

export default function TableOfContents({ content, collapsed, onToggleCollapse }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const observerRef = useRef(null)
  const isScrollingRef = useRef(false)
  const tocContainerRef = useRef(null)
  const activeItemRef = useRef(null)

  // 生成标题 ID - 与 MarkdownRenderer 保持一致
  const generateId = (text) => {
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    return id || 'heading'
  }

  // 解析 Markdown 内容中的标题
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

    // console.log('[TableOfContents] 解析到的标题:', matches)
    setHeadings(matches)
  }, [content])

  // 监听滚动，高亮当前标题
  useEffect(() => {
    if (headings.length === 0 || collapsed) return

    // 初始化默认高亮第一个标题
    const initializeActiveHeading = () => {
      const mainContent = document.querySelector('main')
      if (!mainContent) return

      // 找到当前视口中最靠近顶部的标题
      const allHeadingElements = headings
        .map(h => document.getElementById(h.id))
        .filter(Boolean)

      if (allHeadingElements.length === 0) return

      // 找到第一个在视口内或视口上方的标题
      let targetHeading = allHeadingElements[0]
      for (const element of allHeadingElements) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100) { // 在顶部附近
          targetHeading = element
        } else {
          break
        }
      }

      setActiveId(targetHeading.id)
    }

    // 延迟执行，确保 DOM 已渲染
    const timer = setTimeout(() => {
      const mainContent = document.querySelector('main')
      if (!mainContent) return

      // 初始化高亮
      initializeActiveHeading()
      
      const observer = new IntersectionObserver(
        (entries) => {
          // 如果正在滚动中，不更新高亮
          if (isScrollingRef.current) return

          // 获取所有可见的标题，按照在页面中的位置排序
          const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => {
              const aTop = a.boundingClientRect.top
              const bTop = b.boundingClientRect.top
              return aTop - bTop
            })

          if (visibleEntries.length > 0) {
            // 选择最靠近顶部的可见标题
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

      // 观察所有标题元素
      headings.forEach(heading => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.observe(element)
        }
      })
    }, 50) // 增加延迟

    return () => {
      clearTimeout(timer)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headings, collapsed])

  // 自动滚动到高亮的标题项
  useEffect(() => {
    if (!activeId || collapsed || !tocContainerRef.current || !activeItemRef.current) return

    // 使用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
      if (!activeItemRef.current || !tocContainerRef.current) return

      const container = tocContainerRef.current
      const activeItem = activeItemRef.current

      const containerRect = container.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()

      // 计算相对于容器的位置
      const itemTop = itemRect.top - containerRect.top + container.scrollTop
      const itemBottom = itemTop + itemRect.height

      const containerScrollTop = container.scrollTop
      const containerHeight = container.clientHeight

      // 如果标题项不在可视区域内，滚动到它
      if (itemTop < containerScrollTop) {
        // 标题项在可视区域上方
        container.scrollTo({
          top: itemTop - 20, // 留一点边距
          behavior: 'smooth'
        })
      } else if (itemBottom > containerScrollTop + containerHeight) {
        // 标题项在可视区域下方
        container.scrollTo({
          top: itemBottom - containerHeight + 20, // 留一点边距
          behavior: 'smooth'
        })
      }
    })
  }, [activeId, collapsed])

  // 点击跳转到标题
  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
      // 立即设置目标标题为活跃状态
      setActiveId(id)
      
      // 标记正在滚动，暂时禁用自动高亮更新
      isScrollingRef.current = true
      
      // 找到主内容滚动容器
      const mainContent = document.querySelector('main')
      if (mainContent) {
        const elementTop = element.offsetTop
        const headerHeight = 80 // 考虑固定头部的高度
        mainContent.scrollTo({
          top: elementTop - headerHeight,
          behavior: 'smooth'
        })
        
        // 滚动完成后重新启用自动高亮
        setTimeout(() => {
          isScrollingRef.current = false
        }, 1000) // 给滚动动画足够的时间
      } else {
        // 备用方案
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

  // 渲染标题项
  const renderHeading = (heading) => {
    const isActive = activeId === heading.id
    const paddingLeft = (heading.level - 1) * 16 + 12

    return (
      <button
        key={heading.id}
        ref={isActive ? activeItemRef : null}
        onClick={() => scrollToHeading(heading.id)}
        className={`
          w-full text-left py-2 px-3 text-sm transition-colors duration-200
          hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100
          ${isActive 
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-600' 
            : 'text-gray-600 dark:text-gray-400'
          }
        `}
        style={{ paddingLeft: `${paddingLeft}px` }}
        title={heading.text}
      >
        <span className="truncate block">{heading.text}</span>
      </button>
    )
  }

  if (collapsed) {
    return (
      <div className="fixed right-0 top-16 z-20 w-12 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="p-2">
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 flex items-center text-gray-900 dark:text-gray-100 justify-center hover:bg-gray-400 rounded"
            title="展开目录"
          >
            <PanelRightOpen size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed right-0 top-16 z-20 w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">标题目录</h3>
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-400 rounded text-gray-600 dark:text-gray-100"
            title="收起目录"
          >
            <PanelRightClose size={16} />
          </button>
        </div>
      </div>
      
      <div ref={tocContainerRef} className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {headings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            <p>当前文章无标题</p>
          </div>
        ) : (
          <div className="space-y-1">
            {headings.map(renderHeading)}
          </div>
        )}
      </div>
    </div>
  )
}