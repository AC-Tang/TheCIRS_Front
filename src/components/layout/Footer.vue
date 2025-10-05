<template>
  <footer class="app-footer">
    <div class="footer-content">
      <!-- 顶部部分 -->
      <div class="footer-top">
        <div class="footer-brand">
          <div class="logo">
            <span class="logo-icon">📚</span>
            <span class="logo-text">学院信息发布系统</span>
          </div>
          <p class="brand-description">提供及时、准确的学院新闻资讯与学术信息服务</p>
          <div class="social-links">
            <a href="#" class="social-link"><i class="icon">📱</i> 微信公众号</a>
            <a href="#" class="social-link"><i class="icon">📧</i> 电子邮箱</a>
            <a href="#" class="social-link"><i class="icon">🏢</i> 学院官网</a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="footer-links">
          <h3 class="link-title">快速链接</h3>
          <ul class="link-list">
            <li><router-link to="/front">首页</router-link></li>
            <li><router-link to="/category/list">文章分类</router-link></li>
            <li><router-link to="/front/search">搜索</router-link></li>
            <li><a href="#">关于我们</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>

        <!-- 服务支持 -->
        <div class="footer-links">
          <h3 class="link-title">服务支持</h3>
          <ul class="link-list">
            <li><a href="#">帮助中心</a></li>
            <li><a href="#">常见问题</a></li>
            <li><a href="#">使用指南</a></li>
            <li><a href="#">隐私政策</a></li>
            <li><a href="#">服务条款</a></li>
          </ul>
        </div>

        <!-- 联系我们 -->
        <div class="footer-contact">
          <h3 class="link-title">联系我们</h3>
          <ul class="contact-list">
            <li>
              <i class="icon">📍</i>
              <span>北京市海淀区学院路123号</span>
            </li>
            <li>
              <i class="icon">📞</i>
              <span>010-12345678</span>
            </li>
            <li>
              <i class="icon">✉️</i>
              <span>contact@school.edu.cn</span>
            </li>
            <li>
              <i class="icon">⏰</i>
              <span>工作日 8:00-17:30</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="copyright">© 2024 学院网站信息发布系统 版权所有</div>
        <div class="footer-nav">
          <a href="#">隐私政策</a>
          <span>|</span>
          <a href="#">服务条款</a>
          <span>|</span>
          <a href="#">网站地图</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
</script>

<style scoped>
.app-footer {
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 40px 0 20px;
  color: var(--color-text-secondary);
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.footer-brand .logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 28px;
}

.brand-description {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: var(--color-text-secondary);
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--color-primary);
}

.social-link .icon {
  font-size: 16px;
}

.footer-links .link-title {
  color: var(--color-heading);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  position: relative;
  padding-bottom: 8px;
}

.footer-links .link-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: var(--color-primary);
}

.link-list {
  list-style: none;
}

.link-list li {
  margin-bottom: 12px;
}

.link-list a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.link-list a:hover {
  color: var(--color-primary);
  padding-left: 4px;
}

.footer-contact .link-title {
  color: var(--color-heading);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  position: relative;
  padding-bottom: 8px;
}

.footer-contact .link-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: var(--color-primary);
}

.contact-list {
  list-style: none;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
}

.contact-list .icon {
  font-size: 16px;
  color: var(--color-primary);
  margin-top: 2px;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
}

.copyright {
  font-size: 14px;
  color: var(--color-text-light);
  text-align: center;
}

.footer-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
}

.footer-nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-nav a:hover {
  color: var(--color-primary);
}

.footer-nav span {
  color: var(--color-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-brand {
    text-align: center;
  }

  .footer-brand .logo {
    justify-content: center;
    margin-bottom: 12px;
  }

  .social-links {
    align-items: center;
  }

  .footer-links,
  .footer-contact {
    text-align: center;
  }

  .footer-links .link-title::after,
  .footer-contact .link-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-bottom {
    text-align: center;
  }

  .footer-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 30px 0 15px;
  }

  .footer-content {
    padding: 0 16px;
  }

  .contact-list li {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }

  .footer-nav {
    gap: 12px;
  }

  .footer-nav span {
    display: none;
  }
}
</style>
