<template>
  <div class="teacher-content">
    <div class="page-header">
      <h1>我的发布</h1>
      <button class="btn btn-primary" @click="showCreateForm">
        <span class="icon">📝</span>
        发布新文章
      </button>
    </div>

    <!-- 筛选条件 -->
    <div class="filters card">
      <div class="filter-row">
        <div class="filter-group">
          <label>栏目筛选：</label>
          <select v-model="filters.category" @change="handleFilterChange">
            <option value="">全部栏目</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>状态筛选：</label>
          <select v-model="filters.status" @change="handleFilterChange">
            <option value="">全部状态</option>
            <option value="draft">草稿</option>
            <option value="pending">审核中</option>
            <option value="published">已发布</option>
            <option value="rejected">已驳回</option>
          </select>
        </div>
        <div class="search-group">
          <input 
            type="text" 
            v-model="filters.keyword" 
            placeholder="搜索文章标题"
            @input="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">🔍</button>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="articles-table card">
      <div class="table-header">
        <div class="table-cell title">标题</div>
        <div class="table-cell category">栏目</div>
        <div class="table-cell status">状态</div>
        <div class="table-cell publish-time">发布时间</div>
        <div class="table-cell views">浏览量</div>
        <div class="table-cell actions">操作</div>
      </div>
      <div class="table-body">
        <div v-if="filteredArticles.length > 0">
          <div v-for="article in filteredArticles" :key="article.id" class="table-row">
            <div class="table-cell title">
              <router-link :to="`/front/article/${article.id}`" target="_blank" class="article-title">
                {{ article.title }}
              </router-link>
            </div>
            <div class="table-cell category">{{ article.category }}</div>
            <div class="table-cell status">
              <span :class="['status-badge', article.status]">{{ getStatusText(article.status) }}</span>
            </div>
            <div class="table-cell publish-time">{{ article.publishTime || '未发布' }}</div>
            <div class="table-cell views">{{ article.viewCount }}</div>
            <div class="table-cell actions">
              <button class="action-btn" @click="editArticle(article)">编辑</button>
              <button class="action-btn delete-btn" @click="deleteArticle(article.id)">删除</button>
              <button v-if="article.status === 'draft'" class="action-btn publish-btn" @click="submitForReview(article.id)">提交审核</button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>暂无文章数据</p>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <div class="page-info">共 {{ totalArticles }} 篇文章</div>
      <div class="page-controls">
        <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
        <span class="current-page">{{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">下一页</button>
      </div>
    </div>

    <!-- 创建/编辑弹窗 -->
    <div v-if="showForm" class="modal-overlay" @click.self="hideForm">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingArticle ? '编辑文章' : '发布新文章' }}</h2>
          <button class="close-btn" @click="hideForm">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveArticle">
            <div class="form-group">
              <label>文章标题 <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="articleForm.title" 
                required 
                placeholder="请输入文章标题"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>所属栏目 <span class="required">*</span></label>
                <select v-model="articleForm.categoryId" required>
                  <option value="">请选择栏目</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>封面图</label>
                <div class="upload-area">
                  <input type="file" accept="image/*" @change="handleImageUpload">
                  <div class="upload-placeholder">
                    <span class="upload-icon">📷</span>
                    <span>点击上传封面图</span>
                  </div>
                  <img v-if="articleForm.coverImage" :src="articleForm.coverImage" class="preview-image">
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>文章摘要</label>
              <textarea 
                v-model="articleForm.summary" 
                rows="3" 
                placeholder="请输入文章摘要"
              ></textarea>
            </div>
            <div class="form-group">
              <label>文章内容 <span class="required">*</span></label>
              <div class="editor-container">
                <div class="editor-toolbar">
                  <button type="button" @click="insertFormat('bold')">B</button>
                  <button type="button" @click="insertFormat('italic')">I</button>
                  <button type="button" @click="insertFormat('underline')">U</button>
                  <button type="button" @click="insertFormat('h2')">H2</button>
                  <button type="button" @click="insertFormat('h3')">H3</button>
                  <button type="button" @click="insertFormat('ul')">• 列表</button>
                  <button type="button" @click="insertFormat('ol')">1. 列表</button>
                  <button type="button" @click="insertFormat('link')">🔗</button>
                </div>
                <textarea 
                  v-model="articleForm.content" 
                  rows="12" 
                  required 
                  placeholder="请输入文章内容"
                  class="content-editor"
                ></textarea>
              </div>
            </div>
            <div class="form-group">
              <label>标签</label>
              <input 
                type="text" 
                v-model="articleForm.tags" 
                placeholder="多个标签用逗号分隔"
              />
            </div>
            <div class="form-group">
              <label>发布设置</label>
              <div class="publish-settings">
                <label class="setting-item">
                  <input type="checkbox" v-model="articleForm.isPublic">
                  <span>公开可见</span>
                </label>
                <label class="setting-item">
                  <input type="checkbox" v-model="articleForm.allowComments">
                  <span>允许评论</span>
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" @click="saveAsDraft">保存草稿</button>
              <button type="submit" class="btn btn-primary">
                {{ editingArticle && editingArticle.status === 'draft' ? '提交审核' : '发布' }}
              </button>
            </div>
          </form>
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

