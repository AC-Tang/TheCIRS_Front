<template>
  <div class="category-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1>{{ currentCategoryName }} - 文章列表</h1>
      </div>
    </div>

    <div class="container">
      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- 左侧树形导航 -->
        <div class="sidebar">
          <div class="tree-container">
            <h3>栏目导航</h3>
            <div class="category-tree">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="tree-node"
              >
                <div 
                  class="node-header"
                  :class="{ active: selectedCategory === category.id }"
                  @click="toggleNode(category)"
                >
                  <span class="node-icon">{{ category.children && category.children.length ? (category.expanded ? '▼' : '►') : '•' }}</span>
                  <span class="node-name">{{ category.name }}</span>
                </div>
                
                <!-- 二级菜单 -->
                <div 
                  v-if="category.children && category.children.length"
                  class="tree-children"
                  :class="{ expanded: category.expanded }"
                >
                  <div 
                    v-for="subCategory in category.children" 
                    :key="subCategory.id"
                    class="tree-node level-2"
                  >
                    <div 
                      class="node-header"
                      :class="{ active: selectedCategory === subCategory.id }"
                      @click="toggleNode(subCategory)"
                    >
                      <span class="node-icon">{{ subCategory.children && subCategory.children.length ? (subCategory.expanded ? '▼' : '►') : '▸' }}</span>
                      <span class="node-name">{{ subCategory.name }}</span>
                    </div>
                    
                    <!-- 三级菜单 -->
                    <div 
                      v-if="subCategory.children && subCategory.children.length"
                      class="tree-children"
                      :class="{ expanded: subCategory.expanded }"
                    >
                      <div 
                        v-for="subSubCategory in subCategory.children" 
                        :key="subSubCategory.id"
                        class="tree-node level-3"
                      >
                        <div 
                          class="node-header"
                          :class="{ active: selectedCategory === subSubCategory.id }"
                          @click="selectCategory(subSubCategory.id)"
                        >
                          <span class="node-icon">▸</span>
                          <span class="node-name">{{ subSubCategory.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧文章列表 -->
        <div class="content-area">
          <!-- 筛选和排序 -->
          <div class="filter-bar">
            <div class="filter-options">
              <select v-model="sortBy" @change="applyFilters">
                <option value="newest">最新发布</option>
                <option value="hottest">最热浏览</option>
                <option value="recommended">推荐优先</option>
              </select>
            </div>
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchKeyword" 
                placeholder="搜索此栏目下的文章..."
                @input="applyFilters"
              />
              <button class="search-btn">🔍</button>
            </div>
          </div>

          <!-- 文章卡片列表 -->
          <div class="article-cards">
            <div 
              v-for="article in paginatedArticles" 
              :key="article.id"
              class="article-card"
              @click="goToArticleDetail(article.id)"
            >
              <div class="card-header">
                <h3 class="article-title">{{ article.title }}</h3>
                <span class="article-category">{{ article.category.name }}</span>
              </div>
              
              <div class="card-body">
                <div class="article-content">
                  <p class="article-excerpt">{{ article.excerpt }}</p>
                </div>
                <div v-if="article.coverImage" class="article-image">
                  <img :src="article.coverImage" :alt="article.title" />
                </div>
              </div>
              
              <div class="card-footer">
                <div class="article-meta">
                  <span class="author">{{ article.author }}</span>
                  <span class="date">{{ formatDate(article.publishDate) }}</span>
                  <span class="views">{{ article.views }} 浏览</span>
                  <span class="comments">{{ article.commentCount }} 评论</span>
                </div>
                <div class="article-tags">
                  <span 
                    v-for="tag in article.tags" 
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 无数据提示 -->
          <div v-if="paginatedArticles.length === 0" class="empty-state">
            <div class="empty-icon">📚</div>
            <h3>暂无文章</h3>
            <p>该栏目下暂时没有文章内容</p>
          </div>

          <!-- 分页控件 -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="page-btn"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              上一页
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                class="page-btn"
                :class="{ active: currentPage === page }"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 状态管理
const selectedCategory = ref('all')
const sortBy = ref('newest')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟数据 - 栏目树
const categories = ref([
  {
    id: 'tech',
    name: '科技前沿',
    expanded: false,
    children: [
      {
        id: 'ai',
        name: '人工智能',
        expanded: false,
        children: [
          { id: 'nlp', name: '自然语言处理' },
          { id: 'cv', name: '计算机视觉' },
          { id: 'ml', name: '机器学习' }
        ]
      },
      {
        id: 'cloud',
        name: '云计算',
        expanded: false,
        children: [
          { id: 'iaas', name: '基础设施服务' },
          { id: 'paas', name: '平台服务' },
          { id: 'saas', name: '软件服务' }
        ]
      },
      {
        id: 'iot',
        name: '物联网',
        expanded: false,
        children: [
          { id: 'sensor', name: '传感器技术' },
          { id: 'mqtt', name: '通信协议' },
          { id: 'edge', name: '边缘计算' }
        ]
      }
    ]
  },
  {
    id: 'education',
    name: '教育资讯',
    expanded: false,
    children: [
      {
        id: 'policy',
        name: '政策解读',
        expanded: false,
        children: [
          { id: 'national', name: '国家政策' },
          { id: 'local', name: '地方政策' },
          { id: 'school', name: '学校政策' }
        ]
      },
      {
        id: 'research',
        name: '学术研究',
        expanded: false,
        children: [
          { id: 'paper', name: '论文发表' },
          { id: 'project', name: '科研项目' },
          { id: 'conference', name: '学术会议' }
        ]
      }
    ]
  },
  {
    id: 'campus',
    name: '校园动态',
    expanded: false,
    children: [
      {
        id: 'activities',
        name: '校园活动',
        expanded: false,
        children: [
          { id: 'culture', name: '文化活动' },
          { id: 'sports', name: '体育活动' },
          { id: 'competition', name: '竞赛活动' }
        ]
      },
      {
        id: 'notice',
        name: '通知公告',
        expanded: false,
        children: [
          { id: 'school', name: '学校通知' },
          { id: 'department', name: '部门通知' },
          { id: 'student', name: '学生通知' }
        ]
      }
    ]
  },
  {
    id: 'career',
    name: '就业创业',
    expanded: false,
    children: [
      {
        id: 'recruitment',
        name: '招聘信息',
        expanded: false,
        children: [
          { id: 'campus', name: '校园招聘' },
          { id: 'internship', name: '实习机会' },
          { id: 'graduate', name: '毕业生招聘' }
        ]
      },
      {
        id: 'innovation',
        name: '创业指导',
        expanded: false,
        children: [
          { id: 'fund', name: '创业基金' },
          { id: 'incubator', name: '孵化器' },
          { id: 'case', name: '成功案例' }
        ]
      }
    ]
  }
])

// 模拟文章数据
const articles = ref([
  {
    id: 1,
    title: '2025年人工智能发展趋势预测',
    excerpt: '本文深入分析了2025年人工智能领域的发展方向和重点突破，包括大模型应用、多模态学习、自主智能体等前沿技术的发展前景。',
    coverImage: 'https://picsum.photos/id/1/400/200',
    category: { id: 'ai', name: '人工智能' },
    author: '张明',
    publishDate: '2024-01-20',
    views: 1289,
    commentCount: 45,
    tags: ['人工智能', '趋势', '前沿技术']
  },
  {
    id: 2,
    title: '云计算技术在教育领域的应用研究',
    excerpt: '探讨云计算技术如何改变教育模式，提升教学效率，以及在在线教育、资源共享、智能教学等方面的创新应用。',
    coverImage: 'https://picsum.photos/id/2/400/200',
    category: { id: 'cloud', name: '云计算' },
    author: '李华',
    publishDate: '2024-01-18',
    views: 856,
    commentCount: 32,
    tags: ['云计算', '教育应用', '数字化转型']
  },
  {
    id: 3,
    title: '物联网技术推动智慧城市建设',
    excerpt: '介绍物联网技术在智慧城市建设中的关键作用，包括智能交通、环境监测、公共安全等领域的实际应用案例。',
    coverImage: 'https://picsum.photos/id/3/400/200',
    category: { id: 'iot', name: '物联网' },
    author: '王芳',
    publishDate: '2024-01-15',
    views: 978,
    commentCount: 28,
    tags: ['物联网', '智慧城市', '传感器网络']
  },
  {
    id: 4,
    title: '最新教育政策解读：对高校人才培养的影响',
    excerpt: '详细解读最新发布的教育政策文件，分析其对高校人才培养模式、教学评价体系、学科建设等方面的具体影响。',
    coverImage: 'https://picsum.photos/id/4/400/200',
    category: { id: 'policy', name: '政策解读' },
    author: '赵强',
    publishDate: '2024-01-12',
    views: 1567,
    commentCount: 67,
    tags: ['政策解读', '教育改革', '人才培养']
  },
  {
    id: 5,
    title: '大数据分析在学术研究中的应用',
    excerpt: '阐述大数据分析技术如何帮助研究者处理海量数据，发现研究规律，提升研究效率和质量的方法论与实践案例。',
    coverImage: 'https://picsum.photos/id/5/400/200',
    category: { id: 'research', name: '学术研究' },
    author: '陈明',
    publishDate: '2024-01-10',
    views: 678,
    commentCount: 23,
    tags: ['大数据', '学术研究', '数据分析']
  },
  {
    id: 6,
    title: '校园文化艺术节活动预告',
    excerpt: '2024年校园文化艺术节即将拉开帷幕，本文介绍了本次艺术节的主题、活动安排、参与方式等详细信息。',
    coverImage: 'https://picsum.photos/id/6/400/200',
    category: { id: 'activities', name: '校园活动' },
    author: '学生会',
    publishDate: '2024-01-08',
    views: 2345,
    commentCount: 128,
    tags: ['校园活动', '文化艺术', '学生活动']
  },
  {
    id: 7,
    title: '2024年春季学期选课指南',
    excerpt: '为学生提供2024年春季学期选课的详细指南，包括选课时间、选课流程、热门课程推荐等实用信息。',
    coverImage: 'https://picsum.photos/id/7/400/200',
    category: { id: 'notice', name: '通知公告' },
    author: '教务处',
    publishDate: '2024-01-06',
    views: 3456,
    commentCount: 256,
    tags: ['选课指南', '教学通知', '学生服务']
  },
  {
    id: 8,
    title: '知名企业校园招聘会信息',
    excerpt: '多家知名企业将于下周来校举办校园招聘会，本文汇总了参会企业、招聘岗位、薪资待遇等关键信息。',
    coverImage: 'https://picsum.photos/id/8/400/200',
    category: { id: 'recruitment', name: '招聘信息' },
    author: '就业指导中心',
    publishDate: '2024-01-04',
    views: 1890,
    commentCount: 89,
    tags: ['校园招聘', '就业信息', '职业发展']
  },
  {
    id: 9,
    title: '创业基金申请攻略与注意事项',
    excerpt: '详细介绍学校创业基金的申请条件、申请流程、评审标准以及成功申请的关键要素和注意事项。',
    coverImage: 'https://picsum.photos/id/9/400/200',
    category: { id: 'innovation', name: '创业指导' },
    author: '创业中心',
    publishDate: '2024-01-02',
    views: 789,
    commentCount: 34,
    tags: ['创业基金', '申请攻略', '创新创业']
  },
  {
    id: 10,
    title: '自然语言处理技术最新进展',
    excerpt: '综述自然语言处理领域的最新研究成果和技术突破，包括预训练语言模型、零样本学习、多语言处理等热点方向。',
    coverImage: 'https://picsum.photos/id/10/400/200',
    category: { id: 'nlp', name: '自然语言处理' },
    author: '刘教授',
    publishDate: '2023-12-30',
    views: 1123,
    commentCount: 42,
    tags: ['自然语言处理', '预训练模型', 'AI技术']
  },
  {
    id: 11,
    title: '计算机视觉在医疗领域的应用',
    excerpt: '探讨计算机视觉技术如何辅助医疗诊断、医学影像分析、疾病预测等方面的创新应用和研究进展。',
    coverImage: 'https://picsum.photos/id/11/400/200',
    category: { id: 'cv', name: '计算机视觉' },
    author: '吴博士',
    publishDate: '2023-12-28',
    views: 987,
    commentCount: 36,
    tags: ['计算机视觉', '医疗AI', '健康科技']
  },
  {
    id: 12,
    title: '机器学习算法优化与实践',
    excerpt: '介绍机器学习算法优化的常用方法和实践技巧，包括模型压缩、参数优化、特征工程等实用技术。',
    coverImage: 'https://picsum.photos/id/12/400/200',
    category: { id: 'ml', name: '机器学习' },
    author: '郑工程师',
    publishDate: '2023-12-26',
    views: 876,
    commentCount: 29,
    tags: ['机器学习', '算法优化', '模型训练']
  }
])

// 计算当前选中的栏目名称
const currentCategoryName = computed(() => {
  if (selectedCategory.value === 'all') return '全部栏目'
  
  // 递归查找栏目名称
  const findCategoryName = (categories, id) => {
    for (const category of categories) {
      if (category.id === id) return category.name
      if (category.children) {
        const found = findCategoryName(category.children, id)
        if (found) return found
      }
    }
    return '未知栏目'
  }
  
  return findCategoryName(categories.value, selectedCategory.value)
})

// 过滤文章
const filteredArticles = computed(() => {
  let result = [...articles.value]
  
  // 按栏目筛选
  if (selectedCategory.value !== 'all') {
    // 递归获取所有子栏目ID
    const getAllCategoryIds = (categories) => {
      let ids = []
      categories.forEach(cat => {
        ids.push(cat.id)
        if (cat.children) {
          ids = ids.concat(getAllCategoryIds(cat.children))
        }
      })
      return ids
    }
    
    // 找到选中的栏目及其所有父栏目
    const findCategoryPath = (categories, id) => {
      for (const category of categories) {
        if (category.id === id) return [category]
        if (category.children) {
          const path = findCategoryPath(category.children, id)
          if (path) return [category, ...path]
        }
      }
      return []
    }
    
    const categoryPath = findCategoryPath(categories.value, selectedCategory.value)
    const lastCategory = categoryPath[categoryPath.length - 1]
    const allChildIds = lastCategory.children ? getAllCategoryIds(lastCategory.children) : []
    const allRelevantIds = [lastCategory.id, ...allChildIds]
    
    result = result.filter(article => allRelevantIds.includes(article.category.id))
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(keyword) ||
      article.excerpt.toLowerCase().includes(keyword)
    )
  }
  
  // 排序
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      break
    case 'hottest':
      result.sort((a, b) => b.views - a.views)
      break
    case 'recommended':
      result.sort((a, b) => (b.views * 0.6 + b.commentCount * 0.4) - (a.views * 0.6 + a.commentCount * 0.4))
      break
  }
  
  return result
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / pageSize.value)
})

