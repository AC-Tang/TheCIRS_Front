<template>
  <div class="search-bar">
    <input 
      :value="value" 
      @input="$emit('input', $event.target.value)"
      @keyup.enter="$emit('search', value)"
      type="text" 
      :placeholder="placeholder"
    />
    <button @click="$emit('search', value)">搜索</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索...'
    }
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
}

.search-bar input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.search-bar button {
  padding: 8px 15px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
</style>