// 筛选条件
const filters = ref({
  category: '',
  status: '',
  keyword: ''
})

// 文章列表
const articles = ref([
  {
    id: 1,
    title: '计算机科学前沿技术讲座通知',
    categoryId: 1,
    category: '学术讲座',
    summary: '邀请知名专家来校分享人工智能最新研究成果和应用案例。',
    content: '讲座内容包括人工智能基础、深度学习应用、计算机视觉等前沿技术...',
    coverImage: '',
    author: userName,
    status: 'published',
    publishTime: '2024-06-15 14:30',
    viewCount: 456,
    tags: '人工智能,讲座,前沿技术',
    isPublic: true,
    allowComments: true
  },
  {
    id: 2,
    title: '2024年夏季学期选课指南',
    categoryId: 2,
    category: '课程信息',
    summary: '详细介绍2024年夏季学期选课流程、注意事项和常见问题解答。',
    content: '一、选课时间安排\n1. 本科生选课时间：6月20日-6月25日\n2. 研究生选课时间：6月22日-6月28日...',
    coverImage: '',
    author: userName,
    status: 'published',
    publishTime: '2024-06-10 09:15',
    viewCount: 1234,
    tags: '选课,夏季学期,指南',
    isPublic: true,
    allowComments: true
  },
  {
    id: 3,
    title: '人工智能课程教学大纲修订说明',
    categoryId: 3,
    category: '教学通知',
    summary: '关于人工智能课程教学大纲修订的详细说明和新旧大纲对比。',
    content: '为适应人工智能领域的快速发展，我们对人工智能课程教学大纲进行了全面修订...',
    coverImage: '',
    author: userName,
    status: 'published',
    publishTime: '2024-06-05 16:45',
    viewCount: 789,
    tags: '人工智能,教学大纲,修订',
    isPublic: true,
    allowComments: true
  },
  {
    id: 4,
    title: '数据结构与算法课程设计指导',
    categoryId: 2,
    category: '课程信息',
    summary: '课程设计的选题范围、要求、评分标准和时间安排。',
    content: '课程设计是数据结构与算法课程的重要组成部分，旨在培养学生的实际编程能力...',
    coverImage: '',
    author: userName,
    status: 'draft',
    publishTime: '',
    viewCount: 0,
    tags: '数据结构,算法,课程设计',
    isPublic: true,
    allowComments: true
  }
])

