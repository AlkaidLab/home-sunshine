<script setup vapor>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { translations } from '../i18n.js'
import DeviceIcon from './DeviceIcon.vue'
import DownloadModal from './DownloadModal.vue'
import {
  DEVICE_STORAGE_KEY,
  DEVICES,
  FRIEND_LINKS,
  getClientsForDevice,
  detectDevice,
  getReleaseDownloadUrls,
  isDeviceId,
} from '../products.js'

const props = defineProps({
  lang: { type: String, default: 'zh' },
  hostUrl: { type: String, required: true },
  mirrorUrl: { type: String, required: true },
  projectUrl: { type: String, required: true },
})
const selected = ref(null)
const manuallySelected = ref(false)
const detectedSelection = ref(false)
const copy = computed(() => translations[props.lang] || translations.zh)
const guide = computed(() => copy.value.guide)
const platforms = DEVICES
const client = computed(() => selected.value ? getClientsForDevice(selected.value)[0] : null)
const clientCopy = computed(() => selected.value ? guide.value.platforms[selected.value] : null)
const clientProductName = computed(() => clientCopy.value?.detail.split(' · ')[0] || '')
const clientDevices = computed(() => clientCopy.value?.detail.split(' · ').slice(1).join(' · ') || '')
const clientReleaseUrls = ref({})
const CLIENT_RELEASE_CACHE_KEY = 'alkaidlab-client-release-assets-v2'
const CLIENT_RELEASE_CACHE_TTL_MS = 30 * 60 * 1000
const PRE_RELEASE_ASSET_PATTERN = /(?:^|[-_.])(?:alpha|beta|rc|pre)(?:[-_.]|$)/i
const clientFriendLink = computed(() => FRIEND_LINKS.find(link => link.devices.includes(selected.value)) || null)
const clientFriendUrl = computed(() => clientFriendLink.value?.urls[props.lang] || null)
const clientFriendAction = computed(() => guide.value.friendAction)
const clientOtherOptions = computed(() => selected.value === 'macos' && client.value?.id === 'moonlight-pc' ? [getClientsForDevice(selected.value)[1]] : [])
const clientReleaseKey = computed(() => {
  if (!client.value || !selected.value) return null
  return client.value.id === 'moonlight-pc' ? `moonlight-pc@${selected.value}` : client.value.id
})
const clientReleaseDownloadUrls = computed(() => {
  const key = clientReleaseKey.value
  if (!key || (key !== 'android-vplus' && key !== 'macos-enhanced' && !key.startsWith('moonlight-pc@'))) return null
  const [productKey, device] = key.startsWith('moonlight-pc@')
    ? ['moonlightPc', key.split('@')[1]]
    : [key]
  return getReleaseDownloadUrls(productKey, device, clientReleaseUrls.value[key], props.lang)
})
const clientDirectUrl = computed(() => {
  return clientReleaseDownloadUrls.value?.official || null
})
const clientDownloadUrl = computed(() => clientDirectUrl.value || client.value?.download || null)
const clientMirrorUrl = computed(() => clientReleaseDownloadUrls.value?.mirror || null)
const alternateDownloadUrls = computed(() => {
  const option = clientOtherOptions.value[0]
  if (!option || option.id !== 'macos-enhanced') return null
  return getReleaseDownloadUrls('macos-enhanced', 'macos', clientReleaseUrls.value['macos-enhanced'], props.lang)
})
const clientUrl = computed(() => clientDownloadUrl.value)
const issueUrl = computed(() => `${props.projectUrl}/issues`)
// QQ 群两个入口链接：点击时随机选择一个，对用户保持单一入口。
const QQ_GROUP_LINKS = ['https://qm.qq.com/q/AfMQoyKrkc', 'https://qm.qq.com/q/vIVhpjDMic']
const communityUrl = QQ_GROUP_LINKS[0]
const openQqGroup = event => {
  event.preventDefault()
  window.open(QQ_GROUP_LINKS[Math.floor(Math.random() * QQ_GROUP_LINKS.length)], '_blank', 'noopener,noreferrer')
}
const openMenu = ref(null)
const showRequirements = ref(false)
const toggleMenu = key => { openMenu.value = openMenu.value === key ? null : key }
const showDownloadModal = ref(false)
const modalProduct = ref(null)
const downloadTrigger = ref(null)
const triggerDownload = (url, { newTab = false } = {}) => {
  const link = document.createElement('a')
  link.href = url
  if (newTab) {
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  } else {
    // Direct file URLs download in this context; target=_blank would flash an extra tab.
    link.setAttribute('download', '')
  }
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
}
// Links can be direct files, release pages or store entries; each needs its own wording.
const getLinkKind = url => {
  if (!url) return 'page'
  if (/appgallery\.huawei\.com/i.test(url)) return 'store'
  // Release asset URLs also contain "/releases/"; they are direct files.
  if (/\/releases\/(?:latest\/)?download\//i.test(url)) return 'file'
  if (/\/releases(?:\/|$)/i.test(url)) return 'page'
  return 'file'
}

const fetchStableGithubRelease = async repo => {
  const endpoints = [
    `https://api.github.com/repos/${repo}/releases?per_page=20`,
    `/api/repos/${repo}/releases?per_page=20`,
  ]
  const releases = await Promise.any(endpoints.map(url =>
    fetch(url, { cache: 'no-store', headers: { Accept: 'application/vnd.github+json' } }).then(response => {
      if (!response.ok) throw new Error(`GitHub API ${response.status}`)
      return response.json()
    })
  ))
  return Array.isArray(releases)
    ? releases.find(release => !release.draft && !release.prerelease && !PRE_RELEASE_ASSET_PATTERN.test(release.tag_name || ''))
    : null
}

const pickReleaseAsset = (assets, patterns) => {
  for (const pattern of patterns) {
    const asset = (assets || []).find(asset => pattern.test(asset.name || ''))
    if (asset?.browser_download_url) return asset.browser_download_url
  }
  return null
}

const resolveClientReleaseAssets = async () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CLIENT_RELEASE_CACHE_KEY) || 'null')
    if (cached?.timestamp && Date.now() - cached.timestamp < CLIENT_RELEASE_CACHE_TTL_MS && cached.urls) {
      clientReleaseUrls.value = cached.urls
      return
    }
  } catch { /* storage is optional */ }

  const [vplus, qt] = await Promise.allSettled([
    fetchStableGithubRelease('qiin2333/moonlight-vplus'),
    fetchStableGithubRelease('qiin2333/moonlight-qt'),
  ])
  const urls = {}

  if (vplus.status === 'fulfilled') {
    const url = pickReleaseAsset(vplus.value?.assets, [/\.apk$/i])
    if (url) urls['android-vplus'] = url
  }

  if (qt.status === 'fulfilled') {
    const assets = qt.value?.assets
    const qtUrls = {
      windows: pickReleaseAsset(assets, [/setup.*\.exe$/i]),
      macos: pickReleaseAsset(assets, [/universal.*\.dmg$/i, /arm64.*\.dmg$/i]),
      linux: pickReleaseAsset(assets, [/x86_64\.appimage$/i]),
      steam: pickReleaseAsset(assets, [/steamlink.*\.zip$/i]),
    }
    for (const [device, url] of Object.entries(qtUrls)) {
      if (url) urls[`moonlight-pc@${device}`] = url
    }
  }

  // A total resolution failure must not be cached, or clients stay on the
  // page fallback for the whole TTL while Sunshine serves its cached direct URL.
  if (!Object.keys(urls).length) return

  clientReleaseUrls.value = urls
  try { localStorage.setItem(CLIENT_RELEASE_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), urls })) } catch { /* storage is optional */ }
}
const openDownloadCard = ({ scope, icon, projectName, title, subtitle, downloadUrl, mirrorUrl = null, projectUrl = null }) => {
  openMenu.value = null
  modalProduct.value = { scope, icon, projectName, title, subtitle, kind: getLinkKind(downloadUrl), downloadUrl, mirrorUrl, projectUrl }
  showDownloadModal.value = true
  // Paint the card first, then hand the request to the browser on the next frame.
  nextTick(() => window.setTimeout(() => triggerDownload(downloadUrl, { newTab: getLinkKind(downloadUrl) !== 'file' }), 150))
}
const startHostDownload = event => {
  event.preventDefault()
  downloadTrigger.value = event.currentTarget
  openDownloadCard({
    scope: 'host',
    icon: 'sun',
    projectName: 'Sunshine',
    title: guide.value.downloadModal.productTitle,
    subtitle: guide.value.downloadModal.productSubtitle,
    downloadUrl: props.hostUrl,
    mirrorUrl: props.mirrorUrl,
    projectUrl: props.projectUrl,
  })
}
const startHostMirrorDownload = event => {
  event.preventDefault()
  downloadTrigger.value = event.currentTarget
  openDownloadCard({
    scope: 'host',
    icon: 'sun',
    projectName: 'Sunshine',
    title: guide.value.downloadModal.productTitle,
    subtitle: guide.value.downloadModal.productSubtitle,
    downloadUrl: props.mirrorUrl,
    projectUrl: props.projectUrl,
  })
}
const startClientDownload = event => {
  if (!client.value?.download || !clientCopy.value) return
  event.preventDefault()
  downloadTrigger.value = event.currentTarget
  openDownloadCard({
    scope: 'client',
    icon: client.value.icon,
    projectName: clientCopy.value.detail.split(' · ')[0],
    title: clientCopy.value.name || clientCopy.value.label,
    subtitle: clientCopy.value.detail || '',
    downloadUrl: clientDownloadUrl.value,
    mirrorUrl: clientMirrorUrl.value,
    projectUrl: client.value.project,
  })
}
const startClientMirrorDownload = event => {
  if (!clientMirrorUrl.value) return
  event.preventDefault()
  downloadTrigger.value = event.currentTarget
  openDownloadCard({
    scope: 'client',
    icon: client.value.icon,
    projectName: clientCopy.value.detail.split(' · ')[0],
    title: clientCopy.value.name || clientCopy.value.label,
    subtitle: clientCopy.value.detail || '',
    downloadUrl: clientMirrorUrl.value,
    projectUrl: client.value.project,
  })
}
const startAlternateDownload = (event, option) => {
  if (!option?.download || !clientCopy.value) return
  event.preventDefault()
  downloadTrigger.value = event.currentTarget
  openDownloadCard({
    scope: 'client',
    icon: option.icon,
    projectName: clientCopy.value.alternateDetail.split(' · ')[0],
    title: clientCopy.value.alternateName || option.id,
    subtitle: clientCopy.value.alternateDetail || '',
    downloadUrl: alternateDownloadUrls.value?.official || option.download,
    mirrorUrl: alternateDownloadUrls.value?.mirror || null,
    projectUrl: option.project,
  })
}
const retryModalDownload = () => {
  const { downloadUrl } = modalProduct.value || {}
  if (downloadUrl) triggerDownload(downloadUrl, { newTab: getLinkKind(downloadUrl) !== 'file' })
}
const continueFromModal = () => {
  const wasHost = modalProduct.value?.scope === 'host'
  closeDownloadCard()
  if (wasHost) {
    nextTick(() => {
      document.getElementById('stream-guide-client')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}
const closeDownloadCard = () => {
  showDownloadModal.value = false
  nextTick(() => downloadTrigger.value?.focus())
}
const onGlobalKeydown = event => {
  if (event.key === 'Escape') openMenu.value = null
}
const onGlobalClick = event => {
  if (event.target instanceof Element && event.target.closest('.guide-more')) return
  openMenu.value = null
}
const selectPlatform = id => {
  if (!isDeviceId(id)) return
  selected.value = id
  manuallySelected.value = true
  detectedSelection.value = false
  try { localStorage.setItem(DEVICE_STORAGE_KEY, id) } catch { /* storage is optional */ }
}

onMounted(() => {
  document.addEventListener('click', onGlobalClick)
  document.addEventListener('keydown', onGlobalKeydown)
  try {
    const stored = localStorage.getItem(DEVICE_STORAGE_KEY)
    if (isDeviceId(stored)) {
      selected.value = stored
    }
  } catch { /* storage is optional */ }

  if (!selected.value) {
    const detected = detectDevice(navigator)
    if (detected) {
      selected.value = detected
      detectedSelection.value = true
    }
  }

  resolveClientReleaseAssets()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onGlobalClick)
  document.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <section id="stream-guide" class="stream-guide section-alt" aria-labelledby="stream-guide-title">
    <div class="container">
      <div class="stream-guide-card">
      <div class="guide-heading">
        <div>
          <h2 id="stream-guide-title">{{ guide.title }}</h2>
          <p>{{ guide.subtitle }}</p>
        </div>
        <a class="guide-browse" href="#products">{{ guide.browse }} ↗</a>
      </div>
      <div class="guide-columns">
        <div class="guide-host">
          <p class="guide-step"><span>1</span>{{ guide.hostStep }}</p>
          <div class="guide-host-product">
            <DeviceIcon name="sun" class="guide-sun" />
            <div>
              <strong>{{ guide.hostName }}</strong>
              <small>{{ guide.hostDescription }}</small>
              <small class="guide-host-platform-row">
                <span>{{ guide.hostPlatform }}</span>
                <button type="button" class="guide-requirements-toggle" :aria-expanded="showRequirements" @click="showRequirements = !showRequirements">
                  {{ copy.download.requirements }}
                  <svg class="chev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </small>
              <ul v-if="showRequirements" class="guide-requirements-list">
                <li v-for="(req, index) in copy.download.requirementsList" :key="index" v-html="req"></li>
              </ul>
            </div>
            <div class="guide-host-actions">
              <a :href="hostUrl" class="btn btn-primary guide-host-download" target="_blank" rel="noopener noreferrer" @click="startHostDownload">
                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
                {{ guide.hostDownload }}
              </a>
              <div class="guide-more">
                <button type="button" class="guide-more-trigger" :aria-expanded="openMenu === 'host'" @click="toggleMenu('host')">
                  {{ guide.moreActions }}
                  <svg class="chev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div v-if="openMenu === 'host'" class="guide-more-menu">
                  <a :href="projectUrl" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                    {{ guide.menuProject }}
                  </a>
                  <a :href="mirrorUrl" @click="startHostMirrorDownload">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
                    {{ guide.menuMirror }}
                  </a>
                  <a :href="projectUrl" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                    {{ guide.menuStar }}
                  </a>
          </div>
        </div>
        </div>
          </div>
        </div>
        <div id="stream-guide-client" class="guide-client">
          <p class="guide-step"><span>2</span>{{ guide.clientStep }}</p>
          <p class="guide-client-note">{{ guide.clientDescription }}</p>
          <div class="guide-platforms" role="group" :aria-label="guide.platformGroup">
            <button v-for="platform in platforms" :key="platform.id" type="button" :class="{ active: selected === platform.id }" :aria-pressed="selected === platform.id" @click="selectPlatform(platform.id)">
              <DeviceIcon :name="platform.icon" />
              <span>{{ guide.platforms[platform.id].label }}</span>
              <span v-if="selected === platform.id" class="guide-selected-mark" aria-hidden="true">✓</span>
            </button>
          </div>
          <p v-if="detectedSelection && !manuallySelected" class="guide-detected">{{ guide.detected }}</p>
          <p v-if="!client" class="guide-empty" aria-live="polite">{{ guide.empty }}</p>
          <div v-else class="guide-result">
            <div aria-live="polite" class="guide-result-info">
              <strong>{{ clientCopy.name || clientCopy.label }}</strong>
              <small v-if="clientProductName" class="guide-result-product">{{ clientProductName }}</small>
              <small v-if="clientDevices" class="guide-result-devices">{{ guide.devicesLabel }}{{ clientDevices }}</small>
            </div>
            <div class="guide-result-actions">
              <template v-if="client.download">
                <a :href="clientUrl" class="btn btn-primary" target="_blank" rel="noopener noreferrer" @click="startClientDownload">
                  <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
                  {{ client.store ? guide.store : guide.download }}
                </a>
                <div v-if="client.project" class="guide-more">
                  <button type="button" class="guide-more-trigger" :aria-expanded="openMenu === 'client-main'" @click="toggleMenu('client-main')">
                    {{ guide.moreActions }}
                    <svg class="chev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                <div v-if="openMenu === 'client-main'" class="guide-more-menu">
                  <a :href="client.project" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                    {{ guide.menuProject }}
                  </a>
                  <a v-if="clientMirrorUrl" :href="clientMirrorUrl" @click="startClientMirrorDownload">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
                    {{ guide.menuMirror }}
                  </a>
                  <a :href="client.project" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                      {{ guide.menuStar }}
                    </a>
                  </div>
                </div>
              </template>
             <template v-else>
               <span class="guide-coming-soon">{{ guide.comingSoon }}</span>
            </template>
           </div>
         </div>
          <div v-if="clientFriendUrl" class="guide-friend-section">
            <p class="guide-friend-title">{{ guide.friendTitle }}</p>
            <div class="guide-friend-card">
              <div><strong>{{ clientFriendLink.name }}</strong></div>
              <div class="guide-result-actions">
                <a :href="clientFriendUrl" class="btn btn-primary" target="_blank" rel="noopener noreferrer">{{ clientFriendAction }}</a>
              </div>
            </div>
          </div>
          <div v-for="option in clientOtherOptions" :key="option.id" class="guide-alternate-result">
            <div>
              <strong>{{ clientCopy.alternateName }}</strong>
              <small>{{ clientCopy.alternateDetail }}</small>
              <small class="guide-alternate-hint">{{ guide.alternateHint }}</small>
            </div>
            <div class="guide-result-actions">
              <a :href="alternateDownloadUrls?.official || option.download" class="btn btn-primary" target="_blank" rel="noopener noreferrer" @click="startAlternateDownload($event, option)">
                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
                {{ guide.download }}
              </a>
              <div v-if="option.project" class="guide-more">
                <button type="button" class="guide-more-trigger" :aria-expanded="openMenu === 'client-alt'" @click="toggleMenu('client-alt')">
                  {{ guide.moreActions }}
                  <svg class="chev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div v-if="openMenu === 'client-alt'" class="guide-more-menu">
                  <a :href="option.project" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                    {{ guide.menuProject }}
                  </a>
                  <a :href="option.project" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                    {{ guide.menuStar }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="guide-help">
        <div class="guide-help-main">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <strong>{{ guide.helpTitle }}</strong>
          <a :href="communityUrl" class="guide-help-link" target="_blank" rel="noopener noreferrer" @click="openQqGroup">{{ guide.communityQq }}</a>
          <a :href="issueUrl" class="guide-help-link" target="_blank" rel="noopener noreferrer">{{ guide.communityIssue }}</a>
        </div>
      </div>

      <DownloadModal
        v-if="showDownloadModal && modalProduct"
        :product="modalProduct"
        :copy="guide.downloadModal"
        @close="closeDownloadCard"
        @retry="retryModalDownload"
        @continue="continueFromModal"
      />
    </div>
  </div>
  </section>
</template>

<style scoped lang="less">
.stream-guide { padding: 2.5rem 0 1.5rem; scroll-margin-top: 96px; }
.stream-guide > .container { width: 100%; max-width: 1200px; margin-inline: auto; }
.stream-guide-card { width: 100%; margin-inline: auto; padding: 2rem; border: 1px solid var(--border-color); border-radius: 24px; background: linear-gradient(135deg, var(--background-primary), var(--background-secondary)); box-shadow: var(--card-shadow); }
.guide-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.75rem; h2 { margin: 0 0 0.5rem; color: var(--text-primary); font-family: var(--font-sans); font-size: 1.75rem; font-weight: 700; line-height: 1.25; letter-spacing: normal; } p { margin: 0; color: var(--text-secondary); font-family: var(--font-sans); font-size: 1rem; line-height: 1.6; } }
.guide-browse { font-size: 0.875rem; }
a { color: var(--primary-color); font-family: var(--font-sans); font-size: 0.875rem; font-weight: 600; flex-shrink: 0; }
[data-theme="chocolate"] a { color: var(--primary-light); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; min-height: 36px; padding: 0.55rem 0.9rem; border-radius: 8px; border: 1px solid transparent; font-family: var(--font-sans); font-size: 0.875rem; font-weight: 600; line-height: 1.25; text-decoration: none; }
.btn-primary { background: var(--primary-color); color: var(--text-inverse) !important; }
.btn-primary:hover { color: var(--text-inverse) !important; opacity: 0.9; }
.btn-icon { width: 15px; height: 15px; flex-shrink: 0; }
.guide-columns { display: flex; flex-direction: column; gap: 1.25rem; }
.guide-host { padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); }
.guide-client { scroll-margin-top: 96px; }
.guide-step { display: flex; align-items: center; gap: 0.5rem; margin: 0 0 0.9rem; color: var(--text-primary); font-family: var(--font-sans); font-size: 0.9375rem; font-weight: 700; line-height: 1.6; span { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: color-mix(in srgb, var(--primary-color) 16%, var(--background-primary)); color: var(--primary-color); font-size: 0.8125rem; font-weight: 700; } }
.guide-host-product { display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 12px; background: var(--background-secondary); }
strong { display: block; color: var(--text-primary); font-family: var(--font-sans); font-size: 1rem; font-weight: 700; line-height: 1.4; }
small { display: block; margin-top: 0.3rem; color: var(--text-secondary); font-family: var(--font-sans); font-size: 0.8125rem; line-height: 1.5; }
.guide-sun { width: 40px; height: 40px; padding: 9px; border-radius: 12px; background: var(--background-secondary); color: var(--primary-color); flex-shrink: 0; }
.guide-host-download { margin-left: auto; white-space: nowrap; }
.guide-host-actions { display: flex; align-items: center; gap: 0.75rem; margin-left: auto; }
.guide-host-platform-row { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45rem; }
.guide-requirements-toggle { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.22rem 0.6rem; border: 1px solid color-mix(in srgb, var(--primary-color) 35%, var(--border-color)); border-radius: 999px; background: color-mix(in srgb, var(--primary-color) 8%, var(--background-primary)); color: var(--text-secondary); font-family: var(--font-sans); font-size: 0.6875rem; font-weight: 600; line-height: 1.5; cursor: pointer; user-select: none; transition: color 0.2s, border-color 0.2s, background 0.2s; .chev { width: 11px; height: 11px; transition: transform 0.2s; } &:hover { color: var(--primary-color); border-color: var(--primary-color); } &[aria-expanded='true'] { color: var(--primary-color); border-color: var(--primary-color); background: color-mix(in srgb, var(--primary-color) 12%, var(--background-primary)); .chev { transform: rotate(180deg); } } }
.guide-requirements-list { margin: 0.5rem 0 0; padding-left: 1rem; color: var(--text-secondary); font-family: var(--font-sans); font-size: 0.75rem; line-height: 1.8; }
.guide-platforms { display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 0.45rem; button { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.35rem; min-height: 66px; padding: 0.4rem 0.2rem; border: 1px solid var(--border-color); border-radius: 10px; background: var(--background-secondary); color: var(--text-primary); font-family: var(--font-sans); font-size: 0.75rem; font-weight: 500; line-height: 1.35; cursor: pointer; transition: border-color 0.2s, color 0.2s, transform 0.2s; &:hover { transform: translateY(-1px); } &.active { border-color: var(--primary-color); color: var(--primary-color); background: color-mix(in srgb, var(--primary-color) 10%, var(--background-primary)); } } svg { width: 19px; height: 19px; } }
.guide-selected-mark { position: absolute; top: 0.3rem; right: 0.35rem; color: var(--primary-color); font-size: 0.75rem; font-weight: 700; }
.guide-empty, .guide-detected { margin: 0.9rem 0 0; color: var(--text-secondary); font-family: var(--font-sans); font-size: 0.875rem; line-height: 1.6; }
.guide-result { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 0.9rem; padding: 1rem; border: 1px solid color-mix(in srgb, var(--primary-color) 35%, var(--border-color)); border-radius: 12px; background: color-mix(in srgb, var(--primary-color) 10%, var(--background-secondary)); }
.guide-result-info { display: flex; flex-direction: column; min-width: 0; }
.guide-result-product { margin-top: 0.25rem; color: var(--text-primary); font-weight: 600; }
.guide-result-devices { color: var(--text-secondary); }
.guide-result-actions { display: flex; align-items: center; gap: 0.75rem; }
.guide-project-link, .guide-star-link { white-space: nowrap; }
.guide-star-link { color: var(--text-secondary); }
[data-theme="chocolate"] .guide-star-link { color: var(--text-secondary); }
.guide-more { position: relative; }
.guide-more-trigger { display: inline-flex; align-items: center; gap: 0.4rem; min-height: 36px; padding: 0.55rem 0.9rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--background-secondary); color: var(--text-secondary); font-family: var(--font-sans); font-size: 0.875rem; font-weight: 600; line-height: 1.25; cursor: pointer; white-space: nowrap; transition: border-color 0.2s, color 0.2s; &:hover { border-color: var(--primary-color); color: var(--primary-color); } &[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); } }
.chev { width: 14px; height: 14px; flex-shrink: 0; }
.guide-more-menu { position: absolute; right: 0; top: calc(100% + 6px); min-width: 168px; padding: 0.4rem; border: 1px solid var(--border-color); border-radius: 10px; background: var(--background-primary); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14); z-index: 30; display: flex; flex-direction: column; a { display: flex; align-items: center; gap: 0.55rem; padding: 0.5rem 0.6rem; border-radius: 6px; color: var(--text-primary); font-weight: 500; text-decoration: none; white-space: nowrap; svg { width: 15px; height: 15px; color: var(--text-muted); flex-shrink: 0; } &:hover { background: color-mix(in srgb, var(--primary-color) 10%, var(--background-primary)); color: var(--primary-color); svg { color: var(--primary-color); } } } }
[data-theme="chocolate"] .guide-more-menu { background: var(--background-secondary); }
.guide-coming-soon { color: var(--text-muted); font-family: var(--font-sans); font-size: 0.875rem; white-space: nowrap; }
.guide-friend-section { margin-top: 0.9rem; }
.guide-friend-title { margin: 0 0 0.5rem; color: var(--text-secondary); font-family: var(--font-sans); font-size: 0.75rem; font-weight: 600; line-height: 1.5; text-transform: uppercase; letter-spacing: 0.04em; }
.guide-friend-card { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.75rem 1rem; border: 1px dashed var(--border-color); border-radius: 10px; background: var(--background-secondary); }
.guide-alternate-result { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 0.5rem; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 10px; background: var(--background-secondary); }
.guide-client-note { margin: -0.55rem 0 0.9rem; color: var(--text-secondary); font-family: var(--font-sans); font-size: 0.875rem; line-height: 1.6; }
.guide-alternate-hint { margin-top: 0.2rem; color: var(--text-secondary); }
.guide-help { display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; padding: 0.9rem 1rem; border: 1px solid var(--border-color); border-radius: 12px; background: var(--background-secondary); }
.guide-help-main { display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; > svg { width: 18px; height: 18px; color: var(--primary-color); flex-shrink: 0; } strong { display: inline; margin: 0; font-size: 0.875rem; } }
.guide-help-link { font-size: 0.8125rem; font-weight: 600; }
a:focus-visible, button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 3px; }
@media (max-width: 1050px) { .guide-platforms { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
@media (max-width: 768px) { .guide-heading h2 { font-size: 1.5rem; } }
@media (max-width: 640px) {
  .stream-guide { padding-top: 1.5rem; }
  .stream-guide-card { padding: 1.25rem; border-radius: 18px; }
  .guide-heading { align-items: flex-start; flex-direction: column; }
  .guide-platforms { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .guide-host-product { flex-wrap: wrap; }
  .guide-host-actions { width: 100%; margin-left: 0; flex-wrap: wrap; justify-content: center; }
  .guide-host-download { flex: 1 1 auto; }
  .guide-host-actions .guide-project-link { flex: 0 1 auto; }
  .guide-result, .guide-alternate-result { align-items: flex-start; flex-direction: column; }
  .guide-friend-card { align-items: flex-start; flex-direction: column; }
  .guide-result-actions { width: 100%; flex-wrap: wrap; }
  .guide-result-actions .btn { flex: 1 1 auto; }
}
</style>
