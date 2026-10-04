<script setup vapor>
import { ref, onMounted, onBeforeUnmount, computed, watch, markRaw } from 'vue'
import { translations } from './i18n.js'
import { showcaseContent } from './showcase.js'
import sponsorsData from './sponsors.json'
import { DEFAULT_EGG_CLICKS, getEggEntry, getRandomEggEntry } from './eggs/index.js'
import HeroMeteorSky from './components/HeroMeteorSky.vue'
import StreamingGuide from './components/StreamingGuide.vue'
import { FRIEND_LINKS, PRODUCTS } from './products.js'
import {
  getReleaseDownloadUrls,
  resolveReleaseDownloadUrls,
} from './downloads.js'
import { HTML_LANG, LANG_PATHS, siteMeta } from './site-meta.js'

const DEFAULT_THEME = 'gura'

const props = defineProps({
  lang: { type: String, default: 'zh' },
})

// 语言由 URL 决定（/ 为中文，/en/ 为英文），服务端与客户端取值一致，避免 hydration 不匹配。
const currentLang = ref(props.lang === 'en' ? 'en' : 'zh')
const mobileNavOpen = ref(false)

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value
}

const closeMobileNav = () => {
  mobileNavOpen.value = false
}

const onMobileNavKeydown = event => {
  if (event.key === 'Escape') closeMobileNav()
}

// 首屏动画和客户端水合会改变页面高度，浏览器第一次处理 hash 时可能落在目标上方。
// 等布局稳定后再对齐一次，尤其是手机端的粘性导航和串流引导区。
const alignHashTarget = () => {
  if (typeof window === 'undefined' || !window.location.hash) return
  const target = document.getElementById(window.location.hash.slice(1))
  if (!target) return
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }))
  })
}

// 主题状态管理 - gura(蓝色) 或 chocolate(巧克力深色)
const currentTheme = ref(DEFAULT_THEME)

// 语言切换是真实的页面跳转，这样每种语言都有可被收录的独立 URL。
const otherLang = computed(() => (currentLang.value === 'zh' ? 'en' : 'zh'))
const otherLangPath = computed(() => LANG_PATHS[otherLang.value])

