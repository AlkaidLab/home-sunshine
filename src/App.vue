<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { translations } from './i18n.js'

// 语言状态管理
const currentLang = ref(localStorage.getItem('language') || 'zh')

// 主题状态管理 - gura(蓝色科技) 或 chocolate(巧克力深色)
const currentTheme = ref(localStorage.getItem('theme') || 'gura')

// 切换语言
const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('language', currentLang.value)
  document.documentElement.lang = currentLang.value === 'zh' ? 'zh-CN' : 'en'
  updatePageTitle()
}

// 切换主题
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'gura' ? 'chocolate' : 'gura'
  localStorage.setItem('theme', currentTheme.value)
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}

// 监听主题变化
watch(currentTheme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
})

// 主题图标
const themeIcon = computed(() => {
  return currentTheme.value === 'gura' ? '🌊' : '🍫'
})

// 主题名称
const themeName = computed(() => {
  if (currentLang.value === 'zh') {
    return currentTheme.value === 'gura' ? 'Gura 蓝' : '巧克力'
  }
  return currentTheme.value === 'gura' ? 'Gura Blue' : 'Chocolate'
})

// 更新页面标题
const updatePageTitle = () => {
  document.title = currentLang.value === 'zh' ? '摇光流梦 - 让游戏串流更优雅' : 'SDream - Make Game Streaming Greater'
}

// 当前语言的翻译内容
const t = computed(() => translations[currentLang.value])

// Star History 图表状态
const starHistoryLoaded = ref(false)
const starHistoryError = ref(false)

// 版本信息状态
const versionInfo = ref({
  current: null,
  latest: null,
  preRelease: null,
  loading: true,
  error: null,
})

// 检查最新版本
const checkLatestVersion = async () => {
  try {
    versionInfo.value.loading = true
    versionInfo.value.error = null

    // 获取最新稳定版
    const latestResponse = await fetch('https://api.github.com/repos/qiin2333/Sunshine/releases/latest')
    const latestRelease = await latestResponse.json()

    // 获取所有发布版本
    const allReleasesResponse = await fetch('https://api.github.com/repos/qiin2333/Sunshine/releases')
    const allReleases = await allReleasesResponse.json()

    // 查找预发布版本
    const preRelease = allReleases.find((release) => release.prerelease)

    versionInfo.value.latest = {
      version: latestRelease.tag_name,
      downloadUrl: latestRelease.assets.find((asset) => asset.name.includes('sunshine-windows-installer.exe'))
        ?.browser_download_url,
      releaseUrl: latestRelease.html_url,
      body: latestRelease.body,
    }

    if (preRelease) {
      versionInfo.value.preRelease = {
        version: preRelease.tag_name,
        downloadUrl: preRelease.assets.find((asset) => asset.name.includes('sunshine-windows-installer.exe'))
          ?.browser_download_url,
        releaseUrl: preRelease.html_url,
        body: preRelease.body,
      }
    }

    // 更新下载链接
    if (versionInfo.value.latest.downloadUrl) {
      downloadLinks.value.latest = versionInfo.value.latest.downloadUrl
      downloadLinks.value.windows = versionInfo.value.latest.downloadUrl
      downloadLinks.value.mirror = `https://ghfast.top/${versionInfo.value.latest.downloadUrl}`
    }
  } catch (error) {
    console.error('版本检查失败:', error)
    versionInfo.value.error = error.message
    // 使用默认下载地址
    downloadLinks.value.windows = 'https://vip.123pan.cn/1813496318/26878949'
    downloadLinks.value.mirror = 'https://vip.123pan.cn/1813496318/26878949'
  } finally {
    versionInfo.value.loading = false
  }
}

