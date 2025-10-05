<template>
  <div class="audit-management">
    <div class="page-header">
      <h1>内容审核</h1>
    </div>

    <div class="audit-tabs card">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.name }} ({{ tab.count }})
        </button>
      </div>
    </div>

    <!-- 待审核内容 -->
    <div v-if="activeTab === 'pending'" class="audit-list">
      <div class="card-header">
        <h3>待审核内容</h3>
      </div>
      <div v-for="article in pendingArticles" :key="article.id" class="audit-item card">
        <div class="article-info">
          <h4>{{ article.title }}</h4>
          <p>
            作者：{{ article.author }} | 栏目：{{ article.category }} | 提交时间：{{
              article.submitTime
            }}
          </p>
          <div class="article-summary">{{ article.summary }}</div>
        </div>
        <div class="audit-actions">
          <button class="btn btn-primary" @click="handleAudit(article, 'pass')">通过</button>
          <button class="btn btn-danger" @click="handleAudit(article, 'reject')">退回</button>
          <button class="btn" @click="handleView(article)">查看详情</button>
        </div>
      </div>
    </div>

    <!-- 已通过内容 -->
    <div v-else-if="activeTab === 'passed'" class="audit-list">
      <div class="card-header">
        <h3>已通过内容</h3>
      </div>
      <div v-for="article in passedArticles" :key="article.id" class="audit-item card">
        <div class="article-info">
          <h4>{{ article.title }}</h4>
          <p>
            作者：{{ article.author }} | 栏目：{{ article.category }} | 审核时间：{{
              article.auditTime
            }}
          </p>
          <div class="article-summary">{{ article.summary }}</div>
          <div class="audit-result">
            <span class="status passed">已通过</span>
            <span class="audit-by">审核人：{{ article.auditor }}</span>
          </div>
        </div>
        <div class="audit-actions">
          <button class="btn" @click="handleView(article)">查看详情</button>
        </div>
      </div>
    </div>

    <!-- 已退回内容 -->
    <div v-else-if="activeTab === 'rejected'" class="audit-list">
      <div class="card-header">
        <h3>已退回内容</h3>
      </div>
      <div v-for="article in rejectedArticles" :key="article.id" class="audit-item card">
        <div class="article-info">
          <h4>{{ article.title }}</h4>
          <p>
            作者：{{ article.author }} | 栏目：{{ article.category }} | 审核时间：{{
              article.auditTime
            }}
          </p>
          <div class="article-summary">{{ article.summary }}</div>
          <div class="audit-result">
            <span class="status rejected">已退回</span>
            <span class="audit-by">审核人：{{ article.auditor }}</span>
            <div class="reject-reason">退回原因：{{ article.rejectReason }}</div>
          </div>
        </div>
        <div class="audit-actions">
          <button class="btn" @click="handleView(article)">查看详情</button>
        </div>
      </div>
    </div>

    <!-- 批量审核界面 -->
    <div v-else-if="activeTab === 'batch'" class="batch-audit">
      <div class="card">
        <div class="card-header">
          <h3>批量审核</h3>
        </div>
        <div class="card-body">
          <p>选择要批量审核的文章，然后点击上方的批量通过或批量退回按钮。</p>
          <div class="batch-actions">
            <button class="btn btn-primary">批量通过</button>
            <button class="btn btn-danger">批量退回</button>
          </div>
          <div v-for="article in pendingArticles" :key="article.id" class="batch-item">
            <input type="checkbox" :id="'article-' + article.id" />
            <label :for="'article-' + article.id">{{ article.title }}</label>
          </div>
        </div>
      </div>
    </div>

    <!-- 审核详情界面 -->
    <div v-else-if="activeTab === 'detail'" class="audit-detail">
      <div class="card">
        <div class="card-header">
          <h3>审核详情</h3>
        </div>
        <div class="card-body">
          <div v-if="currentArticle" class="detail-info">
            <h4>{{ currentArticle.title }}</h4>
            <p>
              作者：{{ currentArticle.author }} | 栏目：{{ currentArticle.category }} | 提交时间：{{
                currentArticle.submitTime
              }}
            </p>
            <div class="detail-content">
              {{ currentArticle.summary }}
              <!-- 这里应该是文章的完整内容 -->
            </div>
          </div>
          <div v-else>
            <p>请选择要查看的文章。</p>
          </div>
        </div>
      </div>
    </div>

    <Pagination
      :current-page="pagination.current"
      :total="pagination.total"
      @page-change="handlePageChange"
    />

    <!-- 审核弹窗 -->
    <div v-if="showAuditDialog" class="modal">
      <div class="modal-content">
        <h3>审核意见</h3>
        <form @submit.prevent="submitAudit">
          <div class="form-group">
            <label>审核结果</label>
            <div>
              <label> <input type="radio" v-model="auditForm.result" value="pass" /> 通过 </label>
              <label> <input type="radio" v-model="auditForm.result" value="reject" /> 退回 </label>
            </div>
          </div>
          <div class="form-group">
            <label>审核意见</label>
            <textarea v-model="auditForm.comment" rows="4" placeholder="请输入审核意见"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">提交</button>
            <button type="button" class="btn" @click="showAuditDialog = false">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/common/Pagination.vue'
