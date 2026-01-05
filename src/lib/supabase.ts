import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { mockDirectories, mockArticles } from '../data/mockData'

interface Directory {
  id: string
  name: string
  parent_id: string | null
  created_at: string
  updated_at: string
  articles?: Article[]
  children?: Directory[]
}

interface Article {
  id: string
  title: string
  content: string
  directory_id: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  directories?: Directory | null
}

interface DirectoryTree extends Directory {
  articles: Article[]
  children?: DirectoryTree[]
}

let mutableMockDirectories: Directory[] = [...mockDirectories]
let mutableMockArticles: Article[] = [...mockArticles]

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY

const useMockData = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')

let supabase: SupabaseClient | null = null

if (!useMockData) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Supabase 初始化失败，使用模拟数据:', error)
  }
}

function withFallback<T extends any[], R>(
  mockOperation: (...args: T) => Promise<R>,
  supabaseOperation: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    if (useMockData || !supabase) {
      return mockOperation(...args)
    }

    try {
      return await supabaseOperation(...args)
    } catch (error) {
      console.warn('Supabase 操作失败，使用模拟数据:', error)
      return mockOperation(...args)
    }
  }
}

function buildDirectoryTree(directories: Directory[], articles: Article[]): DirectoryTree[] {
  const dirsWithArticles: DirectoryTree[] = directories.map(dir => ({
    ...dir,
    articles: articles.filter(article => article.directory_id === dir.id),
    children: undefined
  }))
  
  const rootDirs = dirsWithArticles.filter(dir => !dir.parent_id)
  
  function addChildren(parentDir: DirectoryTree): DirectoryTree {
    const children = dirsWithArticles.filter(dir => dir.parent_id === parentDir.id)
    if (children.length > 0) {
      parentDir.children = children.map(child => addChildren(child))
    }
    return parentDir
  }
  
  return rootDirs.map(dir => addChildren(dir))
}

const mockGetDirectoryTree = (): Promise<DirectoryTree[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const tree = buildDirectoryTree(mutableMockDirectories, mutableMockArticles)
      resolve(tree)
    }, 100)
  })
}

const supabaseGetDirectoryTree = async (): Promise<DirectoryTree[]> => {
  const { data: directories, error: dirError } = await supabase!
    .from('directories')
    .select('*')
    .order('created_at')
  
  if (dirError) throw dirError

  const { data: articles, error: artError } = await supabase!
    .from('articles')
    .select('id, title, directory_id, created_at, updated_at')
    .eq('is_published', true)
    .order('created_at')
  
  if (artError) throw artError

  const fullArticles: Article[] = articles.map(art => ({
    ...art,
    content: '',
    is_published: true
  }))

  return buildDirectoryTree(directories, fullArticles)
}

const mockGetArticle = (id: string): Promise<Article | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const article = mutableMockArticles.find(a => a.id === id)
      resolve(article || null)
    }, 100)
  })
}