const rememberLanguage = () => {
  try {
    localStorage.setItem('language', otherLang.value)
  } catch {
    // 隐私模式下写入失败不影响跳转本身。
  }
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

// 更新页面标题
const updatePageTitle = () => {
  document.title = siteMeta[currentLang.value].title
}

// 当前语言的翻译内容
const t = computed(() => translations[currentLang.value])
const showcase = computed(() => showcaseContent[currentLang.value])
const activeCatalogFilter = ref('all')
// 基地版 iOS / Apple TV 尚未发布，在矩阵中并入“敬请期待”卡片；Xbox 一并预告。
const UPCOMING_CLIENT_IDS = ['ios', 'apple-tv']
const catalogProducts = computed(() => {
  const filter = activeCatalogFilter.value
  const items = PRODUCTS
    .filter(product => filter === 'all' || product.kind === filter)
    .filter(product => !UPCOMING_CLIENT_IDS.includes(product.id))
    .map(product => ({ ...product, copy: t.value.catalog.products[product.id] }))
  if (filter === 'all' || filter === 'client') {
    items.push({ id: 'upcoming-clients', kind: 'client', upcoming: true, copy: t.value.catalog.products.upcoming })
  }
  return items
})
const catalogFriendLinks = computed(() => FRIEND_LINKS.map(link => ({
  ...link,
  url: link.urls[currentLang.value],
  copy: t.value.catalog.friendProducts[link.id],
  deviceLabel: t.value.guide.platforms[link.devices[0]]?.label || link.devices[0],
})))
// QQ 群有两个入口链接：点击时随机选一个，用户不需要感知第二条链接的存在。
// QQ 群有两个入口链接：点击时随机选一个跳转，用户不需要感知第二条链接的存在。
const QQ_GROUP_LINKS = ['https://qm.qq.com/q/AfMQoyKrkc', 'https://qm.qq.com/q/vIVhpjDMic']
const openQqGroup = event => {
  event.preventDefault()
  window.open(QQ_GROUP_LINKS[Math.floor(Math.random() * QQ_GROUP_LINKS.length)], '_blank', 'noopener,noreferrer')
}
const productDeviceLabels = product => product.devices
  .map(device => t.value.guide.platforms[device]?.label)
  .filter(Boolean)
  .join(' · ')

// Star History 图表状态
const STAR_HISTORY_REPOS = [
  {
    id: 'sunshine',
    labelKey: 'sunshine',
    repo: 'AlkaidLab/foundation-sunshine',
  },
  {
    id: 'android-moonlight',
    labelKey: 'androidMoonlight',
    repo: 'qiin2333/moonlight-vplus',
  },
  {
    id: 'moonlight-pc',
    labelKey: 'moonlightPc',
    repo: 'qiin2333/moonlight-qt',
  },
  {
    id: 'macos-enhanced',
    labelKey: 'macosEnhanced',
    repo: 'skyhua0224/moonlight-macos-enhanced',
  },
]

const activeStarRepoId = ref('sunshine')
const starHistoryStates = ref({})

const GITHUB_REPO = 'AlkaidLab/foundation-sunshine'
const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`
const BILIBILI_SPACE_URL = 'https://space.bilibili.com/3690974838524514'
const INITIAL_SUNSHINE_URLS = getReleaseDownloadUrls('sunshine', 'windows', null, currentLang.value)
const STAR_REPO_URL = 'https://github.com/AlkaidLab/foundation-sunshine'
const STAR_HISTORY_REPO = 'AlkaidLab/foundation-sunshine'
const STAR_HISTORY_BASE_URL = '/star'
const STAR_HISTORY_URL = `${STAR_HISTORY_BASE_URL}/${STAR_HISTORY_REPO}/detail`
// 图表由第三方服务生成，上游故障时会挂起约 10s 才返回 500。
// 不等它，超过这个时间就直接切到降级卡片，别让访客盯着转圈。
const STAR_HISTORY_TIMEOUT_MS = 3500

const activeStarRepo = computed(() =>
  STAR_HISTORY_REPOS.find(repo => repo.id === activeStarRepoId.value) || null
)

const getStarHistoryTheme = theme => theme === 'chocolate' ? 'dark' : 'light'

const getStarHistoryStateKey = (repo, theme = currentTheme.value) =>
  `${repo.id}:${getStarHistoryTheme(theme)}`

const activeStarHistoryState = computed(() =>
  activeStarRepo.value
    ? (starHistoryStates.value[getStarHistoryStateKey(activeStarRepo.value)] || { status: 'idle' })
    : null
)

const getStarHistoryUrl = repo =>
  `${STAR_HISTORY_BASE_URL}/${repo.repo}/detail`

const getStarHistoryImageUrl = (repo, theme = currentTheme.value) =>
  `${STAR_HISTORY_BASE_URL}/${repo.repo}?theme=${getStarHistoryTheme(theme)}`

const loadStarHistory = (repo, theme = currentTheme.value) => {
  if (!repo) return

  const stateKey = getStarHistoryStateKey(repo, theme)
  const currentState = starHistoryStates.value[stateKey]?.status
  if (currentState === 'loading' || currentState === 'loaded') return

  starHistoryStates.value = {
    ...starHistoryStates.value,
    [stateKey]: { status: 'loading' },
  }

  const img = new Image()
  let settled = false

  const settle = (ok) => {
    if (settled) return
    settled = true
    window.clearTimeout(timer)
    // 已经放弃的请求即使后到也不再覆盖降级状态，避免图表突然跳出来。
    starHistoryStates.value = {
      ...starHistoryStates.value,
      [stateKey]: { status: ok ? 'loaded' : 'error' },
    }
  }

  const timer = window.setTimeout(() => {
    img.src = ''
    settle(false)
  }, STAR_HISTORY_TIMEOUT_MS)

  img.onload = () => settle(true)
  img.onerror = () => settle(false)
  img.src = getStarHistoryImageUrl(repo, theme)
}

const selectStarRepo = repo => {
  activeStarRepoId.value = repo.id
  loadStarHistory(repo)
}

const activeStarRepoUrl = computed(() => activeStarRepo.value ? `https://github.com/${activeStarRepo.value.repo}` : STAR_REPO_URL)
const activeStarHistoryUrl = computed(() => activeStarRepo.value ? getStarHistoryUrl(activeStarRepo.value) : STAR_HISTORY_URL)

watch(currentTheme, newTheme => {
  if (activeStarRepo.value) loadStarHistory(activeStarRepo.value, newTheme)
})

const downloadLinks = ref({
  windows: INITIAL_SUNSHINE_URLS.official,
  mirror: INITIAL_SUNSHINE_URLS.mirror,
  latest: INITIAL_SUNSHINE_URLS.official,
})

const resolveSunshineDownload = async () => {
  const urls = await resolveReleaseDownloadUrls('sunshine', 'windows', currentLang.value)
  downloadLinks.value.windows = urls.official
  downloadLinks.value.latest = urls.official
  downloadLinks.value.mirror = urls.mirror
  return urls
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'gura' || savedTheme === 'chocolate') {
    currentTheme.value = savedTheme
  }

  document.documentElement.setAttribute('data-theme', currentTheme.value)
  document.documentElement.lang = HTML_LANG[currentLang.value]
  updatePageTitle()
  document.addEventListener('keydown', onMobileNavKeydown)
  window.addEventListener('hashchange', alignHashTarget)
  window.setTimeout(alignHashTarget, 120)

  loadStarHistory(STAR_HISTORY_REPOS[0])
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onMobileNavKeydown)
  window.removeEventListener('hashchange', alignHashTarget)
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
      zh: 'PC Moonlight V+',
      en: 'PC Moonlight V+',
    },
    platform: {
      zh: 'Windows / macOS / Linux / Steam Link',
      en: 'Windows / macOS / Linux / Steam Link',
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
          <a :href="LANG_PATHS[currentLang]" class="logo">
            <span class="logo-name">{{ t.nav.brand }}</span>
          </a>

          <div class="nav-center">
            <a href="#stream-guide" class="nav-link">{{ t.nav.start }}</a>
            <a href="#products" class="nav-link">{{ showcase.products }}</a>
            <a href="#stories" class="nav-link">{{ showcase.stories }}</a>
            <a href="#features" class="nav-link">{{ t.nav.features }}</a>
            <a href="#stats" class="nav-link">{{ t.nav.stats }}</a>
            <a href="#docs" class="nav-link">{{ t.nav.docs }}</a>
            <a href="#sponsors" class="nav-link">{{ t.nav.sponsors }}</a>
          </div>

          <div class="nav-controls">
            <a :href="BILIBILI_SPACE_URL" class="nav-icon" target="_blank" rel="noopener noreferrer" :aria-label="t.nav.bilibili" :title="t.nav.bilibili">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3.5 10.2 7"/><path d="M17 3.5 13.8 7"/><rect x="2.5" y="7" width="19" height="13" rx="3.5"/><line x1="8.5" y1="12" x2="8.5" y2="15"/><line x1="15.5" y1="12" x2="15.5" y2="15"/></svg>
            </a>
            <a :href="GITHUB_REPO_URL" class="nav-github" target="_blank" rel="noopener noreferrer" :aria-label="t.nav.github" :title="t.nav.github">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
            </a>
            <button @click="toggleTheme" class="theme-toggle" :title="currentTheme === 'gura' ? t.nav.toDark : t.nav.toLight" :aria-label="currentTheme === 'gura' ? t.nav.toDark : t.nav.toLight">
              <svg v-if="currentTheme === 'gura'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            <button
              type="button"
              class="mobile-nav-toggle"
              :aria-expanded="mobileNavOpen"
              :aria-label="mobileNavOpen ? t.nav.closeMenu : t.nav.openMenu"
              @click="toggleMobileNav"
            >
              <svg v-if="!mobileNavOpen" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12"/><path d="m18 6-12 12"/></svg>
            </button>
            <a
              :href="otherLangPath"
              class="lang-toggle"
              :hreflang="otherLang === 'zh' ? 'zh-CN' : 'en'"
              @click="rememberLanguage"
            >
              {{ currentLang === 'zh' ? 'EN' : '中文' }}
            </a>
          </div>
        </nav>
        <div v-if="mobileNavOpen" class="mobile-nav-panel">
          <a href="#stream-guide" class="mobile-nav-link" @click="closeMobileNav">{{ t.nav.start }}</a>
          <a href="#products" class="mobile-nav-link" @click="closeMobileNav">{{ showcase.products }}</a>
          <a href="#stories" class="mobile-nav-link" @click="closeMobileNav">{{ showcase.stories }}</a>
          <a href="#features" class="mobile-nav-link" @click="closeMobileNav">{{ t.nav.features }}</a>
          <a href="#stats" class="mobile-nav-link" @click="closeMobileNav">{{ t.nav.stats }}</a>
          <a href="#docs" class="mobile-nav-link" @click="closeMobileNav">{{ t.nav.docs }}</a>
          <a href="#sponsors" class="mobile-nav-link" @click="closeMobileNav">{{ t.nav.sponsors }}</a>
          <div class="mobile-nav-external">
            <a :href="GITHUB_REPO_URL" target="_blank" rel="noopener noreferrer" @click="closeMobileNav">{{ t.nav.github }}</a>
            <a :href="BILIBILI_SPACE_URL" target="_blank" rel="noopener noreferrer" @click="closeMobileNav">{{ t.nav.bilibili }}</a>
          </div>
        </div>
      </div>
    </header>

    <!-- 主横幅 -->
    <section class="hero">
      <HeroMeteorSky />
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <!-- 品牌与检索词只对爬虫和读屏软件可见，视觉上仍是纯标语。 -->
            <span class="sr-only">{{ t.hero.h1Prefix }}</span>
            {{ t.hero.title }}
          </h1>
          <p class="hero-subtitle"><span v-for="line in t.hero.intro" :key="line">{{ line }}</span></p>
          <p class="hero-tags">
            <template v-for="(tag, index) in t.hero.tags" :key="tag">
              <span>{{ tag }}</span>
              <i v-if="index < t.hero.tags.length - 1" class="tag-dot" aria-hidden="true"></i>
            </template>
          </p>
          <p class="hero-metrics">★ {{ t.hero.metrics }}</p>
          <div class="hero-actions">
            <a
              href="#stream-guide"
              class="btn btn-primary"
            >
              {{ t.hero.start }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <StreamingGuide :lang="currentLang" :host-url="downloadLinks.windows" :mirror-url="downloadLinks.mirror" :project-url="GITHUB_REPO_URL" :resolve-host-download="resolveSunshineDownload" />

    <!-- 产品矩阵：展示完整产品，友情链接独立成行 -->
    <section id="products" class="section product-catalog">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.catalog.title }}</h2>
          <p class="section-subtitle">{{ t.catalog.subtitle }}</p>
          <div class="section-line"></div>
        </div>
        <div class="catalog-filters" role="group" :aria-label="t.catalog.filterLabel">
          <button
            v-for="filter in ['all', 'host', 'client', 'friend']"
            :key="filter"
            type="button"
            :class="{ active: activeCatalogFilter === filter }"
            @click="activeCatalogFilter = filter"
          >
            {{ t.catalog.filters[filter] }}
          </button>
        </div>
        <div v-if="catalogProducts.length" class="features-grid">
          <div
            v-for="product in catalogProducts"
            :key="product.id"
            class="feature-card showcase-card catalog-card"
            :class="{ 'catalog-card--disabled': !product.project }"
          >
            <template v-if="product.upcoming">
              <span class="showcase-label">{{ t.catalog.filters.client }}</span>
              <h3 class="feature-title">{{ product.copy.name }}</h3>
              <p class="feature-desc">{{ product.copy.description }}</p>
              <span class="showcase-platform">{{ product.copy.platforms }}</span>
              <span class="showcase-action">{{ t.guide.comingSoon }}</span>
            </template>
            <template v-else>
              <span class="showcase-label">{{ t.catalog.filters[product.kind] }}</span>
              <h3 class="feature-title">{{ product.copy.name }}</h3>
              <p class="feature-desc">{{ product.copy.description }}</p>
              <span class="showcase-platform">{{ productDeviceLabels(product) }}</span>
              <div v-if="product.project" class="catalog-card-actions">
                <a :href="product.project" class="showcase-action" target="_blank" rel="noopener noreferrer">{{ t.guide.project }}</a>
                <a :href="product.project" class="showcase-action catalog-star-link" target="_blank" rel="noopener noreferrer">{{ t.guide.star }}</a>
              </div>
              <span v-else class="showcase-action">{{ t.guide.comingSoon }}</span>
            </template>
          </div>
        </div>
        <p v-else-if="activeCatalogFilter !== 'friend'" class="catalog-empty">{{ t.catalog.empty }}</p>
        <div v-if="activeCatalogFilter === 'all' || activeCatalogFilter === 'friend'" class="features-grid catalog-friend-grid">
          <article v-for="link in catalogFriendLinks" :key="link.id" class="feature-card showcase-card catalog-card catalog-friend-card">
            <span class="showcase-label">{{ t.catalog.friends }}</span>
            <h3 class="feature-title">{{ link.copy.name }}</h3>
            <span class="showcase-platform">{{ link.deviceLabel }}</span>
            <div class="catalog-card-actions">
              <a :href="link.url" class="showcase-action" target="_blank" rel="noopener noreferrer">{{ t.catalog.friendAction }}</a>
            </div>
          </article>
        </div>
        <p class="showcase-note">{{ t.catalog.note }}</p>
      </div>
    </section>

    <!-- 探索串流 -->
    <section id="stories" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ showcase.stories }}</h2>
          <p class="section-subtitle">{{ showcase.storiesSubtitle }}</p>
          <div class="section-line"></div>
        </div>
        <div class="docs-grid">
          <article
            v-for="story in showcase.items"
            :key="story.url"
            class="doc-card showcase-card"
            :class="{ 'showcase-featured': story.url === '/audio-haptics-demo.html', 'showcase-community': story.url.startsWith('https://qm.qq.com/') }"
          >
            <div v-if="story.url === '/audio-haptics-demo.html'" class="showcase-sound" aria-hidden="true">
              <span>AUDIO → HAPTICS</span>
              <div class="showcase-wave"><i v-for="n in 29" :key="n" :style="{ height: `${18 + ((n * 37) % 95)}px` }"></i></div>
              <span class="showcase-sound-caption">FEEL THE SOUND.</span>
            </div>
            <span v-if="story.url.startsWith('https://qm.qq.com/')" class="showcase-community-art" aria-hidden="true">↗</span>
            <span class="showcase-label">{{ story.category }}</span>
            <h3>{{ story.title }}</h3>
            <p>{{ story.description }}</p>
            <a
              :href="story.url"
              class="showcase-action"
              :aria-label="`${showcase.read}: ${story.title}`"
              :target="story.url.startsWith('https:') ? '_blank' : undefined"
              :rel="story.url.startsWith('https:') ? 'noopener noreferrer' : undefined"
              @click="story.url.startsWith('https://qm.qq.com/') ? openQqGroup($event) : undefined"
            >{{ showcase.read }} <svg class="inline-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </article>
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
        <div class="features-meta">
          <small class="hero-note">{{ t.hero.note }}</small>
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

    <!-- Star History -->
    <section id="stats" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t.stats.title }}</h2>
          <p class="section-subtitle">{{ t.stats.subtitle }}</p>
          <div class="section-line"></div>
        </div>
        <p class="star-trend-intro">{{ t.stats.trendIntro }}</p>
        <div class="star-history-layout">
          <div class="star-history-tabs" role="tablist" :aria-label="t.stats.repositoryTabs">
            <button
              v-for="(repo, index) in STAR_HISTORY_REPOS"
              :key="repo.id"
              type="button"
              class="star-history-tab"
              :class="{ active: activeStarRepoId === repo.id }"
              :aria-selected="activeStarRepoId === repo.id"
              role="tab"
              @click="selectStarRepo(repo)"
            >
              <span class="star-history-tab-index" aria-hidden="true">{{ index + 1 }}</span>
              {{ t.stats.repositories[repo.labelKey] }}
            </button>
          </div>
          <div class="star-history-container">
            <div v-if="!activeStarRepo" class="star-history-select-hint">
              <p>{{ t.stats.selectRepository }}</p>
            </div>
            <div v-else-if="activeStarHistoryState.status === 'idle' || activeStarHistoryState.status === 'loading'" class="loading-state">
              <div class="loading-spinner"></div>
              <p>{{ t.stats.loading }}</p>
            </div>
            <div v-else-if="activeStarHistoryState.status === 'error'" class="error-state">
              <p>{{ t.stats.error }}</p>
              <a
                :href="activeStarHistoryUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline"
              >
                {{ t.stats.viewManually }}
              </a>
            </div>
            <img
              v-else
              :src="getStarHistoryImageUrl(activeStarRepo)"
              :alt="`${t.title} ${t.stats.title}`"
              class="star-history-chart"
              loading="lazy"
            />
          </div>
        </div>
        <div class="stats-actions">
          <a
            :href="activeStarRepoUrl"
            class="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t.stats.giveStar }}
          </a>
          <a
            :href="activeStarHistoryUrl"
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
          <article class="doc-card">
            <div class="doc-card-body">
              <h3>{{ t.docs.docCenter }}</h3>
              <p>{{ t.docs.docCenterDesc }}</p>
            </div>
            <a href="/docs/" class="doc-card-action">{{ t.docs.view }} <svg class="inline-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </article>
          <article class="doc-card">
            <div class="doc-card-body">
              <h3>{{ t.docs.userGuide }}</h3>
              <p>{{ t.docs.userGuideDesc }}</p>
            </div>
            <a
              href="https://docs.qq.com/aio/DSGdQc3htbFJjSFdO?p=YTpMj5JNNdB5hEKJhhqlSB"
              class="doc-card-action"
              target="_blank"
              rel="noopener noreferrer"
            >{{ t.docs.view }} <svg class="inline-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </article>
          <article class="doc-card">
            <div class="doc-card-body">
              <h3>{{ t.docs.officialDocs }}</h3>
              <p>{{ t.docs.officialDocsDesc }}</p>
            </div>
            <a
              href="https://docs.lizardbyte.dev/projects/sunshine/latest/"
              class="doc-card-action"
              target="_blank"
              rel="noopener noreferrer"
            >{{ t.docs.view }} <svg class="inline-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </article>
          <article class="doc-card">
            <div class="doc-card-body">
              <h3>{{ t.docs.bilibili }}</h3>
              <p>{{ t.docs.bilibiliDesc }}</p>
            </div>
            <a
              :href="BILIBILI_SPACE_URL"
              class="doc-card-action"
              target="_blank"
              rel="noopener noreferrer"
            >{{ t.docs.view }} <svg class="inline-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </article>
          <article class="doc-card">
            <div class="doc-card-body">
              <h3>{{ t.docs.qqGroup }}</h3>
              <p>{{ t.docs.qqGroupDesc }}</p>
            </div>
            <a
              href="https://qm.qq.com/q/AfMQoyKrkc"
              @click="openQqGroup"
              class="doc-card-action"
              target="_blank"
              rel="noopener noreferrer"
            >{{ t.docs.view }} <svg class="inline-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </article>
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

        <!-- 赞助入口 -->
        <div class="sponsors-cta">
          <p class="sponsors-cta-label">{{ t.sponsors.becomeSponsor }}</p>
          <div class="sponsors-cta-buttons">
            <a
              href="https://www.ifdian.net/a/Yundi339"
              class="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t.sponsors.ifdian }}
            </a>
            <button
              type="button"
              class="btn btn-outline sponsor-btn-wechat"
              @click="openWechatSponsorModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 10.436 7.17c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.327-1.233a.49.49 0 0 1 .177-.554C23.02 18.482 24 16.81 24 14.936c0-3.372-3.265-6.078-7.062-6.078zm-2.036 2.891c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.072 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg>
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
                <a href="https://github.com/LizardByte/awesome-sunshine" target="_blank" rel="noopener noreferrer">
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