onMounted(() => {
  // 设置初始主题
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  
  // 设置初始语言
  document.documentElement.lang = currentLang.value === 'zh' ? 'zh-CN' : 'en'
  updatePageTitle()

  // 预加载 Star History 图表
  const img = new Image()
  img.onload = () => {
    starHistoryLoaded.value = true
  }
  img.onerror = () => {
    starHistoryError.value = true
  }
  img.src = 'https://api.star-history.com/svg?repos=qiin2333/Sunshine-Foundation&type=Date&width=800&height=400'

  // 检查最新版本
  checkLatestVersion()

  // 设置特性区域的滚动动画
  setTimeout(() => {
    setupFeatureAnimations()
  }, 100)
})

// 设置特性滚动动画
const setupFeatureAnimations = () => {
  const featureSections = document.querySelectorAll('.feature-section')
  
  // 第一个特性立即触发动画
  if (featureSections[0]) {
    setTimeout(() => {
      featureSections[0].classList.add('is-visible')
    }, 300)
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px',
    }
  )

  // 从第二个特性开始观察
  for (let i = 1; i < featureSections.length; i++) {
    observer.observe(featureSections[i])
  }
}

// 下载链接
const downloadLinks = ref({
  windows: 'https://ghfast.top/https://github.com/qiin2333/Sunshine/releases/download/foundation/sunshine-windows-installer.exe',
  github: 'https://github.com/qiin2333/Sunshine-Foundation/releases/',
  mirror: 'https://ghfast.top/https://github.com/qiin2333/Sunshine/releases/download/foundation/sunshine-windows-installer.exe',
  latest: null,
})

// 客户端推荐
const clients = [
  {
    name: 'Moonlight-PC',
    platform: 'Windows/macOS/Linux',
    link: 'https://github.com/qiin2333/moonlight-qt',
  },
  {
    name: 'VPLUS Moonlight-Android',
    platform: 'Android',
    link: 'https://github.com/qiin2333/moonlight-vplus',
  },
  {
    name: '王冠版 Moonlight-Android',
    platform: 'Android',
    link: 'https://github.com/WACrown/moonlight-android',
  },
  {
    name: 'VoidLink (Moonlight-iOS)',
    platform: 'iOS',
    link: 'https://apps.apple.com/cn/app/voidlink/id6747717070',
  },
]
</script>

