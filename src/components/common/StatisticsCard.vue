<template>
  <div class="statistics-card" :style="{ borderLeftColor: color }">
    <div class="card-icon">
      {{ icon }}
    </div>
    <div class="card-content">
      <div class="card-title">{{ title }}</div>
      <div class="card-value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: {
    type: String,
    default: '#1890ff'
  }
})
</script>

<style scoped>
.statistics-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  display: flex;
  align-items: center;
}

.card-icon {
  font-size: 40px;
  margin-right: 15px;
}

.card-content {
  flex: 1;
}

.card-title {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>