import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Copy, Check } from 'lucide-react'
import { useState, useMemo, useCallback } from 'react'
import { generateId, extractTextContent, generateHash } from '../utils'
import '../styles/MarkdownRenderer.css'

interface MarkdownRendererProps {
  content: string
  isDark?: boolean
}

export default function MarkdownRenderer({ content, isDark = false }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string, codeHash: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(codeHash)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }, [])

  const components = useMemo(() => ({
    pre({ children }: { children?: React.ReactNode }) {
      const codeElement = children as React.ReactElement | undefined
      const className = codeElement?.props?.className || ''
      const match = /language-(\w+)/.exec(className)
      
      if (match) {
        const codeContent = extractTextContent(codeElement?.props?.children)
        const codeHash = generateHash(codeContent.substring(0, 100))
        const isCopied = copiedCode === codeHash
        
        return (
          <div className={`markdown-code-block ${isDark ? 'dark' : ''}`}>
            <div className="markdown-code-header">
              <span className="markdown-code-language">{match[1]}</span>
              <button
                onClick={() => copyToClipboard(codeContent, codeHash)}
                className="markdown-code-copy-btn"
              >
                {isCopied ? (
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
    
    code({ node, className, children, ...props }: { node?: any; className?: string; children?: React.ReactNode; [key: string]: any }) {
      const isInline = node?.children?.length === 1
      
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
    
    h1({ children }: { children?: React.ReactNode }) {
      const id = generateId(children)
      return <h1 id={id} className="markdown-h1">{children}</h1>
    },
    
    h2({ children }: { children?: React.ReactNode }) {
      const id = generateId(children)
      return <h2 id={id} className="markdown-h2">{children}</h2>
    },
    
    h3({ children }: { children?: React.ReactNode }) {
      const id = generateId(children)
      return <h3 id={id} className="markdown-h3">{children}</h3>
    },
    
    p({ children }: { children?: React.ReactNode }) {
      return <p className="markdown-p">{children}</p>
    },
    
    ul({ children }: { children?: React.ReactNode }) {
      return <ul className="markdown-ul">{children}</ul>
    },
    
    ol({ children }: { children?: React.ReactNode }) {
      return <ol className="markdown-ol">{children}</ol>
    },
    
    li({ children }: { children?: React.ReactNode }) {
      return <li className="markdown-li">{children}</li>
    },
    
    blockquote({ children }: { children?: React.ReactNode }) {
      return (
        <blockquote className="markdown-blockquote">
          <div className="markdown-blockquote-content">
            {children}
          </div>
        </blockquote>
      )
    },
    
    table({ children }: { children?: React.ReactNode }) {
      return (
        <div className="markdown-table-container">
          <table className="markdown-table">
            {children}
          </table>
        </div>
      )
    },
    
    th({ children }: { children?: React.ReactNode }) {
      return <th className="markdown-th">{children}</th>
    },
    
    td({ children }: { children?: React.ReactNode }) {
      return <td className="markdown-td">{children}</td>
    },
    
    a({ href, children }: { href?: string; children?: React.ReactNode }) {
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
  }), [isDark, copiedCode, copyToClipboard])

  return (
    <div className={`markdown-renderer ${isDark ? 'dark' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={components as any}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
