<template>
  <div class="personal-center-container">
    <div class="personal-header">
      <div class="user-avatar">
        <img :src="userAvatar" alt="用户头像" class="avatar-img">
      </div>
      <div class="user-info">
        <h2 class="user-name">{{ userInfo.name }}</h2>
        <p class="user-role">{{ getRoleDisplayName(userInfo.role)}}</p>
        <p class="user-department" v-if="userInfo.department">{{ userInfo.department }}</p>
      </div>
    </div>
    
    <div class="personal-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-button', { active: activeTab === tab.key }]"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="tab-content">
      <div v-if="activeTab === 'profile'" class="profile-content">
        <h3>个人资料</h3>
        <div class="form-group">
          <label>用户名：</label>
          <input v-model="profileForm.userName" type="text" placeholder="请输入用户名">
        </div>
        <div class="form-group">
          <label>姓名：</label>
          <input v-model="profileForm.realName" type="text" placeholder="请输入姓名">
        </div>
        <div class="form-group">
          <label>邮箱：</label>
          <input v-model="profileForm.email" type="email" placeholder="请输入邮箱">
        </div>
        <div class="form-group">
          <label>所属部门/院系：</label>
          <input v-model="profileForm.department" type="text" placeholder="请输入所属部门或院系">
        </div>
        <div class="form-group">
          <label>角色权限：</label>
          <span class="role-value">{{ getRoleDisplayName(userInfo.role) }}</span>
        </div>
        <button class="save-button" @click="saveProfile">保存修改</button>
      </div>
      
      <div v-else-if="activeTab === 'password'" class="password-content">
        <h3>修改密码</h3>
        <div class="form-group">
          <label>当前密码：</label>
          <input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码">
        </div>
        <div class="form-group">
          <label>新密码：</label>
          <input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码">
        </div>
        <div class="form-group">
          <label>确认新密码：</label>
          <input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码">
        </div>
        <button class="save-button" @click="changePassword">修改密码</button>
      </div>
      
      <div v-else-if="activeTab === 'settings'" class="settings-content">
        <h3>系统设置</h3>
        <div class="form-group">
          <label>界面语言：</label>
          <select v-model="settingsForm.language">
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
        <div class="form-group">
          <label>暗黑模式：</label>
          <label class="switch">
            <input v-model="settingsForm.darkMode" type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
        <div class="form-group">
          <label>通知设置：</label>
          <div class="checkbox-group">
            <label>
              <input v-model="settingsForm.notifications.email" type="checkbox">
              邮件通知
            </label>
            <label>
              <input v-model="settingsForm.notifications.system" type="checkbox">
              系统消息
            </label>
            <label>
              <input v-model="settingsForm.notifications.task" type="checkbox">
              任务提醒
            </label>
          </div>
        </div>
        <button class="save-button" @click="saveSettings">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 用户信息
const userInfo = ref({
  username: localStorage.getItem('userName') || '',
  name: localStorage.getItem('realName') || '未设置姓名',
  role: localStorage.getItem('roleName') || 'student', // 设置默认角色为student
  department: localStorage.getItem('department') || '',
})

// 头像
const userAvatar = ref('https://picsum.photos/seed/user/200/200')

// 标签页
const tabs = [
  { key: 'profile', label: '个人资料' },
  { key: 'password', label: '修改密码' },
  { key: 'settings', label: '系统设置' }
]

const activeTab = ref('profile')

// 表单数据
const profileForm = ref({
  oldUserName: '',
  userName: '',
  realName: '',
  email: '',
  department: '',
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const settingsForm = ref({
  language: 'zh-CN',
  darkMode: false,
  notifications: {
    email: true,
    system: true,
    task: true
  }
})

// 页面加载时初始化表单数据
onMounted(() => {
  // 将用户信息填充到表单中
  profileForm.value.oldUserName = userInfo.value.username
  profileForm.value.userName = userInfo.value.username || ''
  profileForm.value.realName = userInfo.value.name || ''
  profileForm.value.department = userInfo.value.department || ''
  // 尝试从本地存储获取更多用户信息
  const savedEmail = localStorage.getItem('userEmail')
  if (savedEmail) {
    profileForm.value.email = savedEmail
  }
})

// 获取角色显示名称
const getRoleDisplayName = (role) => {
  const roleMap = {
    'admin': '系统管理员',
    'teacher': '教师',
    'student': '学生',
    'publisher': '发布者',
    'category-admin': '栏目管理员'
  }
  return roleMap[role] || role
}

// 切换标签页
const switchTab = (tabKey) => {
  activeTab.value = tabKey
}

// 保存个人资料
const saveProfile = async () => {
  try {
    // 调用后端API更新用户信息
    const { data } = await axios.post('http://localhost:8080/user/update', {
      userName: profileForm.value.userName,
      realName: profileForm.value.realName,
      email: profileForm.value.email,
      department: profileForm.value.department
    }, {
      params: {
        oldUserName: profileForm.value.oldUserName,
      }
    });
    
    if (data.success) {
      // 更新用户信息
      userInfo.value.username = profileForm.value.userName
      userInfo.value.name = profileForm.value.realName
      userInfo.value.department = profileForm.value.department
      
      // 保存到本地存储
      localStorage.setItem('userName', profileForm.value.username)
      localStorage.setItem('realName', profileForm.value.name)
      localStorage.setItem('department', profileForm.value.department)
      localStorage.setItem('userEmail', profileForm.value.email)
      
      alert('个人资料保存成功！')
    } else {
      alert('保存失败：' + (data.message || '未知错误'))
    }
  } catch (error) {
    console.error('保存个人资料时发生错误：', error)
    alert('保存失败，请稍后重试')
  }
}

// 修改密码
const changePassword = () => {
  if (!passwordForm.value.oldPassword) {
    alert('请输入当前密码')
    return
  }
  
  if (!passwordForm.value.newPassword) {
    alert('请输入新密码')
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }
  
  // 模拟修改密码
  alert('密码修改成功！')
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 保存设置
const saveSettings = () => {
  // 保存设置到本地存储
  localStorage.setItem('userSettings', JSON.stringify(settingsForm.value))
  
  // 模拟应用暗黑模式
  if (settingsForm.value.darkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  alert('设置保存成功！')
}
</script>

<style scoped>
.personal-center-container {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.personal-header {
  display: flex;
  align-items: center;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  margin-right: 24px;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.user-info h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.user-role,
.user-department,
.user-studentId {
  margin: 4px 0;
  opacity: 0.9;
}

.personal-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #f0f0f0;
}

.tab-button.active {
  background-color: #667eea;
  color: white;
}

.tab-content {
  background: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-content h3 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: inline-block;
  width: 120px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.form-group .role-value {
  display: inline-block;
  vertical-align: middle;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: calc(100% - 130px);
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-group {
  display: flex;
  gap: 24px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input {
  width: auto;
  margin-right: 8px;
}

.save-button {
  padding: 12px 24px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #5a67d8;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:focus + .slider {
  box-shadow: 0 0 1px #667eea;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personal-header {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
  
  .user-avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .avatar-img {
    width: 80px;
    height: 80px;
  }
  
  .personal-tabs {
    flex-direction: column;
  }
  
  .checkbox-group {
    flex-direction: column;
    gap: 12px;
  }
}
</style>