<template>
  <BaseLayout title="搜索结果" subtitle="查找学院相关的文章、通知和学习资源">
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" style="margin-bottom: 24px">
      <router-link to="/front">首页</router-link>
      <span>&gt;</span>
      <span>搜索结果</span>
    </nav>

    <!-- 搜索框区域 -->
    <div class="search-section" style="margin-bottom: 24px">
      <div class="search-bar">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="输入关键词搜索..."
          @keyup.enter="performSearch"
          class="search-input"
        />
        <button class="btn btn-primary search-btn" @click="performSearch">
          <i class="icon-search"></i>
          搜索
        </button>
      </div>

      <!-- 搜索筛选条件 -->
      <div class="filter-section">
        <div class="filter-group">
          <label class="filter-label">时间范围：</label>
          <select v-model="timeRange" class="filter-select">
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="year">今年</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">分类：</label>
          <select v-model="selectedCategory" class="filter-select">
            <option value="all">全部分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">排序：</label>
          <select v-model="sortBy" class="filter-select">
            <option value="relevance">相关性</option>
            <option value="time-desc">时间（新到旧）</option>
            <option value="time-asc">时间（旧到新）</option>
            <option value="views">浏览量</option>
            <option value="comments">评论数</option>
          </select>
        </div>

        <div class="filter-actions">
          <button class="reset-btn" @click="resetFilters">重置</button>
        </div>
      </div>
    </div>

    <!-- 搜索结果统计 -->
    <div class="search-stats" v-if="showResults">
      <p>
        找到 <span class="highlight">{{ searchResults.length }}</span> 条与
        <span class="highlight">{{ searchKeyword }}</span> 相关的结果
      </p>
    </div>

    <!-- 搜索结果列表 -->
    <div class="search-results" v-if="showResults">
      <div
        v-for="(article, index) in paginatedResults"
        :key="article.id"
        class="result-item"
        @click="goToArticle(article.id)"
      >
        <!-- 文章封面图 -->
        <div v-if="article.coverImage" class="result-image">
          <img :src="article.coverImage" :alt="article.title" />
        </div>

        <!-- 文章信息 -->
        <div class="result-content">
          <!-- 文章标题 -->
          <h3 class="result-title" v-html="highlightText(article.title, searchKeyword)"></h3>

          <!-- 文章摘要 -->
          <p class="result-excerpt" v-html="highlightText(article.summary, searchKeyword)"></p>

          <!-- 文章元信息 -->
          <div class="result-meta">
            <span class="meta-category">{{ article.categoryName }}</span>
            <span class="meta-author">{{ article.author }}</span>
            <span class="meta-date">{{ formatDate(article.publishDate) }}</span>
            <span class="meta-views">{{ article.views }} 浏览</span>
            <span class="meta-comments">{{ article.comments }} 评论</span>
          </div>
        </div>
      </div>

      <!-- 无结果提示 -->
      <div v-if="searchResults.length === 0 && searchKeyword" class="no-results">
        <div class="no-results-icon">
          <i class="icon-search-large"></i>
        </div>
        <h3>未找到相关内容</h3>
        <p>尝试使用其他关键词，或检查拼写是否正确</p>
        <ul class="search-tips">
          <li>尝试使用更一般的词语</li>
          <li>检查关键词是否有误</li>
          <li>减少搜索条件的限制</li>
        </ul>
      </div>
    </div>

    <!-- 搜索建议 -->
    <div class="search-suggestions" v-if="!searchKeyword && !showResults">
      <h3>热门搜索</h3>
      <div class="hot-keywords">
        <span
          v-for="keyword in hotKeywords"
          :key="keyword"
          class="hot-keyword"
          @click="searchByKeyword(keyword)"
        >
          {{ keyword }}
        </span>
      </div>

      <h3>热门标签</h3>
      <div class="hot-tags">
        <span
          v-for="tag in hotTags"
          :key="tag.name"
          class="tag"
          @click="searchByKeyword(tag.name)"
          :style="{ fontSize: getTagSize(tag.count) }"
        >
          {{ tag.name }}
          <span class="tag-count">{{ tag.count }}</span>
        </span>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="pagination" v-if="showResults && totalPages > 1">
      <button
        class="btn page-btn prev-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        上一页
      </button>

      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="btn page-btn"
          :class="{ active: page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="btn page-btn next-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        下一页
      </button>

      <div class="page-info">
        <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
        <span>共 {{ searchResults.length }} 条结果</span>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseLayout from '@/components/layout/BaseLayout.vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const searchKeyword = ref('')