<template>
  <div class="website" :data-theme="currentTheme">
    <!-- 科技感背景装饰 -->
    <div class="tech-background">
      <div class="tech-grid"></div>
      <div class="tech-glow tech-glow-1"></div>
      <div class="tech-glow tech-glow-2"></div>
      <div class="tech-glow tech-glow-3"></div>
    </div>

    <!-- 头部导航 -->
    <header class="header">
      <div class="container">
        <div class="nav">
          <div class="logo">
            <div class="logo-icon">☀️</div>
            <h1>{{ t.title }}</h1>
          </div>
          <nav class="nav-links">
            <a href="#features">{{ t.nav.features }}</a>
            <a href="#download">{{ t.nav.download }}</a>
            <a href="#clients">{{ t.nav.clients }}</a>
            <a href="#stats">{{ t.nav.stats }}</a>
            <a href="#docs">{{ t.nav.docs }}</a>
            <div class="nav-controls">
              <button @click="toggleTheme" class="theme-toggle" :title="themeName">
                <span class="theme-icon">{{ themeIcon }}</span>
              </button>
              <button @click="toggleLanguage" class="lang-toggle">
                {{ currentLang === 'zh' ? 'EN' : '中文' }}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主横幅 -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-particles"></div>
        <div class="hero-lines"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Game Streaming Platform</span>
          </div>
          <h1 class="hero-title">
            <span class="title-main">{{ t.tagline }}</span>
          </h1>
          <p class="hero-subtitle">{{ t.subtitle }}</p>
          <div class="hero-actions">
            <a :href="downloadLinks.windows" class="btn btn-primary">
              <span class="btn-text">{{ t.hero.download }}</span>
            </a>
            <a :href="downloadLinks.github" class="btn btn-ghost">
              <span class="btn-text">{{ t.hero.github }}</span>
            </a>
            <a :href="downloadLinks.mirror" class="btn btn-ghost">
              <span class="btn-text">{{ t.hero.mirror }}</span>
            </a>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-text">Low Latency</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-text">HDR Support</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-text">Virtual Display</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心特性 -->
    <section id="features" class="features">
      <div class="features-container">
        <div v-for="(feature, index) in t.features.items" :key="feature.title" class="feature-section" :data-index="index">
          <div class="feature-content">
            <div class="feature-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="feature-main">
              <h2 class="feature-headline">{{ feature.title }}</h2>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
          <div class="feature-visual">
            <div class="feature-glow-effect"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 下载区域 -->
    <section id="download" class="download">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.download.title }}</h2>
          <div class="section-line"></div>
        </div>

        <!-- 版本信息 -->
        <div class="version-info" v-if="versionInfo.latest">
          <div class="version-badge">
            <span class="version-pulse"></span>
            <span class="version-label">{{ t.download.latestVersion }}</span>
            <span class="version-number">{{ versionInfo.latest.version }}</span>
          </div>
          <div class="version-actions">
            <button @click="checkLatestVersion" class="btn-refresh" :disabled="versionInfo.loading">
              {{ t.download.checkUpdate }}
            </button>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="versionInfo.loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ t.download.checking }}</p>
        </div>

        <!-- 错误状态 -->
        <div v-if="versionInfo.error" class="error-state">
          <p>{{ t.download.error }}</p>
          <button @click="checkLatestVersion" class="btn btn-secondary">{{ t.download.retry }}</button>
        </div>

        <div class="download-content">
          <div class="download-info">
            <h3>{{ t.download.requirements }}</h3>
            <ul class="requirements-list">
              <li v-for="(req, index) in t.download.requirementsList" :key="index" v-html="req"></li>
            </ul>
          </div>
          <div class="download-actions">
            <a :href="downloadLinks.windows" class="download-btn primary">
              <span class="download-text">
                <strong>{{ t.download.windowsLatest }}</strong>
                <small v-if="versionInfo.latest">{{ versionInfo.latest.version }}</small>
                <small v-else>{{ t.download.recommended }}</small>
              </span>
              <span class="download-arrow">→</span>
            </a>
            <a :href="downloadLinks.github" class="download-btn">
              <span class="download-text">
                <strong>{{ t.download.allVersions }}</strong>
                <small>{{ t.download.githubReleases }}</small>
              </span>
              <span class="download-arrow">→</span>
            </a>
            <a :href="downloadLinks.mirror" class="download-btn">
              <span class="download-text">
                <strong>{{ t.download.mirrorDownload }}</strong>
                <small>{{ t.download.domesticSpeed }}</small>
              </span>
              <span class="download-arrow">→</span>
            </a>
          </div>
        </div>

        <!-- 预发布版本提示 -->
        <div v-if="versionInfo.preRelease" class="prerelease-alert">
          <div class="alert-content">
            <h4>{{ t.download.prerelease }}</h4>
            <p>
              {{ t.download.prereleaseFound }}
              <strong>{{ versionInfo.preRelease.version }}</strong>
            </p>
          </div>
          <a :href="versionInfo.preRelease.releaseUrl" class="btn btn-warning" target="_blank">{{ t.download.viewPrerelease }}</a>
        </div>
      </div>
    </section>

    <!-- 推荐客户端 -->
    <section id="clients" class="clients">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.clients.title }}</h2>
          <p class="section-subtitle">{{ t.clients.subtitle }}</p>
          <div class="section-line"></div>
        </div>
        <div class="clients-grid">
          <div v-for="client in clients" :key="client.name" class="client-card">
            <div class="client-info">
              <h3 class="client-name">{{ client.name }}</h3>
              <p class="client-platform">{{ client.platform }}</p>
            </div>
            <a :href="client.link" class="client-link" target="_blank" rel="noopener">
              {{ t.clients.downloadBtn }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Star History -->
    <section id="stats" class="stats">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.stats.title }}</h2>
          <p class="section-subtitle">{{ t.stats.subtitle }}</p>
          <div class="section-line"></div>
        </div>
        <div class="star-history-container">
          <div v-if="!starHistoryLoaded && !starHistoryError" class="loading-state">
            <div class="loading-spinner"></div>
            <p>{{ t.stats.loading }}</p>
          </div>
          <div v-else-if="starHistoryError" class="error-state">
            <p>{{ t.stats.error }}</p>
            <a href="https://star-history.com/#qiin2333/Sunshine-Foundation&Date" target="_blank" class="btn btn-secondary">
              {{ t.stats.viewManually }}
            </a>
          </div>
          <img
            v-else
            src="https://api.star-history.com/svg?repos=qiin2333/Sunshine-Foundation&type=Date&width=800&height=400"
            :alt="`${t.title} Star History`"
            class="star-history-chart"
            loading="lazy"
          />
        </div>
        <div class="stats-actions">
          <a href="https://github.com/qiin2333/Sunshine-Foundation" class="btn btn-primary" target="_blank">
            {{ t.stats.giveStar }}
          </a>
          <a href="https://star-history.com/#qiin2333/Sunshine-Foundation&Date" class="btn btn-secondary" target="_blank">
            {{ t.stats.viewStats }}
          </a>
        </div>
      </div>
    </section>

    <!-- 文档链接 -->
    <section id="docs" class="docs">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.docs.title }}</h2>
          <div class="section-line"></div>
        </div>
        <div class="docs-grid">
          <a
            href="https://docs.qq.com/aio/DSGdQc3htbFJjSFdO?p=YTpMj5JNNdB5hEKJhhqlSB"
            class="doc-card"
            target="_blank"
          >
            <h3>{{ t.docs.userGuide }}</h3>
            <p>{{ t.docs.userGuideDesc }}</p>
          </a>
          <a href="https://docs.lizardbyte.dev/projects/sunshine/latest/" class="doc-card" target="_blank">
            <h3>{{ t.docs.officialDocs }}</h3>
            <p>{{ t.docs.officialDocsDesc }}</p>
          </a>
          <a
            href="https://qm.qq.com/cgi-bin/qm/qr?k=5qnkzSaLIrIaU4FvumftZH_6Hg7fUuLD&jump_from=webapi"
            class="doc-card"
            target="_blank"
          >
            <h3>{{ t.docs.qqGroup }}</h3>
            <p>{{ t.docs.qqGroupDesc }}</p>
          </a>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section footer-brand">
            <div class="footer-logo">
              <h4>{{ t.footer.title }}</h4>
            </div>
            <p>{{ t.footer.subtitle }}</p>
          </div>
          <div class="footer-section">
            <h4>{{ t.footer.links }}</h4>
            <ul>
              <li><a href="https://github.com/qiin2333/Sunshine" target="_blank">GitHub</a></li>
              <li><a href="https://github.com/LizardByte/awesome-sunshine" target="_blank">awesome-sunshine</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>{{ t.footer.copyright }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="less" scoped>
@import './styles/variables.less';
@import './styles/mixins.less';

// ============================================
// 基础样式
// ============================================

.website {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--background-primary);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.container {
  .container();
}

// ============================================
// 科技感背景
// ============================================

.tech-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.tech-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(var(--tech-grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--tech-grid-color) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.5;
}

.tech-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: pulse-glow 8s ease-in-out infinite;

  &.tech-glow-1 {
    width: 600px;
    height: 600px;
    background: var(--primary-color);
    top: -200px;
    right: -200px;
    animation-delay: 0s;
  }

  &.tech-glow-2 {
    width: 400px;
    height: 400px;
    background: var(--accent-color);
    bottom: 20%;
    left: -100px;
    animation-delay: 2s;
  }

  &.tech-glow-3 {
    width: 500px;
    height: 500px;
    background: var(--accent-secondary);
    top: 50%;
    right: 10%;
    animation-delay: 4s;
    opacity: 0.2;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}

// ============================================
// 头部导航
// ============================================

.header {
  background: rgba(var(--background-primary), 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav {
  .flex-between();
  padding: @spacing-sm 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: @spacing-sm;

  .logo-icon {
    font-size: @font-size-3xl;
    filter: drop-shadow(0 0 10px var(--primary-color));
  }

  h1 {
    margin: 0;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: @font-size-xl;
    font-weight: @font-weight-bold;
  }
}

.nav-links {
  display: flex;
  gap: @spacing-lg;
  align-items: center;

  a {
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: @font-weight-medium;
    transition: all 0.3s ease;
    position: relative;
    padding: @spacing-xs 0;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--gradient-primary);
      transition: width 0.3s ease;
    }

    &:hover {
      color: var(--primary-color);

      &::after {
        width: 100%;
      }
    }
  }
}

.nav-controls {
  display: flex;
  gap: @spacing-sm;
  align-items: center;
}

.theme-toggle {
  background: var(--background-secondary);
  border: 2px solid var(--border-color);
  border-radius: @border-radius-full;
  width: 44px;
  height: 44px;
  .flex-center();
  cursor: pointer;
  transition: all 0.3s ease;

  .theme-icon {
    font-size: @font-size-xl;
  }

  &:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-glow-subtle);
    transform: rotate(15deg);
  }
}

