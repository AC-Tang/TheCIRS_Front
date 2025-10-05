<template>
  <div class="teacher-dashboard">
    <div class="page-header">
      <h1>教师工作台</h1>
      <div class="welcome-message">
        欢迎回来，{{ userName }}！今天是 {{ currentDate }}
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue">📝</div>
        <div class="stat-content">
          <div class="stat-value">{{ myArticlesCount }}</div>
          <div class="stat-label">我的文章</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-green">👁️</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalViews }}</div>
          <div class="stat-label">总浏览量</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-purple">⭐</div>
        <div class="stat-content">
          <div class="stat-value">{{ popularArticlesCount }}</div>
          <div class="stat-label">热门文章</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-orange">📅</div>
        <div class="stat-content">
          <div class="stat-value">{{ upcomingEventsCount }}</div>
          <div class="stat-label">近期活动</div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="dashboard-content">
      <!-- 最新发布的文章 -->
      <div class="recent-articles card">
        <div class="card-header">
          <h3>最新发布</h3>
          <router-link to="/teacher-content" class="view-all">查看全部</router-link>
        </div>
        <div class="card-body">
          <div v-if="recentArticles.length > 0" class="articles-list">
            <div v-for="article in recentArticles" :key="article.id" class="article-item">
              <h4>{{ article.title }}</h4>
              <div class="article-meta">
                <span class="publish-time">{{ article.publishTime }}</span>
                <span class="views">{{ article.viewCount }} 次浏览</span>
                <span :class="['status', article.status]">{{ getStatusText(article.status) }}</span>
              </div>
              <div class="article-actions">
                <button class="btn btn-sm" @click="editArticle(article.id)">编辑</button>
                <router-link :to="`/front/article/${article.id}`" class="btn btn-sm btn-primary" target="_blank">查看</router-link>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>您还没有发布任何文章</p>
            <button class="btn btn-primary" @click="createNewArticle">发布第一篇文章</button>
          </div>
        </div>
      </div>

      <!-- 数据分析 -->
      <div class="analytics card">
        <div class="card-header">
          <h3>内容数据统计</h3>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-icon">📊</div>
              <p>过去30天内容浏览趋势图</p>
            </div>
          </div>
          <div class="top-categories">
            <h4>热门栏目</h4>
            <ul>
              <li v-for="(category, index) in topCategories" :key="index">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }} 篇</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions card">
        <div class="card-header">
          <h3>快捷操作</h3>
        </div>
        <div class="card-body">
          <div class="action-buttons">
            <button class="btn btn-primary" @click="createNewArticle">
              <span class="action-icon">📄</span>
              <span>发布新文章</span>
            </button>
            <button class="btn" @click="viewAnalytics">
              <span class="action-icon">📊</span>
              <span>查看数据分析</span>
            </button>
            <button class="btn" @click="manageCategories">
              <span class="action-icon">📁</span>
              <span>管理栏目</span>
            </button>
            <button class="btn" @click="viewNotifications">
              <span class="action-icon">🔔</span>
              <span>消息通知</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = localStorage.getItem('userName') || '教师'
const userDepartment = localStorage.getItem('userDepartment') || ''

// 当前日期
const currentDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[now.getDay()]
  return `${year}-${month}-${day} ${weekday}`
})

// 统计数据
const myArticlesCount = ref(12)
const totalViews = ref(3568)
const popularArticlesCount = ref(4)
const upcomingEventsCount = ref(2)

// 最近发布的文章
const recentArticles = ref([
  {
    id: 1,
    title: '计算机科学前沿技术讲座通知',
    publishTime: '2024-06-15 14:30',
    viewCount: 456,
    status: 'published'
  },
  {
    id: 2,
    title: '2024年夏季学期选课指南',
    publishTime: '2024-06-10 09:15',
    viewCount: 1234,
    status: 'published'
  },
  {
    id: 3,
    title: '人工智能课程教学大纲修订说明',
    publishTime: '2024-06-05 16:45',
    viewCount: 789,
    status: 'published'
  }
])

// 热门栏目
const topCategories = ref([
  { name: '学术讲座', count: 5 },
  { name: '课程信息', count: 3 },
  { name: '教学通知', count: 2 },
  { name: '科研动态', count: 2 }
])

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'draft': '草稿',
    'pending': '审核中',
    'published': '已发布',
    'rejected': '已驳回'
  }
  return statusMap[status] || status
}

// 编辑文章
const editArticle = (id) => {
  router.push(`/teacher-content/edit?id=${id}`)
}

// 创建新文章
const createNewArticle = () => {
  router.push('/teacher-content/create')
}

// 查看数据分析
const viewAnalytics = () => {
  router.push('/teacher-content/analytics')
}

// 管理栏目
const manageCategories = () => {
  router.push('/teacher-content/categories')
}