const timeRange = ref('all')
const selectedCategory = ref('all')
const sortBy = ref('relevance')
const searchResults = ref([])
const currentPage = ref(1)
const showResults = ref(false)

// 每页显示结果数
const pageSize = 10

// 分类列表
const categories = ref([
  { id: 'ai', name: '人工智能' },
  { id: 'education', name: '教育资讯' },
  { id: 'tech', name: '科技前沿' },
  { id: 'campus', name: '校园活动' },
  { id: 'career', name: '就业信息' },
  { id: 'research', name: '学术研究' },
])

// 热门关键词
const hotKeywords = ref([
  '人工智能',
  '教育改革',
  '校园活动',
  '就业指导',
  '学术研究',
  '科技创新',
  '课程建设',
  '学生管理',
])

// 热门标签
const hotTags = ref([
  { name: '人工智能', count: 156 },
  { name: '教育改革', count: 142 },
  { name: '校园活动', count: 128 },
  { name: '就业信息', count: 115 },
  { name: '前沿技术', count: 109 },
  { name: '创业指导', count: 98 },
  { name: '政策解读', count: 87 },
  { name: '学术研究', count: 76 },
  { name: '课程建设', count: 65 },
  { name: '学生管理', count: 58 },
])

// 模拟数据
const mockArticles = [
  {
    id: 1,
    title: '2025年人工智能发展趋势预测',
    summary:
      '本文深入分析了2025年人工智能领域的发展方向和重点突破，包括大模型应用、多模态学习、自主智能体等前沿技术的发展前景。',
    coverImage: 'https://picsum.photos/id/1/400/300',
    categoryId: 'ai',
    categoryName: '人工智能',
    author: '张明',
    publishDate: '2024-01-20T10:00:00Z',
    views: 1289,
    comments: 45,
  },
  {
    id: 2,
    title: '大模型在医疗领域的创新应用',
    summary: '探讨大语言模型如何革新医疗诊断、药物研发和患者护理，以及实际落地案例分析。',
    coverImage: 'https://picsum.photos/id/2/400/300',
    categoryId: 'ai',
    categoryName: '人工智能',
    author: '李华',
    publishDate: '2024-01-15T08:00:00Z',
    views: 856,
    comments: 32,
  },
  {
    id: 3,
    title: '自主智能体的安全挑战与解决方案',
    summary: '随着自主智能体技术的发展，其安全问题日益凸显。本文分析了潜在风险并提出应对策略。',
    coverImage: 'https://picsum.photos/id/3/400/300',
    categoryId: 'ai',
    categoryName: '人工智能',
    author: '王强',
    publishDate: '2024-01-18T14:00:00Z',
    views: 978,
    comments: 28,
  },
  {
    id: 4,
    title: '最新教育政策解读：对高校人才培养的影响',
    summary: '详细解读2024年最新教育政策变化，分析其对高校人才培养模式的深远影响。',
    coverImage: 'https://picsum.photos/id/4/400/300',
    categoryId: 'education',
    categoryName: '教育资讯',
    author: '陈静',
    publishDate: '2024-01-12T16:00:00Z',
    views: 1567,
    comments: 67,
  },
  {
    id: 5,
    title: '深度学习在自然语言处理中的应用进展',
    summary: '回顾深度学习技术在NLP领域的最新进展，包括预训练模型、多语言处理等热门方向。',
    coverImage: 'https://picsum.photos/id/5/400/300',
    categoryId: 'ai',
    categoryName: '人工智能',
    author: '赵明',
    publishDate: '2024-01-08T09:00:00Z',
    views: 765,
    comments: 23,
  },
  {
    id: 6,
    title: '校园文化艺术节活动预告',
    summary: '2024年校园文化艺术节将于3月举办，本文介绍活动安排、参与方式及往届精彩回顾。',
    coverImage: 'https://picsum.photos/id/6/400/300',
    categoryId: 'campus',
    categoryName: '校园活动',
    author: '学生会',
    publishDate: '2024-01-22T11:00:00Z',
    views: 2341,
    comments: 89,
  },
  {
    id: 7,
    title: '2024年春季学期选课指南',
    summary: '为新生提供选课攻略，包括热门课程介绍、选课技巧、学分规划等实用信息。',
    coverImage: 'https://picsum.photos/id/7/400/300',
    categoryId: 'education',
    categoryName: '教育资讯',
    author: '教务处',
    publishDate: '2024-01-10T10:00:00Z',
    views: 3456,
    comments: 134,
  },
  {
    id: 8,
    title: '知名企业校园招聘会信息',
    summary: '多家知名企业将于2月下旬来校举办招聘会，本文提供参会企业名单、岗位信息及求职建议。',
    coverImage: 'https://picsum.photos/id/8/400/300',
    categoryId: 'career',
    categoryName: '就业信息',
    author: '就业指导中心',
    publishDate: '2024-01-19T15:00:00Z',
    views: 2876,
    comments: 98,
  },
  {
    id: 9,
    title: '量子计算：未来计算的革命性技术',
    summary: '介绍量子计算的基本原理、发展现状及未来应用前景，探讨其对传统计算模式的挑战。',
    coverImage: 'https://picsum.photos/id/9/400/300',
    categoryId: 'tech',
    categoryName: '科技前沿',
    author: '刘教授',
    publishDate: '2024-01-05T14:00:00Z',
    views: 1123,
    comments: 56,
  },
  {
    id: 10,
    title: '自然语言处理技术最新进展',
    summary: '综述NLP领域的最新技术突破，包括情感分析、文本生成、机器翻译等方向的创新成果。',
    coverImage: 'https://picsum.photos/id/10/400/300',
    categoryId: 'ai',
    categoryName: '人工智能',
    author: '张博士',
    publishDate: '2023-12-30T10:00:00Z',
    views: 1123,
    comments: 41,
  },
  {
    id: 11,
    title: '创新创业项目孵化计划启动',
    summary: '学校启动2024年创新创业项目孵化计划，提供资金支持、导师指导、场地资源等全方位帮助。',
    coverImage: 'https://picsum.photos/id/11/400/300',
    categoryId: 'campus',
    categoryName: '校园活动',
    author: '创新创业中心',
    publishDate: '2024-01-21T13:00:00Z',
    views: 1567,
    comments: 78,
  },
  {
    id: 12,
    title: '研究生招生政策调整解读',
    summary: '解析2024年研究生招生政策变化，提供备考建议和专业选择指导。',
    coverImage: 'https://picsum.photos/id/12/400/300',
    categoryId: 'education',
    categoryName: '教育资讯',
    author: '研究生院',
    publishDate: '2024-01-07T09:00:00Z',
    views: 2234,
    comments: 112,
  },
]

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(searchResults.value.length / pageSize)
})

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return searchResults.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  // 显示当前页附近的页码
  if (total <= 7) {
    // 总页数不超过7页，全部显示
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数超过7页，显示部分页码
    if (current <= 4) {
      // 前4页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 后4页
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 中间页面
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// 方法
// 执行搜索
const performSearch = () => {
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    showResults.value = false
    return
  }

  // 模拟搜索延迟
  setTimeout(() => {
    let results = [...mockArticles]

    // 关键词搜索
    const keyword = searchKeyword.value.toLowerCase().trim()
    results = results.filter(
      (article) =>
        article.title.toLowerCase().includes(keyword) ||
        article.summary.toLowerCase().includes(keyword) ||
        article.categoryName.toLowerCase().includes(keyword),
    )

    // 分类筛选
    if (selectedCategory.value !== 'all') {
      results = results.filter((article) => article.categoryId === selectedCategory.value)
    }

    // 时间范围筛选
    results = filterByTimeRange(results)

    // 排序
    results = sortResults(results)

    searchResults.value = results
    currentPage.value = 1
    showResults.value = true
  }, 300)
}

// 时间范围筛选
const filterByTimeRange = (articles) => {
  const now = new Date()
  let startTime = new Date(0)

  switch (timeRange.value) {
    case 'today':
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      const day = now.getDay() || 7
      startTime = new Date(now)
      startTime.setDate(now.getDate() - day + 1)
      startTime.setHours(0, 0, 0, 0)
      break
    case 'month':
      startTime = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'year':
      startTime = new Date(now.getFullYear(), 0, 1)
      break
    default:
      return articles
  }

  return articles.filter((article) => new Date(article.publishDate) >= startTime)
}

// 结果排序
const sortResults = (articles) => {
  const sorted = [...articles]
  const keyword = searchKeyword.value.toLowerCase()

  switch (sortBy.value) {
    case 'relevance':
      // 按相关性排序（标题匹配度 > 摘要匹配度 > 发布时间）
      sorted.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(keyword) ? 1 : 0
        const bTitleMatch = b.title.toLowerCase().includes(keyword) ? 1 : 0

        if (aTitleMatch !== bTitleMatch) {
          return bTitleMatch - aTitleMatch
        }

        const aSummaryMatch = a.summary.toLowerCase().includes(keyword) ? 1 : 0
        const bSummaryMatch = b.summary.toLowerCase().includes(keyword) ? 1 : 0

        if (aSummaryMatch !== bSummaryMatch) {
          return bSummaryMatch - aSummaryMatch
        }

        return new Date(b.publishDate) - new Date(a.publishDate)
      })
      break
    case 'time-desc':
      sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      break
    case 'time-asc':
      sorted.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
      break
    case 'views':
      sorted.sort((a, b) => b.views - a.views)
      break
    case 'comments':
      sorted.sort((a, b) => b.comments - a.comments)
      break
  }

  return sorted
}

