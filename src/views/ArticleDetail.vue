<template>
  <BaseLayout>
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" style="margin-bottom: 24px;">
      <router-link to="/front">首页</router-link>
      <span>&gt;</span>
      <router-link :to="`/category/${articleData?.category?.id}`">{{ articleData?.category?.name }}</router-link>
      <span>&gt;</span>
      <span>文章详情</span>
    </nav>

    <!-- 主内容区域 -->
    <div class="main-content">
        <!-- 文章内容区 -->
        <div class="content-area">
          <!-- 文章头部信息 -->
          <div class="article-header">
            <h1 class="article-title">{{ articleData?.title }}</h1>

            <div class="article-meta">
              <div class="meta-info">
                <span class="author">
                  <i class="icon-user"></i>
                  {{ articleData?.author }}
                </span>
                <span class="date">
                  <i class="icon-date"></i>
                  {{ formatDate(articleData?.publishDate) }}
                </span>
                <span class="category">
                  <i class="icon-category"></i>
                  <router-link :to="`/category/${articleData?.category?.id}`">{{ articleData?.category?.name }}</router-link>
                </span>
                <span class="views">
                  <i class="icon-view"></i>
                  {{ articleData?.views }} 浏览
                </span>
                <span class="comments">
                  <i class="icon-comment"></i>
                  {{ articleData?.commentCount }} 评论
                </span>
              </div>

              <div class="article-tags">
                <span
                  v-for="tag in articleData?.tags"
                  :key="tag"
                  class="tag"
                  @click="searchByTag(tag)"
                >
                  # {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- 文章封面图 -->
          <div v-if="articleData?.coverImage" class="article-cover">
            <img :src="articleData?.coverImage" :alt="articleData?.title" loading="lazy" />
          </div>

          <!-- 文章摘要 -->
          <div v-if="articleData?.summary" class="article-summary">
            <div class="summary-title">摘要</div>
            <p class="summary-content">{{ articleData?.summary }}</p>
          </div>

          <!-- 文章正文 -->
          <div class="article-content">
            <div class="content-section" v-html="articleContent"></div>
          </div>

          <!-- 文章操作区 -->
          <div class="article-actions">
            <div class="action-buttons">
              <button class="btn action-btn like-btn" @click="likeArticle">
                <i class="icon-like"></i>
                <span>{{ liked ? '已点赞' : '点赞' }}</span>
                <span class="like-count">({{ articleData?.likes }})</span>
              </button>
              <button class="btn action-btn share-btn" @click="shareArticle">
                <i class="icon-share"></i>
                <span>分享</span>
              </button>
              <button class="btn action-btn collect-btn" @click="collectArticle">
                <i class="icon-collect"></i>
                <span>{{ collected ? '已收藏' : '收藏' }}</span>
              </button>
              <button class="btn action-btn feedback-btn" @click="showFeedback = true">
                <i class="icon-feedback"></i>
                <span>反馈</span>
              </button>
            </div>
          </div>

          <!-- 附件列表 -->
          <div v-if="articleData?.attachments && articleData?.attachments.length > 0" class="attachments-section">
            <h3 class="section-title">附件下载</h3>
            <div class="attachments-list">
              <div
                v-for="(attachment, index) in articleData?.attachments"
                :key="index"
                class="attachment-item"
                @click="downloadAttachment(attachment)"
              >
                <div class="attachment-icon">
                  <i :class="getFileIcon(attachment.type)"></i>
                </div>
                <div class="attachment-info">
                  <div class="attachment-name">{{ attachment.name }}</div>
                  <div class="attachment-meta">
                    <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
                    <span class="attachment-downloads">{{ attachment.downloads }} 次下载</span>
                  </div>
                </div>
                <div class="attachment-action">
                  <button class="btn btn-primary download-btn">
                <i class="icon-download"></i>
                下载
              </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 作者信息 -->
          <div class="author-section">
            <div class="author-avatar">
              <img :src="articleData?.authorAvatar || 'https://picsum.photos/seed/author/100'" alt="作者头像" />
            </div>
            <div class="author-info">
              <div class="author-name">{{ articleData?.author }}</div>
              <div class="author-title">{{ articleData?.authorTitle }}</div>
              <div class="author-desc">{{ articleData?.authorBio }}</div>
              <button class="btn btn-primary follow-btn">关注作者</button>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comments-section">
            <h3 class="section-title">{{ articleData?.commentCount }} 条评论</h3>

            <!-- 评论输入框 -->
            <div class="comment-input">
              <div class="user-avatar">
                <img src="https://picsum.photos/seed/user/100" alt="用户头像" />
              </div>
              <div class="comment-form">
                <textarea
                  v-model="commentContent"
                  placeholder="写下您的评论..."
                  rows="4"
                ></textarea>
                <div class="comment-actions">
                  <div class="comment-options">
                    <button class="option-btn"><i class="icon-emoji"></i></button>
                    <button class="option-btn"><i class="icon-image"></i></button>
                  </div>
                  <button
                    class="btn btn-primary submit-comment-btn"
                    :disabled="!commentContent.trim()"
                    @click="submitComment"
                  >
                    发表评论
                  </button>
                </div>
              </div>
            </div>

            <!-- 评论列表 -->
            <div class="comments-list">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-avatar">
                  <img :src="comment.avatar" :alt="comment.username" />
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-username">{{ comment.username }}</span>
                    <span class="comment-time">{{ formatCommentTime(comment.time) }}</span>
                  </div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-actions">
                    <button class="comment-action-btn reply-btn" @click="replyToComment(comment)">
                      <i class="icon-reply"></i>
                      回复
                    </button>
                    <button class="comment-action-btn like-btn" @click="likeComment(comment.id)">
                      <i class="icon-like"></i>
                      {{ comment.liked ? '已点赞' : '点赞' }}
                      <span v-if="comment.likes > 0">({{ comment.likes }})</span>
                    </button>
                  </div>

                  <!-- 回复输入框 -->
                  <div v-if="replyingTo === comment.id" class="reply-input">
                    <textarea
                      v-model="replyContent"
                      placeholder="回复 @{{ comment.username }}..."
                      rows="2"
                    ></textarea>
                    <div class="reply-actions">
                      <button class="cancel-reply-btn" @click="cancelReply">取消</button>
                      <button
                        class="submit-reply-btn"
                        :disabled="!replyContent.trim()"
                        @click="submitReply(comment)"
                      >
                        回复
                      </button>
                    </div>
                  </div>

                  <!-- 子评论 -->
                  <div v-if="comment.replies && comment.replies.length > 0" class="sub-comments">
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="sub-comment"
                    >
                      <div class="sub-comment-content">
                        <span class="reply-username">{{ reply.username }}</span>
                        <span class="reply-to">回复</span>
                        <span class="reply-target">@{{ reply.replyTo }}</span>
                        <span class="reply-text">{{ reply.content }}</span>
                      </div>
                      <div class="sub-comment-footer">
                        <span class="reply-time">{{ formatCommentTime(reply.time) }}</span>
                        <button class="reply-action-btn" @click="replyToComment(comment, reply.username)">
                          <i class="icon-reply"></i>
                          回复
                        </button>
                      </div>
                    </div>
                    <button v-if="comment.replies.length > 3" class="show-more-replies">
                      查看更多回复 ({{ comment.replies.length - 3 }})
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 相关推荐 -->
          <div class="related-articles">
            <h3 class="sidebar-title">相关推荐</h3>
            <div class="related-list">
              <div
                v-for="article in relatedArticles"
                :key="article.id"
                class="related-item"
                @click="goToArticle(article.id)"
              >
                <div class="related-image">
                  <img :src="article.coverImage" :alt="article.title" />
                </div>
                <div class="related-info">
                  <div class="related-title">{{ article.title }}</div>
                  <div class="related-meta">
                    <span class="related-date">{{ formatShortDate(article.publishDate) }}</span>
                    <span class="related-views">{{ article.views }} 浏览</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门文章 -->
          <div class="popular-articles">
            <h3 class="sidebar-title">热门文章</h3>
            <div class="popular-list">
              <div
                v-for="(article, index) in popularArticles"
                :key="article.id"
                class="popular-item"
                @click="goToArticle(article.id)"
              >
                <div class="popular-rank">{{ index + 1 }}</div>
                <div class="popular-title">{{ article.title }}</div>
              </div>
            </div>
          </div>

          <!-- 热门标签 -->
          <div class="hot-tags">
            <h3 class="sidebar-title">热门标签</h3>
            <div class="tags-cloud">
              <span
                v-for="tag in hotTags"
                :key="tag.name"
                class="cloud-tag"
                @click="searchByTag(tag.name)"
                :style="{ fontSize: getTagSize(tag.count) }"
              >
                {{ tag.name }}
                <span class="tag-count">{{ tag.count }}</span>
              </span>
            </div>
          </div>

          <!-- 订阅通知 -->
          <div class="subscription">
            <div class="subscription-header">
              <h3 class="sidebar-title">订阅更新</h3>
              <p class="subscription-desc">第一时间获取最新资讯</p>
            </div>
            <div class="subscription-form">
              <input
                type="email"
                placeholder="请输入您的邮箱地址"
                v-model="email"
              />
              <button
                class="subscribe-btn"
                :disabled="!validateEmail(email)"
                @click="subscribe"
              >
                订阅
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 反馈弹窗 -->
    <div v-if="showFeedback" class="modal-overlay" @click="closeFeedback">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>内容反馈</h3>
          <button class="close-btn" @click="closeFeedback">×</button>
        </div>
        <div class="modal-body">
          <div class="feedback-type">
            <label class="feedback-option">
              <input type="radio" name="feedback-type" value="error" v-model="feedbackType" />
              <span>内容错误</span>
            </label>
            <label class="feedback-option">
              <input type="radio" name="feedback-type" value="inaccurate" v-model="feedbackType" />
              <span>信息不准确</span>
            </label>
            <label class="feedback-option">
              <input type="radio" name="feedback-type" value="spam" v-model="feedbackType" />
              <span>垃圾信息</span>
            </label>
            <label class="feedback-option">
              <input type="radio" name="feedback-type" value="other" v-model="feedbackType" />
              <span>其他问题</span>
            </label>
          </div>
          <textarea
            v-model="feedbackContent"
            placeholder="请详细描述您遇到的问题..."
            rows="4"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeFeedback">取消</button>
          <button
            class="submit-btn"
            :disabled="!feedbackType || !feedbackContent.trim()"
            @click="submitFeedback"
          >
            提交反馈
          </button>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseLayout from '@/components/layout/BaseLayout.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 状态管理