.lang-toggle {
  background: var(--gradient-primary);
  color: var(--text-inverse);
  border: none;
  padding: @spacing-xs @spacing-md;
  border-radius: @border-radius-full;
  font-weight: @font-weight-semibold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: @font-size-sm;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
  }
}

// ============================================
// 主横幅
// ============================================

.hero {
  position: relative;
  padding: @spacing-3xl 0;
  background: var(--background-hero);
  overflow: hidden;
  min-height: 80vh;
  .flex-center();
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;

  .hero-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(var(--tech-dot-color) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.5;
  }

  .hero-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 49%, var(--tech-line-color) 50%, transparent 51%),
      linear-gradient(transparent 49%, var(--tech-line-color) 50%, transparent 51%);
    background-size: 100px 100px;
    opacity: 0.3;
  }
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: @spacing-sm;
  background: rgba(var(--primary-color), 0.1);
  border: 1px solid var(--primary-color);
  padding: @spacing-xs @spacing-md;
  border-radius: @border-radius-full;
  margin-bottom: @spacing-lg;
  color: var(--primary-color);
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;

  .badge-dot {
    width: 8px;
    height: 8px;
    background: var(--primary-color);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.hero-title {
  font-size: @font-size-6xl;
  margin-bottom: @spacing-md;
  font-weight: @font-weight-extrabold;
  line-height: 1.1;

  .title-main {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
  }
}

.hero-subtitle {
  font-size: @font-size-lg;
  margin-bottom: @spacing-xl;
  color: var(--text-secondary);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
}

.hero-actions {
  .flex-center();
  gap: @spacing-md;
  flex-wrap: wrap;
  margin-bottom: @spacing-xl;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: @spacing-sm;
  padding: 14px 28px;
  border-radius: @border-radius-md;
  text-decoration: none;
  font-weight: @font-weight-semibold;
  font-size: @font-size-base;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &.btn-primary {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    box-shadow: var(--shadow-glow-subtle);

    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-glow);
    }
  }

  &.btn-secondary {
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);

    &:hover {
      background: var(--primary-color);
      color: var(--text-inverse);
    }
  }

  &.btn-ghost {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }

  &.btn-warning {
    background: var(--gradient-accent);
    color: var(--text-inverse);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow);
    }
  }
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: @spacing-lg;
  flex-wrap: wrap;

  .stat-item {
    display: flex;
    align-items: center;
    gap: @spacing-xs;
    color: var(--text-secondary);
    font-size: @font-size-sm;
  }

  .stat-divider {
    width: 1px;
    height: 20px;
    background: var(--border-color);
  }
}

