<script setup vapor>
import { ref, onMounted, computed, watch, markRaw } from 'vue'
import { translations } from './i18n.js'
import sponsorsData from './sponsors.json'
import { DEFAULT_EGG_CLICKS, getEggEntry, getRandomEggEntry } from './eggs/index.js'
import HeroMeteorSky from './components/HeroMeteorSky.vue'

const DEFAULT_LANGUAGE = 'zh'
const DEFAULT_THEME = 'gura'

// 使用稳定的服务端初始值，客户端挂载后再恢复本地偏好，避免 hydration 不一致。
const currentLang = ref(DEFAULT_LANGUAGE)

// 主题状态管理 - gura(蓝色) 或 chocolate(巧克力深色)
const currentTheme = ref(DEFAULT_THEME)

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
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', newTheme)
  }
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
const GITHUB_REPO = 'AlkaidLab/foundation-sunshine'
const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`
const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`
const GITHUB_LATEST_RELEASE_URL = `${GITHUB_RELEASES_URL}/latest`
const RELEASES_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=20`
const WINDOWS_INSTALLER_ASSET_PATTERNS = [
  /WindowsInstaller\.exe$/i,
  /windows[-_.]?installer\.exe$/i,
]
const DEFAULT_DOWNLOAD_URL = GITHUB_LATEST_RELEASE_URL
const VERSION_CACHE_KEY = 'foundation-sunshine-release-version-info-v2'
const VERSION_CACHE_TTL_MS = 30 * 60 * 1000
const STAR_REPO_URL = 'https://github.com/AlkaidLab/foundation-sunshine'
const STAR_HISTORY_REPO = 'AlkaidLab/foundation-sunshine'
const STAR_HISTORY_URL = `https://www.star-history.com/?type=date&repos=${encodeURIComponent(STAR_HISTORY_REPO)}`
const STAR_HISTORY_IMAGE_URL = 'https://star.alkaidlab.com/starhistory/AlkaidLab/foundation-sunshine'

// 下载链接
const downloadLinks = ref({
  windows: DEFAULT_DOWNLOAD_URL,
  github: `${GITHUB_RELEASES_URL}/`,
  mirror: `${MIRROR_PREFIX}${DEFAULT_DOWNLOAD_URL}`,
  latest: DEFAULT_DOWNLOAD_URL,
})

// 提取资源下载链接
const isWindowsInstallerAsset = asset =>
  WINDOWS_INSTALLER_ASSET_PATTERNS.some(pattern => pattern.test(asset?.name || ''))

const extractDownloadUrl = (assets = []) =>
  Array.isArray(assets)
    ? assets.find(isWindowsInstallerAsset)?.browser_download_url
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

  const latestDownloadUrl = latest.downloadUrl || latest.releaseUrl || DEFAULT_DOWNLOAD_URL
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
      downloadUrl: extractDownloadUrl(latestRelease.assets) || latestRelease.html_url || DEFAULT_DOWNLOAD_URL,
      releaseUrl: latestRelease.html_url || GITHUB_LATEST_RELEASE_URL,
      body: latestRelease.body,
    },
    preRelease: preRelease ? {
      version: preRelease.tag_name,
      downloadUrl: extractDownloadUrl(preRelease.assets),
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
    downloadLinks.value.latest = DEFAULT_DOWNLOAD_URL
    downloadLinks.value.windows = DEFAULT_DOWNLOAD_URL
    downloadLinks.value.mirror = getMirrorUrl(DEFAULT_DOWNLOAD_URL)
  } finally {
    versionInfo.value.loading = false
  }
}

const refreshLatestVersion = () => checkLatestVersion({ force: true })

onMounted(() => {
  const savedLanguage = localStorage.getItem('language')
  const savedTheme = localStorage.getItem('theme')

  if (savedLanguage === 'zh' || savedLanguage === 'en') {
    currentLang.value = savedLanguage
  }
  if (savedTheme === 'gura' || savedTheme === 'chocolate') {
    currentTheme.value = savedTheme
  }

  document.documentElement.setAttribute('data-theme', currentTheme.value)
  document.documentElement.lang = currentLang.value === 'zh' ? 'zh-CN' : 'en'
  updatePageTitle()

  const img = new Image()
  img.onload = () => { starHistoryLoaded.value = true }
  img.onerror = () => { starHistoryError.value = true }
  img.src = STAR_HISTORY_IMAGE_URL

  checkLatestVersion()
})