import { onMounted, computed, watch } from 'vue'

export default {
  name: 'AuditManagement',
  components: {
    Pagination,
  },
  data() {
    return {
      activeTab: null,
      tabs: [
        { key: 'pending', name: '待审核', count: 5 },
        { key: 'passed', name: '已通过', count: 120 },
        { key: 'rejected', name: '已退回', count: 8 },
      ],
      pendingArticles: [
        {
          id: 1,
          title: '关于举办人工智能讲座的通知',
          author: '李四',
          category: '学术讲座',
          submitTime: '2024-01-20 14:30',
          summary: '本次讲座将邀请知名专家讲解人工智能前沿技术...',
        },
        {
          id: 2,
          title: '2024年春季学期选课通知',
          author: '王五',
          category: '教务信息',
          submitTime: '2024-01-19 09:15',
          summary: '2024年春季学期选课系统将于2月1日开放...',
        },
      ],
      passedArticles: [
        {
          id: 3,
          title: '校园安全知识讲座顺利举行',
          author: '安全处',
          category: '安全通知',
          submitTime: '2024-01-18 10:00',
          auditTime: '2024-01-18 11:30',
          summary: '为提高学生安全意识，我校于昨日举办了校园安全知识讲座...',
          auditor: '张三',
        },
        {
          id: 4,
          title: '图书馆新增电子资源公告',
          author: '图书馆',
          category: '资源公告',
          submitTime: '2024-01-17 15:45',
          auditTime: '2024-01-17 16:30',
          summary: '我馆近期新增一批电子资源，包括学术期刊和电子图书...',
          auditor: '张三',
        },
        {
          id: 6,
          title: '2024年度奖学金评选通知',
          author: '学生处',
          category: '奖励资助',
          submitTime: '2024-01-15 14:20',
          auditTime: '2024-01-15 15:30',
          summary: '为激励学生努力学习，现开展2024年度奖学金评选工作...',
          auditor: '张三',
        },
        {
          id: 7,
          title: '校园网络系统升级维护通知',
          author: '信息中心',
          category: '网络通知',
          submitTime: '2024-01-14 09:00',
          auditTime: '2024-01-14 10:15',
          summary: '为提升校园网络服务质量，信息中心将于近期进行系统升级维护...',
          auditor: '张三',
        },
      ],
      rejectedArticles: [
        {
          id: 5,
          title: '关于成立校园社团的申请',
          author: '李明',
          category: '社团活动',
          submitTime: '2024-01-16 09:20',
          auditTime: '2024-01-16 10:15',
          summary: '我们希望成立一个新的校园社团，致力于...',
          auditor: '张三',
          rejectReason: '社团章程不完整，请补充社团活动计划和管理规定',
        },
      ],
      pagination: {
        current: 1,
        total: 10,
      },
      showAuditDialog: false,
      currentArticle: null,
      auditForm: {
        result: 'pass',
        comment: '',
      },
    }
  },
  computed: {
    getInitialTab() {
      const path = this.$route.path
      if (path.includes('pending')) {
        return 'pending'
      } else if (path.includes('records')) {
        // 审核记录可以显示综合视图
        return 'passed'
      } else if (path.includes('detail')) {
        return 'detail'
      } else if (path.includes('batch')) {
        return 'batch'
      }
      return 'pending' // 默认显示待审核
    },
  },
  watch: {
    $route(to, from) {
      // 当路由变化时，更新activeTab
      if (to.path.includes('/auditor/')) {
        this.activeTab = this.getInitialTab
        // 如果是详情页，需要加载对应文章
        if (to.path.includes('detail') && to.params.id) {
          this.handleDetailView(to.params.id)
        }
      }
    },
  },
  mounted() {
    // 组件挂载时根据当前路由设置初始标签页
    this.activeTab = this.getInitialTab
    // 如果是详情页，需要加载对应文章
    if (this.$route.path.includes('detail') && this.$route.params.id) {
      this.handleDetailView(this.$route.params.id)
    }
  },
  methods: {
    handleDetailView(id) {
      // 根据ID查找对应的文章
      const allArticles = [
        ...this.pendingArticles,
        ...this.passedArticles,
        ...this.rejectedArticles,
      ]
      this.currentArticle = allArticles.find((article) => article.id === parseInt(id))
    },
    handleAudit(article, result) {
      this.currentArticle = article
      this.auditForm.result = result
      this.showAuditDialog = true
    },
    handleView(article) {
      // 查看详情，可以跳转到内容页或打开预览
      this.$router.push(`/content/preview/${article.id}`)
    },
    submitAudit() {
      // 提交审核逻辑
      this.showAuditDialog = false
    },
    handlePageChange(page) {
      this.pagination.current = page
      this.loadArticles()
    },
    loadArticles() {
      // 加载审核文章数据
    },
  },
}
</script>

