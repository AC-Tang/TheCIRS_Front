<template>
  <div class="category-management">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <div v-if="activeTab === 'dashboard'" class="header-actions">
        <button class="btn btn-primary" @click="showCreateForm">新建栏目</button>
      </div>
    </div>

    <!-- 栏目工作台 -->
    <div v-if="activeTab === 'dashboard'" class="dashboard-content">
      <div class="dashboard-overview">
        <div class="stat-card">
          <div class="stat-number">{{ totalCategories }}</div>
          <div class="stat-label">栏目总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ pendingArticles }}</div>
          <div class="stat-label">待发布文章</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ publishedArticles }}</div>
          <div class="stat-label">已发布文章</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ todayViews }}</div>
          <div class="stat-label">今日访问量</div>
        </div>
      </div>

      <div class="category-content">
        <div class="category-tree card">
          <h3>栏目结构</h3>
          <CategoryTree
            :categories="categories"
            @edit="handleEditCategory"
            @delete="handleDeleteCategory"
          />
        </div>

        <div class="category-form card" v-if="showForm">
          <h3>{{ editingCategory ? '编辑栏目' : '新建栏目' }}</h3>
          <form @submit.prevent="handleSaveCategory">
            <div class="form-group">
              <label>栏目名称</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-group">
              <label>父栏目</label>
              <select v-model="form.parentId">
                <option value="">无（作为顶级栏目）</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>排序序号</label>
              <input v-model="form.sortOrder" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>栏目描述</label>
              <textarea v-model="form.description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>栏目模板</label>
              <select v-model="form.template">
                <option value="default">默认模板</option>
                <option value="news">新闻模板</option>
                <option value="gallery">图集模板</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">保存</button>
              <button type="button" class="btn" @click="hideForm">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 待发布文章 -->
    <div v-else-if="activeTab === 'pending'" class="pending-content">
      <div class="card-header">
        <h3>待发布文章</h3>
      </div>
      <div class="article-list">
        <div v-for="article in pendingArticlesList" :key="article.id" class="article-item card">
          <div class="article-info">
            <h4>{{ article.title }}</h4>
            <p>
              作者：{{ article.author }} | 栏目：{{ getCategoryName(article.categoryId) }} |
              提交时间：{{ article.submitTime }}
            </p>
            <div class="article-summary">{{ article.summary }}</div>
          </div>
          <div class="article-actions">
            <button class="btn btn-primary" @click="handlePublish(article)">发布</button>
            <button class="btn btn-warning" @click="handleReject(article)">退回</button>
            <button class="btn" @click="handleViewArticle(article)">查看详情</button>
          </div>
        </div>
      </div>
      <Pagination
        v-if="pendingArticlesList.length > 0"
        :currentPage="pagination.current"
        :total="pagination.total"
        @page-change="handlePageChange"
      />
    </div>

    <!-- 文章管理 -->
    <div v-else-if="activeTab === 'articles'" class="articles-content">
      <div class="card-header">
        <h3>文章管理</h3>
        <div class="search-filter">
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="搜索文章标题"
            class="search-input"
          />
          <select v-model="filterCategory" class="filter-select">
            <option value="">全栏目</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <button class="btn btn-primary" @click="searchArticles">搜索</button>
        </div>
      </div>
      <div class="article-list">
        <div v-for="article in allArticles" :key="article.id" class="article-item card">
          <div class="article-info">
            <h4>{{ article.title }}</h4>
            <p>
              作者：{{ article.author }} | 栏目：{{ getCategoryName(article.categoryId) }} |
              发布时间：{{ article.publishTime }}
            </p>
            <div class="article-stats">
              <span>阅读：{{ article.views }}</span>
              <span>评论：{{ article.comments }}</span>
              <span class="status" :class="article.status">{{
                article.status === 'published' ? '已发布' : '已下线'
              }}</span>
            </div>
          </div>
          <div class="article-actions">
            <button class="btn" @click="handleEditArticle(article)">编辑</button>
            <button class="btn btn-danger" @click="handleDeleteArticle(article)">删除</button>
            <button class="btn" @click="handleViewArticle(article)">查看详情</button>
          </div>
        </div>
      </div>
      <Pagination
        v-if="allArticles.length > 0"
        :currentPage="pagination.current"
        :total="pagination.total"
        @page-change="handlePageChange"
      />
    </div>

    <!-- 编辑器排版 -->
    <div v-else-if="activeTab === 'editorial'" class="editorial-content">
      <div class="card-header">
        <h3>编辑器排版</h3>
        <div class="editorial-actions">
          <select v-model="selectedCategory" class="category-select">
            <option value="">选择栏目</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>
      <div v-if="selectedCategory" class="editorial-layout">
        <div class="layout-preview card">
          <h4>{{ getCategoryName(selectedCategory) }} - 首页排版预览</h4>
          <div class="featured-article">
            <h5>头条文章</h5>
            <div class="empty-state">请从下方选择文章设置为头条</div>
          </div>
          <div class="article-grid">
            <h5>文章列表</h5>
            <div class="empty-state">请选择要显示的文章</div>
          </div>
        </div>
        <div class="available-articles card">
          <h4>可排版文章</h4>
          <div class="empty-state">暂无可用文章</div>
        </div>
      </div>
      <div v-else class="empty-state">请选择要排版的栏目</div>
    </div>

    <!-- 统计信息 -->
    <div v-else-if="activeTab === 'statistics'" class="statistics-content">
      <div class="card-header">
        <h3>统计信息</h3>
      </div>
      <div class="stats-overview">
        <div class="stats-card">
          <h4>栏目访问量统计</h4>
          <div class="chart-placeholder">访问量图表区域</div>
        </div>
        <div class="stats-card">
          <h4>文章发布统计</h4>
          <div class="chart-placeholder">发布量图表区域</div>
        </div>
      </div>
      <div class="top-articles">
        <h4>热门文章排行</h4>
        <table class="stats-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>标题</th>
              <th>栏目</th>
              <th>阅读量</th>
              <th>评论量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(article, index) in topArticles" :key="article.id">
              <td>{{ index + 1 }}</td>
              <td>{{ article.title }}</td>
              <td>{{ getCategoryName(article.categoryId) }}</td>
              <td>{{ article.views }}</td>
              <td>{{ article.comments }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 审核弹窗 -->
    <div v-if="showPublishDialog" class="modal">
      <div class="modal-content">
        <h3>{{ publishForm.action === 'publish' ? '发布文章' : '退回文章' }}</h3>
        <form @submit.prevent="submitPublishAction">
          <div class="form-group">
            <label>{{ publishForm.action === 'reject' ? '退回原因' : '发布说明' }}</label>
            <textarea
              v-model="publishForm.comment"
              rows="4"
              placeholder="请输入{{ publishForm.action === 'reject' ? '退回原因' : '发布说明' }}"
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">提交</button>
            <button type="button" class="btn" @click="showPublishDialog = false">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryTree from '@/components/category/CategoryTree.vue'
import Pagination from '@/components/common/Pagination.vue'
import { computed, watch, onMounted } from 'vue'

export default {
  name: 'CategoryManagement',
  components: {
    CategoryTree,
    Pagination,
  },
  data() {
    return {
      activeTab: null,
      categories: [
        {
          id: 1,
          name: '学院通知',
          parentId: null,
          sortOrder: 1,
          description: '学院相关通知',
          template: 'default',
        },
        {
          id: 2,
          name: '教务信息',
          parentId: null,
          sortOrder: 2,
          description: '教务相关信息',
          template: 'default',
        },
        {
          id: 3,
          name: '学术讲座',
          parentId: null,
          sortOrder: 3,
          description: '学术讲座信息',
          template: 'news',
        },
        {
          id: 4,
          name: '学生活动',
          parentId: null,
          sortOrder: 4,
          description: '学生活动信息',
          template: 'default',
        },
      ],
      showForm: false,
      editingCategory: null,
      form: {
        name: '',
        parentId: '',
        sortOrder: 0,
        description: '',
        template: 'default',
      },
      // 待发布文章列表
      pendingArticlesList: [
        {
          id: 1,
          title: '2024年春季学期课程表发布',
          author: '教务处',
          categoryId: 2,
          submitTime: '2024-01-20 14:30',
          summary: '2024年春季学期课程表已经发布，请各位同学及时查看...',
        },
        {
          id: 2,
          title: '关于举办校园科技节的通知',
          author: '学生处',
          categoryId: 4,
          submitTime: '2024-01-19 10:15',
          summary: '为丰富校园文化生活，我校将于3月举办校园科技节...',
        },
        {
          id: 3,
          title: '人工智能前沿技术讲座',
          author: '计算机学院',
          categoryId: 3,
          submitTime: '2024-01-18 16:45',
          summary: '邀请知名专家来校讲解人工智能前沿技术...',
        },
      ],
      // 所有文章列表
      allArticles: [
        {
          id: 4,
          title: '2023年度表彰大会顺利举行',
          author: '校长办公室',
          categoryId: 1,
          publishTime: '2024-01-15 09:30',
          views: 1250,
          comments: 23,
          status: 'published',
        },
        {
          id: 5,
          title: '校园安全知识宣传周活动总结',
          author: '保卫处',
          categoryId: 1,
          publishTime: '2024-01-10 14:20',
          views: 890,
          comments: 15,
          status: 'published',
        },
        {
          id: 6,
          title: '图书馆新增电子资源公告',
          author: '图书馆',
          categoryId: 1,
          publishTime: '2024-01-05 11:15',
          views: 650,
          comments: 8,
          status: 'published',
        },
      ],
      // 热门文章
      topArticles: [
        {
          id: 4,
          title: '2023年度表彰大会顺利举行',
          categoryId: 1,
          views: 1250,
          comments: 23,
        },
        {
          id: 5,
          title: '校园安全知识宣传周活动总结',
          categoryId: 1,
          views: 890,
          comments: 15,
        },
        {
          id: 6,
          title: '图书馆新增电子资源公告',
          categoryId: 1,
          views: 650,
          comments: 8,
        },
      ],
      pagination: {
        current: 1,
        total: 10,
      },
      searchKeyword: '',
      filterCategory: '',
      selectedCategory: '',
      showPublishDialog: false,
      currentArticle: null,
      publishForm: {
        action: 'publish',
        comment: '',
      },
      // 统计数据
      totalCategories: 4,
      pendingArticles: 3,
      publishedArticles: 120,
      todayViews: 568,
    }
  },
  computed: {
    pageTitle() {
      switch (this.activeTab) {
        case 'dashboard':
          return '栏目工作台'
        case 'pending':
          return '待发布文章'
        case 'articles':
          return '文章管理'
        case 'editorial':
          return '编辑器排版'
        case 'statistics':
          return '统计信息'
        default:
          return '栏目管理'
      }
    },
    getInitialTab() {
      const path = this.$route.path
      if (path.includes('pending')) {
        return 'pending'
      } else if (path.includes('articles')) {
        return 'articles'
      } else if (path.includes('editorial')) {
        return 'editorial'
      } else if (path.includes('statistics')) {
        return 'statistics'
      }
      return 'dashboard' // 默认显示栏目工作台
    },
  },
  watch: {
    $route(to, from) {
      // 当路由变化时，更新activeTab
      if (to.path.includes('/category-admin/')) {
        this.activeTab = this.getInitialTab
      }
    },
  },
  mounted() {
    // 组件挂载时根据当前路由设置初始标签页
    this.activeTab = this.getInitialTab
  },
  methods: {
    showCreateForm() {
      this.editingCategory = null
      this.form = {
        name: '',
        parentId: '',
        sortOrder: 0,
        description: '',
        template: 'default',
      }
      this.showForm = true
    },
    hideForm() {
      this.showForm = false
      this.editingCategory = null
    },
    handleEditCategory(category) {
      this.editingCategory = category
      this.form = { ...category }
      this.showForm = true
    },
    handleDeleteCategory(category) {
      if (confirm(`确定要删除栏目"${category.name}"吗？`)) {
        // 删除逻辑
      }
    },
    handleSaveCategory() {
      // 保存栏目逻辑
      this.hideForm()
    },
    // 待发布文章相关方法
    handlePublish(article) {
      this.currentArticle = article
      this.publishForm.action = 'publish'
      this.publishForm.comment = ''
      this.showPublishDialog = true
    },
    handleReject(article) {
      this.currentArticle = article
      this.publishForm.action = 'reject'
      this.publishForm.comment = ''
      this.showPublishDialog = true
    },
    submitPublishAction() {
      // 提交发布或退回操作
      this.showPublishDialog = false
    },
    // 文章管理相关方法
    handleViewArticle(article) {
      // 查看文章详情
      this.$router.push(`/front/article/${article.id}`)
    },
    handleEditArticle(article) {
      // 编辑文章
      this.$router.push(`/publisher/article/edit/${article.id}`)
    },
    handleDeleteArticle(article) {
      if (confirm(`确定要删除文章"${article.title}"吗？`)) {
        // 删除文章逻辑
      }
    },
    searchArticles() {
      // 搜索文章逻辑
    },
    // 获取栏目名称
    getCategoryName(categoryId) {
      const category = this.categories.find((cat) => cat.id === categoryId)
      return category ? category.name : '未知栏目'
    },
    // 分页相关
    handlePageChange(page) {
      this.pagination.current = page
      // 加载对应页数据
    },
  },
}
</script>

<style scoped>
.category-management {
  padding: 20px;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.btn.btn-primary {
  background-color: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.btn.btn-primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.btn.btn-danger {
  background-color: #f5222d;
  border-color: #f5222d;
  color: #fff;
}

.btn.btn-danger:hover {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.btn.btn-warning {
  background-color: #faad14;
  border-color: #faad14;
  color: #fff;
}

.btn.btn-warning:hover {
  background-color: #ffc53d;
  border-color: #ffc53d;
}

/* 卡片样式 */
.card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  margin-bottom: 20px;
  padding: 20px;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fafafa;
  border-radius: 4px 4px 0 0;
  margin: -20px -20px 20px -20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

/* 栏目工作台样式 */
.dashboard-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.category-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.category-tree h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}

/* 表单样式 */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 文章列表样式 */
.article-list {
  margin-top: 20px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s;
}

.article-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.article-info {
  flex: 1;
  margin-right: 20px;
}

.article-info h4 {
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
}

.article-info p {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.article-summary {
  color: #888;
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.article-stats {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.article-stats .status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.article-stats .status.published {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.article-stats .status.offline {
  background-color: #fff2f0;
  color: #f5222d;
  border: 1px solid #ffccc7;
}

.article-actions {
  display: flex;
  gap: 10px;
}

/* 搜索和筛选样式 */
.search-filter {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input,
.filter-select,
.category-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.search-input {
  width: 200px;
}

/* 编辑器排版样式 */
.editorial-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.layout-preview {
  min-height: 500px;
}

.featured-article {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.article-grid {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
}

/* 统计样式 */
.stats-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
  min-height: 300px;
}

.stats-card h4 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}

.chart-placeholder {
  width: 100%;
  height: 200px;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
}

.top-articles h4 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.stats-table th,
.stats-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.stats-table th {
  background-color: #fafafa;
  font-weight: 600;
  color: #333;
}

.stats-table tr:hover {
  background-color: #fafafa;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 4px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  color: #888;
  padding: 40px 20px;
  font-size: 14px;
}

/* 分页样式 */
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>