// 计算可见的页码
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // 如果总页数不超过7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 显示当前页附近的页码
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }
  
  return pages
})

// 计算当前页的文章
const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredArticles.value.slice(startIndex, endIndex)
})

// 方法
const toggleNode = (node) => {
  // 如果点击的是三级菜单，直接选择
  if (node.level === 3 || (!node.children || node.children.length === 0)) {
    selectCategory(node.id)
    return
  }
  
  // 切换展开状态
  node.expanded = !node.expanded
  
  // 如果展开了当前节点，折叠兄弟节点
  const parentNode = findParentNode(categories.value, node)
  if (parentNode && node.expanded) {
    parentNode.children.forEach(child => {
      if (child.id !== node.id) {
        child.expanded = false
      }
    })
  }
}

// 查找父节点
const findParentNode = (nodes, targetNode) => {
  for (const node of nodes) {
    if (node.children && node.children.includes(targetNode)) {
      return node
    }
    if (node.children) {
      const found = findParentNode(node.children, targetNode)
      if (found) return found
    }
  }
  return null
}

// 选择栏目
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1 // 重置到第一页
}

// 应用筛选
const applyFilters = () => {
  currentPage.value = 1 // 重置到第一页
}

// 切换页码
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 跳转到文章详情
const goToArticleDetail = (articleId) => {
  router.push(`/article/${articleId}`)
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 监听路由参数
watch(() => route.params.categoryId, (newCategoryId) => {
  if (newCategoryId) {
    selectCategory(newCategoryId)
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  // 展开第一个顶级栏目
  if (categories.value.length > 0) {
    categories.value[0].expanded = true
    // 展开第一个二级栏目
    if (categories.value[0].children && categories.value[0].children.length > 0) {
      categories.value[0].children[0].expanded = true
    }
  }
})
</script>

<style scoped>
.category-list {
  min-height: 100vh;
  background-color: var(--color-background);
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 40px 0;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 主内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  margin-bottom: 60px;
}

/* 侧边栏 */
.sidebar {
  position: sticky;
  top: 104px;
  height: fit-content;
}

/* 树形导航容器 */
.tree-container {
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tree-container h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-heading);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-primary);
}

