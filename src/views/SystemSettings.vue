<template>
  <div class="system-settings">
    <h1>系统设置</h1>

    <div class="settings-tabs card">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <div class="settings-content">
      <!-- 基础设置 -->
      <div v-if="activeTab === 'basic'" class="settings-section card">
        <h3>基础设置</h3>
        <form @submit.prevent="saveBasicSettings">
          <div class="form-group">
            <label>网站名称</label>
            <input v-model="basicSettings.siteName" type="text">
          </div>
          <div class="form-group">
            <label>网站描述</label>
            <textarea v-model="basicSettings.siteDescription" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>关键词</label>
            <input v-model="basicSettings.keywords" type="text" placeholder="多个关键词用逗号分隔">
          </div>
          <div class="form-group">
            <label>版权信息</label>
            <input v-model="basicSettings.copyright" type="text">
          </div>
          <button type="submit" class="btn btn-primary">保存</button>
        </form>
      </div>

      <!-- 审核流程设置 -->
      <div v-if="activeTab === 'audit'" class="settings-section card">
        <h3>审核流程设置</h3>
        <form @submit.prevent="saveAuditSettings">
          <div class="form-group">
            <label>审核级别</label>
            <select v-model="auditSettings.levels">
              <option value="1">一级审核</option>
              <option value="2">二级审核</option>
              <option value="3">三级审核</option>
            </select>
          </div>
          <div class="form-group">
            <label>紧急内容绿色通道</label>
            <label>
              <input type="checkbox" v-model="auditSettings.emergencyChannel"> 开启
            </label>
          </div>
          <div class="form-group">
            <label>审核超时时间</label>
            <input v-model="auditSettings.timeout" type="number" min="1"> 小时
          </div>
          <button type="submit" class="btn btn-primary">保存</button>
        </form>
      </div>

      <!-- 安全设置 -->
      <div v-if="activeTab === 'security'" class="settings-section card">
        <h3>安全设置</h3>
        <form @submit.prevent="saveSecuritySettings">
          <div class="form-group">
            <label>密码策略</label>
            <div>
              <label>
                <input type="checkbox" v-model="securitySettings.passwordMinLength"> 最小长度8位
              </label>
              <label>
                <input type="checkbox" v-model="securitySettings.passwordComplexity"> 包含字母、数字和特殊字符
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>登录失败锁定</label>
            <div>
              <label>失败 <input type="number" v-model="securitySettings.maxLoginAttempts" min="1" style="width: 60px;"> 次后锁定</label>
              <label>锁定 <input type="number" v-model="securitySettings.lockoutDuration" min="1" style="width: 60px;"> 分钟</label>
            </div>
          </div>
          <div class="form-group">
            <label>会话超时</label>
            <input type="number" v-model="securitySettings.sessionTimeout" min="1"> 分钟
          </div>
          <button type="submit" class="btn btn-primary">保存</button>
        </form>
      </div>

      <!-- 数据备份 -->
      <div v-if="activeTab === 'backup'" class="settings-section card">
        <h3>数据备份与恢复</h3>
        <div class="backup-actions">
          <button class="btn btn-primary" @click="handleBackup">立即备份</button>
          <button class="btn" @click="handleRestore">恢复数据</button>
        </div>
        <div class="backup-list">
          <h4>备份记录</h4>
          <table class="table">
            <thead>
              <tr>
                <th>备份时间</th>
                <th>文件大小</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="backup in backups" :key="backup.id">
                <td>{{ backup.time }}</td>
                <td>{{ backup.size }}</td>
                <td>
                  <button class="btn btn-sm">下载</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemSettings',
  data() {
    return {
      activeTab: 'basic',
      tabs: [
        { key: 'basic', name: '基础设置' },
        { key: 'audit', name: '审核流程' },
        { key: 'security', name: '安全设置' },
        { key: 'backup', name: '数据备份' }
      ],
      basicSettings: {
        siteName: '学院网站信息发布系统',
        siteDescription: '',
        keywords: '',
        copyright: ''
      },
      auditSettings: {
        levels: '2',
        emergencyChannel: true,
        timeout: 24
      },
      securitySettings: {
        passwordMinLength: true,
        passwordComplexity: true,
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        sessionTimeout: 30
      },
      backups: [
        { id: 1, time: '2024-01-20 02:00', size: '15.2MB' },
        { id: 2, time: '2024-01-19 02:00', size: '14.8MB' }
      ]
    }
  },
  methods: {
    saveBasicSettings() {
      // 保存基础设置
    },
    saveAuditSettings() {
      // 保存审核设置
    },
    saveSecuritySettings() {
      // 保存安全设置
    },
    handleBackup() {
      // 处理备份
    },
    handleRestore() {
      // 处理恢复
    }
  }
}
</script>

<style scoped>
.settings-tabs {
  margin-bottom: 20px;
}

.tabs {
  display: flex;
}

.tab {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.tab.active {
  border-bottom-color: #1890ff;
  color: #1890ff;
}

.settings-section {
  margin-bottom: 20px;
}

.settings-section h3 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group label input[type="checkbox"] {
  margin-right: 5px;
}

.backup-actions {
  margin-bottom: 20px;
}

.backup-list h4 {
  margin-bottom: 15px;
}
</style>