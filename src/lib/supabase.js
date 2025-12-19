import { createClient } from '@supabase/supabase-js'
import { mockDirectories, mockArticles } from '../data/mockData'

// 确保我们可以修改模拟数据
let mutableMockDirectories = [...mockDirectories]
let mutableMockArticles = [...mockArticles]

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查是否使用模拟数据
const useMockData = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')

let supabase = null

if (!useMockData) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    // console.log('数据库连接成功')
  } catch (error) {
    console.warn('Supabase 初始化失败，使用模拟数据:', error)
  }
}

if (useMockData) {
  // console.log('使用模拟数据模式 - 请配置正确的 Supabase 环境变量以连接真实数据库')
}

// 构建目录树的辅助函数
function buildDirectoryTree(directories, articles) {
  // 为每个目录添加文章列表
  const dirsWithArticles = directories.map(dir => ({
    ...dir,
    articles: articles.filter(article => article.directory_id === dir.id)
  }))
  
  // 构建树形结构
  const rootDirs = dirsWithArticles.filter(dir => !dir.parent_id)
  
  function addChildren(parentDir) {
    const children = dirsWithArticles.filter(dir => dir.parent_id === parentDir.id)
    if (children.length > 0) {
      parentDir.children = children.map(child => addChildren(child))
    }
    return parentDir
  }
  
  return rootDirs.map(dir => addChildren(dir))
}

