<template>
  <div class="admin-config">
    <div class="page-header">
      <h1>系统配置</h1>
      <div class="header-actions">
        <button class="btn btn-danger" @click="backupSystem">
          <span class="icon">💾</span>
          备份系统
        </button>
        <button class="btn btn-warning" @click="clearCache">
          <span class="icon">🧹</span>
          清除缓存
        </button>
      </div>
    </div>

    <!-- 配置选项卡 -->
    <div class="config-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="switchTab(tab.id)"
      >
        <span :class="['tab-icon', tab.icon]"></span>
        {{ tab.name }}
      </button>
    </div>

    <!-- 配置内容区域 -->
    <div class="config-content card">
      <!-- 系统设置 -->
      <div v-if="activeTab === 'system'" class="tab-content">
        <h2>基本设置</h2>
        <form @submit.prevent="saveSystemSettings">
          <div class="form-row">
            <div class="form-group">
              <label>系统名称 <span class="required">*</span></label>
              <input type="text" v-model="systemSettings.name" required>
            </div>
            <div class="form-group">
              <label>系统版本</label>
              <input type="text" v-model="systemSettings.version" disabled>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>系统Logo</label>
              <div class="upload-area">
                <input type="file" accept="image/*" @change="handleLogoUpload">
                <div class="upload-placeholder">
                  <span class="upload-icon">🖼️</span>
                  <span>上传系统Logo</span>
                </div>
                <img v-if="systemSettings.logo" :src="systemSettings.logo" class="preview-image">
              </div>
            </div>
            <div class="form-group">
              <label>网站备案号</label>
              <input type="text" v-model="systemSettings.licenseNumber">
            </div>
          </div>
          <div class="form-group">
            <label>系统公告</label>
            <textarea v-model="systemSettings.announcement" rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>功能开关</label>
            <div class="feature-switches">
              <label class="switch-item">
                <input type="checkbox" v-model="systemSettings.features.comments">
                <span>启用评论功能</span>
              </label>
              <label class="switch-item">
                <input type="checkbox" v-model="systemSettings.features.fileUpload">
                <span>启用文件上传</span>
              </label>
              <label class="switch-item">
                <input type="checkbox" v-model="systemSettings.features.userRegistration">
                <span>启用用户注册</span>
              </label>
              <label class="switch-item">
                <input type="checkbox" v-model="systemSettings.features.learningProgress">
                <span>启用学习进度跟踪</span>
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">保存设置</button>
            <button type="button" class="btn" @click="resetSystemSettings">重置</button>
          </div>
        </form>
      </div>

      <!-- 用户管理 -->
      <div v-else-if="activeTab === 'users'" class="tab-content">
        <div class="users-header">
          <h2>用户管理</h2>
          <button class="btn btn-primary" @click="showAddUserForm">
            <span class="icon">➕</span>
            添加用户
          </button>
        </div>
        <div class="user-filters">
          <input 
            type="text" 
            placeholder="搜索用户名或邮箱"
            v-model="userSearchKeyword"
            class="search-input"
          >
          <select v-model="userFilterRole" class="filter-select">
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="teacher">教师</option>
            <option value="student">学生</option>
          </select>
          <select v-model="userFilterStatus" class="filter-select">
            <option value="">全部状态</option>
            <option value="active">启用</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
        <div class="users-table">
          <div class="table-header">
            <div class="table-cell id">ID</div>
            <div class="table-cell username">用户名</div>
            <div class="table-cell email">邮箱</div>
            <div class="table-cell role">角色</div>
            <div class="table-cell department">部门/班级</div>
            <div class="table-cell status">状态</div>
            <div class="table-cell register-time">注册时间</div>
            <div class="table-cell actions">操作</div>
          </div>
          <div class="table-body">
            <div v-for="user in filteredUsers" :key="user.id" class="table-row">
              <div class="table-cell id">{{ user.id }}</div>
              <div class="table-cell username">
                <div class="user-info">
                  <img :src="user.avatar" class="user-avatar">
                  <span>{{ user.username }}</span>
                </div>
              </div>
              <div class="table-cell email">{{ user.email }}</div>
              <div class="table-cell role">{{ getRoleDisplayName(user.role) }}</div>
              <div class="table-cell department">{{ user.department || '-' }}</div>
              <div class="table-cell status">
                <span :class="['status-badge', user.status]">{{ user.status === 'active' ? '启用' : '禁用' }}</span>
              </div>
              <div class="table-cell register-time">{{ user.registerTime }}</div>
              <div class="table-cell actions">
                <button class="action-btn" @click="editUser(user)">编辑</button>
                <button class="action-btn delete-btn" @click="deleteUser(user.id)">
                  {{ user.status === 'active' ? '禁用' : '启用' }}
                </button>
                <button class="action-btn reset-btn" @click="resetPassword(user.id)">重置密码</button>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <div class="page-info">共 {{ filteredUsers.length }} 个用户</div>
          <div class="page-controls">
            <button class="page-btn" :disabled="userCurrentPage === 1" @click="changeUserPage(userCurrentPage - 1)">上一页</button>
            <span class="current-page">{{ userCurrentPage }} / {{ userTotalPages }}</span>
            <button class="page-btn" :disabled="userCurrentPage === userTotalPages" @click="changeUserPage(userCurrentPage + 1)">下一页</button>
          </div>
        </div>
      </div>

      <!-- 角色管理 -->
      <div v-else-if="activeTab === 'roles'" class="tab-content">
        <div class="roles-header">
          <h2>角色管理</h2>
          <button class="btn btn-primary" @click="showAddRoleForm">
            <span class="icon">➕</span>
            添加角色
          </button>
        </div>
        <div class="roles-list">
          <div v-for="role in roles" :key="role.id" class="role-card">
            <div class="role-header">
              <h3>{{ role.name }}</h3>
              <div class="role-actions">
                <button class="btn" @click="editRole(role)">编辑</button>
                <button v-if="role.id !== 1" class="btn delete-btn" @click="deleteRole(role.id)">删除</button>
              </div>
            </div>
            <div class="role-permissions">
              <h4>权限列表：</h4>
              <div class="permissions-grid">
                <div v-for="permission in role.permissions" :key="permission.id" class="permission-item">
                  {{ permission.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统日志 -->
      <div v-else-if="activeTab === 'logs'" class="tab-content">
        <div class="logs-header">
          <h2>系统日志</h2>
          <div class="log-filters">
            <select v-model="logFilterType" class="filter-select">
              <option value="">全部类型</option>
              <option value="login">登录</option>
              <option value="operation">操作</option>
              <option value="error">错误</option>
              <option value="system">系统</option>
            </select>
            <input type="date" v-model="logFilterDate" class="date-input">
            <button class="btn" @click="exportLogs">导出日志</button>
          </div>
        </div>
        <div class="logs-table">
          <div class="table-header">
            <div class="table-cell time">时间</div>
            <div class="table-cell user">操作用户</div>
            <div class="table-cell type">类型</div>
            <div class="table-cell content">内容</div>
            <div class="table-cell ip">IP地址</div>
          </div>
          <div class="table-body">
            <div v-for="log in filteredLogs" :key="log.id" class="table-row" :class="['log-type-' + log.type]">
              <div class="table-cell time">{{ log.time }}</div>
              <div class="table-cell user">{{ log.user }}</div>
              <div class="table-cell type">{{ getLogTypeDisplayName(log.type) }}</div>
              <div class="table-cell content">{{ log.content }}</div>
              <div class="table-cell ip">{{ log.ip }}</div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <div class="page-info">共 {{ filteredLogs.length }} 条日志</div>
          <div class="page-controls">
            <button class="page-btn" :disabled="logCurrentPage === 1" @click="changeLogPage(logCurrentPage - 1)">上一页</button>
            <span class="current-page">{{ logCurrentPage }} / {{ logTotalPages }}</span>
            <button class="page-btn" :disabled="logCurrentPage === logTotalPages" @click="changeLogPage(logCurrentPage + 1)">下一页</button>
          </div>
        </div>
      </div>

      <!-- 数据统计 -->
      <div v-else-if="activeTab === 'stats'" class="tab-content">
        <h2>数据统计</h2>
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalUsersCount }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👨‍🏫</div>
            <div class="stat-content">
              <div class="stat-value">{{ teacherCount }}</div>
              <div class="stat-label">教师数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👨‍🎓</div>
            <div class="stat-content">
              <div class="stat-value">{{ studentCount }}</div>
              <div class="stat-label">学生数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-value">{{ courseCount }}</div>
              <div class="stat-label">课程数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <div class="stat-value">{{ articleCount }}</div>
              <div class="stat-label">文章数</div>
            </div>
          </div>
        </div>
        <div class="stats-charts">
          <div class="chart-container">
            <h3>用户增长趋势</h3>
            <div class="chart-placeholder">
              <!-- 这里可以放置图表 -->
              <div class="chart-bar"></div>
              <div class="chart-bar" style="width: 65%"></div>
              <div class="chart-bar" style="width: 80%"></div>
              <div class="chart-bar" style="width: 75%"></div>
              <div class="chart-bar" style="width: 90%"></div>
              <div class="chart-bar" style="width: 100%"></div>
            </div>
          </div>
          <div class="chart-container">
            <h3>访问统计</h3>
            <div class="chart-placeholder">
              <!-- 这里可以放置图表 -->
              <div class="chart-bar" style="width: 70%"></div>
              <div class="chart-bar" style="width: 85%"></div>
              <div class="chart-bar" style="width: 60%"></div>
              <div class="chart-bar" style="width: 95%"></div>
              <div class="chart-bar" style="width: 80%"></div>
              <div class="chart-bar" style="width: 65%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑用户弹窗 -->
    <div v-if="showUserForm" class="modal-overlay" @click.self="hideUserForm">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingUser ? '编辑用户' : '添加用户' }}</h2>
          <button class="close-btn" @click="hideUserForm">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveUser">
            <div class="form-row">
              <div class="form-group">
                <label>用户名 <span class="required">*</span></label>
                <input type="text" v-model="userForm.username" required :disabled="!!editingUser">
              </div>
              <div class="form-group">
                <label>邮箱 <span class="required">*</span></label>
                <input type="email" v-model="userForm.email" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>角色 <span class="required">*</span></label>
                <select v-model="userForm.role" required>
                  <option value="admin">管理员</option>
                  <option value="teacher">教师</option>
                  <option value="student">学生</option>
                </select>
              </div>
              <div class="form-group">
                <label>部门/班级</label>
                <input type="text" v-model="userForm.department">
              </div>
            </div>
            <div v-if="!editingUser" class="form-group">
              <label>密码 <span class="required">*</span></label>
              <input type="password" v-model="userForm.password" required>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="userForm.status">
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">保存</button>
              <button type="button" class="btn" @click="hideUserForm">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 添加/编辑角色弹窗 -->
    <div v-if="showRoleForm" class="modal-overlay" @click.self="hideRoleForm">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingRole ? '编辑角色' : '添加角色' }}</h2>
          <button class="close-btn" @click="hideRoleForm">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveRole">
            <div class="form-group">
              <label>角色名称 <span class="required">*</span></label>
              <input type="text" v-model="roleForm.name" required>
            </div>
            <div class="form-group">
              <label>角色描述</label>
              <textarea v-model="roleForm.description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>权限设置</label>
              <div class="permissions-checklist">
                <label v-for="permission in allPermissions" :key="permission.id" class="permission-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="roleForm.permissions" 
                    :value="permission"
                  >
                  <span>{{ permission.name }} - {{ permission.description }}</span>
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">保存</button>
              <button type="button" class="btn" @click="hideRoleForm">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 配置选项卡
