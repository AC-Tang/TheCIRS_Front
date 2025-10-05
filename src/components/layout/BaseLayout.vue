<template>
  <div class="base-layout">
    <!-- 页面标题栏 -->
    <div class="page-header" v-if="showHeader">
      <h1 class="page-title">{{ title || '页面标题' }}</h1>
      <p class="page-subtitle" v-if="subtitle">{{ subtitle }}</p>
      <div class="page-actions" v-if="showActions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="page-content">
      <slot></slot>
    </div>

    <!-- 页脚区域 -->
    <div class="page-footer" v-if="showFooter">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 页面标题
  title: {
    type: String,
    default: '',
  },
  // 页面副标题
  subtitle: {
    type: String,
    default: '',
  },
  // 是否显示头部
  showHeader: {
    type: Boolean,
    default: true,
  },
  // 是否显示操作区域
  showActions: {
    type: Boolean,
    default: false,
  },
  // 是否显示页脚
  showFooter: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.base-layout {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 0;
}

.page-actions {
  margin-top: 16px;
}

.page-content {
  background-color: var(--color-background);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.page-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;
}
</style>
