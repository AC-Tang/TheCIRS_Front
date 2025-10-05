<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <!-- 返回首页按钮 -->
      <router-link to="/front" class="back-to-home">
        <span class="arrow-icon">←</span>
        <span>返回首页</span>
      </router-link>
      
      <div class="login-form">
        <div class="login-header">
          <div class="logo">
            <span class="logo-icon">📚</span>
            <h2>学院信息发布系统</h2>
          </div>
          <p>欢迎使用统一身份认证登录</p>
        </div>
        
        <!-- CAS/LDAP统一身份认证按钮 -->
        <div class="auth-methods">
          <!-- 本地账号登录表单 -->
          <form @submit.prevent="handleLogin" class="local-login-form">
            <div class="form-group">
              <label for="username">账号</label>
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="请输入账号"
                required
                autofocus
              />
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="请输入密码"
                required
              />
            </div>
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe">
                记住我
              </label>
              <router-link to="#" class="forgot-password">忘记密码？</router-link>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
                <span v-if="!isLoading">登录</span>
                <span v-else class="loading-spinner">⟳</span>
              </button>
            </div>
            <div v-if="errorMessage" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ errorMessage }}
            </div>
          </form>
        </div>
        
          <div v-if="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>
        
        <div class="register-link">
          还没有账号？<router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
// 处理登录
const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    // 模拟登录请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const { data } = await axios.get('http://localhost:8080/user/login', {
      params: {
        userName: username.value,
        password: password.value
      }
    })

    console.log(data);
    if (data.success) {
      alert('登录成功');
    console.log("ok"+data.roleName);
    // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userName', username.value)
      localStorage.setItem('userRole', data.roleName);
      localStorage.setItem('realName', data.realName);
      localStorage.setItem('department', data.department);
      console.log(localStorage.isLoggedIn);
      console.log(localStorage.userName);
      console.log(localStorage.userRole);
    // 根据角色跳转到相应页面
      const roleRoute = {
        'admin': { name: 'AdminDashboard' },
        'publisher': { name: 'PublisherDashboard' },
        'auditor': { name: 'AuditorDashboard' },
        'teacher': { name: 'PublisherDashboard' },
        'category-admin': { name: 'CategoryAdminDashboard' }
      }
      await router.push(roleRoute[localStorage.userRole] || { name: 'FrontPage' })
    }
    else {
      errorMessage.value = data.message || '用户名或密码错误';
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = err.response?.data?.message ||'登录失败，请检查账号和密码'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// 自动填充登录信息并设置角色
const fillLoginInfo = (user, pass, role) => {
  username.value = user
  password.value = pass
  // 自动设置角色并登录
  setTimeout(() => {
    document.querySelector('.btn-primary')?.click()
  }, 100)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.login-container::before,
.login-container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.2;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.login-container::before {
  top: -150px;
  right: -150px;
  animation: floatRight 8s ease-in-out infinite;
}

.login-container::after {
  bottom: -150px;
  left: -150px;
  animation: floatLeft 10s ease-in-out infinite reverse;
}

@keyframes floatRight {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-30px) translateX(-20px); }
}

@keyframes floatLeft {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(30px) translateX(20px); }
}

.login-form-wrapper {
  position: relative;
  width: 100%;
  max-width: 450px;
  z-index: 1;
}

/* 返回首页按钮 */
.back-to-home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-text-secondary);
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-to-home:hover {
  background-color: white;
  color: var(--color-primary);
  transform: translateX(-2px);
}

.arrow-icon {
  font-size: 16px;
  font-weight: bold;
}

.login-form {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.logo-icon {
  font-size: 32px;
}

.logo h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.login-header p {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0;
}

.auth-methods {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* CAS登录按钮 */
.btn-cas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  color: var(--color-primary);
}

.btn-cas:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
}

.btn-cas .icon {
  font-size: 20px;
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--color-text-light);
  font-size: 14px;
  margin: 10px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--color-border);
}

/* 本地登录表单 */
.local-login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: var(--color-text);
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: var(--color-background-mute);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  transform: translateY(-1px);
}

/* 添加表单选项样式 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
  background-color: var(--color-background-mute);
}

.forgot-password {
  font-size: 14px;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.form-actions {
  margin-top: 8px;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误消息 */
.error-message {
  background-color: #fef2f2;
  color: var(--color-danger);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 16px;
}

.error-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 测试账号信息 */
.login-info {
  margin-top: 32px;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
}

.login-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
}

.account-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.account-card {
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.account-header {
  margin-bottom: 8px;
}

.role-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.role-badge.admin {
  background-color: var(--color-info);
}

.role-badge.publisher {
  background-color: var(--color-primary);
}

.role-badge.student {
  background-color: var(--color-warning);
}

.role-badge.auditor {
  background-color: var(--color-secondary);
}

.role-badge.category {
  background-color: #8b5cf6;
}

.account-details p {
  margin: 4px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.account-details p strong {
  color: var(--color-text);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-form {
    padding: 28px 24px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  }
  
  .logo h2 {
    font-size: 20px;
  }
  
  .btn-cas,
  .btn-primary {
    padding: 12px;
    font-size: 15px;
  }
  
  .account-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>