<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { translations } from './i18n.js'

// 语言状态管理
const currentLang = ref(localStorage.getItem('language') || 'zh')

// 主题状态管理 - gura(蓝色科技) 或 chocolate(巧克力深色)
const currentTheme = ref(localStorage.getItem('theme') || 'gura')

// 切换语言
const toggleLanguage = () => {
  const newLang = currentLang.value === 'zh' ? 'en' : 'zh'
  currentLang.value = newLang
  localStorage.setItem('language', newLang)
  document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en'
  updatePageTitle()
}

// 切换主题
const toggleTheme = () => {
  const newTheme = currentTheme.value === 'gura' ? 'chocolate' : 'gura'
  currentTheme.value = newTheme
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
}

// 监听主题变化
watch(currentTheme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
})

// 主题图标
const themeIcon = computed(() => currentTheme.value === 'gura' ? '🌊' : '🍫')

// 主题名称
const themeName = computed(() => {
  const isGura = currentTheme.value === 'gura'
  return currentLang.value === 'zh'
    ? (isGura ? 'Gura 蓝' : '巧克力')
    : (isGura ? 'Gura Blue' : 'Chocolate')
})

// 更新页面标题
const updatePageTitle = () => {
  document.title = currentLang.value === 'zh' 
    ? '摇光流梦 - 让游戏串流更优雅' 
    : 'SDream - Make Game Streaming Greater'
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

// 国内镜像前缀（若失效可换：ghfast.top / cf.ghproxy.cc / gh.ddlc.top 等，见 https://ghproxy.link）
const MIRROR_PREFIX = 'https://mirror.ghproxy.com/'

// 下载链接（仓库为 qiin2333/Sunshine-Foundation）
const downloadLinks = ref({
  windows: 'https://github.com/qiin2333/Sunshine-Foundation/releases/latest',
  github: 'https://github.com/qiin2333/Sunshine-Foundation/releases/',
  mirror: 'https://github.com/qiin2333/Sunshine-Foundation/releases/latest',
  latest: null,
})

// 提取资源下载链接
const extractDownloadUrl = (assets, filename) => 
  assets.find(asset => asset.name.includes(filename))?.browser_download_url

// 检查最新版本
const checkLatestVersion = async () => {
  try {
    versionInfo.value.loading = true
    versionInfo.value.error = null

    const [latestResponse, allReleasesResponse] = await Promise.all([
      fetch('https://api.github.com/repos/qiin2333/Sunshine-Foundation/releases/latest'),
      fetch('https://api.github.com/repos/qiin2333/Sunshine-Foundation/releases')
    ])

    const [latestRelease, allReleases] = await Promise.all([
      latestResponse.json(),
      allReleasesResponse.json()
    ])

    const preRelease = allReleases.find(release => release.prerelease)
    const installerFilename = 'sunshine-windows-installer.exe'

    versionInfo.value.latest = {
      version: latestRelease.tag_name,
      downloadUrl: extractDownloadUrl(latestRelease.assets, installerFilename),
      releaseUrl: latestRelease.html_url,
      body: latestRelease.body,
    }

    if (preRelease) {
      versionInfo.value.preRelease = {
        version: preRelease.tag_name,
        downloadUrl: extractDownloadUrl(preRelease.assets, installerFilename),
        releaseUrl: preRelease.html_url,
        body: preRelease.body,
      }
    }

    // 更新下载链接
    const latestDownloadUrl = versionInfo.value.latest.downloadUrl
    if (latestDownloadUrl) {
      downloadLinks.value.latest = latestDownloadUrl
      downloadLinks.value.windows = latestDownloadUrl
      downloadLinks.value.mirror = `${MIRROR_PREFIX}${latestDownloadUrl}`
    }
  } catch (error) {
    console.error('版本检查失败:', error)
    versionInfo.value.error = error.message
    // 使用默认下载地址
    const fallbackUrl = 'https://vip.123pan.cn/1813496318/26878949'
    downloadLinks.value.windows = fallbackUrl
    downloadLinks.value.mirror = fallbackUrl
  } finally {
    versionInfo.value.loading = false
  }
}

// 设置特性滚动动画
const setupFeatureAnimations = () => {
  const featureSections = document.querySelectorAll('.feature-section')
  
  // 第一个特性立即触发动画
  if (featureSections[0]) {
    requestAnimationFrame(() => {
      featureSections[0].classList.add('is-visible')
    })
  }
  
  // 使用 requestAnimationFrame 优化回调性能
  let rafId = null
  const observer = new IntersectionObserver(
    (entries) => {
      if (rafId) cancelAnimationFrame(rafId)
      
      rafId = requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  )

  // 从第二个特性开始观察
  for (let i = 1; i < featureSections.length; i++) {
    observer.observe(featureSections[i])
  }
}

onMounted(() => {
  // 设置初始主题和语言
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  document.documentElement.lang = currentLang.value === 'zh' ? 'zh-CN' : 'en'
  updatePageTitle()

  // 预加载 Star History 图表
  const img = new Image()
  img.onload = () => { starHistoryLoaded.value = true }
  img.onerror = () => { starHistoryError.value = true }
  img.src = 'https://api.star-history.com/svg?repos=qiin2333/Sunshine-Foundation&type=Date&width=800&height=400'

  // 检查最新版本
  checkLatestVersion()

  // 设置特性区域的滚动动画
  setTimeout(setupFeatureAnimations, 100)
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

    <!-- 主横幅 - 梦幻/丝滑/极速 视觉 -->
    <section class="hero">
      <!-- 多层背景效果 -->
      <div class="hero-bg">
        <!-- 梦幻渐变光晕 -->
        <div class="hero-aurora">
          <div class="aurora-layer aurora-1"></div>
          <div class="aurora-layer aurora-2"></div>
          <div class="aurora-layer aurora-3"></div>
        </div>
        <!-- 极速光线 -->
        <div class="hero-speed-lines">
          <div class="speed-line" v-for="n in 8" :key="n" :style="{ '--i': n }"></div>
        </div>
        <!-- 丝滑波浪 -->
        <div class="hero-waves">
          <svg class="wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path class="wave wave-1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path class="wave wave-2" d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,224C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <!-- 星光粒子 -->
        <div class="hero-stars">
          <div class="star" v-for="n in 20" :key="n" :style="{ '--x': Math.random() * 100, '--y': Math.random() * 100, '--d': Math.random() * 3 + 1, '--s': Math.random() * 0.5 + 0.5 }"></div>
        </div>
        <!-- 流光效果 -->
        <div class="hero-glow-orbs">
          <div class="glow-orb orb-1"></div>
          <div class="glow-orb orb-2"></div>
          <div class="glow-orb orb-3"></div>
        </div>
      </div>
      
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-glow"></span>
            <span class="badge-dot"></span>
            <span>Game Streaming Platform</span>
          </div>
          <h1 class="hero-title">
            <span class="title-main">{{ t.tagline }}</span>
            <span class="title-shimmer"></span>
          </h1>
          <p class="hero-subtitle">{{ t.subtitle }}</p>
          <div class="hero-actions">
            <a :href="downloadLinks.windows" class="btn btn-primary btn-glow">
              <span class="btn-text">{{ t.hero.download }}</span>
              <span class="btn-shine"></span>
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
              <span class="stat-icon">⚡</span>
              <span class="stat-text">Low Latency</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">🎨</span>
              <span class="stat-text">HDR Support</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">🖥️</span>
              <span class="stat-text">Virtual Display</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心特性 -->
    <section id="features" class="features">
      <div class="features-container">
        <div 
          v-for="(feature, index) in t.features.items" 
          :key="feature.title" 
          class="feature-section" 
          :data-index="index"
        >
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
        <div v-if="versionInfo.latest" class="version-info">
          <div class="version-badge">
            <span class="version-pulse"></span>
            <span class="version-label">{{ t.download.latestVersion }}</span>
            <span class="version-number">{{ versionInfo.latest.version }}</span>
          </div>
          <div class="version-actions">
            <button 
              @click="checkLatestVersion" 
              class="btn-refresh" 
              :disabled="versionInfo.loading"
            >
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
          <button @click="checkLatestVersion" class="btn btn-secondary">
            {{ t.download.retry }}
          </button>
        </div>

        <div class="download-content">
          <div class="download-info">
            <h3>{{ t.download.requirements }}</h3>
            <ul class="requirements-list">
              <li 
                v-for="(req, index) in t.download.requirementsList" 
                :key="index" 
                v-html="req"
              ></li>
            </ul>
          </div>
          <div class="download-actions">
            <a :href="downloadLinks.windows" class="download-btn primary">
              <span class="download-text">
                <strong>{{ t.download.windowsLatest }}</strong>
                <small>{{ versionInfo.latest?.version || t.download.recommended }}</small>
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
          <a 
            :href="versionInfo.preRelease.releaseUrl" 
            class="btn btn-warning" 
            target="_blank"
          >
            {{ t.download.viewPrerelease }}
          </a>
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
            <a 
              href="https://star-history.com/#qiin2333/Sunshine-Foundation&Date" 
              target="_blank" 
              class="btn btn-secondary"
            >
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
          <a 
            href="https://github.com/qiin2333/Sunshine-Foundation" 
            class="btn btn-primary" 
            target="_blank"
          >
            {{ t.stats.giveStar }}
          </a>
          <a 
            href="https://star-history.com/#qiin2333/Sunshine-Foundation&Date" 
            class="btn btn-secondary" 
            target="_blank"
          >
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
          <a 
            href="https://docs.lizardbyte.dev/projects/sunshine/latest/" 
            class="doc-card" 
            target="_blank"
          >
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
              <li>
                <a href="https://github.com/qiin2333/Sunshine-Foundation" target="_blank">GitHub</a>
              </li>
              <li>
                <a href="https://github.com/LizardByte/awesome-sunshine" target="_blank">
                  awesome-sunshine
                </a>
              </li>
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
  transform: translateZ(0);
  will-change: scroll-position;
  contain: layout style paint;
}

.container {
  .container();
}

// ============================================
// 科技感背景
// ============================================

.tech-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform;
  contain: layout style paint;
}

.tech-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--tech-grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--tech-grid-color) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.5;
}

