<template>
  <div class="category-page">
    <div class="page-header">
      <h1>{{ category.name }}</h1>
      <div class="category-description">{{ category.description }}</div>
    </div>
    <div class="article-list">
      <div v-for="article in articles" :key="article.id" class="article-item">
        <h3><router-link :to="`/front/article/${article.id}`">{{ article.title }}</router-link></h3>
        <p class="article-meta">
          {{ article.publishTime }} | 浏览：{{ article.viewCount }} | 作者：{{ article.author }}
        </p>
        <p class="article-summary">{{ article.summary }}</p>
      </div>
    </div>
    <div class="pagination" v-if="total > 0">
      <button class="btn" @click="handlePageChange(1)" :disabled="currentPage === 1">首页</button>
      <button class="btn" @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button class="btn" @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
      <button class="btn" @click="handlePageChange(totalPages)" :disabled="currentPage === totalPages">末页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const category = ref({
  id: 1,
  name: '学院通知',
  description: '学院最新通知公告，包括假期安排、重要活动等'
})

const articles = ref([
  {
    id: 1,
    title: '学院2024年寒假安排通知',
    publishTime: '2024-01-15',
    viewCount: 156,
    author: '教务处',
    summary: '根据学校校历安排，2024年寒假时间为1月20日至2月25日，2月26日正式上课...'
  },
  {
    id: 2,
    title: '关于做好2024年春季学期开学准备工作的通知',
    publishTime: '2024-02-10',
    viewCount: 128,
    author: '校长办公室',
    summary: '为确保2024年春季学期顺利开学，现将有关事项通知如下...'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

onMounted(() => {
  // 在实际应用中，这里应该根据route.params.id获取栏目信息
  const categoryId = route.params.id
  console.log('获取栏目ID:', categoryId)
  // 加载该栏目下的文章列表
})

const handlePageChange = (page) => {
  currentPage.value = page
  // 加载对应页码的文章
}

// 需要导入computed
import { computed } from 'vue'
</script>

<style scoped>
/* 栏目页面容器 */
.category-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 64px);
  background-color: var(--color-background);
}

/* 页面头部 */
.page-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 2px;
}

.page-header h1 {
  color: var(--color-heading);
  margin-bottom: 16px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.category-description {
  color: var(--color-text);
  font-size: 16px;
  line-height: 1.6;
  max-width: 80%;
}

/* 文章列表 */
.article-list {
  margin-bottom: 40px;
}

/* 文章列表项 */
.article-item {
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.article-item:hover {
  padding-left: 12px;
  background-color: var(--color-background-alt);
}

.article-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 40%;
  background: linear-gradient(180deg, var(--color-primary), var(--color-secondary));
  border-radius: 0 4px 4px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-item:hover::before {
  width: 4px;
}

.article-item:last-child {
  border-bottom: none;
}

/* 文章标题 */
.article-item h3 {
  margin-bottom: 16px;
}

.article-item h3 a {
  color: var(--color-heading);
  text-decoration: none;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
}

.article-item h3 a:hover {
  color: var(--color-primary);
  transform: translateX(4px);
}

/* 文章元信息 */
.article-meta {
  color: var(--color-text);
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-weight: 500;
}

.article-meta span {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.article-meta span::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}

/* 文章摘要 */
.article-summary {
  color: var(--color-text);
  line-height: 1.7;
  font-size: 16px;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-item:hover .article-summary {
  color: var(--color-text-hover, var(--color-heading));
}

/* 分页组件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid var(--color-border);
}

.pagination span {
  color: var(--color-heading);
  font-weight: 600;
  font-size: 16px;
  padding: 8px 16px;
  background-color: var(--color-background-alt);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

/* 分页按钮 */
.btn {
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(126, 34, 206, 0.15);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(126, 34, 206, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  color: white;
  box-shadow: 0 6px 16px rgba(126, 34, 206, 0.3);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text);
  background: linear-gradient(135deg, rgba(126, 34, 206, 0.05), rgba(219, 39, 119, 0.05));
  border-radius: 12px;
  border: 1px dashed var(--color-border);
  margin: 40px 0;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-page {
    padding: 20px;
  }
  
  .page-header {
    margin-bottom: 32px;
    padding-bottom: 20px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .category-description {
    max-width: 100%;
    font-size: 15px;
  }
  
  .article-item {
    padding: 20px 0;
  }
  
  .article-item h3 a {
    font-size: 20px;
  }
  
  .article-meta {
    gap: 16px;
    font-size: 13px;
  }
  
  .article-summary {
    font-size: 15px;
  }
  
  .pagination {
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .category-page {
    padding: 16px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .article-item {
    padding: 16px 0;
  }
  
  .article-item h3 a {
    font-size: 18px;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 8px;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .pagination span {
    width: 100%;
    text-align: center;
  }
}

/* 打印样式 */
@media print {
  .pagination {
    display: none;
  }
  
  .category-page {
    padding: 0;
    max-width: 100%;
  }
  
  .page-header {
    border-bottom: 1px solid #000;
  }
  
  .page-header::after {
    background: #000;
  }
}
</style>