/* 树形导航 */
.category-tree {
  max-height: 600px;
  overflow-y: auto;
}

.tree-node {
  margin-bottom: 4px;
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text);
}

.node-header:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  transform: translateX(4px);
}

.node-header.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.node-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 12px;
  font-weight: bold;
}

.node-name {
  flex: 1;
  font-size: 15px;
}

/* 子节点 */
.tree-children {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.tree-children.expanded {
  max-height: 1000px;
}

/* 不同层级的缩进 */
.level-2 .node-header {
  padding-left: 24px;
}

.level-3 .node-header {
  padding-left: 44px;
}

/* 内容区域 */
.content-area {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.filter-options select {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: white;
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-options select:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.filter-options select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* 搜索框 */
.search-box {
  display: flex;
  gap: 0;
  width: 300px;
}

.search-box input {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px 0 0 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 文章卡片列表 */
.article-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* 文章卡片 */
.article-card {
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
  transform: translateX(-4px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(16, 185, 129, 0.1);
  border-color: var(--color-primary);
  background-color: white;
}

.article-card:hover::before {
  transform: translateX(0);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.article-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.4;
  flex: 1;
  margin-right: 16px;
  transition: color 0.3s ease;
}

.article-card:hover .article-title {
  color: var(--color-primary);
}

.article-category {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* 卡片主体 */
.card-body {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.article-content {
  flex: 1;
}

.article-excerpt {
  margin: 0;
  color: var(--color-text);
  line-height: 1.6;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-image {
  width: 200px;
  height: 120px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.1);
}

/* 卡片底部 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.article-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.article-card:hover .tag {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: var(--color-heading);
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  background-color: white;
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  min-width: 40px;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.page-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  font-weight: 500;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 240px 1fr;
    gap: 24px;
  }
  
  .search-box {
    width: 240px;
  }
  
  .article-image {
    width: 160px;
    height: 100px;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
    margin-bottom: 24px;
  }
  
  .content-area {
    padding: 24px;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-box {
    width: 100%;
  }
  
  .card-body {
    flex-direction: column;
    gap: 16px;
  }
  
  .article-image {
    width: 100%;
    height: 180px;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .article-meta {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 32px 0;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .content-area {
    padding: 20px;
  }
  
  .article-card {
    padding: 20px;
  }
  
  .article-title {
    font-size: 18px;
  }
  
  .article-image {
    height: 150px;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .page-btn {
    padding: 6px 12px;
    font-size: 13px;
    min-width: 36px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-card {
  animation: fadeInUp 0.4s ease-out;
  animation-fill-mode: both;
}

.article-card:nth-child(1) { animation-delay: 0.1s; }
.article-card:nth-child(2) { animation-delay: 0.2s; }
.article-card:nth-child(3) { animation-delay: 0.3s; }
.article-card:nth-child(4) { animation-delay: 0.4s; }
.article-card:nth-child(5) { animation-delay: 0.5s; }
</style>