const supabaseGetArticle = async (id: string): Promise<Article> => {
  const { data, error } = await supabase!
    .from('articles')
    .select(`
      *,
      directories (
        id,
        name
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

const mockCreateDirectory = (directory: Partial<Directory>): Promise<Directory> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const newDir: Directory = {
          id: Date.now().toString(),
          name: directory.name || '',
          parent_id: directory.parent_id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          articles: []
        }
        mutableMockDirectories.push(newDir)
        resolve(newDir)
      } catch (error) {
        reject(error)
      }
    }, 100)
  })
}

const supabaseCreateDirectory = async (directory: Partial<Directory>): Promise<Directory> => {
  const { data, error } = await supabase!
    .from('directories')
    .insert(directory)
    .select()
    .single()
  
  if (error) throw error
  return data
}

const mockUpdateDirectory = (id: string, updates: Partial<Directory>): Promise<Directory> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const dirIndex = mutableMockDirectories.findIndex(d => d.id === id)
        if (dirIndex > -1) {
          const oldParentId = mutableMockDirectories[dirIndex].parent_id
          const newParentId = updates.parent_id || null
          
          mutableMockDirectories[dirIndex] = {
            ...mutableMockDirectories[dirIndex],
            ...updates,
            parent_id: newParentId,
            updated_at: new Date().toISOString()
          }
          
          if (oldParentId !== newParentId) {
            const updateArticlesInDirectory = (dirId: string) => {
              mutableMockArticles.forEach(article => {
                if (article.directory_id === dirId) {
                  article.updated_at = new Date().toISOString()
                }
              })
              
              const childDirs = mutableMockDirectories.filter(d => d.parent_id === dirId)
              childDirs.forEach(child => updateArticlesInDirectory(child.id))
            }
            
            updateArticlesInDirectory(id)
          }
          
          resolve(mutableMockDirectories[dirIndex])
        } else {
          reject(new Error('目录不存在'))
        }
      } catch (error) {
        reject(error)
      }
    }, 100)
  })
}

const supabaseUpdateDirectory = async (id: string, updates: Partial<Directory>): Promise<Directory> => {
  const { data, error } = await supabase!
    .from('directories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

const mockDeleteDirectory = (id: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const deleteRecursive = (dirId: string) => {
        const childDirs = mutableMockDirectories.filter(d => d.parent_id === dirId)
        childDirs.forEach(child => deleteRecursive(child.id))
        
        const articlesToDelete = mutableMockArticles.filter(a => a.directory_id === dirId)
        articlesToDelete.forEach(article => {
          const articleIndex = mutableMockArticles.findIndex(a => a.id === article.id)
          if (articleIndex > -1) {
            mutableMockArticles.splice(articleIndex, 1)
          }
        })
        
        const dirIndex = mutableMockDirectories.findIndex(d => d.id === dirId)
        if (dirIndex > -1) {
          mutableMockDirectories.splice(dirIndex, 1)
        }
      }
      
      deleteRecursive(id)
      resolve()
    }, 100)
  })
}

const supabaseDeleteDirectory = async (id: string): Promise<void> => {
  const { error } = await supabase!
    .from('directories')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

const mockCreateArticle = (article: Partial<Article>): Promise<Article> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newArticle: Article = {
        id: Date.now().toString(),
        title: article.title || '',
        content: article.content || '',
        directory_id: article.directory_id || null,
        is_published: article.is_published ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        directories: mutableMockDirectories.find(d => d.id === article.directory_id) || null
      }
      mutableMockArticles.push(newArticle)
      resolve(newArticle)
    }, 100)
  })
}

const supabaseCreateArticle = async (article: Partial<Article>): Promise<Article> => {
  const { data, error } = await supabase!
    .from('articles')
    .insert(article)
    .select()
    .single()
  
  if (error) throw error
  return data
}

const mockUpdateArticle = (id: string, updates: Partial<Article>): Promise<Article> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const articleIndex = mutableMockArticles.findIndex(a => a.id === id)
      if (articleIndex > -1) {
        mutableMockArticles[articleIndex] = {
          ...mutableMockArticles[articleIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }
        resolve(mutableMockArticles[articleIndex])
      }
    }, 100)
  })
}

const supabaseUpdateArticle = async (id: string, updates: Partial<Article>): Promise<Article> => {
  const { data, error } = await supabase!
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

const mockDeleteArticle = (id: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const articleIndex = mutableMockArticles.findIndex(a => a.id === id)
      if (articleIndex > -1) {
        mutableMockArticles.splice(articleIndex, 1)
      }
      resolve()
    }, 100)
  })
}

const supabaseDeleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase!
    .from('articles')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

const mockSearchArticles = (query: string): Promise<Article[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let results = mutableMockArticles.filter(a => a.is_published)
      
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase()
        results = results.filter(a => 
          a.title.toLowerCase().includes(searchTerm) ||
          a.content.toLowerCase().includes(searchTerm)
        )
      }
      
      resolve(results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    }, 100)
  })
}

const supabaseSearchArticles = async (query: string): Promise<Article[]> => {
  if (!query.trim()) {
    const { data, error } = await supabase!
      .from('articles')
      .select(`
        *,
        directories (
          id,
          name
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  const { data, error } = await supabase!
    .from('articles')
    .select(`
      *,
      directories (
        id,
        name
      )
    `)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const db = {
  getDirectoryTree: withFallback(mockGetDirectoryTree, supabaseGetDirectoryTree),
  getArticle: withFallback(mockGetArticle, supabaseGetArticle),
  createDirectory: withFallback(mockCreateDirectory, supabaseCreateDirectory),
  updateDirectory: withFallback(mockUpdateDirectory, supabaseUpdateDirectory),
  deleteDirectory: withFallback(mockDeleteDirectory, supabaseDeleteDirectory),
  createArticle: withFallback(mockCreateArticle, supabaseCreateArticle),
  updateArticle: withFallback(mockUpdateArticle, supabaseUpdateArticle),
  deleteArticle: withFallback(mockDeleteArticle, supabaseDeleteArticle),
  searchArticles: withFallback(mockSearchArticles, supabaseSearchArticles)
}

export type { Directory, Article, DirectoryTree }
