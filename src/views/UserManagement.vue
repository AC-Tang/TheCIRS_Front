<template>
  <div class="user-management">
    <div class="page-header">
      <h1>用户管理</h1>
      <button class="btn btn-primary" @click="showCreateForm">
        新建用户
      </button>
    </div>

    <div class="filters card">
      <div class="filter-group">
        <label>角色筛选：</label>
        <select v-model="filters.role">
          <option value="">全部角色</option>
          <option value="super_admin">超级管理员</option>
          <option value="category_admin">栏目管理员</option>
          <option value="editor">编辑</option>
          <option value="auditor">审核员</option>
        </select>
      </div>
      <SearchBar @search="handleSearch" placeholder="搜索用户名或真实姓名" />
    </div>

    <div class="user-table card">
      <table class="table">
        <thead>
          <tr>
            <th>用户名</th>
            <th>真实姓名</th>
            <th>角色</th>
            <th>部门</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.realName }}</td>
            <td>{{ user.roleName }}</td>
            <td>{{ user.department }}</td>
            <td>
              <span :class="['status', user.status]">{{ user.status === 'active' ? '激活' : '禁用' }}</span>
            </td>
            <td>
              <button class="btn btn-sm" @click="handleEdit(user)">编辑</button>
              <button class="btn btn-sm btn-danger" @click="handleDelete(user)">删除</button>
              <button class="btn btn-sm" @click="handleResetPassword(user)">重置密码</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination 
      :current-page="pagination.current"
      :total="pagination.total"
      @page-change="handlePageChange"
    />

    <!-- 用户编辑弹窗 -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h3>{{ editingUser ? '编辑用户' : '新建用户' }}</h3>
        <form @submit.prevent="handleSaveUser">
          <div class="form-row">
            <div class="form-group">
              <label>用户名</label>
              <input v-model="userForm.username" type="text" required>
            </div>
            <div class="form-group">
              <label>真实姓名</label>
              <input v-model="userForm.realName" type="text" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>角色</label>
              <select v-model="userForm.role" required>
                <option value="super_admin">超级管理员</option>
                <option value="category_admin">栏目管理员</option>
                <option value="editor">编辑</option>
                <option value="auditor">审核员</option>
              </select>
            </div>
            <div class="form-group">
              <label>部门</label>
              <input v-model="userForm.department" type="text">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>邮箱</label>
              <input v-model="userForm.email" type="email">
            </div>
            <div class="form-group">
              <label>电话</label>
              <input v-model="userForm.phone" type="tel">
            </div>
          </div>
          <div class="form-group" v-if="!editingUser">
            <label>密码</label>
            <input v-model="userForm.password" type="password" required>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" class="btn" @click="hideForm">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/common/SearchBar.vue'
import Pagination from '@/components/common/Pagination.vue'

export default {
  name: 'UserManagement',
  components: {
    SearchBar,
    Pagination
  },
  data() {
    return {
      filters: {
        role: '',
        keyword: ''
      },
      users: [
        {
          id: 1,
          username: 'admin',
          realName: '超级管理员',
          role: 'super_admin',
          roleName: '超级管理员',
          department: '信息中心',
          status: 'active',
          email: 'admin@college.edu',
          phone: '13800138000'
        },
        {
          id: 2,
          username: 'zhangsan',
          realName: '张三',
          role: 'category_admin',
          roleName: '栏目管理员',
          department: '教务处',
          status: 'active',
          email: 'zhangsan@college.edu',
          phone: '13800138001'
        }
      ],
      pagination: {
        current: 1,
        total: 50
      },
      showForm: false,
      editingUser: null,
      userForm: {
        username: '',
        realName: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    showCreateForm() {
      this.editingUser = null
      this.userForm = {
        username: '',
        realName: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        password: ''
      }
      this.showForm = true
    },
    hideForm() {
      this.showForm = false
      this.editingUser = null
    },
    handleEdit(user) {
      this.editingUser = user
      this.userForm = { ...user, password: '' }
      this.showForm = true
    },
    handleDelete(user) {
      if (confirm(`确定要删除用户"${user.realName}"吗？`)) {
        // 删除逻辑
      }
    },
    handleResetPassword(user) {
      if (confirm(`确定要重置用户"${user.realName}"的密码吗？`)) {
        // 重置密码逻辑
      }
    },
    handleSaveUser() {
      // 保存用户逻辑
      this.hideForm()
    },
    handleSearch(keyword) {
      this.filters.keyword = keyword
      this.loadUsers()
    },
    handlePageChange(page) {
      this.pagination.current = page
      this.loadUsers()
    },
    loadUsers() {
      // 加载用户数据
    }
  }
}
</script>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.status.active {
  color: #52c41a;
}

.status.inactive {
  color: #ff4d4f;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  margin-right: 5px;
}
</style>