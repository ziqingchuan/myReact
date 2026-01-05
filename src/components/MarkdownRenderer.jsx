import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { generateId, extractTextContent, generateHash } from '../utils'
import '../styles/MarkdownRenderer.css'

export default function MarkdownRenderer({ content, isDark = false }) {
  const [copiedCode, setCopiedCode] = useState(null)

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(index)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const components = {
    pre({ children }) {
      // 处理 pre 标签，这里包含完整的代码块
      const codeElement = children?.props
      const className = codeElement?.className || ''
      const match = /language-(\w+)/.exec(className)
      
      if (match) {
        const codeContent = extractTextContent(codeElement?.children)
        const codeIndex = generateHash(codeContent.substring(0, 100))
        
        return (
          <div className={`markdown-code-block ${isDark ? 'dark' : ''}`}>
            <div className="markdown-code-header">
              <span className="markdown-code-language">{match[1]}</span>
              <button
                onClick={() => copyToClipboard(codeContent, codeIndex)}
                className="markdown-code-copy-btn"
              >
                {copiedCode === codeIndex ? (
                  <>
                    <Check size={14} />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>
            <pre className="markdown-code-pre">
              {children}
            </pre>
          </div>
        )
      }
      
      return <pre>{children}</pre>
    },
    
    code({ node, className, children, ...props }) {
      const isInline = node?.children.length === 1 ? true : false
      
      if (isInline) {
        return (
          <code className="markdown-inline-code" {...props}>
            {children}
          </code>
        )
      }
      
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    
    h1({ children }) {
      const id = generateId(children)
      return (
        <h1 
          id={id}
          className="markdown-h1"
        >
          {children}
        </h1>
      )
    },
    
    h2({ children }) {
      const id = generateId(children)
      return (
        <h2 
          id={id}
          className="markdown-h2"
        >
          {children}
        </h2>
      )
    },
    
    h3({ children }) {
      const id = generateId(children)
      return (
        <h3 
          id={id}
          className="markdown-h3"
        >
          {children}
        </h3>
      )
    },
    
    p({ children }) {
      return <p className="markdown-p">{children}</p>
    },
    
    ul({ children }) {
      return <ul className="markdown-ul">{children}</ul>
    },
    
    ol({ children }) {
      return <ol className="markdown-ol">{children}</ol>
    },
    
    li({ children }) {
      return <li className="markdown-li">{children}</li>
    },
    
    blockquote({ children }) {
      return (
        <blockquote className="markdown-blockquote">
          <div className="markdown-blockquote-content">
            {children}
          </div>
        </blockquote>
      )
    },
    
    table({ children }) {
      return (
        <div className="markdown-table-container">
          <table className="markdown-table">
            {children}
          </table>
        </div>
      )
    },
    
    th({ children }) {
      return <th className="markdown-th">{children}</th>
    },
    
    td({ children }) {
      return <td className="markdown-td">{children}</td>
    },
    
    a({ href, children }) {
      return (
        <a 
          href={href} 
          className="markdown-a"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    }
  }

  return (
    <div className={`markdown-renderer ${isDark ? 'dark' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}