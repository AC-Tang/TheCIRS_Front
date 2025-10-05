<template>
  <div class="content-table">
    <table class="table">
      <thead>
        <tr>
          <th>标题</th>
          <th>栏目</th>
          <th>作者</th>
          <th>状态</th>
          <th>发布时间</th>
          <th>浏览数</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td class="title-cell">
            <span v-if="article.isTop" class="top-badge">置顶</span>
            {{ article.title }}
          </td>
          <td>{{ article.category }}</td>
          <td>{{ article.author }}</td>
          <td>
            <span :class="['status', article.status]">
              {{ getStatusText(article.status) }}
            </span>
          </td>
          <td>{{ article.publishTime }}</td>
          <td>{{ article.viewCount }}</td>
          <td class="actions">
            <button class="btn btn-sm" @click="$emit('edit', article)">编辑</button>
            <button class="btn btn-sm" @click="$emit('audit', article)" v-if="article.status === 'auditing'">审核</button>
            <button class="btn btn-sm btn-danger" @click="$emit('delete', article)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ContentTable',
  props: {
    articles: {
      type: Array,
      required: true
    }
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        'draft': '草稿',
        'auditing': '审核中',
        'published': '已发布',
        'rejected': '已退回'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
.title-cell {
  max-width: 300px;
}

.top-badge {
  background: #ff4d4f;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 5px;
}

.status {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.status.draft {
  background: #f0f0f0;
  color: #666;
}

.status.auditing {
  background: #fff7e6;
  color: #fa8c16;
}

.status.published {
  background: #f6ffed;
  color: #52c41a;
}

.status.rejected {
  background: #fff2f0;
  color: #ff4d4f;
}

.actions {
  white-space: nowrap;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
  margin-right: 5px;
}
</style>