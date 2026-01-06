// 缓存配置
export const CACHE = {
  DURATION: 120_000, // 2 分钟
  KEYS: {
    DIRECTORIES: 'directories_cache',
    DIRECTORIES_TIME: 'directories_cache_time',
    DARK_MODE: 'darkMode',
    LAST_ARTICLE: 'lastArticleId',
    AUTH: 'isAuthenticated'
  }
} as const

// 时间配置
export const TIMING = {
  DB_UPDATE_DELAY: 100, // 数据库更新延迟
  TOAST_DURATION: 2000, // Toast 显示时长
  COPY_FEEDBACK_DURATION: 2000 // 复制反馈时长
} as const

// 布局配置
export const LAYOUT = {
  SIDEBAR_WIDTH: {
    EXPANDED: '18rem',
    COLLAPSED: '3rem'
  },
  MOBILE_BREAKPOINT: 768
} as const

// 默认配置
export const DEFAULTS = {
  ADMIN_PASSWORD: '221250108',
  WORDS_PER_MINUTE: 200 // 阅读速度
} as const