// 栏目列表
const categories = ref([
  { id: 1, name: '学术讲座' },
  { id: 2, name: '课程信息' },
  { id: 3, name: '教学通知' },
  { id: 4, name: '科研动态' },
  { id: 5, name: '学生活动' }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 表单相关
const showForm = ref(false)
const editingArticle = ref(null)
const articleForm = ref({
  title: '',
  categoryId: '',
  summary: '',
  content: '',
  coverImage: '',
  tags: '',
  isPublic: true,
  allowComments: true
})

// 计算筛选后的文章列表
const filteredArticles = computed(() => {
  let result = [...articles.value]
  
  // 栏目筛选
  if (filters.value.category) {
    result = result.filter(article => article.categoryId === parseInt(filters.value.category))
  }
  
  // 状态筛选
  if (filters.value.status) {
    result = result.filter(article => article.status === filters.value.status)
  }
  
  // 关键词搜索
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    result = result.filter(article => article.title.toLowerCase().includes(keyword))
  }
  
  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  
  return result.slice(startIndex, endIndex)
})

// 计算总文章数
const totalArticles = computed(() => {
  let result = [...articles.value]
  
  // 应用相同的筛选条件
  if (filters.value.category) {
    result = result.filter(article => article.categoryId === parseInt(filters.value.category))
  }
  
  if (filters.value.status) {
    result = result.filter(article => article.status === filters.value.status)
  }
  
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    result = result.filter(article => article.title.toLowerCase().includes(keyword))
  }
  
  return result.length
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalArticles.value / pageSize.value)
})

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

// 显示创建表单
const showCreateForm = () => {
  editingArticle.value = null
  articleForm.value = {
    title: '',
    categoryId: '',
    summary: '',
    content: '',
    coverImage: '',
    tags: '',
    isPublic: true,
    allowComments: true
  }
  showForm.value = true
}

// 编辑文章
const editArticle = (article) => {
  editingArticle.value = article
  articleForm.value = {
    title: article.title,
    categoryId: article.categoryId,
    summary: article.summary,
    content: article.content,
    coverImage: article.coverImage,
    tags: article.tags,
    isPublic: article.isPublic,
    allowComments: article.allowComments
  }
  showForm.value = true
}

// 删除文章
const deleteArticle = (id) => {
  if (confirm('确定要删除这篇文章吗？')) {
    const index = articles.value.findIndex(article => article.id === id)
    if (index !== -1) {
      articles.value.splice(index, 1)
    }
  }
}

// 提交审核
const submitForReview = (id) => {
  if (confirm('确定要提交这篇文章进行审核吗？')) {
    const article = articles.value.find(article => article.id === id)
    if (article) {
      article.status = 'pending'
    }
  }
}

// 隐藏表单
const hideForm = () => {
  showForm.value = false
  editingArticle.value = null
}

// 保存文章
const saveArticle = () => {
  if (editingArticle.value) {
    // 编辑现有文章
    const index = articles.value.findIndex(article => article.id === editingArticle.value.id)
    if (index !== -1) {
      const category = categories.value.find(cat => cat.id === parseInt(articleForm.value.categoryId))
      articles.value[index] = {
        ...editingArticle.value,
        ...articleForm.value,
        categoryId: parseInt(articleForm.value.categoryId),
        category: category ? category.name : '',
        status: editingArticle.value.status === 'draft' ? 'pending' : 'published',
        publishTime: editingArticle.value.status === 'draft' ? '' : new Date().toLocaleString('zh-CN')
      }
    }
  } else {
    // 创建新文章
    const category = categories.value.find(cat => cat.id === parseInt(articleForm.value.categoryId))
    const newArticle = {
      id: Date.now(),
      ...articleForm.value,
      categoryId: parseInt(articleForm.value.categoryId),
      category: category ? category.name : '',
      author: userName,
      status: 'pending',
      publishTime: '',
      viewCount: 0
    }
    articles.value.unshift(newArticle)
  }
  
  hideForm()
  currentPage.value = 1
}

