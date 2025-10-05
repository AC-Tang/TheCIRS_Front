<template>
  <div class="category-tree">
    <ul class="tree">
      <li v-for="category in rootCategories" :key="category.id" class="tree-node">
        <div class="tree-node-content">
          <span class="node-label">{{ category.name }}</span>
          <div class="node-actions">
            <button class="btn btn-sm" @click="$emit('edit', category)">编辑</button>
            <button class="btn btn-sm btn-danger" @click="$emit('delete', category)">删除</button>
          </div>
        </div>
        <ul v-if="hasChildren(category.id)" class="tree-children">
          <li v-for="child in getChildren(category.id)" :key="child.id" class="tree-node">
            <div class="tree-node-content">
              <span class="node-label">└─ {{ child.name }}</span>
              <div class="node-actions">
                <button class="btn btn-sm" @click="$emit('edit', child)">编辑</button>
                <button class="btn btn-sm btn-danger" @click="$emit('delete', child)">删除</button>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CategoryTree',
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  computed: {
    rootCategories() {
      return this.categories.filter(cat => !cat.parentId)
    }
  },
  methods: {
    hasChildren(categoryId) {
      return this.categories.some(cat => cat.parentId === categoryId)
    },
    getChildren(categoryId) {
      return this.categories.filter(cat => cat.parentId === categoryId)
    }
  }
}
</script>

<style scoped>
.tree {
  list-style: none;
  padding-left: 0;
}

.tree-node {
  margin-bottom: 8px;
}

.tree-node-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tree-node-content:hover {
  background: #f0f5ff;
  border-color: #1890ff;
}

.tree-children {
  padding-left: 25px;
  list-style: none;
}

.node-label {
  font-weight: 500;
  color: #333;
}

.node-actions {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 3px;
}
</style>