.tech-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: pulse-glow 8s ease-in-out infinite;
  transform: translateZ(0);
  will-change: transform, opacity;
  contain: layout style paint;

  &-1 {
    width: 600px;
    height: 600px;
    background: var(--primary-color);
    top: -200px;
    right: -200px;
  }

  &-2 {
    width: 400px;
    height: 400px;
    background: var(--accent-color);
    bottom: 20%;
    left: -100px;
    animation-delay: 2s;
  }

  &-3 {
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
    transform: translateZ(0) scale(1);
  }
  50% {
    opacity: 0.4;
    transform: translateZ(0) scale(1.1);
  }
}

// ============================================
// 头部导航
// ============================================

.header {
  background: rgba(var(--background-primary), 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  transform: translateZ(0);
  will-change: transform;
}

.nav {
  .flex-between();
  padding: @spacing-sm 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: @spacing-sm;

  &-icon {
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

// ============================================
// Hero 区域 - 梦幻/丝滑/极速 视觉效果
// ============================================

.hero {
  position: relative;
  padding: @spacing-6xl 0 @spacing-3xl;
  background: var(--background-hero);
  overflow: hidden;
  min-height: 90vh;
  .flex-center();

  // 背景容器
  &-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
  }

  // ========== 梦幻极光效果 ==========
  &-aurora {
    position: absolute;
    inset: 0;
    overflow: hidden;
    
    .aurora-layer {
      position: absolute;
      width: 150%;
      height: 150%;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: aurora-float 15s ease-in-out infinite;
      will-change: transform;
      
      &.aurora-1 {
        background: linear-gradient(135deg, var(--primary-color) 0%, transparent 60%);
        top: -50%;
        left: -25%;
        animation-delay: 0s;
      }
      
      &.aurora-2 {
        background: linear-gradient(225deg, var(--accent-color) 0%, transparent 60%);
        top: -30%;
        right: -25%;
        animation-delay: -5s;
        animation-duration: 18s;
      }
      
      &.aurora-3 {
        background: linear-gradient(315deg, var(--accent-secondary) 0%, transparent 60%);
        bottom: -40%;
        left: 20%;
        animation-delay: -10s;
        animation-duration: 20s;
        opacity: 0.3;
      }
    }
  }

  // ========== 极速光线效果 ==========
  &-speed-lines {
    position: absolute;
    inset: 0;
    overflow: hidden;
    
    .speed-line {
      position: absolute;
      width: 2px;
      height: 80px;
      background: linear-gradient(to bottom, transparent, var(--primary-color), transparent);
      opacity: 0;
      animation: speed-dash 3s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.4s);
      left: calc(var(--i) * 12.5%);
      top: -100px;
      transform: rotate(15deg);
      will-change: transform, opacity;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -1px;
        width: 4px;
        height: 100%;
        background: linear-gradient(to bottom, transparent, var(--primary-color), transparent);
        filter: blur(4px);
      }
    }
  }

  // ========== 丝滑波浪效果 ==========
  &-waves {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    overflow: hidden;
    
    .wave-svg {
      position: absolute;
      bottom: 0;
      width: 200%;
      height: 100%;
      animation: wave-drift 25s linear infinite;
      will-change: transform;
    }
    
    .wave {
      fill: var(--primary-color);
      
      &.wave-1 {
        opacity: 0.08;
        animation: wave-morph 8s ease-in-out infinite;
      }
      
      &.wave-2 {
        opacity: 0.05;
        animation: wave-morph 10s ease-in-out infinite reverse;
      }
    }
  }

  // ========== 星光粒子 ==========
  &-stars {
    position: absolute;
    inset: 0;
    overflow: hidden;
    
    .star {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--primary-color);
      border-radius: 50%;
      left: calc(var(--x) * 1%);
      top: calc(var(--y) * 1%);
      opacity: 0;
      transform: scale(calc(var(--s)));
      animation: star-twinkle calc(var(--d) * 1s) ease-in-out infinite;
      box-shadow: 0 0 6px var(--primary-color), 0 0 12px var(--primary-color);
      will-change: opacity, transform;
    }
  }

  // ========== 流光球效果 ==========
  &-glow-orbs {
    position: absolute;
    inset: 0;
    overflow: hidden;
    
    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.5;
      animation: orb-float 12s ease-in-out infinite;
      will-change: transform;
      
      &.orb-1 {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
        top: 10%;
        right: 15%;
        animation-delay: 0s;
      }
      
      &.orb-2 {
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
        bottom: 20%;
        left: 10%;
        animation-delay: -4s;
      }
      
      &.orb-3 {
        width: 250px;
        height: 250px;
        background: radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%);
        top: 40%;
        left: 50%;
        animation-delay: -8s;
        opacity: 0.3;
      }
    }
  }

  // ========== 内容区域 ==========
  &-content {
    text-align: center;
    position: relative;
    z-index: 2;
    max-width: 950px;
    margin: 0 auto;
  }

  // ========== 徽章 ==========
  &-badge {
    display: inline-flex;
    align-items: center;
    gap: @spacing-sm;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: @spacing-xs @spacing-lg;
    border-radius: @border-radius-full;
    margin-bottom: @spacing-xl;
    color: var(--primary-color);
    font-size: @font-size-sm;
    font-weight: @font-weight-medium;
    position: relative;
    overflow: hidden;

    .badge-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: shimmer 3s ease-in-out infinite;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      background: var(--primary-color);
      border-radius: 50%;
      animation: pulse-glow 2s ease-in-out infinite;
      box-shadow: 0 0 10px var(--primary-color);
      position: relative;
      z-index: 1;
    }
    
    span:last-child {
      position: relative;
      z-index: 1;
    }
  }

  // ========== 标题 ==========
  &-title {
    font-size: clamp(2.5rem, 8vw, 5rem);
    margin-bottom: @spacing-lg;
    font-weight: @font-weight-extrabold;
    line-height: 1.1;
    position: relative;
    display: inline-block;

    .title-main {
      background: linear-gradient(135deg, 
        var(--primary-color) 0%, 
        var(--accent-color) 25%,
        var(--primary-color) 50%, 
        var(--accent-secondary) 75%,
        var(--primary-color) 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradient-flow 4s linear infinite;
      filter: drop-shadow(0 0 30px rgba(var(--primary-color), 0.3));
    }
    
    .title-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: title-shine 4s ease-in-out infinite;
    }
  }

  // ========== 副标题 ==========
  &-subtitle {
    font-size: @font-size-lg;
    margin-bottom: @spacing-2xl;
    color: var(--text-secondary);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.8;
    opacity: 0.9;
  }

  // ========== 操作按钮 ==========
  &-actions {
    .flex-center();
    gap: @spacing-md;
    flex-wrap: wrap;
    margin-bottom: @spacing-2xl;
  }

  // ========== 统计信息 ==========
  &-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: @spacing-xl;
    flex-wrap: wrap;
    padding: @spacing-md @spacing-xl;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border-radius: @border-radius-lg;
    border: 1px solid rgba(255, 255, 255, 0.05);

    .stat-item {
      display: flex;
      align-items: center;
      gap: @spacing-sm;
      color: var(--text-secondary);
      font-size: @font-size-sm;
      font-weight: @font-weight-medium;
      
      .stat-icon {
        font-size: @font-size-base;
      }
    }

    .stat-divider {
      width: 1px;
      height: 24px;
      background: linear-gradient(to bottom, transparent, var(--border-color), transparent);
    }
  }
}

