<template>
  <div class="content-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-section">
        <h3>基本信息</h3>
        <div class="form-row">
          <div class="form-group">
            <label>标题 <span class="required">*</span></label>
            <input v-model="form.title" type="text" required>
          </div>
          <div class="form-group">
            <label>栏目 <span class="required">*</span></label>
            <select v-model="form.categoryId" required>
              <option value="">请选择栏目</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>关键词</label>
            <input v-model="form.keywords" type="text" placeholder="多个关键词用逗号分隔">
          </div>
          <div class="form-group">
            <label>来源</label>
            <input v-model="form.source" type="text">
          </div>
        </div>
        <div class="form-group">
          <label>摘要</label>
          <textarea v-model="form.summary" rows="3" placeholder="请输入文章摘要"></textarea>
        </div>
      </div>

      <div class="form-section">
        <h3>内容编辑</h3>
        <div class="form-group">
          <label>内容 <span class="required">*</span></label>
          <RichTextEditor v-model="form.content" />
        </div>
      </div>

      <div class="form-section">
        <h3>发布设置</h3>
        <div class="form-row">
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="form.isTop"> 置顶显示
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="form.allowComment"> 允许评论
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>发布时间</label>
          <input v-model="form.publishTime" type="datetime-local">
          <small>留空则立即发布</small>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">保存</button>
        <button type="button" class="btn" @click="$emit('cancel')">取消</button>
        <button type="button" class="btn" @click="saveDraft">保存草稿</button>
        <button type="button" class="btn btn-primary" @click="submitAudit">提交审核</button>
      </div>
    </form>
  </div>
</template>

<script>
import RichTextEditor from './RichTextEditor.vue'

export default {
  name: 'ContentForm',
  components: {
    RichTextEditor
  },
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        title: '',
        categoryId: '',
        keywords: '',
        source: '',
        summary: '',
        content: '',
        isTop: false,
        allowComment: true,
        publishTime: ''
      },
      categories: [
        { id: 1, name: '学院通知' },
        { id: 2, name: '教务信息' },
        { id: 3, name: '学术讲座' }
      ]
    }
  },
  watch: {
    article: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal }
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('save', this.form)
    },
    saveDraft() {
      // 保存草稿逻辑
    },
    submitAudit() {
      // 提交审核逻辑
      this.$emit('save', { ...this.form, status: 'auditing' })
    }
  }
}
</script>

<style scoped>
.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.form-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.required {
  color: #ff4d4f;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

small {
  color: #666;
  margin-left: 10px;
}
</style>