const articleData = ref(null)
const articleContent = ref('')
const comments = ref([])
const relatedArticles = ref([])
const popularArticles = ref([])
const hotTags = ref([])
const liked = ref(false)
const collected = ref(false)
const commentContent = ref('')
const replyContent = ref('')
const replyingTo = ref(null)
const showFeedback = ref(false)
const feedbackType = ref('')
const feedbackContent = ref('')
const email = ref('')

// 模拟文章数据
const mockArticleData = {
  id: 1,
  title: '2025年人工智能发展趋势预测',
  summary: '本文深入分析了2025年人工智能领域的发展方向和重点突破，包括大模型应用、多模态学习、自主智能体等前沿技术的发展前景。',
  coverImage: 'https://picsum.photos/id/1/1200/600',
  category: { id: 'ai', name: '人工智能' },
  author: '张明',
  authorAvatar: 'https://picsum.photos/seed/zhangming/200',
  authorTitle: 'AI研究员',
  authorBio: '从事人工智能研究工作10年，专注于大模型和多模态学习方向，发表论文30余篇。',
  publishDate: '2024-01-20T10:00:00Z',
  views: 1289,
  commentCount: 45,
  likes: 234,
  tags: ['人工智能', '趋势', '前沿技术', '大模型', '机器学习'],
  attachments: [
    { name: '2025年AI趋势报告.pdf', type: 'pdf', size: 2560000, downloads: 567 },
    { name: '行业案例分析.docx', type: 'docx', size: 1280000, downloads: 342 },
    { name: '数据图表.xlsx', type: 'xlsx', size: 890000, downloads: 289 }
  ],
  content: `
    <h2>引言</h2>
    <p>随着技术的不断进步，人工智能在过去几年取得了惊人的发展。从AlphaGo击败人类围棋世界冠军，到GPT系列大模型引发的生成式AI革命，人工智能正在深刻改变我们的生活和工作方式。</p>

    <h2>大模型应用的普及</h2>
    <p>2025年，大语言模型（LLM）将进一步普及到各行各业。企业级应用将更加成熟，主要体现在以下几个方面：</p>
    <ul>
      <li><strong>垂直领域专业化</strong>：针对金融、医疗、法律等特定行业优化的专业大模型将大幅提升行业效率。</li>
      <li><strong>多模态能力增强</strong>：结合文本、图像、音频、视频等多种模态的AI系统将成为主流。</li>
      <li><strong>轻量化部署</strong>：小型化、高效率的模型将使得AI能力可以在边缘设备上广泛部署。</li>
    </ul>

    <blockquote>
      "大模型不仅仅是一种技术工具，更是推动数字化转型的核心引擎。"
    </blockquote>

    <h2>自主智能体的崛起</h2>
    <p>自主智能体（Autonomous Agents）将成为2025年AI领域的重要突破。这些智能体能够：</p>
    <ul>
      <li>基于目标进行多步骤规划</li>
      <li>自主决策并执行复杂任务</li>
      <li>通过环境反馈持续学习和优化</li>
    </ul>

    <h2>AI伦理与监管</h2>
    <p>随着AI技术的广泛应用，伦理问题和监管框架将变得更加重要：</p>
    <ol>
      <li><strong>透明度要求</strong>：AI系统的决策过程需要更加透明，可解释AI技术将成为标准配置。</li>
      <li><strong>隐私保护</strong>：联邦学习、差分隐私等技术将在保护用户隐私的同时实现AI能力提升。</li>
      <li><strong>全球监管协调</strong>：各国将加强AI监管合作，形成更加统一的国际标准。</li>
    </ol>

    <h2>行业应用展望</h2>
    <h3>医疗健康</h3>
    <p>AI辅助诊断系统将在基层医疗机构广泛应用，提高疾病早期诊断率。个性化治疗方案制定将更加精准，药物研发周期大幅缩短。</p>

    <h3>金融服务</h3>
    <p>智能风控系统将有效降低金融风险，智能投顾服务将更加普及，数字货币和区块链技术与AI的结合将创造新的金融产品和服务。</p>

    <h3>智能制造</h3>
    <p>工业机器人与AI的深度融合将实现真正的柔性制造，预测性维护将大幅降低设备故障率，供应链优化将提高生产效率。</p>

    <h2>结论</h2>
    <p>2025年，人工智能将进入更加成熟、普及的发展阶段。技术创新与行业应用相互促进，伦理规范与监管框架逐步完善，人工智能将成为推动经济社会发展的重要力量。企业和个人都需要积极拥抱这一变革，把握AI带来的机遇。</p>
  `
}

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    username: '科技爱好者',
    avatar: 'https://picsum.photos/seed/user1/100',
    content: '非常有见地的分析！我特别赞同大模型在垂直领域的应用前景。',
    time: '2024-01-20T14:30:00Z',
    likes: 15,
    liked: false,
    replies: [
      {
        id: 11,
        username: 'AI研究者',
        avatar: 'https://picsum.photos/seed/user2/100',
        replyTo: '科技爱好者',
        content: '谢谢支持！垂直领域确实是大模型落地的重要方向。',
        time: '2024-01-20T15:00:00Z'
      }
    ]
  },
  {
    id: 2,
    username: '程序员小王',
    avatar: 'https://picsum.photos/seed/user3/100',
    content: '请问作者对AI伦理监管有什么具体的建议吗？感觉这方面还存在很多挑战。',
    time: '2024-01-20T16:20:00Z',
    likes: 8,
    liked: false,
    replies: []
  },
  {
    id: 3,
    username: '未来学家',
    avatar: 'https://picsum.photos/seed/user4/100',
    content: '自主智能体的发展可能比预期更快，需要关注其潜在的安全风险。',
    time: '2024-01-21T09:10:00Z',
    likes: 12,
    liked: false,
    replies: [
      {
        id: 31,
        username: '安全专家',
        avatar: 'https://picsum.photos/seed/user5/100',
        replyTo: '未来学家',
        content: '完全同意，安全护栏的建设应该与技术发展同步进行。',
        time: '2024-01-21T10:30:00Z'
      },
      {
        id: 32,
        username: '张明',
        avatar: 'https://picsum.photos/seed/zhangming/100',
        replyTo: '未来学家',
        content: '是的，我在文章中也提到了AI伦理与监管的重要性。',
        time: '2024-01-21T11:00:00Z'
      }
    ]
  }
]