// ============================================
// Hero 动画关键帧
// ============================================

@keyframes aurora-float {
  0%, 100% {
    transform: translateZ(0) translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateZ(0) translate(30px, -20px) rotate(5deg) scale(1.05);
  }
  50% {
    transform: translateZ(0) translate(-20px, 30px) rotate(-5deg) scale(0.95);
  }
  75% {
    transform: translateZ(0) translate(-30px, -10px) rotate(3deg) scale(1.02);
  }
}

@keyframes speed-dash {
  0% {
    transform: translateY(-100px) rotate(15deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(calc(100vh + 100px)) rotate(15deg);
    opacity: 0;
  }
}

@keyframes wave-drift {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes wave-morph {
  0%, 100% {
    d: path("M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z");
  }
  50% {
    d: path("M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,224C672,235,768,213,864,192C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z");
  }
}

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0;
    transform: translateZ(0) scale(calc(var(--s) * 0.5));
  }
  50% {
    opacity: 1;
    transform: translateZ(0) scale(calc(var(--s)));
  }
}

@keyframes orb-float {
  0%, 100% {
    transform: translateZ(0) translate(0, 0);
  }
  25% {
    transform: translateZ(0) translate(40px, -30px);
  }
  50% {
    transform: translateZ(0) translate(-30px, 40px);
  }
  75% {
    transform: translateZ(0) translate(20px, 20px);
  }
}

