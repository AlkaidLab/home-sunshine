<script setup>
import { ref, onMounted, computed, watch, markRaw } from 'vue'
import { translations } from './i18n.js'
import sponsorsData from './sponsors.json'
import { DEFAULT_EGG_CLICKS, getEggEntry, getRandomEggEntry } from './eggs/index.js'

// 语言状态管理
const currentLang = ref(localStorage.getItem('language') || 'zh')

// 主题状态管理 - gura(蓝色) 或 chocolate(巧克力深色)
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
    ? '瑶光流梦 - 让游戏串流更优雅'
    : 'AlkaidLab Sunshine - Make Game Streaming Greater'
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

// 国内镜像前缀
const MIRROR_PREFIX = 'https://mirror.ghproxy.com/'
const GITHUB_REPO = 'qiin2333/Sunshine-Foundation'
const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`
const GITHUB_LATEST_RELEASE_URL = `${GITHUB_RELEASES_URL}/latest`
const INSTALLER_FILENAME = 'sunshine-windows-installer.exe'
const LATEST_INSTALLER_URL = `${GITHUB_LATEST_RELEASE_URL}/download/${INSTALLER_FILENAME}`
const RELEASES_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=20`
const VERSION_CACHE_KEY = 'sunshine-release-version-info'
const VERSION_CACHE_TTL_MS = 30 * 60 * 1000
const PAN_FALLBACK_URL = 'https://vip.123pan.cn/1813496318/26878949'

// 下载链接
const downloadLinks = ref({
  windows: LATEST_INSTALLER_URL,
  github: `${GITHUB_RELEASES_URL}/`,
  mirror: `${MIRROR_PREFIX}${LATEST_INSTALLER_URL}`,
  latest: LATEST_INSTALLER_URL,
})

// 提取资源下载链接
const extractDownloadUrl = (assets = [], filename) =>
  Array.isArray(assets)
    ? assets.find(asset => asset.name?.includes(filename))?.browser_download_url
    : undefined

const fetchGithubJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || response.statusText || 'request failed'
    throw new Error(`GitHub API ${response.status}: ${message}`)
  }

  return data
}

const isGithubRateLimitError = error =>
  /GitHub API 403:.*rate limit/i.test(error?.message || '')

const readCachedVersionInfo = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(VERSION_CACHE_KEY) || 'null')
    return cached?.latest?.version ? cached : null
  } catch {
    return null
  }
}

const writeCachedVersionInfo = (releaseInfo) => {
  try {
    localStorage.setItem(VERSION_CACHE_KEY, JSON.stringify({
      ...releaseInfo,
      timestamp: Date.now(),
    }))
  } catch {
    // Ignore storage failures; the direct download fallback still works.
  }
}

const isFreshCachedVersionInfo = cached =>
  cached?.timestamp && Date.now() - cached.timestamp < VERSION_CACHE_TTL_MS

const getMirrorUrl = url =>
  url?.startsWith('https://github.com/') ? `${MIRROR_PREFIX}${url}` : url

const applyReleaseInfo = ({ latest, preRelease }) => {
  versionInfo.value.latest = latest
  versionInfo.value.preRelease = preRelease || null

  const latestDownloadUrl = latest.downloadUrl || LATEST_INSTALLER_URL
  downloadLinks.value.latest = latestDownloadUrl
  downloadLinks.value.windows = latestDownloadUrl
  downloadLinks.value.mirror = getMirrorUrl(latestDownloadUrl)
}