// 模拟相关推荐数据
const mockRelatedArticles = [
  {
    id: 2,
    title: '大模型在医疗领域的创新应用',
    coverImage: 'https://picsum.photos/id/2/200/120',
    publishDate: '2024-01-15T08:00:00Z',
    views: 856
  },
  {
    id: 3,
    title: '自主智能体的安全挑战与解决方案',
    coverImage: 'https://picsum.photos/id/3/200/120',
    publishDate: '2024-01-18T14:00:00Z',
    views: 978
  },
  {
    id: 10,
    title: '自然语言处理技术最新进展',
    coverImage: 'https://picsum.photos/id/10/200/120',
    publishDate: '2023-12-30T10:00:00Z',
    views: 1123
  },
  {
    id: 4,
    title: '最新教育政策解读：对高校人才培养的影响',
    coverImage: 'https://picsum.photos/id/4/200/120',
    publishDate: '2024-01-12T16:00:00Z',
    views: 1567
  }
]

// 模拟热门文章数据
const mockPopularArticles = [
  {
    id: 6,
    title: '校园文化艺术节活动预告'
  },
  {
    id: 7,
    title: '2024年春季学期选课指南'
  },
  {
    id: 4,
    title: '最新教育政策解读：对高校人才培养的影响'
  },
  {
    id: 8,
    title: '知名企业校园招聘会信息'
  },
  {
    id: 1,
    title: '2025年人工智能发展趋势预测'
  }
]

