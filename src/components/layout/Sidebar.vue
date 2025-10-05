<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <div class="user-info">
        <div class="avatar">{{ userInfo.name.charAt(0) }}</div>
        <div class="user-details">
          <div class="username">{{ userInfo.name }}</div>
          <div class="role">{{ getRoleDisplayName() }}</div>
          <div v-if="userInfo.department" class="department">{{ userInfo.department }}</div>
          <div v-if="userInfo.studentId" class="student-id">学号: {{ userInfo.studentId }}</div>
        </div>
      </div>

      <ul class="nav-menu">
        <!-- 管理员菜单 -->
        <template v-if="userInfo.role === 'admin'">
          <li class="nav-item" :class="{ active: route.path === '/dashboard' }">
            <router-link to="/dashboard" class="nav-link">
              <span class="icon">📊</span>
              <span>系统概览</span>
            </router-link>
          </li>
          <li class="nav-item" :class="{ active: route.path.includes('/content') }">
            <router-link to="/content" class="nav-link">
              <span class="icon">📄</span>
              <span>内容管理</span>
            </router-link>
          </li>
          <li class="nav-item" :class="{ active: route.path.includes('/category') }">
            <router-link to="/category" class="nav-link">
              <span class="icon">📁</span>
              <span>栏目管理</span>
            </router-link>
          </li>
          <li class="nav-item" :class="{ active: route.path.includes('/user') }">
            <router-link to="/user" class="nav-link">
              <span class="icon">👥</span>
              <span>用户管理</span>
            </router-link>
          </li>
          <li class="nav-item" :class="{ active: route.path.includes('/audit') }">
            <router-link to="/audit" class="nav-link">
              <span class="icon">✅</span>
              <span>内容审核</span>
            </router-link>
          </li>
          <li class="nav-item" :class="{ active: route.path.includes('/system') }">
            <router-link to="/system" class="nav-link">
              <span class="icon">⚙️</span>
              <span>系统设置</span>
            </router-link>
          </li>
        </template>

        <!-- 教师菜单 -->
        <template v-else-if="userInfo.role === 'teacher'">
          <li class="nav-item" :class="{ active: route.path === '/teacher-dashboard' }">
            <router-link to="/teacher-dashboard" class="nav-link">
              <span class="icon">📊</span>
              <span>工作台</span>
            </router-link>
          </li>
          <li class="nav-item" :class="{ active: route.path.includes('/teacher-content') }">
            <router-link to="/teacher-content" class="nav-link">
              <span class="icon">📄</span>
              <span>我的发布</span>
            </router-link>
          </li>
        </template>

        <!-- 学生菜单 -->
        <template v-else-if="userInfo.role === 'student'">
          <li class="nav-item" :class="{ active: route.path === '/student-dashboard' }">
            <router-link to="/student-dashboard" class="nav-link">
              <span class="icon">📚</span>
              <span>学生中心</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/front" class="nav-link">
              <span class="icon">🏠</span>
              <span>网站首页</span>
            </router-link>
          </li>
        </template>

        <!-- 公共菜单 -->
        <li class="nav-item" :class="{ active: route.path === '/personal-center' }">
          <router-link to="/personal-center" class="nav-link">
            <span class="icon">👤</span>
            <span>个人中心</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userInfo = ref({
  name: localStorage.getItem('userName') || '张三',
  role: localStorage.getItem('userRole') || 'user',
  department: localStorage.getItem('userDepartment') || '',
  studentId: localStorage.getItem('userStudentId') || ''
})

// 获取角色的显示名称
const getRoleDisplayName = () => {
  const roleMap = {
    'admin': '系统管理员',
    'teacher': '教师',
    'student': '学生'
  }
  return roleMap[userInfo.value.role] || userInfo.value.role
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--color-background);
  border-right: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.user-info {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(135deg, rgba(126, 34, 206, 0.05), rgba(236, 72, 153, 0.05));
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(126, 34, 206, 0.2);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.username {
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 500;
}

.department,
.student-id {
  font-size: 12px;
  color: var(--color-text);
  margin-top: 2px;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 15px;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(126, 34, 206, 0.05);
  color: var(--color-primary);
}

.nav-item.active .nav-link {
  background-color: rgba(126, 34, 206, 0.1);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 500;
}

.icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

/* 分割线 */
.nav-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 16px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }
  
  .user-info {
    padding: 20px;
  }
  
  .nav-link {
    padding: 14px 20px;
  }
}

/* 动画效果 */
.nav-item {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.nav-item:hover {
  transform: translateX(4px);
}
</style>