const tabs = ref([
  { id: 'system', name: '系统设置', icon: '⚙️' },
  { id: 'users', name: '用户管理', icon: '👥' },
  { id: 'roles', name: '角色管理', icon: '🔐' },
  { id: 'logs', name: '系统日志', icon: '📋' },
  { id: 'stats', name: '数据统计', icon: '📊' }
])

const activeTab = ref('system')

// 系统设置数据
const systemSettings = ref({
  name: '教学管理系统',
  version: '1.0.0',
  logo: '',
  licenseNumber: '粤ICP备12345678号',
  announcement: '欢迎使用教学管理系统，系统将于每周日凌晨2点进行维护。',
  features: {
    comments: true,
    fileUpload: true,
    userRegistration: false,
    learningProgress: true
  }
})

const originalSystemSettings = ref({ ...systemSettings.value })

// 用户管理数据
const users = ref([
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', department: '系统管理部', status: 'active', registerTime: '2024-01-10 10:30', avatar: 'https://via.placeholder.com/32/1890ff/ffffff?text=A' },
  { id: 2, username: 'teacher1', email: 'teacher1@example.com', role: 'teacher', department: '计算机科学系', status: 'active', registerTime: '2024-02-15 14:20', avatar: 'https://via.placeholder.com/32/28a745/ffffff?text=T1' },
  { id: 3, username: 'teacher2', email: 'teacher2@example.com', role: 'teacher', department: '软件工程系', status: 'active', registerTime: '2024-02-20 09:10', avatar: 'https://via.placeholder.com/32/ffc107/ffffff?text=T2' },
  { id: 4, username: 'student1', email: 'student1@example.com', role: 'student', department: '计算机科学系 2021级', status: 'active', registerTime: '2024-03-05 16:45', avatar: 'https://via.placeholder.com/32/17a2b8/ffffff?text=S1' },
  { id: 5, username: 'student2', email: 'student2@example.com', role: 'student', department: '软件工程系 2022级', status: 'active', registerTime: '2024-03-10 11:30', avatar: 'https://via.placeholder.com/32/6f42c1/ffffff?text=S2' },
  { id: 6, username: 'student3', email: 'student3@example.com', role: 'student', department: '数据科学系 2021级', status: 'inactive', registerTime: '2024-04-01 13:20', avatar: 'https://via.placeholder.com/32/dc3545/ffffff?text=S3' }
])