// ============================================
// 通用区块样式
// ============================================

.section-header {
  text-align: center;
  margin-bottom: @spacing-xl;
}

.section-title {
  font-size: @font-size-4xl;
  margin-bottom: @spacing-sm;
  color: var(--text-primary);
  font-weight: @font-weight-bold;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: @font-size-lg;
  margin-bottom: @spacing-md;
}

.section-line {
  width: 80px;
  height: 4px;
  background: var(--gradient-primary);
  margin: 0 auto;
  border-radius: @border-radius-full;
}

// ============================================
// 特性区域 - ZeroTier 风格大标题动画
// ============================================

.features {
  padding: 0;
  background: var(--background-primary);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.features-container {
  display: flex;
  flex-direction: column;
}

.feature-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: @spacing-3xl 0;
  overflow: hidden;

  &:nth-child(even) {
    background: var(--background-secondary);
  }

  &:nth-child(odd) {
    background: var(--background-primary);
  }
}

.feature-content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 @spacing-md;
  display: flex;
  align-items: center;
  gap: @spacing-3xl;
  position: relative;
  z-index: 2;

  @media (max-width: @breakpoint-lg) {
    flex-direction: column;
    gap: @spacing-xl;
    text-align: center;
  }

  @media (max-width: @breakpoint-md) {
    padding: 0 @spacing-sm;
    gap: @spacing-lg;
  }
}