// 数据库操作函数
export const db = {
  // 获取目录树
  async getDirectoryTree() {
    if (useMockData || !supabase) {
      return new Promise(resolve => {
        setTimeout(() => {
          const tree = buildDirectoryTree(mutableMockDirectories, mutableMockArticles)
          // console.log('构建的目录树:', tree)
          resolve(tree)
        }, 100)
      })
    }

    try {
      // 获取所有目录
      const { data: directories, error: dirError } = await supabase
        .from('directories')
        .select('*')
        .order('created_at')
      
      if (dirError) throw dirError

      // 获取所有文章
      const { data: articles, error: artError } = await supabase
        .from('articles')
        .select('id, title, directory_id, created_at, updated_at')
        .eq('is_published', true)
        .order('created_at')
      
      if (artError) throw artError

      return buildDirectoryTree(directories, articles)
    } catch (error) {
      console.warn('Supabase 查询失败，使用模拟数据:', error)
      return buildDirectoryTree(mutableMockDirectories, mutableMockArticles)
    }
  },

  // 获取文章详情
  async getArticle(id) {
    if (useMockData || !supabase) {
      return new Promise(resolve => {
        setTimeout(() => {
          const article = mutableMockArticles.find(a => a.id === id)
          resolve(article || null)
        }, 100)
      })
    }

    try {
      const { data, error } = await supabase
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
    } catch (error) {
      console.warn('Supabase 查询失败，使用模拟数据:', error)
      return mutableMockArticles.find(a => a.id === id) || null
    }
  },

  // 创建目录
  async createDirectory(directory) {
    if (useMockData || !supabase) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const newDir = {
              id: Date.now().toString(),
              ...directory,
              parent_id: directory.parent_id || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              articles: []
            }
            mutableMockDirectories.push(newDir)
            // console.log('创建目录成功:', newDir)
            resolve(newDir)
          } catch (error) {
            reject(error)
          }
        }, 100)
      })
    }

    try {
      const { data, error } = await supabase
        .from('directories')
        .insert(directory)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase 操作失败，使用模拟数据:', error)
      const newDir = {
        id: Date.now().toString(),
        ...directory,
        parent_id: directory.parent_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        articles: []
      }
      mutableMockDirectories.push(newDir)
      return newDir
    }
  },

  // 更新目录
  async updateDirectory(id, updates) {
    if (useMockData || !supabase) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const dirIndex = mutableMockDirectories.findIndex(d => d.id === id)
            if (dirIndex > -1) {
              const oldParentId = mutableMockDirectories[dirIndex].parent_id
              const newParentId = updates.parent_id || null
              
              // 更新目录信息
              mutableMockDirectories[dirIndex] = {
                ...mutableMockDirectories[dirIndex],
                ...updates,
                parent_id: newParentId,
                updated_at: new Date().toISOString()
              }
              
              // 如果父目录发生变化，需要更新该目录下所有文章的目录关联
              if (oldParentId !== newParentId) {
                // 递归更新所有子目录下的文章
                const updateArticlesInDirectory = (dirId) => {
                  // 更新直接在该目录下的文章
                  mutableMockArticles.forEach(article => {
                    if (article.directory_id === dirId) {
                      article.updated_at = new Date().toISOString()
                    }
                  })
                  
                  // 递归处理子目录
                  const childDirs = mutableMockDirectories.filter(d => d.parent_id === dirId)
                  childDirs.forEach(child => updateArticlesInDirectory(child.id))
                }
                
                updateArticlesInDirectory(id)
              }
              
              // console.log('更新目录成功:', mutableMockDirectories[dirIndex])
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

    try {
      const { data, error } = await supabase
        .from('directories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // 在真实数据库中，文章的目录关联通过外键自动维护
      // 这里不需要额外处理
      
      return data
    } catch (error) {
      console.warn('Supabase 操作失败，使用模拟数据:', error)
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
        
        // 处理文章关联更新
        if (oldParentId !== newParentId) {
          const updateArticlesInDirectory = (dirId) => {
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
        
        return mutableMockDirectories[dirIndex]
      }
      throw error
    }
  },

  // 删除目录及其所有子目录和文章
  async deleteDirectory(id) {
    if (useMockData || !supabase) {
      return new Promise(resolve => {
        setTimeout(() => {
          // 递归删除子目录
          const deleteRecursive = (dirId) => {
            // 找到所有子目录
            const childDirs = mutableMockDirectories.filter(d => d.parent_id === dirId)
            // console.log(`删除目录 ${dirId} 的子目录:`, childDirs.map(d => d.name))
            childDirs.forEach(child => deleteRecursive(child.id))
            
            // 删除该目录下的所有文章
            const articlesToDelete = mutableMockArticles.filter(a => a.directory_id === dirId)
            // console.log(`删除目录 ${dirId} 下的文章:`, articlesToDelete.map(a => a.title))
            articlesToDelete.forEach(article => {
              const articleIndex = mutableMockArticles.findIndex(a => a.id === article.id)
              if (articleIndex > -1) {
                mutableMockArticles.splice(articleIndex, 1)
              }
            })
            
            // 删除目录本身
            const dirIndex = mutableMockDirectories.findIndex(d => d.id === dirId)
            if (dirIndex > -1) {
              // console.log(`删除目录:`, mutableMockDirectories[dirIndex].name)
              mutableMockDirectories.splice(dirIndex, 1)
            }
          }
          
          deleteRecursive(id)
          resolve()
        }, 100)
      })
    }

    try {
      // 数据库已配置级联删除，删除目录会自动删除子目录和相关文章
      const { error } = await supabase
        .from('directories')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.warn('Supabase 操作失败，使用模拟数据:', error)
      // 模拟数据的递归删除逻辑
      const deleteRecursive = (dirId) => {
        const childDirs = mutableMockDirectories.filter(d => d.parent_id === dirId)
        // console.log(`删除目录 ${dirId} 的子目录:`, childDirs.map(d => d.name))
        childDirs.forEach(child => deleteRecursive(child.id))
        
        const articlesToDelete = mutableMockArticles.filter(a => a.directory_id === dirId)
        // console.log(`删除目录 ${dirId} 下的文章:`, articlesToDelete.map(a => a.title))
        articlesToDelete.forEach(article => {
          const articleIndex = mutableMockArticles.findIndex(a => a.id === article.id)
          if (articleIndex > -1) {
            mutableMockArticles.splice(articleIndex, 1)
          }
        })
        
        const dirIndex = mutableMockDirectories.findIndex(d => d.id === dirId)
        if (dirIndex > -1) {
          // console.log(`删除目录:`, mutableMockDirectories[dirIndex].name)
          mutableMockDirectories.splice(dirIndex, 1)
        }
      }
      
      deleteRecursive(id)
    }
  },

  // 创建文章
  async createArticle(article) {
    if (useMockData || !supabase) {
      return new Promise(resolve => {
        setTimeout(() => {
          const newArticle = {
            id: Date.now().toString(),
            ...article,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            directories: mutableMockDirectories.find(d => d.id === article.directory_id) || null
          }
          mutableMockArticles.push(newArticle)
          // console.log('创建文章成功:', newArticle)
          resolve(newArticle)
        }, 100)
      })
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase 操作失败，使用模拟数据:', error)
      const newArticle = {
        id: Date.now().toString(),
        ...article,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      mutableMockArticles.push(newArticle)
      return newArticle
    }
  },

  // 更新文章
  async updateArticle(id, updates) {
    if (useMockData || !supabase) {
      return new Promise(resolve => {
        setTimeout(() => {
          const articleIndex = mutableMockArticles.findIndex(a => a.id === id)
          if (articleIndex > -1) {
            mutableMockArticles[articleIndex] = {
              ...mutableMockArticles[articleIndex],
              ...updates,
              updated_at: new Date().toISOString()
            }
            // console.log('更新文章成功:', mutableMockArticles[articleIndex])
            resolve(mutableMockArticles[articleIndex])
          }
        }, 100)
      })
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase 操作失败，使用模拟数据:', error)
      const articleIndex = mutableMockArticles.findIndex(a => a.id === id)
      if (articleIndex > -1) {
        mutableMockArticles[articleIndex] = {
          ...mutableMockArticles[articleIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }
        return mutableMockArticles[articleIndex]
      }
      throw error
    }
  },

  // 删除文章
  async deleteArticle(id) {
    if (useMockData || !supabase) {
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

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.warn('Supabase 操作失败，使用模拟数据:', error)
      const articleIndex = mutableMockArticles.findIndex(a => a.id === id)
      if (articleIndex > -1) {
        mutableMockArticles.splice(articleIndex, 1)
      }
    }
  },

  // 搜索文章
  async searchArticles(query) {
    if (useMockData || !supabase) {
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
          
          resolve(results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
        }, 100)
      })
    }

    try {
      if (!query.trim()) {
        const { data, error } = await supabase
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

      const { data, error } = await supabase
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
    } catch (error) {
      console.warn('Supabase 查询失败，使用模拟数据:', error)
      return mutableMockArticles.filter(a => a.is_published)
    }
  }
}
