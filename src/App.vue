<template>
  <div id="app">
    <!-- 公共顶部导航栏 -->
    <TopNavigation v-if="showTopNavigation" />
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNavigation from '@/components/layout/TopNavigation.vue'
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()

// 控制是否显示顶部导航栏
const showTopNavigation = computed(() => {
  return route.path !== '/login'
})

// 控制是否显示页脚
const showFooter = computed(() => {
  return !route.meta.hideFooter
})
</script>

<style>
/* 全局CSS变量 - 绿色主题 */
:root {
  /* 主色调 */
  --color-primary: #10b981;
  --color-primary-dark: #059669;
  --color-primary-light: #34d399;
  --color-secondary: #059669;
  
  /* 背景色 */
  --color-background: #ffffff;
  --color-background-mute: #f9fafb;
  
  /* 文本色 */
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-light: #9ca3af;
  --color-heading: #111827;
  
  /* 边框色 */
  --color-border: #e5e7eb;
  --color-border-light: #f3f4f6;
  
  /* 功能色 */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background);
}

#app {
  font-family: inherit;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 24px;
  background-color: var(--color-background-mute);
  overflow-y: auto;
}

/* 主内容区域样式 */

/* 通用样式 - 简约高级风格 */
.card {
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(126, 34, 206, 0.3);
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-outline:hover {
  background-color: var(--color-primary);
  color: white;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* 表格样式 */
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.table th {
  background-color: var(--color-primary);
  color: white;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 13px;
}

.table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover td {
  background-color: rgba(126, 34, 206, 0.05);
}

/* 输入框样式 */
input,
textarea,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: var(--color-background);
  color: var(--color-text);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(126, 34, 206, 0.1);
}

/* 标题样式 */
h1, h2, h3, h4, h5, h6 {
  color: var(--color-heading);
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 16px;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.125rem; }
h6 { font-size: 1rem; }

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .card {
    padding: 20px;
    margin-bottom: 16px;
  }
  
  .table th,
  .table td {
    padding: 12px 16px;
  }
  
  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: 1.5rem; }
}
</style>