<template>
  <div class="rich-text-editor">
    <div class="toolbar">
      <button type="button" @click="execCommand('bold')" title="粗体">B</button>
      <button type="button" @click="execCommand('italic')" title="斜体">I</button>
      <button type="button" @click="execCommand('underline')" title="下划线">U</button>
      <button type="button" @click="execCommand('insertUnorderedList')" title="无序列表">•</button>
      <button type="button" @click="execCommand('insertOrderedList')" title="有序列表">1.</button>
      <button type="button" @click="insertImage" title="插入图片">📷</button>
      <button type="button" @click="insertTable" title="插入表格">⧉</button>
    </div>
    <div
      ref="editor"
      contenteditable="true"
      class="editor-content"
      @input="handleInput"
      @paste="handlePaste"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'RichTextEditor',
  props: {
    value: String
  },
  mounted() {
    if (this.value) {
      this.$refs.editor.innerHTML = this.value
    }
  },
  methods: {
    execCommand(command, value = null) {
      document.execCommand(command, false, value)
      this.$refs.editor.focus()
    },
    handleInput() {
      this.$emit('input', this.$refs.editor.innerHTML)
    },
    insertImage() {
      const url = prompt('请输入图片URL:')
      if (url) {
        this.execCommand('insertImage', url)
      }
    },
    insertTable() {
      const html = '<table border="1"><tr><td>内容</td></tr></table>'
      this.execCommand('insertHTML', html)
    },
    handlePaste(e) {
      // 处理粘贴内容，防止XSS
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
    }
  }
}
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.toolbar {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background: #f5f5f5;
}

.toolbar button {
  margin-right: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 3px;
}

.editor-content {
  min-height: 300px;
  padding: 15px;
  outline: none;
}
</style>