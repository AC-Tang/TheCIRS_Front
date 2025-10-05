<template>
  <div class="front-page">
    <!-- 现代化轮播图区域 -->
    <section class="hero-carousel">
      <div class="carousel-container" ref="carouselContainer">
        <div class="carousel-slides" :style="carouselStyle">
          <div v-for="(slide, index) in carouselSlides" :key="index" class="carousel-slide">
            <img :src="slide.image" :alt="slide.title" class="carousel-image" />
            <div class="carousel-overlay"></div>
            <div class="carousel-caption">
              <span class="caption-tag">{{ slide.tag }}</span>
              <h2 class="caption-title">{{ slide.title }}</h2>
              <p class="caption-subtitle">{{ slide.subtitle }}</p>
              <button class="caption-button" @click="goToSlideLink(slide.link)">查看详情</button>
            </div>
          </div>
        </div>

        <!-- 轮播控制按钮 -->
        <button class="carousel-control prev" @click="prevSlide" aria-label="上一张">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="carousel-control next" @click="nextSlide" aria-label="下一张">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <button
            v-for="(slide, index) in carouselSlides"
            :key="index"
            :class="['indicator', { active: currentSlide === index }]"
            @click="goToSlide(index)"
            :aria-label="`转到幻灯片 ${index + 1}`"
          ></button>
        </div>
      </div>
    </section>

    <!-- 快速导航区域 -->
    <section class="quick-nav-section">
      <div class="container">
        <div class="quick-nav-grid">
          <router-link to="/category/list" class="quick-nav-item">
            <div class="nav-icon">📚</div>
            <span>文章分类</span>
          </router-link>
          <router-link to="/search" class="quick-nav-item">
            <div class="nav-icon">🔍</div>
            <span>搜索文章</span>
          </router-link>
          <router-link to="/dashboard" class="quick-nav-item">
            <div class="nav-icon">🎯</div>
            <span>个人中心</span>
          </router-link>
          <a href="#contact" class="quick-nav-item">
            <div class="nav-icon">📞</div>
            <span>联系我们</span>
          </a>
        </div>
      </div>
    </section>

    <!-- 内容网格区域 -->
    <div class="content-grid">
      <!-- 主要内容区域 -->
      <main class="main-content">
        <!-- 热点文章区域 -->
        <section class="section hot-articles-section">
          <div class="section-header">
            <h2>🔥 热点文章</h2>
            <router-link to="/category/hot" class="view-more">查看更多</router-link>
          </div>

          <div class="articles-grid">
            <div
              v-for="article in hotArticles"
              :key="article.id"
              class="article-card modern-card"
              @click="goToArticleDetail(article.id)"
            >
              <div class="article-image-wrapper">
                <img :src="article.image" :alt="article.title" class="article-image" />
                <span class="article-category-badge">{{ article.category }}</span>
              </div>
              <div class="article-content">
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-excerpt">{{ article.excerpt }}</p>
                <div class="article-meta">
                  <span class="author">{{ article.author }}</span>
                  <span class="date">{{ formatRelativeDate(article.date) }}</span>
                  <span class="views">{{ article.views }} 浏览</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 最新文章区域 -->
        <section class="section latest-articles-section">
          <div class="section-header">
            <h2>✨ 最新文章</h2>
            <router-link to="/category/latest" class="view-more">查看更多</router-link>
          </div>

          <div class="articles-list">
            <div
              v-for="(article, index) in latestArticles"
              :key="article.id"
              class="article-item modern-list-item"
              @click="goToArticleDetail(article.id)"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="article-image-container">
                <img :src="article.image" :alt="article.title" class="article-item-image" />
              </div>
              <div class="article-content-container">
                <div class="article-meta">
                  <span class="category-tag">{{ article.category }}</span>
                  <span class="article-date">{{ formatRelativeDate(article.date) }}</span>
                </div>
                <h3 class="article-item-title">{{ article.title }}</h3>
                <p class="article-item-excerpt">{{ article.excerpt }}</p>
                <div class="article-item-footer">
                  <span class="article-author">{{ article.author }}</span>
                  <div class="article-stats">
                    <span class="views-count">{{ article.views }} 浏览</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <!-- 分页控件 -->
        <div class="pagination modern-pagination">
          <button
            class="page-btn prev"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            aria-label="上一页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div class="page-numbers">
            <button
              v-for="page in totalPages"
              :key="page"
              :class="['page-btn', { active: currentPage === page }]"
              @click="changePage(page)"
              :aria-label="`第 ${page} 页`"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="page-btn next"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
            aria-label="下一页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      <!-- 特色内容区域 -->
      <section class="section featured-content-section">
        <div class="section-header">
          <h2>🌟 特色推荐</h2>
        </div>
        
        <div class="featured-content-grid">
          <div class="featured-main modern-card large-card">
            <div class="featured-image-wrapper">
              <img src="https://picsum.photos/id/60/800/400" alt="特色内容" class="featured-image" />
              <div class="featured-overlay"></div>
              <div class="featured-caption">
                <h3>2025年度教育科技峰会</h3>
                <p>探讨教育数字化转型的未来趋势</p>
              </div>
            </div>
          </div>
          
          <div class="featured-sidebar">
            <div class="featured-item modern-card small-card" v-for="i in 2" :key="i">
              <div class="featured-item-content">
                <span class="featured-tag">特别策划</span>
                <h4>教师专业发展工作坊</h4>
                <p>提升教学技能，促进专业成长</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 侧边栏 -->
    <aside class="sidebar">
      <!-- 搜索框 -->
      <div class="widget search-widget">
        <h3>🔍 搜索文章</h3>
        <div class="search-box">
          <input type="text" placeholder="输入关键词搜索..." v-model="searchQuery" @keyup.enter="handleSearch" />
          <button @click="handleSearch">搜索</button>
        </div>
      </div>

      <!-- 热门栏目 -->
      <div class="widget categories-widget">
        <h3>📚 热门栏目</h3>
        <ul class="category-nav">
          <li><router-link to="/category/tech">科技前沿</router-link></li>
          <li><router-link to="/category/education">教育动态</router-link></li>
          <li><router-link to="/category/campus">校园生活</router-link></li>
          <li><router-link to="/category/career">就业创业</router-link></li>
          <li><router-link to="/category/research">学术研究</router-link></li>
        </ul>
      </div>

      <!-- 热门文章 -->
      <div class="widget popular-widget">
        <h3>🔥 热门阅读</h3>
        <ul class="popular-articles">
          <li v-for="article in hotArticles.slice(0, 5)" :key="article.id">
            <router-link :to="`/article/${article.id}`" @click.stop="goToArticleDetail(article.id)">
              {{ article.title }}
              <span class="view-count">{{ article.views }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 订阅区域 -->
      <div class="widget subscribe-widget modern-card">
        <h3>📬 订阅更新</h3>
        <p>订阅我们的通讯，获取最新资讯</p>
        <div class="subscribe-form">
          <input type="email" placeholder="您的邮箱地址" v-model="email" />
          <button @click="subscribe" class="subscribe-button">立即订阅</button>
        </div>
      </div>
    </aside>
  </div>

    <!-- 底部公告区域 -->
    <section class="announcement-section modern-announcement">
      <div class="container">
        <div class="announcement">
          <div class="announcement-icon">📢</div>
          <div class="announcement-content">
            <p>系统公告：欢迎使用信息发布系统，如有任何问题请联系管理员。</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 轮播图状态
const currentSlide = ref(0)
const carouselContainer = ref(null)
const autoPlayTimer = ref(null)

// 文章列表状态
const currentPage = ref(1)
const pageSize = 5

// 轮播图数据 - 增加了标签和链接
const carouselSlides = [
  {
    image: 'https://picsum.photos/id/1/1600/600',
    title: '系统全新升级',
    subtitle: '新增多项功能，优化用户体验，提升平台性能',
    tag: '重要通知',
    link: '/system-update'
  },
  {
    image: 'https://picsum.photos/id/2/1600/600',
    title: '学术交流论坛',
    subtitle: '探讨最新研究成果，分享学术见解，促进学科发展',
    tag: '学术活动',
    link: '/academic-forum'
  },
  {
    image: 'https://picsum.photos/id/3/1600/600',
    title: '校园文化节',
    subtitle: '参与丰富多彩的校园活动，展现青春风采',
    tag: '校园活动',
    link: '/campus-festival'
  },
]

// 热点文章数据
const hotArticles = [
  {
    id: 1,
    title: '2025年科技发展趋势报告',
    excerpt:
      '详细分析了2025年科技领域的发展方向和重点突破，包括人工智能、量子计算、生物技术等前沿领域。',
    image: 'https://picsum.photos/id/10/400/300',
    category: '科技前沿',
    author: '张明',
    date: '2024-01-15',
    views: 1234,
  },
  {
    id: 2,
    title: '大学生创新创业指南',
    excerpt: '为大学生提供创新创业的实用建议，包括项目选择、团队组建、资金筹集等方面的内容。',
    image: 'https://picsum.photos/id/20/400/300',
    category: '创业就业',
    author: '李华',
    date: '2024-01-10',
    views: 987,
  },
  {
    id: 3,
    title: '校园文化活动回顾',
    excerpt: '回顾了本学期校园文化活动的精彩瞬间，展示了校园生活的丰富多彩。',
    image: 'https://picsum.photos/id/30/400/300',
    category: '校园文化',
    author: '王芳',
    date: '2024-01-08',
    views: 876,
  },
]

// 最新文章数据
const latestArticles = [
  {
    id: 10,
    title: '新学期教学计划发布',
    excerpt: '教务处发布了新学期的教学计划，包括课程安排、教学大纲和考核方式等内容。',
    image: 'https://picsum.photos/id/100/200/150',
    category: '教学动态',
    author: '教务处',
    date: '2024-01-20',
    views: 654,
  },
  {
    id: 11,
    title: '校园环境整治成果展示',
    excerpt: '展示了校园环境整治的最新成果，学校环境得到了显著改善。',
    image: 'https://picsum.photos/id/110/200/150',
    category: '校园建设',
    author: '后勤处',
    date: '2024-01-18',
    views: 543,
  },
  {
    id: 12,
    title: '学生社团招新公告',
    excerpt: '各学生社团开始招新，欢迎新生积极参与，丰富课余生活。',
    image: 'https://picsum.photos/id/120/200/150',
    category: '学生活动',
    author: '社团联合会',
    date: '2024-01-16',
    views: 432,
  },
  {
    id: 13,
    title: '图书馆新增电子资源',
    excerpt: '图书馆新增一批电子资源，包括学术期刊、电子图书和数据库等。',
    image: 'https://picsum.photos/id/130/200/150',
    category: '资源动态',
    author: '图书馆',
    date: '2024-01-14',
    views: 321,
  },
  {
    id: 14,
    title: '校园安全知识讲座',
    excerpt: '学校将举办校园安全知识讲座，提高师生的安全意识和防范能力。',
    image: 'https://picsum.photos/id/140/200/150',
    category: '安全提示',
    author: '保卫处',
    date: '2024-01-12',
    views: 210,
  },
]

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(latestArticles.length / pageSize)
})