const fetchReleaseInfo = async () => {
  const releases = await fetchGithubJson(RELEASES_API_URL)
  if (!Array.isArray(releases)) {
    throw new Error('GitHub API returned invalid release data')
  }

  const latestRelease = releases.find(release => !release.draft && !release.prerelease)
  const preRelease = releases.find(release => !release.draft && release.prerelease)

  if (!latestRelease?.tag_name) {
    throw new Error('GitHub API returned invalid latest release data')
  }

  return {
    latest: {
      version: latestRelease.tag_name,
      downloadUrl: extractDownloadUrl(latestRelease.assets, INSTALLER_FILENAME) || LATEST_INSTALLER_URL,
      releaseUrl: latestRelease.html_url || GITHUB_LATEST_RELEASE_URL,
      body: latestRelease.body,
    },
    preRelease: preRelease ? {
      version: preRelease.tag_name,
      downloadUrl: extractDownloadUrl(preRelease.assets, INSTALLER_FILENAME),
      releaseUrl: preRelease.html_url,
      body: preRelease.body,
    } : null,
  }
}

// 检查最新版本
const checkLatestVersion = async ({ force = false } = {}) => {
  const cachedReleaseInfo = readCachedVersionInfo()

  if (!force && isFreshCachedVersionInfo(cachedReleaseInfo)) {
    applyReleaseInfo(cachedReleaseInfo)
    versionInfo.value.loading = false
    versionInfo.value.error = null
    return
  }

  try {
    versionInfo.value.loading = true
    versionInfo.value.error = null

    const releaseInfo = await fetchReleaseInfo()
    applyReleaseInfo(releaseInfo)
    writeCachedVersionInfo(releaseInfo)
  } catch (error) {
    if (cachedReleaseInfo) {
      applyReleaseInfo(cachedReleaseInfo)
      versionInfo.value.error = null
      return
    }

    if (!isGithubRateLimitError(error)) {
      console.warn('版本检查失败:', error)
    }

    versionInfo.value.error = error.message
    downloadLinks.value.latest = LATEST_INSTALLER_URL
    downloadLinks.value.windows = PAN_FALLBACK_URL
    downloadLinks.value.mirror = PAN_FALLBACK_URL
  } finally {
    versionInfo.value.loading = false
  }
}

const refreshLatestVersion = () => checkLatestVersion({ force: true })

