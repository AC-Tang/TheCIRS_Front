<template>
  <div class="content-management">
    <div class="page-header">
      <h1>内容管理</h1>
      <button class="btn btn-primary" @click="showCreateForm">
        新建内容
      </button>
    </div>

    <div class="filters card">
      <div class="filter-group">
        <label>栏目筛选：</label>
        <select v-model="filters.category">
          <option value="">全部栏目</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>状态筛选：</label>
        <select v-model="filters.status">
          <option value="">全部状态</option>
          <option value="draft">草稿</option>
          <option value="auditing">审核中</option>
          <option value="published">已发布</option>
        </select>
      </div>
      <SearchBar @search="handleSearch" />
    </div>

    <ContentTable 
      :articles="articles"
      @edit="handleEdit"
      @delete="handleDelete"
      @audit="handleAudit"
    />

    <Pagination 
      :current-page="pagination.current"
      :total="pagination.total"
      @page-change="handlePageChange"
    />

    <!-- 创建/编辑弹窗 -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <ContentForm 
          :article="editingArticle"
          @save="handleSave"
          @cancel="hideForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ContentTable from '@/components/content/ContentTable.vue'
import ContentForm from '@/components/content/ContentForm.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import Pagination from '@/components/common/Pagination.vue'

export default {
  name: 'ContentManagement',
  components: {
    ContentTable,
    ContentForm,
    SearchBar,
    Pagination
  },
  data() {
    return {
      filters: {
        category: '',
        status: '',
        keyword: ''
      },
      articles: [
        {
          id: 1,
          title: '学院2024年寒假安排通知',
          category: '学院通知',
          author: '张三',
          status: 'published',
          publishTime: '2024-01-15 10:30',
          viewCount: 156
        }
        // ... 更多文章数据
      ],
      categories: [
        { id: 1, name: '学院通知' },
        { id: 2, name: '教务信息' },
        { id: 3, name: '学术讲座' }
      ],
      pagination: {
        current: 1,
        total: 100
      },
      showForm: false,
      editingArticle: null
    }
  },
  methods: {
    showCreateForm() {
      this.editingArticle = null
      this.showForm = true
    },
    hideForm() {
      this.showForm = false
      this.editingArticle = null
    },
    handleEdit(article) {
      this.editingArticle = article
      this.showForm = true
    },
    handleSave(articleData) {
      // 保存逻辑
      this.hideForm()
    },
    handleSearch(keyword) {
      this.filters.keyword = keyword
      this.loadArticles()
    },
    handlePageChange(page) {
      this.pagination.current = page
      this.loadArticles()
    },
    loadArticles() {
      // 加载文章数据
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}
</style>