.feature-section {
  .feature-number,
  .feature-headline,
  .feature-description {
    opacity: 0;
  }

  &.is-visible {
    .feature-number {
      animation: fadeInScale 0.8s ease forwards;
      animation-delay: 0.2s;
    }

    .feature-headline {
      animation: slideUpFadeIn 1s ease forwards;
      animation-delay: 0.3s;
    }

    .feature-description {
      animation: slideUpFadeIn 1s ease forwards;
      animation-delay: 0.5s;
    }
  }
}

.feature-number {
  font-size: @font-size-6xl;
  font-weight: @font-weight-extrabold;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  opacity: 0.3;
  flex-shrink: 0;

  @media (max-width: @breakpoint-lg) {
    font-size: @font-size-5xl;
  }
}

.feature-main {
  flex: 1;
}

.feature-headline {
  font-size: @font-size-6xl;
  font-weight: @font-weight-extrabold;
  line-height: 1.1;
  margin: 0 0 @spacing-lg 0;
  color: var(--text-primary);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateY(50px);

  @media (max-width: @breakpoint-lg) {
    font-size: @font-size-4xl;
  }

  @media (max-width: @breakpoint-md) {
    font-size: @font-size-3xl;
  }
}

.feature-description {
  font-size: @font-size-xl;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
  max-width: 700px;
  transform: translateY(30px);

  @media (max-width: @breakpoint-lg) {
    font-size: @font-size-lg;
    max-width: 100%;
  }

  @media (max-width: @breakpoint-md) {
    font-size: @font-size-base;
  }
}

.feature-visual {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.feature-glow-effect {
  position: absolute;
  width: 600px;
  height: 600px;
  background: var(--gradient-glow);
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
    opacity: 0.2;
    animation: pulse 4s ease-in-out infinite;
  }
}

// 动画定义
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 0.3;
    transform: scale(1);
  }
}

@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.2);
  }
}