// 模拟热门标签数据
const mockHotTags = [
  { name: '人工智能', count: 156 },
  { name: '教育改革', count: 142 },
  { name: '校园活动', count: 128 },
  { name: '就业信息', count: 115 },
  { name: '前沿技术', count: 109 },
  { name: '创业指导', count: 98 },
  { name: '政策解读', count: 87 },
  { name: '学术研究', count: 76 }
]

// 方法
const loadArticleData = async () => {
  // 在实际应用中，这里应该是API调用
  const articleId = route.params.id || 1

  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 设置文章数据
  articleData.value = { ...mockArticleData, id: parseInt(articleId) }
  articleContent.value = mockArticleData.content

  // 设置评论数据
  comments.value = [...mockComments]

  // 设置相关推荐
  relatedArticles.value = [...mockRelatedArticles]

  // 设置热门文章
  popularArticles.value = [...mockPopularArticles]

  // 设置热门标签
  hotTags.value = [...mockHotTags]
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 格式化短日期
const formatShortDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化评论时间
const formatCommentTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 30) return `${diffDays}天前`
  return formatShortDate(dateString)
}

// 获取文件图标
const getFileIcon = (fileType) => {
  const iconMap = {
    pdf: 'icon-pdf',
    docx: 'icon-word',
    xlsx: 'icon-excel',
    pptx: 'icon-ppt',
    zip: 'icon-zip',
    jpg: 'icon-image',
    png: 'icon-image',
    mp4: 'icon-video',
    mp3: 'icon-audio'
  }
  return iconMap[fileType] || 'icon-file'
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取标签大小
const getTagSize = (count) => {
  const minSize = 12
  const maxSize = 18
  const minCount = Math.min(...mockHotTags.map(tag => tag.count))
  const maxCount = Math.max(...mockHotTags.map(tag => tag.count))
  const size = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize)
  return `${size}px`
}