// 计算轮播图样式
const carouselStyle = computed(() => {
  return {
    transform: `translateX(-${currentSlide.value * 100}%)`,
  }
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化相对日期
const formatRelativeDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}周前`
  } else {
    return formatDate(dateString)
  }
}

// 搜索功能
const searchQuery = ref('')
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

// 订阅功能
const email = ref('')
const subscribe = () => {
  // 简单的邮箱验证
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    alert('订阅成功！我们会定期向您发送最新资讯。')
    email.value = ''
  } else {
    alert('请输入有效的邮箱地址。')
  }
}

// 跳转到幻灯片链接
const goToSlideLink = (link) => {
  if (link) {
    router.push(link)
  }
}

// 轮播图控制方法
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
  resetAutoPlay()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + carouselSlides.length) % carouselSlides.length
  resetAutoPlay()
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetAutoPlay()
}

// 重置自动播放
const resetAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
  }
  startAutoPlay()
}

// 开始自动播放
const startAutoPlay = () => {
  autoPlayTimer.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

// 跳转到文章详情
const goToArticleDetail = (id) => {
  router.push(`/article/${id}`)
}

// 分页控制
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 组件挂载
onMounted(() => {
  startAutoPlay()

  // 添加鼠标悬停暂停自动播放
  if (carouselContainer.value) {
    carouselContainer.value.addEventListener('mouseenter', () => {
      if (autoPlayTimer.value) {
        clearInterval(autoPlayTimer.value)
      }
    })

    carouselContainer.value.addEventListener('mouseleave', () => {
      startAutoPlay()
    })
  }
})

// 组件卸载
onUnmounted(() => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
  }
})
</script>

<style scoped>
/* CSS变量定义 */
:root {
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
  --shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.18);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

.front-page {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
}

/* 现代化轮播图样式 */
.hero-carousel {
  position: relative;
  height: 600px;
  overflow: hidden;
  margin-bottom: 56px;
}

.carousel-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.carousel-slides {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-slide {
  position: relative;
  flex: 0 0 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.carousel-slide:hover .carousel-image {
  transform: scale(1.03);
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
  z-index: 1;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 80px 60px 60px;
  color: white;
  z-index: 2;
  max-width: 800px;
}

.caption-tag {
  display: inline-block;
  background-color: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.caption-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.2;
  letter-spacing: -1px;
}

.caption-subtitle {
  font-size: 18px;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.6;
}

.caption-button {
  background-color: white;
  color: var(--color-primary);
  border: none;
  padding: 12px 32px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
  display: inline-block;
}

.caption-button:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-control:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-primary);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.carousel-control.prev {
  left: 30px;
}

.carousel-control.next {
  right: 30px;
}

.carousel-indicators {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background-color: transparent;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.indicator.active {
  background-color: white;
  width: 28px;
  border-radius: 4px;
}

/* 内容容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 快速导航区域 */
.quick-nav-section {
  margin-bottom: 64px;
}

.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.quick-nav-item {
  text-align: center;
  padding: 32px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
  text-decoration: none;
  color: var(--color-text);
  background-color: white;
  position: relative;
  overflow: hidden;
}

.quick-nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.quick-nav-item:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}

.quick-nav-item:hover::before {
  transform: scaleX(1);
}

.quick-nav-item .nav-icon {
  font-size: 40px;
  margin-bottom: 16px;
  transition: transform var(--transition-normal);
}

.quick-nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.quick-nav-item span {
  font-weight: 600;
  font-size: 18px;
  color: var(--color-heading);
  display: block;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

/* 内容区块 */
.section {
  margin: 60px 0;
}

.section h2 {
  font-size: 28px;
  margin-bottom: 28px;
  color: var(--color-heading);
  position: relative;
  padding-bottom: 12px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.section h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 2px;
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 文章项 */
.article-item {
  padding: 24px;
  background-color: var(--color-background-alt);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.article-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
  border-radius: 2px 0 0 2px;
  transform: translateX(-4px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(16, 185, 129, 0.1);
  border-color: var(--color-primary-light);
  background-color: white;
}

.article-item:hover::before {
  transform: translateX(0);
}

.article-item h3 {
  margin-bottom: 12px;
}

.article-item h3 a {
  color: var(--color-heading);
  text-decoration: none;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
}

.article-item h3 a:hover {
  color: var(--color-primary);
  transform: translateX(4px);
}

.article-meta {
  color: var(--color-text);
  font-size: 14px;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.article-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.article-meta span::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}

.article-summary {
  color: var(--color-text);
  line-height: 1.6;
  font-size: 15px;
  margin: 0;
}

/* 侧边栏 */
.sidebar {
  position: sticky;
  top: 104px;
  height: fit-content;
}

.widget {
  background-color: var(--color-background-alt);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget:hover {
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.08);
  transform: translateY(-2px);
}

.widget h3 {
  color: var(--color-heading);
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

.widget h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 2px;
}

/* 搜索框 */
.search-box {
  display: flex;
  gap: 0;
}

.search-box input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px 0 0 8px;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-box button {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 栏目导航 */
.category-nav {
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-nav li {
  margin-bottom: 12px;
}

.category-nav li:last-child {
  margin-bottom: 0;
}

.category-nav a {
  color: var(--color-text);
  text-decoration: none;
  font-size: 15px;
  display: block;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.category-nav a::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
  border-radius: 2px 0 0 2px;
  transform: translateX(-3px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-nav a:hover {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  padding-left: 16px;
}

.category-nav a:hover::before {
  transform: translateX(0);
}

/* 热门文章 */
.popular-articles {
  list-style: none;
  margin: 0;
  padding: 0;
}

.popular-articles li {
  margin-bottom: 16px;
  position: relative;
  padding-left: 24px;
}

.popular-articles li:last-child {
  margin-bottom: 0;
}

.popular-articles li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}

.popular-articles a {
  color: var(--color-text);
  text-decoration: none;
  font-size: 15px;
  line-height: 1.4;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 4px 0;
}

.popular-articles a:hover {
  color: var(--color-primary);
  transform: translateX(4px);
}

.popular-articles .view-count {
  color: var(--color-primary);
  font-size: 12px;
  background-color: var(--color-primary-light);
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
  font-weight: 500;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 40px 0;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  background-color: white;
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.pagination button:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.pagination button.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 底部公告 */
.announcement {
  background-color: var(--color-primary-light);
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  padding: 20px 24px;
  margin: 40px 0;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.announcement .icon {
  color: var(--color-primary);
  font-size: 24px;
  flex-shrink: 0;
}

.announcement .content h4 {
  color: var(--color-primary);
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.announcement .content p {
  color: var(--color-text);
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 2fr 1fr;
    gap: 32px;
  }

  .carousel {
    height: 400px;
  }

  .carousel-caption {
    padding: 30px 40px 20px;
  }

  .carousel-caption h3 {
    font-size: 24px;
  }

  .section {
    margin: 48px 0;
  }

  .quick-nav-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .sidebar {
    position: static;
  }

  .carousel {
    height: 300px;
  }

  .carousel-caption {
    padding: 20px 24px 16px;
  }

  .carousel-caption h3 {
    font-size: 20px;
  }

  .carousel-caption p {
    font-size: 14px;
  }

  .carousel-arrow {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .carousel-arrow.prev {
    left: 12px;
  }

  .carousel-arrow.next {
    right: 12px;
  }

  .container {
    padding: 0 16px;
  }

  .section {
    margin: 32px 0;
  }

  .section h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .article-item {
    padding: 20px;
  }

  .article-item h3 a {
    font-size: 18px;
  }

  .article-meta {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .widget {
    padding: 20px;
  }

  .quick-nav {
    padding: 24px 16px;
  }

  .quick-nav-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .quick-nav-item {
    padding: 16px;
  }

  .announcement {
    flex-direction: column;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .carousel {
    height: 250px;
  }

  .carousel-caption h3 {
    font-size: 18px;
  }

  .article-item h3 a {
    font-size: 16px;
  }

  .search-box {
    flex-direction: column;
    gap: 12px;
  }

  .search-box input,
  .search-box button {
    border-radius: 8px;
  }

  .popular-articles li {
    padding-left: 20px;
  }

  .popular-articles a {
    font-size: 14px;
  }

  .quick-nav-grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .pagination button {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section {
  animation: fadeInUp 0.6s ease-out;
}

.article-item {
  animation: fadeInUp 0.4s ease-out;
  animation-fill-mode: both;
}

.article-item:nth-child(1) {
  animation-delay: 0.1s;
}
.article-item:nth-child(2) {
  animation-delay: 0.2s;
}
.article-item:nth-child(3) {
  animation-delay: 0.3s;
}
.article-item:nth-child(4) {
  animation-delay: 0.4s;
}
.article-item:nth-child(5) {
  animation-delay: 0.5s;
}

/* 轮播图淡入效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.carousel-slide.active {
  animation: fadeIn 0.5s ease-out;
}
/* 内容网格布局 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  max-width: 1248px;
  margin: 0 auto 64px;
  padding: 0 24px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 区块样式 */
.section {
  animation: fadeInUp 0.6s ease forwards;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.view-more {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all var(--transition-fast);
}

.view-more:hover {
  color: var(--color-primary-dark);
  transform: translateX(4px);
}

.view-more::after {
  content: '→';
  margin-left: 6px;
  font-size: 14px;
  transition: transform var(--transition-fast);
}

.view-more:hover::after {
  transform: translateX(2px);
}

/* 文章网格样式 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* 现代化卡片样式 */
.modern-card {
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.modern-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
}

/* 文章卡片样式 */
.article-card {
  display: flex;
  flex-direction: column;
}

.article-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.article-card:hover .article-image {
  transform: scale(1.05);
}

.article-category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: var(--color-primary);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
}

.article-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 12px 0;
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.article-card:hover .article-title {
  color: var(--color-primary);
}

.article-excerpt {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: auto;
}

.article-meta .author {
  font-weight: 500;
  color: var(--color-text-secondary);
}

/* 文章列表样式 */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item {
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  display: flex;
  align-items: stretch;
}

.article-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.article-image-container {
  flex: 0 0 160px;
  height: 120px;
  overflow: hidden;
}

.article-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.article-item:hover .article-item-image {
  transform: scale(1.05);
}

.article-content-container {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-content-container .article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.category-tag {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.article-date {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.article-item-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 8px 0;
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.article-item:hover .article-item-title {
  color: var(--color-primary);
}

.article-item-excerpt {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-author {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.article-stats {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

/* 特色内容样式 */
.featured-content-section {
  animation: fadeInUp 0.8s ease forwards;
}

.featured-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  height: 320px;
}

.featured-main {
  height: 100%;
}

.featured-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.featured-main:hover .featured-image {
  transform: scale(1.03);
}

.featured-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3));
}

.featured-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px;
  color: white;
  z-index: 1;
}

.featured-caption h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.featured-caption p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.featured-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.featured-item {
  flex: 1;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light));
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-heading);
}

.featured-tag {
  display: inline-block;
  background-color: white;
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
}

.featured-item h4 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.featured-item p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

/* 侧边栏小部件样式 */
.widget {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.widget h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 20px 0;
}

/* 搜索小部件 */
.search-box {
  display: flex;
  gap: 8px;
}

.search-box input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  transition: all var(--transition-fast);
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-box button {
  padding: 10px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-box button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

/* 栏目导航小部件 */
.category-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-nav li {
  margin-bottom: 8px;
}

.category-nav li:last-child {
  margin-bottom: 0;
}

.category-nav a {
  display: block;
  padding: 12px 16px;
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-size: 14px;
}

.category-nav a:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  transform: translateX(4px);
}

/* 热门文章小部件 */
.popular-articles {
  list-style: none;
  padding: 0;
  margin: 0;
}

.popular-articles li {
  margin-bottom: 16px;
  position: relative;
}

.popular-articles li:last-child {
  margin-bottom: 0;
}

.popular-articles a {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 0;
  color: var(--color-text);
  text-decoration: none;
  font-size: 14px;
  line-height: 1.4;
  transition: all var(--transition-fast);
}

.popular-articles a:hover {
  color: var(--color-primary);
}

.popular-articles a:hover .view-count {
  background-color: var(--color-primary-light);
}

.view-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--color-background-alt);
  border-radius: 50%;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-left: 8px;
  transition: all var(--transition-fast);
}

/* 订阅小部件 */
.subscribe-widget {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light));
  text-align: center;
}

.subscribe-widget h3 {
  color: var(--color-heading);
}

.subscribe-widget p {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0 0 20px 0;
}

.subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subscribe-form input {
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-md);
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all var(--transition-fast);
}

.subscribe-form input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background-color: white;
}

.subscribe-button {
  padding: 12px 24px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.subscribe-button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.2);
}

/* 分页控件样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: white;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
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

/* 底部公告样式 */
.modern-announcement {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light));
  padding: 24px 0;
  margin-top: 64px;
}

.announcement {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.announcement-icon {
  font-size: 24px;
  flex: 0 0 auto;
}

.announcement-content {
  flex: 1;
}

.announcement-content p {
  margin: 0;
  color: var(--color-heading);
  font-weight: 500;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-carousel {
    height: 500px;
  }
  
  .caption-title {
    font-size: 36px;
  }
  
  .featured-content-grid {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .featured-main {
    height: 240px;
  }
  
  .featured-sidebar {
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .hero-carousel {
    height: 400px;
  }
  
  .carousel-caption {
    padding: 60px 40px 40px;
  }
  
  .caption-title {
    font-size: 28px;
  }
  
  .caption-subtitle {
    font-size: 16px;
  }
  
  .quick-nav-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .article-item {
    flex-direction: column;
  }
  
  .article-image-container {
    flex: 0 0 180px;
    width: 100%;
  }
  
  .featured-sidebar {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-carousel {
    height: 320px;
  }
  
  .carousel-caption {
    padding: 40px 24px 32px;
  }
  
  .caption-title {
    font-size: 24px;
  }
  
  .caption-subtitle {
    font-size: 14px;
    margin-bottom: 16px;
  }
  
  .caption-button {
    padding: 10px 24px;
    font-size: 14px;
  }
  
  .carousel-control {
    width: 44px;
    height: 44px;
    left: 16px;
    right: 16px;
  }
  
  .quick-nav-section {
    margin-bottom: 40px;
  }
  
  .quick-nav-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .quick-nav-item {
    padding: 24px 16px;
  }
  
  .main-content {
    gap: 40px;
  }
  
  .section-header h2 {
    font-size: 20px;
  }
  
  .pagination {
    margin-top: 24px;
  }
  
  .page-btn {
    width: 36px;
    height: 36px;
  }
  
  .announcement {
    flex-direction: column;
    text-align: center;
  }
}

/* 可访问性增强 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 焦点样式 */
button:focus-visible,
input:focus-visible,
router-link:focus-visible a,
a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