const userSearchKeyword = ref('')
const userFilterRole = ref('')
const userFilterStatus = ref('')
const userCurrentPage = ref(1)
const userPageSize = ref(10)

// 角色管理数据
const roles = ref([
  {
    id: 1,
    name: '管理员',
    description: '系统管理员，拥有最高权限',
    permissions: [
      { id: 1, name: 'system_config', description: '系统配置' },
      { id: 2, name: 'user_manage', description: '用户管理' },
      { id: 3, name: 'role_manage', description: '角色管理' },
      { id: 4, name: 'content_manage', description: '内容管理' },
      { id: 5, name: 'log_view', description: '日志查看' }
    ]
  },
  {
    id: 2,
    name: '教师',
    description: '教师用户，负责课程管理和学生指导',
    permissions: [
      { id: 4, name: 'content_manage', description: '内容管理' },
      { id: 6, name: 'course_manage', description: '课程管理' },
      { id: 7, name: 'assignment_manage', description: '作业管理' }
    ]
  },
  {
    id: 3,
    name: '学生',
    description: '学生用户，进行课程学习和作业提交',
    permissions: [
      { id: 8, name: 'course_learning', description: '课程学习' },
      { id: 9, name: 'assignment_submit', description: '作业提交' },
      { id: 10, name: 'comment_post', description: '发表评论' }
    ]
  }
])