// 重置筛选条件
const resetFilters = () => {
  timeRange.value = 'all'
  selectedCategory.value = 'all'
  sortBy.value = 'relevance'
  performSearch()
}

// 高亮文本
const highlightText = (text, keyword) => {
  if (!text || !keyword) return text

  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="highlight-text">$1</span>')
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取标签大小
const getTagSize = (count) => {
  const minSize = 14
  const maxSize = 20
  const minCount = Math.min(...hotTags.value.map((tag) => tag.count))
  const maxCount = Math.max(...hotTags.value.map((tag) => tag.count))
  const size = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize)
  return `${size}px`
}

// 跳转到文章
const goToArticle = (articleId) => {
  router.push(`/article/${articleId}`)
}

// 按关键词搜索
const searchByKeyword = (keyword) => {
  searchKeyword.value = keyword
  performSearch()
}

// 分页
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 监听路由参数
watch(
  () => route.query,
  (query) => {
    if (query.keyword) {
      searchKeyword.value = query.keyword
      if (query.type === 'tag') {
        // 标签搜索时特殊处理
        sortBy.value = 'relevance'
      }
      performSearch()
    }
  },
  { immediate: true },
)

// 组件挂载
onMounted(() => {
  // 检查URL参数中是否有搜索关键词
  const keyword = route.query.keyword
  if (keyword) {
    searchKeyword.value = keyword
    performSearch()
  }
})
</script>

