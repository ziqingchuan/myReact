export function generateId(children) {
  const id = extractTextContent(children)
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return id || 'heading'
}

export function extractTextContent(node) {
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

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateReadTime(content) {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function generateHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36).substring(0, 10)
}