const allPermissions = ref([
  { id: 1, name: 'system_config', description: '系统配置' },
  { id: 2, name: 'user_manage', description: '用户管理' },
  { id: 3, name: 'role_manage', description: '角色管理' },
  { id: 4, name: 'content_manage', description: '内容管理' },
  { id: 5, name: 'log_view', description: '日志查看' },
  { id: 6, name: 'course_manage', description: '课程管理' },
  { id: 7, name: 'assignment_manage', description: '作业管理' },
  { id: 8, name: 'course_learning', description: '课程学习' },
  { id: 9, name: 'assignment_submit', description: '作业提交' },
  { id: 10, name: 'comment_post', description: '发表评论' }
])

// 系统日志数据
const logs = ref([
  { id: 1, time: '2024-06-18 14:30:22', user: 'admin', type: 'login', content: '管理员登录系统', ip: '192.168.1.100' },
  { id: 2, time: '2024-06-18 13:45:10', user: 'teacher1', type: 'operation', content: '发布新文章《数据结构与算法课件》', ip: '192.168.1.101' },
  { id: 3, time: '2024-06-18 12:20:35', user: 'student1', type: 'operation', content: '提交作业《SQL查询实验报告》', ip: '192.168.1.102' },
  { id: 4, time: '2024-06-18 11:15:40', user: 'admin', type: 'operation', content: '添加新用户 student4', ip: '192.168.1.100' },
  { id: 5, time: '2024-06-18 10:05:55', user: 'system', type: 'system', content: '系统自动备份完成', ip: '127.0.0.1' },
  { id: 6, time: '2024-06-18 09:30:12', user: 'student2', type: 'error', content: '上传文件失败：文件大小超过限制', ip: '192.168.1.103' },
  { id: 7, time: '2024-06-17 18:20:30', user: 'teacher2', type: 'operation', content: '创建新课程《操作系统原理》', ip: '192.168.1.104' },
  { id: 8, time: '2024-06-17 16:45:15', user: 'student3', type: 'login', content: '学生登录系统', ip: '192.168.1.105' },
  { id: 9, time: '2024-06-17 15:10:25', user: 'admin', type: 'operation', content: '修改系统设置', ip: '192.168.1.100' },
  { id: 10, time: '2024-06-17 14:30:40', user: 'system', type: 'system', content: '清理系统缓存完成', ip: '127.0.0.1' }
])