<style scoped>
.audit-management {
  padding: 20px;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.audit-tabs.card {
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
  padding: 0 20px;
}

.tab {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #666;
}

.tab:hover {
  color: #1890ff;
}

.tab.active {
  border-bottom-color: #1890ff;
  color: #1890ff;
}

.audit-list {
  margin-bottom: 20px;
}

.audit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s;
}

.audit-item:hover {
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
  margin-bottom: 15px;
  line-height: 1.5;
}

.audit-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 6px 16px;
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

/* 审核结果样式 */
.audit-result {
  margin-top: 15px;
  font-size: 14px;
}

.status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 10px;
}

.status.passed {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status.rejected {
  background-color: #fff2f0;
  color: #f5222d;
  border: 1px solid #ffccc7;
}

.audit-by {
  color: #666;
  font-size: 12px;
}

.reject-reason {
  margin-top: 8px;
  color: #f5222d;
  font-size: 12px;
  padding: 8px;
  background-color: #fff2f0;
  border-radius: 4px;
  line-height: 1.5;
}

/* 批量审核样式 */
.batch-audit {
  margin-top: 20px;
}

.card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  margin-bottom: 20px;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fafafa;
  border-radius: 4px 4px 0 0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.card-body {
  padding: 20px;
}

.batch-actions {
  margin: 20px 0;
  display: flex;
  gap: 15px;
}

.batch-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}

.batch-item:hover {
  background-color: #fafafa;
}

.batch-item input[type='checkbox'] {
  margin-right: 15px;
  width: 16px;
  height: 16px;
}

/* 审核详情样式 */
.detail-info {
  line-height: 1.6;
}

.detail-info h4 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.detail-content {
  margin-top: 20px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 4px;
  line-height: 1.8;
  color: #333;
}

/* 分页样式 */
.pagination {
  margin-top: 30px;
  text-align: center;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}
</style>
