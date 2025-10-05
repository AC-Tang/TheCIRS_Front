<template>
  <div class="draft-box-page">
    <!-- 页面标题栏 -->
    <div class="page-header">
      <div class="container">
        <h1>草稿箱</h1>
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span>&gt;</span>
          <span>草稿箱</span>
        </nav>
      </div>
    </div>

    <div class="container">
      <!-- 功能操作区 -->
      <div class="action-section">
        <button class="primary-btn" @click="createNewDraft">
          <i class="icon-plus"></i>
          新建文章
        </button>
        
        <div class="search-filter">
          <div class="search-group">
            <input 
              v-model="searchKeyword" 
              type="text" 
              placeholder="搜索草稿标题..."
              @keyup.enter="searchDrafts"
              class="search-input"
            />
            <button class="search-btn" @click="searchDrafts">
              <i class="icon-search"></i>
            </button>
          </div>
          
          <select v-model="sortBy" class="sort-select" @change="sortDrafts">
            <option value="update-time-desc">最后保存时间（新到旧）</option>
            <option value="update-time-asc">最后保存时间（旧到新）</option>
            <option value="create-time-desc">创建时间（新到旧）</option>
            <option value="create-time-asc">创建时间（旧到新）</option>
            <option value="title-asc">标题（A-Z）</option>
            <option value="title-desc">标题（Z-A）</option>
          </select>
        </div>
      </div>

      <!-- 草稿统计 -->
      <div class="draft-stats">
        <div class="stat-item">
          <span class="stat-number">{{ allDrafts.length }}</span>
          <span class="stat-label">总草稿</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ recentDrafts.length }}</span>
          <span class="stat-label">最近编辑</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ oldestDrafts.length }}</span>
          <span class="stat-label">未更新草稿</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ getDraftSize() }}</span>
          <span class="stat-label">占用空间</span>
        </div>
      </div>

      <!-- 草稿列表 -->
      <div class="draft-list">
        <div 
          v-for="draft in paginatedDrafts" 
          :key="draft.id"
          class="draft-card"
        >
          <!-- 草稿标题和基本信息 -->
          <div class="draft-header">
            <h3 class="draft-title" v-html="highlightText(draft.title, searchKeyword)"></h3>
            
            <div class="draft-meta">
              <span class="meta-item category">
                {{ draft.category || '未分类' }}
              </span>
              <span class="meta-item word-count">
                <i class="icon-file-text"></i>
                {{ draft.wordCount }} 字
              </span>
              <span class="meta-item last-save">
                <i class="icon-clock"></i>
                {{ formatRelativeTime(draft.lastSaveTime) }}
              </span>
            </div>
          </div>
          
          <!-- 草稿内容预览 -->
          <div class="draft-preview">
            <p v-html="highlightText(getPreviewText(draft.content), searchKeyword)"></p>
          </div>
          
          <!-- 草稿状态标签 -->
          <div class="draft-status">
            <span 
              v-if="isRecentDraft(draft.lastSaveTime)" 
              class="status-badge recent"
            >
              最近编辑
            </span>
            <span 
              v-else-if="isOldDraft(draft.lastSaveTime)" 
              class="status-badge old"
            >
              30天未更新
            </span>
            <span 
              v-if="draft.autoSave" 
              class="status-badge auto-save"
            >
              自动保存
            </span>
            <span 
              v-if="draft.isNew" 
              class="status-badge new"
            >
              新建草稿
            </span>
          </div>
          
          <!-- 操作按钮 -->
          <div class="draft-actions">
            <button 
              class="action-btn edit"
              @click="editDraft(draft.id)"
              title="继续编辑"
            >
              <i class="icon-edit"></i>
              继续编辑
            </button>
            
            <button 
              class="action-btn preview"
              @click="previewDraft(draft.id)"
              title="预览"
            >
              <i class="icon-eye"></i>
              预览
            </button>
            
            <button 
              class="action-btn delete"
              @click="showDeleteConfirm(draft.id)"
              title="删除"
            >
              <i class="icon-trash"></i>
              删除
            </button>
            
            <button 
              class="action-btn export"
              @click="exportDraft(draft.id)"
              title="导出"
            >
              <i class="icon-download"></i>
              导出
            </button>
          </div>
        </div>
        
        <!-- 无草稿提示 -->
        <div v-if="filteredDrafts.length === 0" class="no-drafts">
          <div class="no-drafts-icon">
            <i class="icon-file-o"></i>
          </div>
          <h3>暂无草稿</h3>
          <p>点击"新建文章"开始创作</p>
          <button class="primary-btn" @click="createNewDraft">
            <i class="icon-plus"></i>
            立即创建
          </button>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="page-btn prev-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="page-btn next-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
        
        <div class="page-info">
          <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
          <span>共 {{ filteredDrafts.length }} 条草稿</span>
        </div>
      </div>

      <!-- 删除确认弹窗 -->
      <div v-if="showDeleteDialog" class="dialog-overlay" @click="cancelDelete">
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <h3>删除草稿</h3>
            <button class="close-btn" @click="cancelDelete">
              <i class="icon-times"></i>
            </button>
          </div>
          <div class="dialog-body">
            <p>确定要删除草稿"{{ getDraftById(deleteDraftId).title }}"吗？</p>
            <p class="warning-text">此操作不可恢复，删除后草稿将无法找回。</p>
          </div>
          <div class="dialog-footer">
            <button class="cancel-btn" @click="cancelDelete">取消</button>
            <button class="delete-btn" @click="confirmDelete">确认删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const sortBy = ref('update-time-desc')