const logFilterType = ref('')
const logFilterDate = ref('')
const logCurrentPage = ref(1)
const logPageSize = ref(10)

// 数据统计
const totalUsersCount = ref(256)
const teacherCount = ref(32)
const studentCount = ref(220)
const courseCount = ref(68)
const articleCount = ref(342)

// 弹窗状态
const showUserForm = ref(false)
const editingUser = ref(null)
const userForm = ref({
  username: '',
  email: '',
  role: 'student',
  department: '',
  password: '',
  status: 'active'
})

const showRoleForm = ref(false)
const editingRole = ref(null)
const roleForm = ref({
  name: '',
  description: '',
  permissions: []
})

// 计算筛选后的用户列表
const filteredUsers = computed(() => {
  let result = [...users.value]
  
  // 关键词搜索
  if (userSearchKeyword.value) {
    const keyword = userSearchKeyword.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(keyword) || 
      user.email.toLowerCase().includes(keyword)
    )
  }
  
  // 角色筛选
  if (userFilterRole.value) {
    result = result.filter(user => user.role === userFilterRole.value)
  }
  
  // 状态筛选
  if (userFilterStatus.value) {
    result = result.filter(user => user.status === userFilterStatus.value)
  }
  
  // 分页
  const startIndex = (userCurrentPage.value - 1) * userPageSize.value
  const endIndex = startIndex + userPageSize.value
  
  return result.slice(startIndex, endIndex)
})

// 计算用户总页数
const userTotalPages = computed(() => {
  let result = [...users.value]
  
  // 应用相同的筛选条件
  if (userSearchKeyword.value) {
    const keyword = userSearchKeyword.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(keyword) || 
      user.email.toLowerCase().includes(keyword)
    )
  }
  
  if (userFilterRole.value) {
    result = result.filter(user => user.role === userFilterRole.value)
  }
  
  if (userFilterStatus.value) {
    result = result.filter(user => user.status === userFilterStatus.value)
  }
  
  return Math.ceil(result.length / userPageSize.value)
})

// 计算筛选后的日志列表
const filteredLogs = computed(() => {
  let result = [...logs.value]
  
  // 类型筛选
  if (logFilterType.value) {
    result = result.filter(log => log.type === logFilterType.value)
  }
  
  // 日期筛选
  if (logFilterDate.value) {
    result = result.filter(log => log.time.startsWith(logFilterDate.value))
  }
  
  // 分页
  const startIndex = (logCurrentPage.value - 1) * logPageSize.value
  const endIndex = startIndex + logPageSize.value
  
  return result.slice(startIndex, endIndex)
})

// 计算日志总页数
const logTotalPages = computed(() => {
  let result = [...logs.value]
  
  // 应用相同的筛选条件
  if (logFilterType.value) {
    result = result.filter(log => log.type === logFilterType.value)
  }
  
  if (logFilterDate.value) {
    result = result.filter(log => log.time.startsWith(logFilterDate.value))
  }
  
  return Math.ceil(result.length / logPageSize.value)
})

