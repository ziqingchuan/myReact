import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function MarkdownRenderer({ content }) {
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

  // 递归提取文本内容的函数
  const extractTextContent = (node) => {
    if (typeof node === 'string') {
      return node
    }
    if (Array.isArray(node)) {
      return node.map(extractTextContent).join('')
    }
    if (node && typeof node === 'object') {
      if (node.props && node.props.children) {
        return extractTextContent(node.props.children)
      }
      if (node.children) {
        return extractTextContent(node.children)
      }
    }
    return ''
  }

  const components = {
    pre({ children }) {
      // 处理 pre 标签，这里包含完整的代码块
      const codeElement = children?.props
      const className = codeElement?.className || ''
      const match = /language-(\w+)/.exec(className)
      
      if (match) {
        const codeContent = extractTextContent(codeElement?.children)
        // 使用代码内容的哈希作为稳定的标识符
        const codeIndex = btoa(codeContent.substring(0, 50)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)
        
        return (
          <div className="relative group">
            <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-lg">
              <span className="font-mono">{match[1]}</span>
              <button
                onClick={() => copyToClipboard(codeContent, codeIndex)}
                className="flex items-center space-x-1 hover:bg-gray-700 px-2 py-1 rounded"
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
            <pre className="!mt-0 !rounded-t-none overflow-x-auto">
              {children}
            </pre>
          </div>
        )
      }
      
      return <pre>{children}</pre>
    },
    
    code({ node, inline, className, children, ...props }) {
      // 只处理内联代码
      if (inline) {
        return (
          <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
            {children}
          </code>
        )
      }
      
      // 块级代码由 pre 组件处理
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    
    h1({ children }) {
      return <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 border-b border-gray-200 pb-2">{children}</h1>
    },
    
    h2({ children }) {
      return <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-6">{children}</h2>
    },
    
    h3({ children }) {
      return <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-5">{children}</h3>
    },
    
    p({ children }) {
      return <p className="text-gray-700 leading-7 mb-4">{children}</p>
    },
    
    ul({ children }) {
      return <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
    },
    
    ol({ children }) {
      return <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
    },
    
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 mb-4 bg-gray-50 py-2">
          {children}
        </blockquote>
      )
    },
    
    table({ children }) {
      return (
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-gray-300">
            {children}
          </table>
        </div>
      )
    },
    
    th({ children }) {
      return <th className="border border-gray-300 px-4 py-2 text-left bg-gray-50 font-semibold">{children}</th>
    },
    
    td({ children }) {
      return <td className="border border-gray-300 px-4 py-2">{children}</td>
    },
    
    a({ href, children }) {
      return (
        <a 
          href={href} 
          className="text-primary-600 hover:text-primary-700 underline"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    }
  }

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}