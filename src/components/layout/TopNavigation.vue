<template>
  <header class="top-navigation">
    <div class="nav-container">
      <!-- 左侧logo和网站名称 -->
      <div class="nav-left">
        <router-link to="/front" class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">学院信息发布系统</span>
        </router-link>
      </div>

      <!-- 中间导航菜单 -->
      <nav class="nav-center">
        <div class="nav-menu">
          <!-- 访客可见导航 -->
          <router-link to="/front" class="nav-item">首页</router-link>
          <router-link to="/front/search" class="nav-item">搜索</router-link>

          <!-- 教师/发布者可见导航 -->
          <template
            v-if="
              currentUser && (currentUser.role === 'teacher' || currentUser.role === 'publisher')
            "
          >
            <router-link to="/publisher/dashboard" class="nav-item">工作台</router-link>
            <router-link to="/publisher/article/create" class="nav-item">创建文章</router-link>
            <router-link to="/publisher/drafts" class="nav-item">草稿箱</router-link>
          </template>

          <!-- 审核员可见导航 -->
          <template v-if="currentUser && currentUser.role === 'auditor'">
            <router-link to="/auditor/dashboard" class="nav-item">审核工作台</router-link>
            <router-link to="/auditor/pending" class="nav-item">待审核</router-link>
            <router-link to="/auditor/records" class="nav-item">审核记录</router-link>
          </template>

          <!-- 栏目管理员可见导航 -->
          <template v-if="currentUser && currentUser.role === 'category-admin'">
            <router-link to="/category-admin/dashboard" class="nav-item">栏目工作台</router-link>
            <router-link to="/category-admin/pending" class="nav-item">待发布</router-link>
            <router-link to="/category-admin/articles" class="nav-item">文章管理</router-link>
          </template>

          <!-- 管理员可见导航 -->
          <template v-if="currentUser && currentUser.role === 'admin'">
            <router-link to="/dashboard" class="nav-item">管理控制台</router-link>
            <router-link to="/admin/users" class="nav-item">用户管理</router-link>
            <router-link to="/admin/categories" class="nav-item">栏目管理</router-link>
            <router-link to="/admin/roles" class="nav-item">权限设置</router-link>
          </template>
        </div>
      </nav>

      <!-- 右侧用户信息和操作 -->
      <div class="nav-right">
        <template v-if="currentUser">
          <div class="user-menu" :class="{ open: showUserDropdown }">
            <button class="user-menu-trigger" @click="toggleUserDropdown">
              <span class="avatar">{{ currentUser.name?.charAt(0) || '用' }}</span>
              <span class="user-name">{{ currentUser.name || '用户' }}</span>
              <span class="user-role">{{ getUserRoleText() }}</span>
              <span class="arrow-icon">▼</span>
            </button>
            <div class="user-dropdown" v-show="showUserDropdown">
              <router-link to="/personal-center" class="dropdown-item">个人中心</router-link>
              <button @click="handleLogout" class="dropdown-item logout-item">退出登录</button>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
          <router-link to="/register" class="register-btn">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUserDropdown = ref(false)

// 获取当前用户信息
const currentUser = computed(() => {
  return {
    name: localStorage.getItem('userName') || null,
    role: localStorage.getItem('userRole') || null,
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  }
})

// 根据用户角色获取显示文本
const getUserRoleText = () => {
  const roleMap = {
    admin: '管理员',
    teacher: '教师',
    student: '学生',
    auditor: '审核员',
  }
  return roleMap[currentUser.value.role] || '用户'
}

// 处理退出登录
const handleLogout = () => {
  // 清除所有登录相关信息
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  // 关闭下拉菜单
  showUserDropdown.value = false
  // 强制刷新页面并跳转到登录页
  window.location.href = '/login'
}

// 切换用户下拉菜单
const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu')
  if (userMenu && !userMenu.contains(event.target)) {
    showUserDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.top-navigation {
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
}

/* 左侧Logo样式 */
.nav-left .logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 20px;
  transition: opacity 0.3s ease;
}

.nav-left .logo:hover {
  opacity: 0.9;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  white-space: nowrap;
}

/* 中间导航菜单 */
.nav-center {
  flex: 1;
  margin: 0 40px;
}

.nav-menu {
  display: flex;
  gap: 8px;
  list-style: none;
  justify-content: center;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  color: var(--color-text);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* 右侧用户区域 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn,
.register-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-btn {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.login-btn:hover {
  background-color: var(--color-primary);
  color: white;
}

.register-btn {
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}

.register-btn:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

/* 用户菜单 */
.user-menu {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.user-menu-trigger:hover {
  background-color: var(--color-background-mute);
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-weight: 500;
  color: var(--color-text);
}

.user-role {
  font-size: 12px;
  color: var(--color-text-secondary);
  padding: 2px 6px;
  background-color: var(--color-background-mute);
  border-radius: 4px;
}

.arrow-icon {
  font-size: 10px;
  color: var(--color-text-secondary);
  transition: transform 0.3s ease;
}

.user-menu.open .arrow-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.3s ease;
}

.user-menu.open .user-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: var(--color-background-mute);
}

.dropdown-item.logout-item {
  color: var(--color-danger);
}

.dropdown-item.logout-item:hover {
  background-color: rgba(239, 68, 68, 0.05);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .nav-menu {
    gap: 4px;
  }

  .nav-item {
    padding: 0 12px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }

  .nav-center {
    display: none; /* 在移动端隐藏中间导航，后续可添加汉堡菜单 */
  }

  .logo-text {
    display: none;
  }

  .user-name {
    display: none;
  }

  .user-role {
    display: none;
  }
}
</style>