// 切换选项卡
const switchTab = (tabId) => {
  activeTab.value = tabId
}

// 系统设置相关方法
const saveSystemSettings = () => {
  // 保存系统设置
  console.log('保存系统设置:', systemSettings.value)
  originalSystemSettings.value = { ...systemSettings.value }
  alert('系统设置保存成功！')
}

const resetSystemSettings = () => {
  // 重置系统设置
  systemSettings.value = { ...originalSystemSettings.value }
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 这里只是模拟上传，实际项目中应该调用上传接口
    const reader = new FileReader()
    reader.onload = (e) => {
      systemSettings.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const backupSystem = () => {
  // 备份系统
  console.log('备份系统')
  alert('系统备份开始，请稍候...')
}

const clearCache = () => {
  // 清除缓存
  console.log('清除缓存')
  alert('系统缓存清除成功！')
}

// 用户管理相关方法
const showAddUserForm = () => {
  editingUser.value = null
  userForm.value = {
    username: '',
    email: '',
    role: 'student',
    department: '',
    password: '',
    status: 'active'
  }
  showUserForm.value = true
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    username: user.username,
    email: user.email,
    role: user.role,
    department: user.department,
    password: '', // 编辑用户时不显示密码
    status: user.status
  }
  showUserForm.value = true
}

const hideUserForm = () => {
  showUserForm.value = false
  editingUser.value = null
}

const saveUser = () => {
  if (editingUser.value) {
    // 编辑现有用户
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        email: userForm.value.email,
        role: userForm.value.role,
        department: userForm.value.department,
        status: userForm.value.status
      }
    }
  } else {
    // 添加新用户
    const newUser = {
      id: Date.now(),
      username: userForm.value.username,
      email: userForm.value.email,
      role: userForm.value.role,
      department: userForm.value.department,
      status: userForm.value.status,
      registerTime: new Date().toLocaleString('zh-CN'),
      avatar: `https://via.placeholder.com/32/6c757d/ffffff?text=${userForm.value.username.charAt(0).toUpperCase()}`
    }
    users.value.unshift(newUser)
  }
  
  hideUserForm()
  userCurrentPage.value = 1
}

const deleteUser = (userId) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    const confirmMessage = user.status === 'active' ? '确定要禁用该用户吗？' : '确定要启用该用户吗？'
    if (confirm(confirmMessage)) {
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index].status = user.status === 'active' ? 'inactive' : 'active'
      }
    }
  }
}

const resetPassword = (userId) => {
  if (confirm('确定要重置该用户的密码吗？重置后密码将变为123456')) {
    console.log('重置用户密码:', userId)
    alert('密码重置成功，新密码为：123456')
  }
}

const changeUserPage = (page) => {
  if (page >= 1 && page <= userTotalPages.value) {
    userCurrentPage.value = page
  }
}

// 角色管理相关方法
const showAddRoleForm = () => {
  editingRole.value = null
  roleForm.value = {
    name: '',
    description: '',
    permissions: []
  }
  showRoleForm.value = true
}

const editRole = (role) => {
  editingRole.value = role
  roleForm.value = {
    name: role.name,
    description: role.description,
    permissions: [...role.permissions]
  }
  showRoleForm.value = true
}

const hideRoleForm = () => {
  showRoleForm.value = false
  editingRole.value = null
}

const saveRole = () => {
  if (editingRole.value) {
    // 编辑现有角色
    const index = roles.value.findIndex(r => r.id === editingRole.value.id)
    if (index !== -1) {
      roles.value[index] = {
        ...roles.value[index],
        name: roleForm.value.name,
        description: roleForm.value.description,
        permissions: roleForm.value.permissions
      }
    }
  } else {
    // 添加新角色
    const newRole = {
      id: Date.now(),
      name: roleForm.value.name,
      description: roleForm.value.description,
      permissions: roleForm.value.permissions
    }
    roles.value.push(newRole)
  }
  
  hideRoleForm()
}

const deleteRole = (roleId) => {
  if (confirm('确定要删除该角色吗？删除后使用该角色的用户将无法正常使用系统。')) {
    const index = roles.value.findIndex(r => r.id === roleId)
    if (index !== -1) {
      roles.value.splice(index, 1)
    }
  }
}

