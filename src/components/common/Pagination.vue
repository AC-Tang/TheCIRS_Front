<template>
  <div class="pagination">
    <button 
      :disabled="currentPage <= 1" 
      @click="$emit('page-change', currentPage - 1)"
      class="pagination-btn"
    >
      上一页
    </button>
    
    <button 
      v-for="page in pages" 
      :key="page"
      :class="['pagination-btn', { active: page === currentPage }]"
      @click="$emit('page-change', page)"
    >
      {{ page }}
    </button>
    
    <button 
      :disabled="currentPage >= totalPages" 
      @click="$emit('page-change', currentPage + 1)"
      class="pagination-btn"
    >
      下一页
    </button>
    
    <span class="pagination-info">共 {{ total }} 条记录</span>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
    pages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, start + 4)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
}

.pagination-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 3px;
}

.pagination-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.pagination-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-info {
  margin-left: 15px;
  color: #666;
}
</style>