<style scoped>
.search-page {
  width: 100%;
}

/* 页面标题栏 */
.page-header {
  background-color: white;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.breadcrumb a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: var(--color-primary);
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 搜索区域 */
.search-section {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 24px;
  margin-top: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 搜索框 */
.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-btn {
  padding: 12px 32px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover {
  background-color: var(--color-secondary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 筛选区域 */
.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.filter-actions {
  margin-left: auto;
}

.reset-btn {
  padding: 8px 16px;
  background-color: var(--color-background-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: white;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 搜索统计 */
.search-stats {
  margin-top: 32px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.search-stats .highlight {
  color: var(--color-primary);
  font-weight: 600;
}

/* 搜索结果列表 */
.search-results {
  margin-top: 24px;
}

.result-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

.result-image {
  width: 200px;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.result-item:hover .result-image img {
  transform: scale(1.05);
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.3;
  transition: color 0.3s ease;
}

.result-item:hover .result-title {
  color: var(--color-primary);
}

.result-excerpt {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: auto;
}

.meta-category {
  padding: 2px 8px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 12px;
  font-weight: 500;
}

/* 高亮文本 */
.highlight-text {
  background-color: rgba(251, 191, 36, 0.2);
  color: #92400e;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 500;
}

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  margin-top: 24px;
}

.no-results-icon {
  font-size: 64px;
  color: var(--color-border);
  margin-bottom: 20px;
}

.no-results h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: var(--color-heading);
}

.no-results p {
  margin: 0 0 24px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.search-tips {
  text-align: left;
  max-width: 300px;
  margin: 0 auto;
  padding-left: 20px;
}

.search-tips li {
  margin: 8px 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

/* 搜索建议 */
.search-suggestions {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 32px;
  margin-top: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-suggestions h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-heading);
}

.hot-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.hot-keyword {
  padding: 8px 16px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.hot-keyword:hover {
  background-color: white;
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag {
  padding: 6px 12px;
  background-color: var(--color-background-alt);
  color: var(--color-text);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
}

.tag:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.tag-count {
  font-size: 11px;
  opacity: 0.7;
  margin-left: 4px;
}

/* 分页控件 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.page-btn {
  padding: 8px 16px;
  background-color: white;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.page-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-left: 20px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .result-image {
    width: 160px;
    height: 120px;
  }
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }

  .filter-actions {
    margin-left: 0;
    text-align: center;
  }

  .result-item {
    flex-direction: column;
  }

  .result-image {
    width: 100%;
    height: 180px;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-info {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 16px;
  }

  .search-input {
    font-size: 14px;
  }

  .search-suggestions {
    padding: 20px;
  }

  .result-item {
    padding: 16px;
  }

  .result-title {
    font-size: 18px;
  }
}
</style>