// 日志管理相关方法
const exportLogs = () => {
  // 导出日志
  console.log('导出日志')
  alert('日志导出开始，请稍候...')
}

const changeLogPage = (page) => {
  if (page >= 1 && page <= logTotalPages.value) {
    logCurrentPage.value = page
  }
}

// 获取角色显示名称
const getRoleDisplayName = (role) => {
  const roleMap = {
    'admin': '管理员',
    'teacher': '教师',
    'student': '学生'
  }
  return roleMap[role] || role
}

// 获取日志类型显示名称
const getLogTypeDisplayName = (type) => {
  const typeMap = {
    'login': '登录',
    'operation': '操作',
    'error': '错误',
    'system': '系统'
  }
  return typeMap[type] || type
}

// 组件挂载时的操作
onMounted(() => {
  // 这里可以添加数据获取逻辑
})
</script>

<style scoped>
.admin-config {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.btn-primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  color: #fff;
}

.btn-warning {
  background: #faad14;
  border-color: #faad14;
  color: #fff;
}

.btn-warning:hover {
  background: #ffc53d;
  border-color: #ffc53d;
  color: #fff;
}

.btn-danger {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

.btn-danger:hover {
  background: #ff7875;
  border-color: #ff7875;
  color: #fff;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

/* 配置选项卡样式 */
.config-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: #fff;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: #1890ff;
  background: #f0f8ff;
}

.tab-btn.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  background: #e6f7ff;
  font-weight: 600;
}

/* 配置内容样式 */
.config-content {
  min-height: 500px;
}

.tab-content {
  padding: 24px;
}

.tab-content h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

/* 表单样式 */
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #ff4d4f;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.upload-area {
  position: relative;
  width: 100%;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}

.upload-area input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  color: #999;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature-switches {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

/* 用户管理样式 */
.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.date-input {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

/* 表格样式 */
.users-table,
.logs-table {
  width: 100%;
  overflow-x: auto;
}

.table-header {
  display: flex;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #333;
  min-width: 800px;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  min-width: 800px;
}

.table-row:hover {
  background-color: #fafafa;
}

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
}

.table-cell.id {
  width: 80px;
}

.table-cell.username {
  flex: 2;
}

.table-cell.email {
  flex: 3;
}

.table-cell.role {
  width: 100px;
}

.table-cell.department {
  flex: 2;
}

.table-cell.status {
  width: 100px;
}

.table-cell.register-time {
  width: 160px;
}

.table-cell.actions {
  width: 180px;
  display: flex;
  gap: 8px;
}

.table-cell.time {
  width: 180px;
}

.table-cell.user {
  width: 120px;
}

.table-cell.type {
  width: 100px;
}

.table-cell.content {
  flex: 3;
}

.table-cell.ip {
  width: 120px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.active {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-badge.inactive {
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.action-btn {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.delete-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.reset-btn:hover {
  border-color: #faad14;
  color: #faad14;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-page {
  font-size: 14px;
  color: #333;
  min-width: 80px;
  text-align: center;
}

/* 角色管理样式 */
.roles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.roles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.role-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.role-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.role-actions {
  display: flex;
  gap: 8px;
}

.role-permissions {
  padding: 20px;
}

.role-permissions h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.permission-item {
  padding: 6px 12px;
  background: #f0f8ff;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  font-size: 12px;
  color: #1890ff;
}

/* 日志管理样式 */
.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.log-filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

.log-type-login {
  background: #f6ffed;
}

.log-type-operation {
  background: #e6f7ff;
}

.log-type-error {
  background: #fff1f0;
}

.log-type-system {
  background: #f5f5f5;
}

/* 数据统计样式 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #f0f0f0;
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stats-charts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.chart-container h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 8px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.chart-bar {
  width: 40px;
  background: linear-gradient(180deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  position: relative;
}

.chart-bar::before {
  content: attr(data-value);
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #333;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.permissions-checklist {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 12px;
}

.permission-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.permission-checkbox:hover {
  background: #fafafa;
}

.permission-checkbox input {
  margin-top: 4px;
  width: auto;
}

.permission-checkbox span {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>