const currentPage = ref(1)
const showDeleteDialog = ref(false)
const deleteDraftId = ref(null)

// 每页显示草稿数
const pageSize = 10

// 模拟草稿数据
const allDrafts = ref([
  {
    id: 1,
    title: '人工智能在教育领域的应用研究',
    content: '本文探讨了人工智能技术如何革新现代教育体系，包括个性化学习、智能评估、教育机器人等多个方面的应用案例和未来发展趋势。\n\n研究表明，AI驱动的教育解决方案能够显著提升学习效果和教学效率。通过大数据分析学生行为模式，AI系统可以为每个学习者提供量身定制的学习路径...',
    category: '教育资讯',
    wordCount: 1245,
    createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    autoSave: true,
    isNew: false
  },
  {
    id: 2,
    title: '2024年校园文化活动策划书',
    content: '为丰富校园文化生活，增强学生凝聚力，计划于2024年3月举办"春季文化艺术节"。活动将涵盖音乐、舞蹈、戏剧、美术等多个艺术门类，为全校师生提供展示才华的平台。\n\n活动主题：\n"青春·创新·融合"\n\n活动时间：\n2024年3月15日-3月30日\n\n活动内容：\n1. 开幕式文艺演出\n2. 校园歌手大赛\n3. 创意设计展...',
    category: '校园活动',
    wordCount: 876,
    createTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    autoSave: false,
    isNew: false
  },
  {
    id: 3,
    title: '大数据分析课程教案设计',
    content: '【课程基本信息】\n课程名称：大数据分析与应用\n授课对象：计算机科学专业三年级学生\n课时安排：48学时\n\n【教学目标】\n1. 知识目标：掌握大数据分析的基本概念、原理和方法\n2. 能力目标：能够运用主流大数据分析工具解决实际问题\n3. 素养目标：培养数据思维和团队协作能力\n\n【教学内容】\n模块一：大数据基础理论\n模块二：数据采集与预处理\n模块三：数据可视化技术...',
    category: '教学资源',
    wordCount: 2156,
    createTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    autoSave: true,
    isNew: false
  },
  {
    id: 4,
    title: '学术论文写作指南',
    content: '学术论文是科研成果的重要表现形式，也是学术交流的主要载体。本文将从选题、资料收集、结构安排、语言表达等方面，为研究生提供学术论文写作的实用指导。\n\n一、论文选题\n1. 选题的重要性\n2. 选题的基本原则\n3. 如何确定研究问题\n\n二、资料收集\n1. 文献检索策略\n2. 文献阅读方法...',
    category: '学术研究',
    wordCount: 3567,
    createTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    autoSave: false,
    isNew: false
  },
  {
    id: 5,
    title: '实验室安全管理制度修订稿',
    content: '为加强实验室安全管理，保障师生生命财产安全，促进教学科研工作顺利进行，现对实验室安全管理制度进行修订。\n\n一、总则\n二、安全责任\n三、安全操作规程\n四、安全检查与隐患排查\n五、应急处置\n六、奖励与处罚\n\n本制度自发布之日起施行。\n\n附件：\n1. 实验室安全操作规程\n2. 危险化学品管理办法\n3. 实验室应急预案...',
    category: '管理制度',
    wordCount: 1789,
    createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    autoSave: true,
    isNew: true
  },
  {
    id: 6,
    title: '校园创新创业项目申报指南',
    content: '为鼓励学生参与创新创业实践，培养创新精神和创业能力，学校设立校园创新创业基金，支持学生开展创新创业项目。\n\n一、项目类型\n1. 科技创新类\n2. 文化创意类\n3. 社会服务类\n4. 商业创业类\n\n二、申报条件\n1. 项目负责人和主要成员须为我校在读学生\n2. 项目具有创新性和可行性\n3. 团队成员结构合理...',
    category: '校园活动',
    wordCount: 1345,
    createTime: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    autoSave: false,
    isNew: false
  },
  {
    id: 7,
    title: '新课程教学改革总结报告',
    content: '为适应新时代高等教育发展需求，深化教育教学改革，提升人才培养质量，我院于2023年开展了新课程教学改革试点工作。现将改革情况总结如下：\n\n一、改革背景与目标\n二、改革主要内容\n三、实施效果\n四、经验与教训\n五、改进建议...',
    category: '教学研究',
    wordCount: 2890,
    createTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    autoSave: true,
    isNew: false
  },
  {
    id: 8,
    title: '校园网络安全防护方案',
    content: '随着信息技术的快速发展，校园网络安全问题日益突出。为保障校园网络安全，防范网络攻击，保护师生个人信息和学校数据资产安全，制定本防护方案。\n\n一、现状分析\n二、安全威胁\n三、防护目标\n四、具体措施\n五、应急响应\n六、保障机制...',
    category: '信息技术',
    wordCount: 2345,
    createTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    autoSave: true,
    isNew: false
  },
  {
    id: 9,
    title: '研究生招生宣传工作方案',
    content: '为做好2024年研究生招生宣传工作，吸引更多优秀生源，制定本工作方案。\n\n一、工作目标\n二、宣传内容\n三、宣传渠道\n四、时间安排\n五、工作要求\n六、经费预算...',
    category: '招生就业',
    wordCount: 1056,
    createTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    autoSave: true,
    isNew: true
  },
  {
    id: 10,
    title: '校园绿化改造计划',
    content: '为进一步改善校园环境，提升校园品质，创建绿色生态校园，现制定校园绿化改造计划。\n\n一、改造目标\n二、改造范围\n三、植物配置方案\n四、实施步骤\n五、养护管理\n六、投资估算...',
    category: '校园建设',
    wordCount: 1678,
    createTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    autoSave: false,
    isNew: false
  },
  {
    id: 11,
    title: '学科建设发展规划（2024-2028）',
    content: '为全面提升学科建设水平，增强学科核心竞争力，服务国家战略需求和地方经济社会发展，制定本学科建设发展规划。\n\n一、现状分析\n二、指导思想与建设目标\n三、建设重点\n四、保障措施\n五、预期成效...',
    category: '学科建设',
    wordCount: 4567,
    createTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastSaveTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    autoSave: true,
    isNew: false
  }
])