@keyframes gradient-flow {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes title-shine {
  0% {
    left: -100%;
  }
  20%, 100% {
    left: 150%;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 10px var(--primary-color);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
    box-shadow: 0 0 20px var(--primary-color), 0 0 40px var(--primary-color);
  }
}

@keyframes btn-pulse {
  0%, 100% {
    box-shadow: 
      0 4px 15px rgba(57, 197, 187, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }
  50% {
    box-shadow: 
      0 4px 20px rgba(57, 197, 187, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.15) inset,
      0 0 30px rgba(57, 197, 187, 0.2);
  }
}

@keyframes shine-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// ============================================
// 按钮样式
// ============================================

.btn {
  display: inline-flex;
  align-items: center;
  gap: @spacing-sm;
  padding: 14px 32px;
  border-radius: @border-radius-lg;
  text-decoration: none;
  font-weight: @font-weight-semibold;
  font-size: @font-size-base;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    color: var(--text-inverse);
    box-shadow: 
      0 4px 15px rgba(57, 197, 187, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;

    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 
        0 8px 30px rgba(57, 197, 187, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset,
        0 0 40px rgba(57, 197, 187, 0.2);
    }
    
    &:active {
      transform: translateY(-2px) scale(1);
    }
    
    // 发光按钮额外效果
    &.btn-glow {
      animation: btn-pulse 3s ease-in-out infinite;
      
      .btn-shine {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover .btn-shine {
        opacity: 1;
        animation: shine-rotate 3s linear infinite;
      }
    }
  }

  &-secondary {
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);

    &:hover {
      background: var(--primary-color);
      color: var(--text-inverse);
    }
  }

  &-ghost {
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

  &-warning {
    background: var(--gradient-accent);
    color: var(--text-inverse);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow);
    }
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
// 特性区域
// ============================================

.features {
  padding: 0;
  background: var(--background-primary);
  position: relative;
  z-index: 1;
  overflow: hidden;

  &-container {
    display: flex;
    flex-direction: column;
  }
}

.feature-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: @spacing-3xl 0;
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform;
  contain: layout style paint;

  &:nth-child(even) {
    background: var(--background-secondary);
  }

  &:nth-child(odd) {
    background: var(--background-primary);
  }

  .feature-number,
  .feature-headline,
  .feature-description {
    opacity: 0;
    will-change: opacity, transform;
  }

  &.is-visible {
    .feature-number {
      animation: fadeInScale 0.8s ease forwards 0.2s;
    }

    .feature-headline {
      animation: slideUpFadeIn 1s ease forwards 0.3s;
    }

    .feature-description {
      animation: slideUpFadeIn 1s ease forwards 0.5s;
    }
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
  transform: translateZ(0) translateY(50px);

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
  transform: translateZ(0) translateY(30px);

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
  inset: 0;
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
  filter: blur(60px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
  transform: translateZ(0);
  will-change: transform;
  contain: layout style paint;

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
    will-change: transform, opacity;
  }
}

// 动画定义
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateZ(0) scale(0.8);
  }
  to {
    opacity: 0.3;
    transform: translateZ(0) scale(1);
  }
}

@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateZ(0) translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateZ(0) translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateZ(0) translate(0, 0) scale(1);
  }
  33% {
    transform: translateZ(0) translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translateZ(0) translate(-20px, 20px) scale(0.9);
  }
}