// 查看通知
const viewNotifications = () => {
  router.push('/teacher-content/notifications')
}

// 组件挂载时的操作
onMounted(() => {
  // 这里可以添加数据获取逻辑
})
</script>

<style scoped>
.teacher-dashboard {
  padding: 24px;
  min-height: calc(100vh - 64px);
  background-color: var(--color-background);
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
  letter-spacing: -0.5px;
}

.welcome-message {
  font-size: 16px;
  color: var(--color-text);
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* 统计卡片 */
.stat-card {
  background: var(--color-background);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-light);
}

/* 统计图标 */
.stat-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-right: 24px;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light));
  color: var(--color-primary);
}

.bg-blue { 
  background: linear-gradient(135deg, #e6f7ff, #c1e4ff); 
  color: #1890ff;
}
.bg-green { 
  background: linear-gradient(135deg, #f6ffed, #d9f7be); 
  color: #52c41a;
}
.bg-purple { 
  background: linear-gradient(135deg, #f9f0ff, #e9d5ff); 
  color: #722ed1;
}
.bg-orange { 
  background: linear-gradient(135deg, #fff7e6, #ffe7ba); 
  color: #fa8c16;
}

/* 统计数值 */
.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

/* 统计标签 */
.stat-label {
  font-size: 16px;
  color: var(--color-text);
  margin-top: 6px;
  font-weight: 500;
}

/* 内容区域 */
.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 28px;
}

/* 卡片样式 */
.card {
  background: var(--color-background);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-light);
}

/* 卡片头部 */
.card-header {
  padding: 24px 24px 20px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
}

/* 查看全部链接 */
.view-all {
  font-size: 15px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.view-all:hover {
  color: var(--color-primary-dark);
  transform: translateX(4px);
}

.view-all::after {
  content: '→';
  font-size: 13px;
  transition: transform 0.3s ease;
}

.view-all:hover::after {
  transform: translateX(2px);
}

/* 卡片内容 */
.card-body {
  padding: 24px;
}

/* 文章项 */
.article-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.article-item:hover {
  padding-left: 8px;
  border-left: 3px solid var(--color-primary);
}

.article-item:last-child {
  border-bottom: none;
}

.article-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 12px;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.article-item:hover h4 {
  color: var(--color-primary);
}

/* 文章元信息 */
.article-meta {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-text);
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 16px;
}

/* 状态标签 */
.status {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.status.published {
  background: linear-gradient(135deg, #f6ffed, #d9f7be);
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status.pending {
  background: linear-gradient(135deg, #fff7e6, #ffe7ba);
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status.draft {
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  color: #8c8c8c;
  border: 1px solid #d9d9d9;
}

/* 文章操作 */
.article-actions {
  display: flex;
  gap: 12px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text);
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 20px;
}

/* 图表容器 */
.chart-container {
  height: 240px;
  margin-bottom: 24px;
}

/* 图表占位符 */
.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(126, 34, 206, 0.05), rgba(219, 39, 119, 0.05));
  border-radius: 12px;
  border: 1px dashed var(--color-primary-light);
  transition: all 0.3s ease;
}

.chart-placeholder:hover {
  background: linear-gradient(135deg, rgba(126, 34, 206, 0.08), rgba(219, 39, 119, 0.08));
  border-color: var(--color-primary);
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;
}

.chart-placeholder p {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

/* 热门栏目 */
.top-categories h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 16px;
}

.top-categories ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.top-categories li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 15px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.top-categories li:hover {
  background-color: var(--color-background-alt);
  padding-left: 8px;
}

.category-name {
  color: var(--color-heading);
  font-weight: 500;
  transition: color 0.3s ease;
}

.top-categories li:hover .category-name {
  color: var(--color-primary);
}

.category-count {
  color: var(--color-text);
  background-color: var(--color-background-alt);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
}

/* 快捷操作按钮 */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

/* 按钮样式 */
.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(126, 34, 206, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  border-color: var(--color-primary-light);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(126, 34, 206, 0.25);
}

/* 操作图标 */
.action-icon {
  font-size: 28px;
  margin-bottom: 8px;
  transition: transform 0.3s ease;
}

.btn:hover .action-icon {
  transform: scale(1.1);
}

/* 小按钮 */
.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 8px;
  flex-direction: row;
  gap: 6px;
}

.btn-sm .action-icon {
  font-size: 16px;
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
  }
  
  .stat-value {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .teacher-dashboard {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .welcome-message {
    font-size: 14px;
  }
  
  .stats-grid {
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    margin-right: 16px;
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .card-header,
  .card-body {
    padding: 20px;
  }
  
  .card-header h3 {
    font-size: 18px;
  }
  
  .action-buttons {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .btn {
    padding: 16px 8px;
    font-size: 13px;
  }
  
  .action-icon {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .article-actions {
    flex-direction: column;
  }
}
</style>