// 计算属性
// 筛选后的草稿列表
const filteredDrafts = computed(() => {
  let drafts = [...allDrafts.value]
  
  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    drafts = drafts.filter(draft => 
      draft.title.toLowerCase().includes(keyword) || 
      draft.content.toLowerCase().includes(keyword) ||
      draft.category.toLowerCase().includes(keyword)
    )
  }
  
  return drafts
})

// 排序后的草稿列表
const sortedDrafts = computed(() => {
  const drafts = [...filteredDrafts.value]
  
  switch (sortBy.value) {
    case 'update-time-desc':
      return drafts.sort((a, b) => new Date(b.lastSaveTime) - new Date(a.lastSaveTime))
    case 'update-time-asc':
      return drafts.sort((a, b) => new Date(a.lastSaveTime) - new Date(b.lastSaveTime))
    case 'create-time-desc':
      return drafts.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    case 'create-time-asc':
      return drafts.sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
    case 'title-asc':
      return drafts.sort((a, b) => a.title.localeCompare(b.title))
    case 'title-desc':
      return drafts.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return drafts
  }
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredDrafts.value.length / pageSize)
})

// 分页后的草稿
const paginatedDrafts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedDrafts.value.slice(start, end)
})

// 最近编辑的草稿（7天内）
const recentDrafts = computed(() => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return allDrafts.value.filter(draft => new Date(draft.lastSaveTime) >= sevenDaysAgo)
})