// 滚动视差效果
@media (prefers-reduced-motion: no-preference) {
  .feature-section {
    &:nth-child(1) .feature-glow-effect { top: 10%; right: 10%; }
    &:nth-child(2) .feature-glow-effect { bottom: 20%; left: 15%; }
    &:nth-child(3) .feature-glow-effect { top: 30%; left: 20%; }
    &:nth-child(4) .feature-glow-effect { bottom: 15%; right: 25%; }
    &:nth-child(5) .feature-glow-effect { top: 25%; right: 15%; }
    &:nth-child(6) .feature-glow-effect { bottom: 30%; left: 10%; }
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
    inset: 0;
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

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: @spacing-lg;
  }
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

  &-actions {
    .flex-center();
    gap: @spacing-md;
    flex-wrap: wrap;
  }
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

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: @spacing-lg;
  }
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

  &-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: @spacing-xl;
    margin-bottom: @spacing-xl;
  }

  &-section {
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

  &-brand {
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

  &-bottom {
    border-top: 1px solid var(--border-dark);
    padding-top: @spacing-md;
    text-align: center;

    p {
      margin: 0;
      color: var(--text-muted);
      font-size: @font-size-sm;
    }
  }
}

// ============================================
// 响应式设计
// ============================================

@media (max-width: @breakpoint-md) {
  // Hero 响应式优化
  .hero {
    min-height: 85vh;
    padding: @spacing-3xl 0 @spacing-xl;
    
    &-aurora .aurora-layer {
      filter: blur(60px);
      opacity: 0.3;
    }
    
    &-speed-lines {
      display: none; // 移动端隐藏极速线条
    }
    
    &-waves {
      height: 120px;
    }
    
    &-glow-orbs .glow-orb {
      filter: blur(40px);
      opacity: 0.3;
      
      &.orb-1 { width: 200px; height: 200px; }
      &.orb-2 { width: 150px; height: 150px; }
      &.orb-3 { display: none; }
    }
    
    &-stars .star {
      width: 3px;
      height: 3px;
    }
  }

  .hero-title {
    font-size: @font-size-4xl;
    
    .title-shimmer {
      display: none;
    }
  }

  .hero-subtitle {
    font-size: @font-size-base;
    padding: 0 @spacing-sm;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: @spacing-sm;
    
    .btn {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }
  }

  .hero-badge {
    font-size: @font-size-xs;
    padding: @spacing-xs @spacing-md;
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
    padding: @spacing-sm @spacing-md;

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
