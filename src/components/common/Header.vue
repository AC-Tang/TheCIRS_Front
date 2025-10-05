<template>
  <header class="header">
    <div class="header-left">
      <h1>学院网站信息发布系统</h1>
    </div>
    <div class="header-right">
      <div class="user-menu">
        <span class="username">欢迎，{{ userInfo.name }}</span>
        <div class="dropdown">
          <button class="dropdown-toggle">
            <span class="avatar">{{ userInfo.name.charAt(0) }}</span>
          </button>
          <div class="dropdown-menu">
            <a href="#" @click.prevent="handleProfile">个人资料</a>
            <a href="#" @click.prevent="handleLogout">退出登录</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInfo = ref({
  name: localStorage.getItem('userName') || '张三',
  role: localStorage.getItem('userRole') || '栏目管理员'
})

const handleProfile = () => {
  // 处理个人资料
  console.log('查看个人资料')
}

const handleLogout = () => {
  // 处理退出登录
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  router.push('/login')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background: var(--color-background);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid var(--color-border);
}

.header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: -0.5px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  color: var(--color-text);
  font-weight: 500;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.dropdown-toggle:hover {
  background-color: var(--color-background-mute);
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(126, 34, 206, 0.3);
  transition: transform 0.3s ease;
}

.dropdown-toggle:hover .avatar {
  transform: scale(1.05);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--color-border);
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu a {
  display: block;
  padding: 12px 20px;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.dropdown-menu a:hover {
  background-color: rgba(126, 34, 206, 0.05);
  color: var(--color-primary);
}

.dropdown-menu a:last-child {
  color: #ef4444;
}

.dropdown-menu a:last-child:hover {
  background-color: rgba(239, 68, 68, 0.05);
  color: #dc2626;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }
  
  .header h1 {
    font-size: 18px;
  }
  
  .username {
    display: none;
  }
}
</style>