// 未更新的草稿（超过30天）
const oldestDrafts = computed(() => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return allDrafts.value.filter(draft => new Date(draft.lastSaveTime) < thirtyDaysAgo)
})

// 可见页码
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  // 显示当前页附近的页码
  if (total <= 7) {
    // 总页数不超过7页，全部显示
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数超过7页，显示部分页码
    if (current <= 4) {
      // 前4页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 后4页
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 中间页面
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 方法
// 搜索草稿
const searchDrafts = () => {
  currentPage.value = 1
}

// 排序草稿
const sortDrafts = () => {
  // 排序后重置到第一页
  currentPage.value = 1
}

// 创建新草稿
const createNewDraft = () => {
  router.push('/editor/new')
}

// 编辑草稿
const editDraft = (draftId) => {
  router.push(`/editor/${draftId}`)
}

// 预览草稿
const previewDraft = (draftId) => {
  router.push(`/preview/${draftId}`)
}

// 导出草稿
const exportDraft = (draftId) => {
  const draft = getDraftById(draftId)
  if (!draft) return
  
  // 创建文本内容
  const textContent = `# ${draft.title}\n\n分类: ${draft.category}\n创建时间: ${formatDate(draft.createTime)}\n最后保存时间: ${formatDate(draft.lastSaveTime)}\n\n---\n\n${draft.content}`
  
  // 创建Blob对象
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${draft.title.replace(/[^\w\u4e00-\u9fa5]/g, '_')}.txt`
  
  // 触发下载
  document.body.appendChild(link)
  link.click()
  
  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
  
  // 提示下载成功
  alert(`草稿"${draft.title}"已导出`)
}

// 显示删除确认
const showDeleteConfirm = (draftId) => {
  deleteDraftId.value = draftId
  showDeleteDialog.value = true
}

// 取消删除
const cancelDelete = () => {
  showDeleteDialog.value = false
  deleteDraftId.value = null
}

// 确认删除
const confirmDelete = () => {
  if (deleteDraftId.value !== null) {
    const index = allDrafts.value.findIndex(draft => draft.id === deleteDraftId.value)
    if (index !== -1) {
      const deletedDraft = allDrafts.value.splice(index, 1)[0]
      alert(`草稿"${deletedDraft.title}"已删除`)
    }
  }
  showDeleteDialog.value = false
  deleteDraftId.value = null
  
  // 如果当前页没有数据，返回上一页
  if (paginatedDrafts.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
}

// 分页
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 获取草稿内容预览（截取前100个字符）
const getPreviewText = (content) => {
  // 简单移除可能的Markdown标记
  const plainText = content.replace(/#{1,6}\s/g, '').replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
  return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText
}

// 高亮文本
const highlightText = (text, keyword) => {
  if (!text || !keyword) return text
  
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="highlight-text">$1</span>')
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 格式化相对时间
const formatRelativeTime = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  
  if (diffMin < 1) {
    return '刚刚'
  } else if (diffMin < 60) {
    return `${diffMin}分钟前`
  } else if (diffHour < 24) {
    return `${diffHour}小时前`
  } else if (diffDay < 7) {
    return `${diffDay}天前`
  } else {
    return formatDate(dateString)
  }
}

// 判断是否为最近编辑的草稿（7天内）
const isRecentDraft = (dateString) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return new Date(dateString) >= sevenDaysAgo
}

// 判断是否为未更新的草稿（超过30天）
const isOldDraft = (dateString) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return new Date(dateString) < thirtyDaysAgo
}

// 根据ID获取草稿
const getDraftById = (draftId) => {
  return allDrafts.value.find(draft => draft.id === draftId)
}

// 获取草稿总大小（估算）
const getDraftSize = () => {
  let totalSize = 0
  allDrafts.value.forEach(draft => {
    totalSize += draft.title.length + draft.content.length
  })
  
  // 转换为KB或MB
  if (totalSize < 1024 * 1024) {
    return `${(totalSize / 1024).toFixed(1)} KB`
  } else {
    return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
  }
}

// 组件挂载
onMounted(() => {
  // 可以在这里加载草稿数据
})
</script>

<style scoped>
.draft-box-page {
  min-height: 100vh;
  background-color: var(--color-background);
}

/* 页面标题栏 */
.page-header {
  background-color: white;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
}

.page-header h1 {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--color-heading);
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.breadcrumb a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: var(--color-primary);
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 功能操作区 */
.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

/* 按钮样式 */
.primary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.primary-btn:hover {
  background-color: var(--color-secondary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 搜索和筛选 */
.search-filter {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-group {
  display: flex;
  align-items: stretch;
  position: relative;
}

.search-input {
  padding: 10px 40px 10px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  width: 300px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-btn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background-color: transparent;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background-color: var(--color-background-alt);
  color: var(--color-primary);
}

.sort-select {
  padding: 10px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 180px;
}

.sort-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* 草稿统计 */
.draft-stats {
  display: flex;
  gap: 24px;
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--color-border);
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  border-right: 1px solid var(--color-border);
}

.stat-item:last-child {
  border-right: none;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* 草稿列表 */
.draft-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 草稿卡片 */
.draft-card {
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.draft-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* 草稿头部 */
.draft-header {
  margin-bottom: 16px;
}

.draft-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.3;
}

.draft-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item.category {
  padding: 2px 8px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 12px;
  font-weight: 500;
}

/* 草稿预览 */
.draft-preview {
  margin-bottom: 16px;
}

.draft-preview p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* 草稿状态 */
.draft-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.recent {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-primary);
}

.status-badge.old {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.status-badge.auto-save {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--color-info);
}

.status-badge.new {
  background-color: rgba(251, 191, 36, 0.1);
  color: var(--color-warning);
}

/* 高亮文本 */
.highlight-text {
  background-color: rgba(251, 191, 36, 0.2);
  color: #92400e;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 500;
}

/* 操作按钮 */
.draft-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.action-btn.edit {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.action-btn.edit:hover {
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
}

.action-btn.preview {
  background-color: white;
  color: var(--color-info);
  border-color: var(--color-info);
}

.action-btn.preview:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.action-btn.delete {
  background-color: white;
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.action-btn.delete:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.action-btn.export {
  background-color: white;
  color: var(--color-text);
  border-color: var(--color-border);
}

.action-btn.export:hover {
  background-color: var(--color-background-alt);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 无草稿提示 */
.no-drafts {
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px dashed var(--color-border);
}

.no-drafts-icon {
  font-size: 64px;
  color: var(--color-border);
  margin-bottom: 20px;
}

.no-drafts h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: var(--color-heading);
}

.no-drafts p {
  margin: 0 0 24px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

/* 分页控件 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.page-btn {
  padding: 8px 16px;
  background-color: white;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.page-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-left: 20px;
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-heading);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: var(--color-background-alt);
  color: var(--color-text);
}

.dialog-body {
  padding: 24px;
}

.dialog-body p {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--color-text);
  line-height: 1.5;
}

.warning-text {
  color: var(--color-warning) !important;
  font-size: 14px !important;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 24px;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: var(--color-background-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: white;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.delete-btn {
  padding: 10px 20px;
  background-color: var(--color-danger);
  color: white;
  border: 1px solid var(--color-danger);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .action-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    justify-content: center;
  }
  
  .search-input {
    width: 250px;
  }
  
  .draft-meta {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .sort-select {
    width: 100%;
  }
  
  .draft-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-item {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    padding: 16px 0;
  }
  
  .stat-item:last-child {
    border-bottom: none;
  }
  
  .draft-card {
    padding: 16px;
  }
  
  .draft-title {
    font-size: 18px;
  }
  
  .draft-meta {
    gap: 8px;
  }
  
  .draft-actions {
    justify-content: center;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .pagination {
    gap: 8px;
  }
  
  .page-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .dialog-content {
    width: 95%;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .action-btn {
    flex: 1;
    justify-content: center;
    min-width: 120px;
  }
  
  .page-info {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }
}
</style>