// 点赞文章
const likeArticle = () => {
  liked.value = !liked.value
  if (liked.value) {
    articleData.value.likes += 1
  } else {
    articleData.value.likes -= 1
  }
}

// 收藏文章
const collectArticle = () => {
  collected.value = !collected.value
}

// 分享文章
const shareArticle = () => {
  alert('分享功能已触发！')
}

// 下载附件
const downloadAttachment = (attachment) => {
  alert(`开始下载：${attachment.name}`)
  attachment.downloads += 1
}

// 提交评论
const submitComment = () => {
  if (!commentContent.value.trim()) return

  const newComment = {
    id: comments.value.length + 1,
    username: '当前用户',
    avatar: 'https://picsum.photos/seed/currentuser/100',
    content: commentContent.value.trim(),
    time: new Date().toISOString(),
    likes: 0,
    liked: false,
    replies: []
  }

  comments.value.unshift(newComment)
  commentContent.value = ''
  articleData.value.commentCount += 1
}

// 回复评论
const replyToComment = (comment, replyTo = null) => {
  replyingTo.value = comment.id
  if (replyTo) {
    replyContent.value = `@${replyTo} `
  } else {
    replyContent.value = `@${comment.username} `
  }
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = (comment) => {
  if (!replyContent.value.trim()) return

  const newReply = {
    id: Date.now(),
    username: '当前用户',
    avatar: 'https://picsum.photos/seed/currentuser/100',
    replyTo: comment.username,
    content: replyContent.value.replace(`@${comment.username} `, '').trim(),
    time: new Date().toISOString()
  }

  comment.replies.push(newReply)
  replyingTo.value = null
  replyContent.value = ''
  articleData.value.commentCount += 1
}

// 点赞评论
const likeComment = (commentId) => {
  const findAndToggleLike = (commentList) => {
    for (const comment of commentList) {
      if (comment.id === commentId) {
        comment.liked = !comment.liked
        if (comment.liked) {
          comment.likes += 1
        } else {
          comment.likes -= 1
        }
        return true
      }
      if (comment.replies && comment.replies.length > 0) {
        if (findAndToggleLike(comment.replies)) return true
      }
    }
    return false
  }

  findAndToggleLike(comments.value)
}

// 跳转到文章
const goToArticle = (articleId) => {
  router.push(`/article/${articleId}`)
}

// 按标签搜索
const searchByTag = (tag) => {
  router.push(`/search?keyword=${encodeURIComponent(tag)}&type=tag`)
}

// 关闭反馈弹窗
const closeFeedback = () => {
  showFeedback.value = false
  feedbackType.value = ''
  feedbackContent.value = ''
}

// 提交反馈
const submitFeedback = () => {
  if (!feedbackType.value || !feedbackContent.value.trim()) return

  alert('感谢您的反馈！')
  closeFeedback()
}

// 订阅
const subscribe = () => {
  if (!validateEmail(email.value)) return

  alert(`订阅成功！我们将向 ${email.value} 发送最新资讯。`)
  email.value = ''
}

// 验证邮箱
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// 监听路由变化
watch(() => route.params.id, () => {
  loadArticleData()
})

// 组件挂载
onMounted(() => {
  loadArticleData()
})
</script>

<style scoped>
.article-detail {
  width: 100%;
}

/* 页面标题栏 */
.page-header {
  background-color: white;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
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

.breadcrumb span:last-child {
  color: var(--color-text);
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 主内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  padding: 32px 0 60px;
}

/* 内容区域 */
.content-area {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 文章头部 */
.article-header {
  margin-bottom: 32px;
}

.article-title {
  margin: 0 0 24px 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.3;
  letter-spacing: -0.5px;
}

/* 文章元信息 */
.article-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.meta-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-info a {
  color: var(--color-primary);
  text-decoration: none;
}

.meta-info a:hover {
  text-decoration: underline;
}

/* 文章标签 */
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.tag:hover {
  background-color: white;
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

/* 文章封面图 */
.article-cover {
  margin-bottom: 32px;
  overflow: hidden;
  border-radius: 12px;
}

.article-cover img {
  width: 100%;
  height: auto;
  transition: transform 0.5s ease;
}

.article-cover:hover img {
  transform: scale(1.02);
}

/* 文章摘要 */
.article-summary {
  margin-bottom: 32px;
  padding: 20px;
  background-color: var(--color-background-alt);
  border-radius: 8px;
  border-left: 4px solid var(--color-primary);
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.summary-content {
  margin: 0;
  color: var(--color-text);
  line-height: 1.6;
  font-size: 15px;
}

/* 文章内容 */
.article-content {
  margin-bottom: 40px;
}

.content-section {
  color: var(--color-text);
  line-height: 1.8;
  font-size: 16px;
}

/* 内容样式 */
.content-section h2 {
  margin: 40px 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-heading);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-primary);
}

.content-section h3 {
  margin: 32px 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-heading);
}

.content-section p {
  margin: 16px 0;
  text-align: justify;
}

.content-section ul,
.content-section ol {
  margin: 16px 0;
  padding-left: 24px;
}

.content-section li {
  margin: 8px 0;
}

.content-section blockquote {
  margin: 24px 0;
  padding: 16px 24px;
  background-color: var(--color-background-alt);
  border-left: 4px solid var(--color-primary);
  font-style: italic;
}

.content-section img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
}

/* 文章操作区 */
.article-actions {
  margin-bottom: 32px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: var(--color-background-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.action-btn:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 附件列表 */
.attachments-section {
  margin-bottom: 32px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-heading);
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-background-alt);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
}

.attachment-item:hover {
  background-color: white;
  border-color: var(--color-primary);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
}

.attachment-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-light);
  border-radius: 8px;
  font-size: 24px;
  color: var(--color-primary);
}