// 滚动视差效果
@media (prefers-reduced-motion: no-preference) {
  .feature-section {
    &:nth-child(1) .feature-glow-effect {
      top: 10%;
      right: 10%;
    }

    &:nth-child(2) .feature-glow-effect {
      bottom: 20%;
      left: 15%;
    }

    &:nth-child(3) .feature-glow-effect {
      top: 30%;
      left: 20%;
    }

    &:nth-child(4) .feature-glow-effect {
      bottom: 15%;
      right: 25%;
    }

    &:nth-child(5) .feature-glow-effect {
      top: 25%;
      right: 15%;
    }

    &:nth-child(6) .feature-glow-effect {
      bottom: 30%;
      left: 10%;
    }
  }
}

// ============================================
// 下载区域
// ============================================

.download {
  padding: @spacing-3xl 0;
  position: relative;
  z-index: 1;
}

.version-info {
  .flex-between();
  background: var(--card-background);
  border: 2px solid var(--primary-color);
  border-radius: @border-radius-lg;
  padding: @spacing-lg;
  margin-bottom: @spacing-xl;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gradient-glow);
    opacity: 0.5;
    pointer-events: none;
  }
}

.version-badge {
  display: flex;
  align-items: center;
  gap: @spacing-md;
  position: relative;
  z-index: 2;

  .version-pulse {
    width: 12px;
    height: 12px;
    background: var(--primary-color);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .version-label {
    color: var(--text-secondary);
    font-size: @font-size-sm;
  }

  .version-number {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    padding: @spacing-xs @spacing-md;
    border-radius: @border-radius-md;
    font-weight: @font-weight-bold;
    font-size: @font-size-sm;
  }
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: @spacing-xs;
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: @spacing-xs @spacing-md;
  border-radius: @border-radius-md;
  font-size: @font-size-sm;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.download-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-xl;
  align-items: start;

  @media (max-width: @breakpoint-md) {
    grid-template-columns: 1fr;
  }
}

.download-info {
  h3 {
    margin-bottom: @spacing-md;
    color: var(--text-primary);
    font-weight: @font-weight-bold;
  }

  .requirements-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: @spacing-sm;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
      display: flex;
      align-items: flex-start;
      gap: @spacing-sm;

      &::before {
        content: '✓';
        color: var(--primary-color);
        font-weight: bold;
      }

      a {
        color: var(--primary-color);

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.download-actions {
  display: flex;
  flex-direction: column;
  gap: @spacing-md;
}

.download-btn {
  display: flex;
  align-items: center;
  padding: @spacing-md @spacing-lg;
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: @border-radius-lg;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-color);
    transform: translateX(5px);
    box-shadow: var(--shadow-glow-subtle);

    .download-arrow {
      transform: translateX(5px);
    }
  }

  &.primary {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    border: none;

    &:hover {
      box-shadow: var(--shadow-glow);
    }
  }

  .download-text {
    flex: 1;
    display: flex;
    flex-direction: column;

    strong {
      font-size: @font-size-lg;
      margin-bottom: 2px;
    }

    small {
      opacity: 0.8;
      font-size: @font-size-sm;
    }
  }

  .download-arrow {
    font-size: @font-size-xl;
    transition: transform 0.3s ease;
  }
}

.prerelease-alert {
  display: flex;
  align-items: center;
  gap: @spacing-lg;
  background: var(--gradient-accent);
  border-radius: @border-radius-lg;
  padding: @spacing-lg;
  margin-top: @spacing-xl;
  color: var(--text-inverse);

  .alert-content {
    flex: 1;

    h4 {
      margin: 0 0 @spacing-xs 0;
      color: var(--text-inverse);
    }

    p {
      margin: 0;
      opacity: 0.9;
    }
  }
}

// ============================================
// 客户端区域
// ============================================

.clients {
  padding: @spacing-3xl 0;
  background: var(--background-secondary);
  position: relative;
  z-index: 1;
}

.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: @spacing-lg;
}

