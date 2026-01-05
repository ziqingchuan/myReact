import { ReactNode } from 'react'

export function generateId(children: ReactNode): string {
  const id = extractTextContent(children)
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return id || 'heading'
}

export function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string') {
    return node
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('')
  }
  if (node && typeof node === 'object') {
    if ('props' in node && node.props && node.props.children) {
      return extractTextContent(node.props.children)
    }
    if ('children' in node && node.children) {
      return extractTextContent(node.children)
    }
  }
  return ''
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function generateHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36).substring(0, 10)
}