.attachment-info {
  flex: 1;
}

.attachment-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-heading);
  margin-bottom: 4px;
}

.attachment-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.attachment-action .download-btn {
  padding: 6px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.attachment-action .download-btn:hover {
  background-color: var(--color-secondary);
  transform: translateY(-1px);
}

/* 作者信息 */
.author-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: var(--color-background-alt);
  border-radius: 12px;
  margin-bottom: 40px;
  border: 1px solid var(--color-border);
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 4px;
}

.author-title {
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.author-desc {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 12px;
}

.follow-btn {
  padding: 8px 24px;
  background-color: white;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.follow-btn:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 评论区 */
.comments-section {
  margin-top: 40px;
}

/* 评论输入框 */
.comment-input {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background-color: var(--color-background-alt);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.user-avatar,
.comment-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img,
.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-form {
  flex: 1;
}

.comment-form textarea,
.reply-input textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
}

.comment-form textarea:focus,
.reply-input textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.comment-options {
  display: flex;
  gap: 12px;
}

.option-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s ease;
}

.option-btn:hover {
  color: var(--color-primary);
}

.submit-comment-btn {
  padding: 8px 24px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.submit-comment-btn:hover:not(:disabled) {
  background-color: var(--color-secondary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.submit-comment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 侧边栏 */
.sidebar {
  position: sticky;
  top: 104px;
  height: fit-content;
}

.sidebar > div {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-heading);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-primary);
}

/* 相关推荐 */
.related-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.related-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.related-item:hover {
  background-color: var(--color-background-alt);
  transform: translateX(4px);
}

.related-image {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info {
  flex: 1;
  min-width: 0;
}

.related-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-heading);
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr 280px;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .content-area {
    padding: 24px;
  }

  .article-title {
    font-size: 24px;
  }
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(126, 34, 206, 0.3);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(126, 34, 206, 0.2);
}

/* 阅读进度指示器 */
.reading-progress {
  position: fixed;
  top: 64px;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  z-index: 1000;
  width: 0%;
  transition: width 0.1s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-detail {
    padding: 20px;
  }

  .article-header {
    margin-bottom: 32px;
    padding-bottom: 20px;
  }

  .article-header h1 {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .article-meta {
    gap: 16px;
    font-size: 13px;
  }

  .article-content {
    font-size: 16px;
    margin-bottom: 32px;
  }

  .article-content p {
    margin-bottom: 20px;
  }

  .btn {
    padding: 11px 20px;
    font-size: 15px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .article-detail {
    padding: 16px;
  }

  .article-header h1 {
    font-size: 24px;
  }

  .article-meta {
    flex-direction: column;
    gap: 12px;
  }

  .article-meta span {
    font-size: 14px;
  }

  .article-content {
    font-size: 15px;
  }

  .reading-progress {
    top: 0;
  }
}

/* 打印样式 */
@media print {
  .article-actions,
  .reading-progress {
    display: none;
  }

  .article-detail {
    padding: 0;
    max-width: 100%;
  }

  .article-header {
    border-bottom: 1px solid #000;
  }

  .article-header::after {
    background: #000;
  }
}
</style>