.client-card {
  background: var(--card-background);
  border: 1px solid var(--card-border);
  border-radius: @border-radius-lg;
  padding: @spacing-lg;
  display: flex;
  align-items: center;
  gap: @spacing-md;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: var(--shadow-glow-subtle);
  }

  .client-info {
    flex: 1;
  }

  .client-name {
    margin: 0 0 @spacing-xs 0;
    font-size: @font-size-lg;
    color: var(--text-primary);
    font-weight: @font-weight-semibold;
  }

  .client-platform {
    margin: 0;
    color: var(--text-secondary);
    font-size: @font-size-sm;
  }

  .client-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: @font-weight-semibold;
    padding: @spacing-xs @spacing-md;
    border: 1px solid var(--primary-color);
    border-radius: @border-radius-md;
    transition: all 0.3s ease;

    &:hover {
      background: var(--primary-color);
      color: var(--text-inverse);
    }
  }
}

// ============================================
// Star History 区域
// ============================================

.stats {
  padding: @spacing-3xl 0;
  position: relative;
  z-index: 1;
}

.star-history-container {
  background: var(--card-background);
  border: 1px solid var(--card-border);
  border-radius: @border-radius-xl;
  padding: @spacing-xl;
  margin-bottom: @spacing-xl;
  min-height: 400px;
  .flex-center();
  flex-direction: column;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
  }
}

.star-history-chart {
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: @border-radius-md;
}

.stats-actions {
  .flex-center();
  gap: @spacing-md;
  flex-wrap: wrap;
}

.loading-state,
.error-state {
  .flex-center();
  flex-direction: column;
  gap: @spacing-md;
  padding: @spacing-xl;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

// ============================================
// 文档区域
// ============================================

.docs {
  padding: @spacing-3xl 0;
  background: var(--background-secondary);
  position: relative;
  z-index: 1;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: @spacing-lg;
}

.doc-card {
  background: var(--card-background);
  border: 1px solid var(--card-border);
  border-radius: @border-radius-lg;
  padding: @spacing-xl;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: var(--gradient-primary);
    transition: width 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: var(--shadow-glow-subtle);

    &::after {
      width: 100%;
    }
  }

  h3 {
    margin: 0 0 @spacing-sm 0;
    color: var(--text-primary);
    font-weight: @font-weight-bold;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: @font-size-sm;
  }
}

// ============================================
// 页脚
// ============================================

.footer {
  background: var(--background-dark);
  color: var(--text-inverse);
  padding: @spacing-xl 0 @spacing-md;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: @spacing-xl;
  margin-bottom: @spacing-xl;
}

.footer-section {
  h4 {
    margin: 0 0 @spacing-md 0;
    color: var(--text-inverse);
    font-weight: @font-weight-semibold;
  }

  p {
    margin: 0;
    color: var(--text-muted);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: @spacing-xs;
  }

  a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.footer-brand {
  .footer-logo {
    display: flex;
    align-items: center;
    gap: @spacing-sm;
    margin-bottom: @spacing-sm;

    h4 {
      margin: 0;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

.footer-bottom {
  border-top: 1px solid var(--border-dark);
  padding-top: @spacing-md;
  text-align: center;

  p {
    margin: 0;
    color: var(--text-muted);
    font-size: @font-size-sm;
  }
}

// ============================================
// 响应式设计
// ============================================

@media (max-width: @breakpoint-md) {
  .hero-title {
    font-size: @font-size-4xl;
  }

  .hero-subtitle {
    font-size: @font-size-base;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .nav {
    flex-direction: column;
    gap: @spacing-sm;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: @spacing-sm;

    a {
      font-size: @font-size-sm;
    }
  }

  .version-info {
    flex-direction: column;
    gap: @spacing-md;
    text-align: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: @spacing-sm;

    .stat-divider {
      display: none;
    }
  }

  .prerelease-alert {
    flex-direction: column;
    text-align: center;
  }

  .section-title {
    font-size: @font-size-3xl;
  }
}
</style>
