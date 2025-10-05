import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 根路径重定向到登录页面
    {
      path: '/',
      redirect: '/login',
    },

    // 登录注册相关路由
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { hideFooter: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { hideFooter: true },
    },

    // 学生（浏览者）路由
    {
      path: '/front',
      name: 'FrontPage',
      component: () => import('@/views/FrontPage.vue'),
    },
    {
      path: '/front/article/:id',
      name: 'ArticleDetail',
      component: () => import('@/views/ArticleDetail.vue'),
    },
    {
      path: '/front/category/:id',
      name: 'CategoryPage',
      component: () => import('@/views/CategoryPage.vue'),
    },
    {
      path: '/front/search',
      name: 'SearchPage',
      component: () => import('@/views/Search.vue'),
    },

    // 发布者路由
    {
      path: '/publisher/dashboard',
      name: 'PublisherDashboard',
      component: () => import('@/views/TeacherDashboard.vue'),
      meta: { requiresAuth: true, allowedRoles: ['teacher', 'publisher'] },
    },
    {
      path: '/publisher/drafts',
      name: 'DraftBox',
      component: () => import('@/views/DraftBox.vue'),
      meta: { requiresAuth: true, allowedRoles: ['teacher', 'publisher'] },
    },
    {
      path: '/publisher/article/create',
      name: 'CreateArticle',
      component: () => import('@/views/TeacherContent.vue'),
      meta: { requiresAuth: true, allowedRoles: ['teacher', 'publisher'] },
    },
    {
      path: '/publisher/article/edit/:id',
      name: 'EditArticle',
      component: () => import('@/views/TeacherContent.vue'),
      meta: { requiresAuth: true, allowedRoles: ['teacher', 'publisher'] },
    },
    {
      path: '/publisher/submissions',
      name: 'SubmissionTracking',
      component: () => import('@/views/TeacherContent.vue'),
      meta: { requiresAuth: true, allowedRoles: ['teacher', 'publisher'] },
    },
    {
      path: '/publisher/revision/:id',
      name: 'RevisionRequest',
      component: () => import('@/views/TeacherContent.vue'),
      meta: { requiresAuth: true, allowedRoles: ['teacher', 'publisher'] },
    },

    // 栏目管理员路由
    {
      path: '/category-admin/dashboard',
      name: 'CategoryAdminDashboard',
      component: () => import('@/views/CategoryManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['category-admin'] },
    },
    {
      path: '/category-admin/pending',
      name: 'PendingPublication',
      component: () => import('@/views/CategoryManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['category-admin'] },
    },
    {
      path: '/category-admin/editorial',
      name: 'EditorialLayout',
      component: () => import('@/views/CategoryManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['category-admin'] },
    },
    {
      path: '/category-admin/articles',
      name: 'CategoryArticleManagement',
      component: () => import('@/views/CategoryManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['category-admin'] },
    },
    {
      path: '/category-admin/statistics',
      name: 'CategoryStatistics',
      component: () => import('@/views/CategoryManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['category-admin'] },
    },

    // 审核员路由
    {
      path: '/auditor/dashboard',
      name: 'AuditorDashboard',
      component: () => import('@/views/AuditManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['auditor'] },
    },
    {
      path: '/auditor/pending',
      name: 'PendingAudit',
      component: () => import('@/views/AuditManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['auditor'] },
    },
    {
      path: '/auditor/detail/:id',
      name: 'AuditDetail',
      component: () => import('@/views/AuditManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['auditor'] },
    },
    {
      path: '/auditor/batch',
      name: 'BatchAudit',
      component: () => import('@/views/AuditManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['auditor'] },
    },
    {
      path: '/auditor/records',
      name: 'AuditRecords',
      component: () => import('@/views/AuditManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['auditor'] },
    },

    // 超级管理员路由
    {
      path: '/dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/admin/users',
      name: 'UserManagement',
      component: () => import('@/views/UserManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/admin/roles',
      name: 'RolePermissionConfig',
      component: () => import('@/views/AdminConfig.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/admin/categories',
      name: 'CategoryTreeManagement',
      component: () => import('@/views/CategoryManagement.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/admin/logs',
      name: 'SystemLogs',
      component: () => import('@/views/SystemSettings.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/admin/backup',
      name: 'BackupRestore',
      component: () => import('@/views/SystemSettings.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },

    // 公共功能路由
    {
      path: '/personal-center',
      name: 'PersonalCenter',
      component: () => import('@/views/PersonalCenter.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'teacher', 'publisher', 'auditor', 'category-admin', 'student'],
      },
    },

    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/FrontPage.vue'),
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查登录状态
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'
    if (!isAuthenticated) {
      // 保存当前路径，登录后可以跳转回来
      localStorage.setItem('redirectPath', to.fullPath)
      next({ path: '/login' })
      return
    }

    // 检查角色权限
    if (to.meta.allowedRoles) {
      const userRole = localStorage.getItem('userRole') || ''
      if (to.meta.allowedRoles.includes(userRole)) {
        next()
      } else {
        // 角色不匹配，重定向到对应首页
        switch (userRole) {
          case 'admin':
            next({ path: '/dashboard' })
            break
          case 'teacher':
          case 'publisher':
            next({ path: '/publisher/dashboard' })
            break
          case 'auditor':
            next({ path: '/auditor/dashboard' })
            break
          case 'category-admin':
            next({ path: '/category-admin/dashboard' })
            break
          case 'student':
            next({ path: '/student/dashboard' })
            break
          default:
            next({ path: '/login' })
        }
      }
    } else {
      next()
    }
  } else {
    // 无需认证的页面
    next()
  }
})

export default router