onMounted(() => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  document.documentElement.lang = currentLang.value === 'zh' ? 'zh-CN' : 'en'
  updatePageTitle()

  const img = new Image()
  img.onload = () => { starHistoryLoaded.value = true }
  img.onerror = () => { starHistoryError.value = true }
  img.src = 'https://api.star-history.com/svg?repos=qiin2333/Sunshine-Foundation&type=Date&width=800&height=400'

  checkLatestVersion()
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

const wechatSponsorModalOpen = ref(false)
const studioWechatPayImage = '/studio-wechat-pay.webp'

const openWechatSponsorModal = () => {
  wechatSponsorModalOpen.value = !wechatSponsorModalOpen.value
}

const closeWechatSponsorModal = () => {
  wechatSponsorModalOpen.value = false
}

// 彩蛋
const eggClicks = ref({})
const eggLastClickTimes = ref({})
const eggRipples = ref({})
const eggLoading = ref(false)
const activeEgg = ref({
  open: false,
  key: null,
  sponsorId: null,
  revealName: '',
  component: null,
  props: null,
})

const isDefaultEggSponsor = sponsor => sponsorsData.users.gold[0] === sponsor
const getSponsorEggId = sponsor => `${sponsor.special || 'random'}:${sponsor.name}`
const getSponsorEggEntry = sponsor => {
  if (!sponsor) return null
  if (sponsor.special) return getEggEntry(sponsor.special)
  return isDefaultEggSponsor(sponsor) ? getRandomEggEntry() : null
}
const getSponsorEggClicks = sponsor =>
  sponsor?.special ? (getEggEntry(sponsor.special)?.clicks || DEFAULT_EGG_CLICKS) : DEFAULT_EGG_CLICKS
const isEggSponsor = sponsor =>
  Boolean(sponsor?.special ? getEggEntry(sponsor.special) : isDefaultEggSponsor(sponsor))
const getEggRipples = sponsor => eggRipples.value[getSponsorEggId(sponsor)] || []
const isActiveEggSponsor = sponsor =>
  activeEgg.value.open && activeEgg.value.sponsorId === getSponsorEggId(sponsor)

const getSponsorDisplayName = sponsor =>
  isActiveEggSponsor(sponsor) ? (activeEgg.value.revealName || sponsor.name) : sponsor.name

const addEggRipple = (event, sponsor) => {
  const sponsorId = getSponsorEggId(sponsor)
  const rect = event.currentTarget.getBoundingClientRect()
  const ripple = { id: Date.now(), x: event.clientX - rect.left, y: event.clientY - rect.top }
  eggRipples.value = {
    ...eggRipples.value,
    [sponsorId]: [...(eggRipples.value[sponsorId] || []), ripple],
  }
  setTimeout(() => {
    eggRipples.value = {
      ...eggRipples.value,
      [sponsorId]: (eggRipples.value[sponsorId] || []).filter(r => r.id !== ripple.id),
    }
  }, 600)
}

const openEggRoom = async (sponsor) => {
  const entry = getSponsorEggEntry(sponsor)
  if (!entry || eggLoading.value) return

  eggLoading.value = true
  try {
    const mod = await entry.load()
    const createEgg = mod.createEgg || mod.default?.createEgg
    if (!createEgg) throw new Error(`Missing egg factory: ${entry.key}`)
    const egg = createEgg({ sponsor })

    activeEgg.value = {
      open: true,
      key: entry.key,
      sponsorId: getSponsorEggId(sponsor),
      revealName: egg.revealName || sponsor.name,
      component: markRaw(egg.component),
      props: egg.props || {},
    }
  } catch (error) {
    console.error('彩蛋加载失败:', error)
  } finally {
    eggLoading.value = false
  }
}

const handleEggClick = (event, sponsor) => {
  if (!isEggSponsor(sponsor)) return

  addEggRipple(event, sponsor)

  const now = Date.now()
  const sponsorId = getSponsorEggId(sponsor)
  if (now - (eggLastClickTimes.value[sponsorId] || 0) > 3000) {
    eggClicks.value = { ...eggClicks.value, [sponsorId]: 0 }
  }
  eggLastClickTimes.value = { ...eggLastClickTimes.value, [sponsorId]: now }
  const nextCount = (eggClicks.value[sponsorId] || 0) + 1
  eggClicks.value = { ...eggClicks.value, [sponsorId]: nextCount }

  if (nextCount >= getSponsorEggClicks(sponsor)) {
    eggClicks.value = { ...eggClicks.value, [sponsorId]: 0 }
    openEggRoom(sponsor)
  }
}

const closeEggRoom = () => {
  activeEgg.value = {
    open: false,
    key: null,
    sponsorId: null,
    revealName: '',
    component: null,
    props: null,
  }
}
</script>

<template>
  <div class="website" :data-theme="currentTheme">
    <!-- 头部导航 -->
    <header class="header">
      <div class="container">
        <nav class="nav">
          <a href="#" class="logo">
            <span class="logo-name">{{ t.title }}</span>
            <span class="logo-badge">Beta</span>
          </a>

          <div class="nav-center">
            <a href="#features" class="nav-link">{{ t.nav.features }}</a>
            <a href="#download" class="nav-link">{{ t.nav.download }}</a>
            <a href="#clients" class="nav-link">{{ t.nav.clients }}</a>
            <a href="#stats" class="nav-link">{{ t.nav.stats }}</a>
            <a href="#docs" class="nav-link">{{ t.nav.docs }}</a>
            <a href="#sponsors" class="nav-link">{{ t.nav.sponsors }}</a>
          </div>

          <div class="nav-controls">
            <button @click="toggleTheme" class="theme-toggle" :title="themeName">
              <svg v-if="currentTheme === 'gura'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            <button @click="toggleLanguage" class="lang-toggle">
              {{ currentLang === 'zh' ? 'EN' : '中文' }}
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- 主横幅 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <p class="hero-badge">{{ t.hero.badge }}</p>
          <h1 class="hero-title">{{ t.tagline }}</h1>
          <p class="hero-subtitle">{{ t.subtitle }}</p>
          <div class="hero-actions">
            <a :href="downloadLinks.windows" class="btn btn-primary">
              {{ t.hero.download }}
            </a>
            <a :href="downloadLinks.github" class="btn btn-outline">
              {{ t.hero.github }}
            </a>
            <a :href="downloadLinks.mirror" class="btn btn-outline">
              {{ t.hero.mirror }}
            </a>
          </div>
          <div class="hero-stats">
            <span class="stat-item">{{ t.hero.stats[0] }}</span>
            <span class="stat-divider"></span>
            <span class="stat-item">{{ t.hero.stats[1] }}</span>
            <span class="stat-divider"></span>
            <span class="stat-item">{{ t.hero.stats[2] }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心特性 -->
    <section id="features" class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.features.title }}</h2>
          <div class="section-line"></div>
        </div>
        <div class="features-grid">
          <div
            v-for="(feature, index) in t.features.items"
            :key="feature.title"
            class="feature-card"
          >
            <span class="feature-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 下载区域 -->
    <section id="download" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.download.title }}</h2>
          <div class="section-line"></div>
        </div>

        <!-- 版本信息 -->
        <div v-if="versionInfo.latest" class="version-info">
          <div class="version-badge">
            <span class="version-dot"></span>
            <span class="version-label">{{ t.download.latestVersion }}</span>
            <span class="version-number">{{ versionInfo.latest.version }}</span>
          </div>
          <button
            @click="refreshLatestVersion"
            class="btn-text"
            :disabled="versionInfo.loading"
          >
            {{ t.download.checkUpdate }}
          </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="versionInfo.loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ t.download.checking }}</p>
        </div>

        <!-- 错误状态 -->
        <div v-if="versionInfo.error" class="error-state">
          <p>{{ t.download.error }}</p>
          <button @click="refreshLatestVersion" class="btn btn-outline">
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
              <span class="download-arrow">&rarr;</span>
            </a>
            <a :href="downloadLinks.github" class="download-btn">
              <span class="download-text">
                <strong>{{ t.download.allVersions }}</strong>
                <small>{{ t.download.githubReleases }}</small>
              </span>
              <span class="download-arrow">&rarr;</span>
            </a>
            <a :href="downloadLinks.mirror" class="download-btn">
              <span class="download-text">
                <strong>{{ t.download.mirrorDownload }}</strong>
                <small>{{ t.download.domesticSpeed }}</small>
              </span>
              <span class="download-arrow">&rarr;</span>
            </a>
          </div>
        </div>

        <!-- 预发布版本 -->
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
            class="btn btn-outline"
            target="_blank"
          >
            {{ t.download.viewPrerelease }}
          </a>
        </div>
      </div>
    </section>

    <!-- 推荐客户端 -->
    <section id="clients" class="section">
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
    <section id="stats" class="section section-alt">
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
              class="btn btn-outline"
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
            class="btn btn-outline"
            target="_blank"
          >
            {{ t.stats.viewStats }}
          </a>
        </div>
      </div>
    </section>

    <!-- 文档链接 -->
    <section id="docs" class="section">
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

    <!-- 赞助者展示 -->
    <section id="sponsors" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.sponsors.title }}</h2>
          <p class="section-subtitle">{{ t.sponsors.subtitle }}</p>
          <div class="section-line"></div>
        </div>

        <!-- 赞助商 -->
        <div class="sponsors-tier">
          <h3 class="tier-label tier-gold">{{ t.sponsors.commercial }}</h3>
          <div v-if="sponsorsData.sponsors.length" class="sponsors-gold-grid">
            <component
              v-for="s in sponsorsData.sponsors"
              :key="s.name"
              :is="s.url ? 'a' : 'span'"
              :href="s.url || undefined"
              class="sponsor-featured"
              :target="s.url ? '_blank' : undefined"
              :rel="s.url ? 'noopener' : undefined"
            >
              <div class="sponsor-featured-badge">TOP SPONSOR</div>
              <div class="sponsor-featured-body">
                <div class="sponsor-featured-header">
                  <img v-if="s.logo" :src="s.logo" :alt="s.name" class="sponsor-featured-logo" />
                  <span class="sponsor-featured-name">{{ s.name }}</span>
                </div>
                <span v-if="s.description" class="sponsor-featured-desc">{{ s.description }}</span>
              </div>
              <span v-if="s.url" class="sponsor-featured-arrow">&rarr;</span>
            </component>
          </div>
          <div v-else class="sponsors-empty gold-empty">
            <div class="empty-slot">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <p>{{ t.sponsors.emptyCommercial }}</p>
            </div>
          </div>
        </div>

        <!-- 金牌赞助者 -->
        <div class="sponsors-tier">
          <h3 class="tier-label tier-gold">{{ t.sponsors.gold }}</h3>
          <div v-if="sponsorsData.users.gold.length" class="sponsors-avatar-grid">
            <template v-for="s in sponsorsData.users.gold" :key="s.name">
              <!-- 彩蛋 -->
              <span
                v-if="isEggSponsor(s)"
                class="sponsor-avatar-item sponsor-avatar-item--gold sponsor-avatar-item--egg"
                :class="{
                  'egg-active': isActiveEggSponsor(s),
                  'egg-loading': eggLoading && activeEgg.sponsorId === getSponsorEggId(s),
                }"
                :title="s.name"
                @click="handleEggClick($event, s)"
              >
                <span class="egg-avatar-wrap">
                  <img :src="s.avatar" :alt="s.name" class="sponsor-avatar sponsor-avatar--gold" />
                  <span
                    v-for="ripple in getEggRipples(s)"
                    :key="ripple.id"
                    class="egg-ripple"
                    :style="{ left: ripple.x + 'px', top: ripple.y + 'px' }"
                  ></span>
                </span>
                <span class="sponsor-avatar-name">
                  <transition name="egg-name" mode="out-in">
                    <span
                      :key="isActiveEggSponsor(s) ? 'full' : 'masked'"
                      :class="{ 'egg-full-name': isActiveEggSponsor(s) }"
                    >{{ getSponsorDisplayName(s) }}</span>
                  </transition>
                </span>
              </span>

              <component
                v-else
                :is="s.url ? 'a' : 'span'"
                :href="s.url || undefined"
                class="sponsor-avatar-item sponsor-avatar-item--gold"
                :target="s.url ? '_blank' : undefined"
                :rel="s.url ? 'noopener' : undefined"
                :title="s.name"
              >
                <img v-if="s.avatar" :src="s.avatar" :alt="s.name" class="sponsor-avatar sponsor-avatar--gold" />
                <span v-else class="sponsor-avatar-placeholder">{{ s.name.charAt(0) }}</span>
                <span class="sponsor-avatar-name">{{ s.name }}</span>
              </component>
            </template>
          </div>
          <div v-else class="sponsors-empty gold-empty">
            <div class="empty-slot">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <p>{{ t.sponsors.emptyGold }}</p>
            </div>
          </div>

          <!-- 彩蛋 -->
          <component
            :is="activeEgg.component"
            v-if="activeEgg.open && activeEgg.component"
            :key="activeEgg.props?.room?.instanceId || activeEgg.key"
            v-bind="activeEgg.props"
            @close="closeEggRoom"
          />
        </div>

        <!-- 银牌赞助者 -->
        <div class="sponsors-tier">
          <h3 class="tier-label tier-silver">{{ t.sponsors.silver }}</h3>
          <div v-if="sponsorsData.users.silver.length" class="sponsors-avatar-grid">
            <component
              v-for="s in sponsorsData.users.silver"
              :key="s.name"
              :is="s.url ? 'a' : 'span'"
              :href="s.url || undefined"
              class="sponsor-avatar-item"
              :target="s.url ? '_blank' : undefined"
              :rel="s.url ? 'noopener' : undefined"
              :title="s.name"
            >
              <img v-if="s.avatar" :src="s.avatar" :alt="s.name" class="sponsor-avatar" />
              <span v-else class="sponsor-avatar-placeholder">{{ s.name.charAt(0) }}</span>
              <span class="sponsor-avatar-name">{{ s.name }}</span>
            </component>
          </div>
          <p v-else class="sponsors-empty-text">{{ t.sponsors.emptySilver }}</p>
        </div>

        <!-- 铜牌赞助者 -->
        <div class="sponsors-tier">
          <h3 class="tier-label tier-bronze">{{ t.sponsors.bronze }}</h3>
          <div v-if="sponsorsData.users.bronze.length" class="sponsors-name-list">
            <component
              v-for="s in sponsorsData.users.bronze"
              :key="s.name"
              :is="s.url ? 'a' : 'span'"
              :href="s.url || undefined"
              class="sponsor-name-tag"
              :target="s.url ? '_blank' : undefined"
              :rel="s.url ? 'noopener' : undefined"
            >
              {{ s.name }}
            </component>
          </div>
          <p v-else class="sponsors-empty-text">{{ t.sponsors.emptyBronze }}</p>
        </div>

        <div class="sponsors-cta">
          <p class="sponsors-cta-label">{{ t.sponsors.becomeSponsor }}</p>
          <div class="sponsors-cta-buttons">
            <a
              href="https://www.ifdian.net/a/Yundi339"
              class="btn btn-primary"
              target="_blank"
            >
              {{ t.sponsors.ifdian }}
            </a>
            <button
              type="button"
              class="btn btn-outline sponsor-btn-wechat"
              @click="openWechatSponsorModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.327-1.233a.49.49 0 0 1 .177-.554C23.02 18.482 24 16.81 24 14.936c0-3.372-3.265-6.078-7.062-6.078zm-2.036 2.891c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.072 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg>
              {{ t.sponsors.wechat }}
            </button>
          </div>
          <div v-if="wechatSponsorModalOpen" class="sponsor-inline-panel">
            <div class="sponsor-inline-card">
              <div class="sponsor-inline-header">
                <div>
                  <span class="sponsor-inline-badge">{{ t.sponsors.wechatModalBadge }}</span>
                  <h3 class="sponsor-inline-title">{{ t.sponsors.wechatModalTitle }}</h3>
                </div>
                <button
                  type="button"
                  class="sponsor-inline-close"
                  :aria-label="t.sponsors.closeModal"
                  @click="closeWechatSponsorModal"
                >
                  ×
                </button>
              </div>
              <p class="sponsor-inline-subtitle">{{ t.sponsors.wechatModalSubtitle }}</p>
              <div class="sponsor-inline-qr-wrap">
                <img
                  :src="studioWechatPayImage"
                  :alt="t.sponsors.wechatModalTitle"
                  class="sponsor-inline-qr"
                />
              </div>
              <p v-if="t.sponsors.wechatModalNote" class="sponsor-inline-note">{{ t.sponsors.wechatModalNote }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section footer-brand">
            <h4 class="footer-logo-text">{{ t.footer.title }}</h4>
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
          <div class="beian-row">
            <span class="beian-item">
              <img src="/police-badge.webp" :alt="t.footer.policeBadgeAlt" class="beian-badge" />
              <span>{{ t.footer.policePlaceholder }}</span>
            </span>
            <a :href="t.footer.icpLink" class="beian-item" target="_blank" rel="noopener">
              {{ t.footer.icp }}
            </a>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<style lang="less" scoped src="./styles/app.less"></style>