// 客户端推荐
const clients = [
  {
    id: 'android-vplus',
    name: {
      zh: '安卓 Moonlight V+',
      en: 'Android Moonlight V+',
    },
    platform: {
      zh: 'Android / Android TV',
      en: 'Android / Android TV',
    },
    link: 'https://github.com/qiin2333/moonlight-vplus',
    icon: 'android',
    type: 'android',
  },
  {
    id: 'harmonyos-vplus',
    name: {
      zh: '鸿蒙 Moonlight V+',
      en: 'HarmonyOS Moonlight V+',
    },
    platform: {
      zh: 'HarmonyOS NEXT',
      en: 'HarmonyOS NEXT',
    },
    link: 'https://appgallery.huawei.com/app/detail?id=com.alkaidlab.sdream',
    icon: 'phone',
    type: 'harmony',
  },
  {
    id: 'moonlight-pc',
    name: {
      zh: 'Moonlight PC',
      en: 'Moonlight PC',
    },
    platform: {
      zh: 'Windows / macOS / Linux',
      en: 'Windows / macOS / Linux',
    },
    link: 'https://github.com/qiin2333/moonlight-qt',
    icon: 'monitor',
    type: 'desktop',
  },
  {
    id: 'macos-enhanced',
    name: {
      zh: 'macOS 增强版',
      en: 'macOS Enhanced',
    },
    platform: {
      zh: 'skyhua0224 · macOS 增强版',
      en: 'skyhua0224 · macOS Enhanced',
    },
    link: 'https://github.com/skyhua0224/moonlight-macos-enhanced',
    icon: 'apple',
    type: 'apple',
  },
  {
    id: 'voidlink',
    name: {
      zh: '虚空终端 (VoidLink)',
      en: 'VoidLink',
    },
    platform: {
      zh: 'iOS / iPadOS',
      en: 'iOS / iPadOS',
    },
    link: 'https://apps.apple.com/cn/app/voidlink/id6747717070',
    icon: 'apple',
    type: 'apple',
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
      <HeroMeteorSky />
      <div class="container">
        <div class="hero-content">
          <p class="hero-badge">{{ t.hero.badge }}</p>
          <h1 class="hero-title">{{ t.tagline }}</h1>
          <p class="hero-subtitle">{{ t.subtitle }}</p>
          <div class="hero-actions">
            <a
              :href="downloadLinks.windows"
              class="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t.hero.download }}
            </a>
            <a
              :href="downloadLinks.github"
              class="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t.hero.github }}
            </a>
            <a
              :href="downloadLinks.mirror"
              class="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t.hero.mirror }}
            </a>
            <a href="#clients" class="btn btn-outline">
              {{ t.hero.moonlightClient }}
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
            <a
              :href="downloadLinks.windows"
              class="download-btn primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="download-text">
                <strong>{{ t.download.windowsLatest }}</strong>
                <small>{{ versionInfo.latest?.version || t.download.recommended }}</small>
              </span>
              <span class="download-arrow">&rarr;</span>
            </a>
            <a
              :href="downloadLinks.github"
              class="download-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="download-text">
                <strong>{{ t.download.allVersions }}</strong>
                <small>{{ t.download.githubReleases }}</small>
              </span>
              <span class="download-arrow">&rarr;</span>
            </a>
            <a
              :href="downloadLinks.mirror"
              class="download-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="download-text">
                <strong>{{ t.download.mirrorDownload }}</strong>
                <small>{{ t.download.domesticSpeed }}</small>
              </span>
              <span class="download-arrow">&rarr;</span>
            </a>
            <a href="#clients" class="download-btn client-jump-btn">
              <span class="download-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3v12"/>
                  <path d="m7 10 5 5 5-5"/>
                  <path d="M5 21h14"/>
                </svg>
              </span>
              <span class="download-text">
                <strong>{{ t.download.moonlightClient }}</strong>
                <small>{{ t.download.moonlightClientDesc }}</small>
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
            rel="noopener noreferrer"
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
          <component
            v-for="client in clients"
            :key="client.id"
            :is="client.link ? 'a' : 'span'"
            :href="client.link || undefined"
            class="client-card"
            :class="[`client-card--${client.type}`, { 'client-card--disabled': !client.link }]"
            :target="client.link ? '_blank' : undefined"
            :rel="client.link ? 'noopener noreferrer' : undefined"
            :aria-label="client.link ? `${t.clients.downloadBtn} ${client.name[currentLang]}` : `${client.name[currentLang]} ${t.clients.comingSoon}`"
          >
            <span class="client-icon" aria-hidden="true">
              <svg v-if="client.icon === 'android'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7.2 9.2h9.6a2 2 0 0 1 2 2v5.6a2 2 0 0 1-2 2H7.2a2 2 0 0 1-2-2v-5.6a2 2 0 0 1 2-2Z"/>
                <path d="M8 9.2 6.4 6.5M16 9.2l1.6-2.7"/>
                <path d="M8.6 13h.01M15.4 13h.01"/>
                <path d="M3.5 11.2v5M20.5 11.2v5"/>
              </svg>
              <svg v-else-if="client.icon === 'phone'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="7" y="3" width="10" height="18" rx="2"/>
                <path d="M11 18h2"/>
              </svg>
              <svg v-else-if="client.icon === 'monitor'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="13" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
              </svg>
              <svg v-else-if="client.icon === 'apple'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16.4 12.2c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.7 0-1.7-.7-2.8-.7-1.4 0-2.7.8-3.5 2.1-1.5 2.7-.4 6.6 1.1 8.7.7 1 1.5 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 2-1.1 2.7-2.1.8-1.2 1.1-2.3 1.1-2.4 0-.1-2.7-1.1-2.7-3.7Z"/>
                <path d="M14.5 6.2c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.7-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z"/>
              </svg>
            </span>
            <div class="client-info">
              <h3 class="client-name">{{ client.name[currentLang] }}</h3>
              <p class="client-platform">{{ client.platform[currentLang] }}</p>
            </div>
            <span class="client-link" aria-hidden="true">
              <svg v-if="client.link" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M15 3h6v6"/>
                <path d="M10 14 21 3"/>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              </svg>
              <span v-else>{{ t.clients.comingSoon }}</span>
            </span>
          </component>
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
              :href="STAR_HISTORY_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline"
            >
              {{ t.stats.viewManually }}
            </a>
          </div>
          <img
            v-else
            :src="STAR_HISTORY_IMAGE_URL"
            :alt="`${t.title} ${t.stats.title}`"
            class="star-history-chart"
            loading="lazy"
          />
        </div>
        <div class="stats-actions">
          <a
            :href="STAR_REPO_URL"
            class="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t.stats.giveStar }}
          </a>
          <a
            :href="STAR_HISTORY_URL"
            class="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
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
                <a :href="GITHUB_REPO_URL" target="_blank" rel="noopener noreferrer">GitHub</a>
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