// 保存为草稿
const saveAsDraft = () => {
  if (editingArticle.value) {
    // 编辑现有文章
    const index = articles.value.findIndex(article => article.id === editingArticle.value.id)
    if (index !== -1) {
      const category = categories.value.find(cat => cat.id === parseInt(articleForm.value.categoryId))
      articles.value[index] = {
        ...editingArticle.value,
        ...articleForm.value,
        categoryId: parseInt(articleForm.value.categoryId),
        category: category ? category.name : '',
        status: 'draft'
      }
    }
  } else {
    // 创建新草稿
    const category = categories.value.find(cat => cat.id === parseInt(articleForm.value.categoryId))
    const newArticle = {
      id: Date.now(),
      ...articleForm.value,
      categoryId: parseInt(articleForm.value.categoryId),
      category: category ? category.name : '',
      author: userName,
      status: 'draft',
      publishTime: '',
      viewCount: 0
    }
    articles.value.unshift(newArticle)
  }
  
  hideForm()
  currentPage.value = 1
}

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 这里只是模拟上传，实际项目中应该调用上传接口
    const reader = new FileReader()
    reader.onload = (e) => {
      articleForm.value.coverImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 插入格式（简化版编辑器功能）
const insertFormat = (format) => {
  let text = articleForm.value.content
  const textarea = document.querySelector('.content-editor')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = text.substring(start, end)
  
  let newText = ''
  
  switch (format) {
    case 'bold':
      newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end)
      break
    case 'italic':
      newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end)
      break
    case 'underline':
      newText = text.substring(0, start) + `__${selectedText}__` + text.substring(end)
      break
    case 'h2':
      newText = text.substring(0, start) + `## ${selectedText}` + text.substring(end)
      break
    case 'h3':
      newText = text.substring(0, start) + `### ${selectedText}` + text.substring(end)
      break
    case 'ul':
      if (selectedText) {
        const lines = selectedText.split('\n')
        newText = text.substring(0, start) + lines.map(line => `- ${line}`).join('\n') + text.substring(end)
      } else {
        newText = text.substring(0, start) + '- '
      }
      break
    case 'ol':
      if (selectedText) {
        const lines = selectedText.split('\n')
        newText = text.substring(0, start) + lines.map((line, index) => `${index + 1}. ${line}`).join('\n') + text.substring(end)
      } else {
        newText = text.substring(0, start) + '1. '
      }
      break
    case 'link':
      if (selectedText) {
        newText = text.substring(0, start) + `[${selectedText}](链接地址)` + text.substring(end)
      } else {
        newText = text.substring(0, start) + '[链接文本](链接地址)'
      }
      break
  }
  
  if (newText) {
    articleForm.value.content = newText
    
    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus()
      if (selectedText) {
        // 如果有选中文本，设置光标到格式化文本之后
        const newCursorPosition = start + (newText.substring(start).indexOf(selectedText) + selectedText.length)
        textarea.setSelectionRange(newCursorPosition, newCursorPosition)
      } else {
        // 如果没有选中文本，保持光标位置
        textarea.setSelectionRange(start + format.length + 2, start + format.length + 2)
      }
    }, 0)
  }
}

// 处理筛选条件变化
const handleFilterChange = () => {
  currentPage.value = 1
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 切换页面
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 组件挂载时的操作
onMounted(() => {
  // 这里可以添加数据获取逻辑
})
</script>

<style scoped>
.teacher-content {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.btn-primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  color: #fff;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

/* 筛选条件样式 */
.filters {
  padding: 16px 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.filter-group select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.search-group {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.search-group input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  width: 200px;
}

.search-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-left: none;
  background: #f0f0f0;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 14px;
}

/* 文章列表样式 */
.table-header {
  display: flex;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 20px;
  font-weight: 600;
  color: #333;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 20px;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #fafafa;
}

.table-cell {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
}

.table-cell.title {
  flex: 3;
}

.table-cell.category {
  flex: 1;
}

.table-cell.status {
  flex: 1;
}

.table-cell.publish-time {
  flex: 1.5;
}

.table-cell.views {
  flex: 0.8;
}

.table-cell.actions {
  flex: 1.2;
  justify-content: flex-end;
}

.article-title {
  color: #333;
  text-decoration: none;
  transition: color 0.2s ease;
}

.article-title:hover {
  color: #1890ff;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.draft {
  background: #f5f5f5;
  color: #666;
}

.status-badge.pending {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status-badge.published {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-badge.rejected {
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.action-btn {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.delete-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.publish-btn {
  border-color: #52c41a;
  color: #52c41a;
}

.publish-btn:hover {
  background: #f6ffed;
  border-color: #52c41a;
  color: #52c41a;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-page {
  font-size: 14px;
  color: #333;
  min-width: 80px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #ff4d4f;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.upload-area {
  position: relative;
  width: 100%;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}

.upload-area input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  color: #999;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.editor-container {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.editor-toolbar button {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.editor-toolbar button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.content-editor {
  width: 100%;
  padding: 12px;
  border: none;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
}

.content-editor:focus {
  outline: none;
}

.publish-settings {
  display: flex;
  gap: 20px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>