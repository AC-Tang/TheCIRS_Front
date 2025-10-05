<template>
  <div class="register-container">
    <div class="register-form-wrapper">
      <!-- 返回首页按钮 -->
      <router-link to="/front" class="back-to-home">
        <span class="arrow-icon">←</span>
        <span>返回首页</span>
      </router-link>

      <div class="register-form">
        <div class="register-header">
          <div class="logo">
            <span class="logo-icon">📚</span>
            <h2>学院信息发布系统</h2>
          </div>
          <p>创建新账号</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-content">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              type="text"
              id="username"
              v-model="form.username"
              placeholder="请设置登录账号（5-20个字符）"
              required
              pattern="^[a-zA-Z0-9]{5,20}$"
              title="账号只能包含字母和数字，长度5-20个字符"
            />
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              placeholder="请设置密码（至少8个字符，包含字母和数字）"
              required
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
              title="密码至少8个字符，必须包含字母和数字"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              placeholder="请再次输入密码"
              required
            />
          </div>

          <div class="form-group">
            <label for="realName">姓名</label>
            <input
              type="text"
              id="realName"
              v-model="form.realName"
              placeholder="请输入您的真实姓名"
              required
            />
          </div>

          <div class="form-group">
            <label for="userType">用户类型</label>
            <select id="userType" v-model="form.userType" required>
              <option value="">请选择用户类型</option>
              <option value="student">学生</option>
              <option value="publisher">发布者</option>
              <option value="auditor">审核员</option>
              <option value="category-admin">栏目管理员</option>
            </select>
          </div>

          <div class="form-group">
            <label for="department">所属部门</label>
            <input
              type="text"
              id="department"
              v-model="form.department"
              placeholder="请输入所属部门或学院"
              required
            />
          </div>

          <div class="form-group">
            <label for="securityQuestion">密保问题</label>
            <select id="securityQuestion" v-model="form.securityQuestion" required>
              <option value="">请选择密保问题</option>
              <option value="1">您的出生城市是？</option>
              <option value="2">您的小学名称是？</option>
              <option value="3">您的父亲姓名是？</option>
              <option value="4">您的母亲姓名是？</option>
              <option value="5">您的第一只宠物名称是？</option>
              <option value="6">自定义问题</option>
            </select>
          </div>

          <div class="form-group" v-if="form.securityQuestion === '6'">
            <label for="customQuestion">自定义问题</label>
            <input
              type="text"
              id="customQuestion"
              v-model="form.customQuestion"
              placeholder="请输入您的自定义问题"
              required
            />
          </div>

          <div class="form-group">
            <label for="securityAnswer">密保答案</label>
            <input
              type="text"
              id="securityAnswer"
              v-model="form.securityAnswer"
              placeholder="请输入密保答案"
              required
            />
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeTerms" required />
              我已阅读并同意<a href="#" class="terms-link">服务条款</a>和<a
                href="#"
                class="privacy-link"
                >隐私政策</a
              >
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
              <span v-if="!isLoading">注册账号</span>
              <span v-else class="loading-spinner">⟳</span>
            </button>
          </div>

          <div v-if="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="success-message">
            <span class="success-icon">✅</span>
            {{ successMessage }}
          </div>
        </form>

        <div class="login-link">已有账号？<router-link to="/login">立即登录</router-link></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const agreeTerms = ref(false)

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  realName: '',
  userType: '',
  department: '',
  securityQuestion: '',
  customQuestion: '',
  securityAnswer: ''
})

const handleRegister = async () => {
  try {
    // 重置消息
    errorMessage.value = ''
    successMessage.value = ''

    // 表单验证
    if (form.value.password !== form.value.confirmPassword) {
      errorMessage.value = '两次输入的密码不一致'
      setTimeout(() => {
        errorMessage.value = ''
      }, 3000)
      return
    }

    if (!agreeTerms.value) {
      errorMessage.value = '请阅读并同意服务条款和隐私政策'
      setTimeout(() => {
        errorMessage.value = ''
      }, 3000)
      return
    }

    // 验证密保问题
    if (form.value.securityQuestion === '6' && !form.value.customQuestion) {
      errorMessage.value = '请输入自定义密保问题'
      setTimeout(() => {
        errorMessage.value = ''
      }, 3000)
      return
    }

    isLoading.value = true

    // 准备注册数据
    const registerData = {
      userName: form.value.username,
      password: form.value.password,
      realName: form.value.realName,
      roleName: form.value.userType,
      department: form.value.department,
      securityQuestion: form.value.securityQuestion === '6' ? form.value.customQuestion : form.value.securityQuestion,
      securityAnswer: form.value.securityAnswer
    }

    console.log('注册数据:', registerData)
    // 发送注册请求到后端API
    const { data } = await axios.post('http://localhost:8080/user/register', registerData)

    console.log('注册成功:', data)
    if (data.success) {
      successMessage.value = '注册成功！正在跳转到登录页面...'
      
      // 3秒后跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      alert(data.message || '注册失败，请稍后重试') 
    }
  } catch (error) {
    console.error('注册失败:', error)
    errorMessage.value = error.response?.data?.message || '注册失败，请稍后重试'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
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
.register-container::before,
.register-container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.2;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.register-container::before {
  top: -150px;
  right: -150px;
  animation: floatRight 8s ease-in-out infinite;
}

.register-container::after {
  bottom: -150px;
  left: -150px;
  animation: floatLeft 10s ease-in-out infinite reverse;
}

@keyframes floatRight {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-30px) translateX(-20px);
  }
}

@keyframes floatLeft {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(30px) translateX(20px);
  }
}

.register-form-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
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

.register-form {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.register-header {
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

.register-header p {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0;
}

/* 注册表单 */
.register-content {
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: var(--color-background-mute);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  transform: translateY(-1px);
}

.form-group select {
  cursor: pointer;
}

/* 表单选项 */
.form-options {
  margin: 12px 0 16px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: var(--color-primary);
  background-color: var(--color-background-mute);
}

.checkbox-label a {
  color: var(--color-primary);
  text-decoration: none;
}

.checkbox-label a:hover {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 消息提示 */
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

.success-message {
  background-color: #f0fdf4;
  color: var(--color-primary);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon,
.success-icon {
  font-size: 16px;
}

/* 登录链接 */
.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-link a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-form {
    padding: 28px 24px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  }

  .logo h2 {
    font-size: 20px;
  }

  .btn-primary {
    padding: 12px;
    font-size: 15px;
  }
}
</style>
