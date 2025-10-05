<template>
  <BaseLayout title="系统概览" subtitle="管理员控制台 - 实时监控系统运行状态" showActions="true">
    <template #actions>
      <div class="action-buttons">
        <button class="btn btn-primary" @click="navigateTo('/admin/users')">用户管理</button>
        <button class="btn" @click="navigateTo('/admin/categories')">栏目管理</button>
        <button class="btn" @click="navigateTo('/admin/roles')">权限设置</button>
      </div>
    </template>

    <div class="stats-grid">
      <StatisticsCard title="总文章数" :value="stats.totalArticles" icon="📄" color="#1890ff" />
      <StatisticsCard title="待审核" :value="stats.pendingAudit" icon="⏳" color="#faad14" />
      <StatisticsCard title="今日发布" :value="stats.todayPublished" icon="🚀" color="#52c41a" />
      <StatisticsCard title="用户数" :value="stats.totalUsers" icon="👥" color="#722ed1" />
    </div>

    <div class="dashboard-content">
      <div class="recent-activities card">
        <h3>最近活动</h3>
        <ul>
          <li v-for="activity in recentActivities" :key="activity.id">
            <span class="activity-time">{{ activity.time }}</span>
            <span class="activity-content">{{ activity.content }}</span>
          </li>
        </ul>
      </div>

      <div class="quick-actions card">
        <h3>快捷操作</h3>
        <div class="action-buttons">
          <button class="btn btn-primary" @click="navigateTo('/admin/users')">用户管理</button>
          <button class="btn" @click="navigateTo('/admin/categories')">栏目管理</button>
          <button class="btn" @click="navigateTo('/admin/roles')">权限设置</button>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StatisticsCard from '@/components/common/StatisticsCard.vue'
import BaseLayout from '@/components/layout/BaseLayout.vue'

const router = useRouter()
const stats = ref({
  totalArticles: 128,
  pendingAudit: 15,
  todayPublished: 8,
  totalUsers: 36,
})

const recentActivities = ref([
  {
    id: 1,
    time: '10:30',
    content: '张三发布了新文章《学院2024年寒假安排通知》',
  },
  {
    id: 2,
    time: '09:45',
    content: '李四审核通过了文章《2024年春季学期选课通知》',
  },
  {
    id: 3,
    time: '昨天',
    content: '王五创建了新栏目《学术讲座》',
  },
])

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* Dashboard 容器样式 */
.dashboard {
  width: 100%;
  background-color: var(--color-background, #f5f5f7);
}

/* 页面头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
}

.page-header h1,
h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-heading, #111827);
  margin: 0 0 20px 0;
  letter-spacing: -0.5px;
}

/* 统计卡片网格 */
.stats-grid,
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 统计卡片样式 */
.stat-card {
  background: var(--color-background, #ffffff);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border, #e0e0e0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-light, #e9d5ff);
}

/* 统计卡片装饰元素 */
.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(
    180deg,
    var(--color-primary, #7e22ce),
    var(--color-secondary, #a855f7)
  );
}

.stat-card h3 {
  font-size: 15px;
  color: var(--color-text, #6b7280);
  margin-bottom: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-heading, #111827);
  margin-bottom: 12px;
  line-height: 1.2;
}

/* 主内容网格 */
.dashboard-content,
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

/* 卡片基础样式 */
.card {
  background: var(--color-background, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid var(--color-border, #e0e0e0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-light, #e9d5ff);
}

/* 卡片头部 */
.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-heading, #111827);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 活动列表样式 */
.recent-activities ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-activities li {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
  display: flex;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.recent-activities li:hover {
  padding-left: 28px;
  background-color: var(--color-background-alt, #f9fafb);
}

.recent-activities li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 30%;
  background: linear-gradient(
    180deg,
    var(--color-secondary, #a855f7),
    var(--color-primary, #7e22ce)
  );
  border-radius: 0 4px 4px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recent-activities li:hover::before {
  width: 4px;
}

.recent-activities li:last-child {
  border-bottom: none;
}

.activity-time {
  color: var(--color-text, #6b7280);
  font-size: 14px;
  min-width: 60px;
  font-weight: 500;
}

.activity-content {
  flex: 1;
  margin-left: 20px;
  color: var(--color-heading, #111827);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recent-activities li:hover .activity-content {
  color: var(--color-primary, #7e22ce);
}

/* 快捷操作样式 */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f3f4f6;
  color: #374151;
  text-align: left;
}

.btn:hover {
  background-color: #e5e7eb;
  transform: translateX(4px);
}

.btn-primary {
  background: linear-gradient(
    135deg,
    var(--color-primary, #7e22ce),
    var(--color-secondary, #a855f7)
  );
  color: white;
  box-shadow: 0 4px 12px rgba(126, 34, 206, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #6b21a8, #9333ea);
  box-shadow: 0 6px 16px rgba(126, 34, 206, 0.3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-grid,
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }

  .dashboard-content,
  .content-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .dashboard {
    padding: 20px;
  }

  h1,
  .page-header h1 {
    font-size: 28px;
  }

  .dashboard-content,
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }

  h1,
  .page-header h1 {
    font-size: 24px;
  }

  .stats-grid,
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .recent-activities li {
    padding: 16px;
  }

  .action-buttons {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 12px;
  }

  .stat-card {
    padding: 20px;
  }

  .recent-activities li,
  .action-buttons {
    padding: 16px;
  }
}
</style>
