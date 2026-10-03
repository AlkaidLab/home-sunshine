// Download and release metadata policy.
//
// Chinese pages resolve release metadata through the same-origin
// /release-metadata route first. That route returns the current CNB asset URL
// and its GitHub fallback. If the proxy is unavailable, the versioned asset
// name kept below is used to build a direct CNB URL. GitHub remains the final
// fallback. English pages resolve directly from GitHub and never depend on the
// release-metadata proxy.

export const RELEASE_METADATA_PATH = '/release-metadata'

export const CNB_RELEASE_REPOSITORIES = Object.freeze({
  sunshine: 'AlkaidLab/foundation-sunshine-release',
  androidVplus: 'AlkaidLab/moonlight-vplus-android-release',
  moonlightPc: 'AlkaidLab/moonlight-vplus-pc-release',
  'macos-enhanced': 'AlkaidLab/moonlight-macos-enhanced-release',
})

export const GITHUB_RELEASE_REPOSITORIES = Object.freeze({
  sunshine: 'AlkaidLab/foundation-sunshine',
  androidVplus: 'qiin2333/moonlight-vplus',
  moonlightPc: 'qiin2333/moonlight-qt',
  'macos-enhanced': 'skyhua0224/moonlight-macos-enhanced',
})

const RELEASE_METADATA_FILES = Object.freeze({
  sunshine: 'foundation-sunshine.json',
  androidVplus: 'moonlight-vplus.json',
  moonlightPc: 'moonlight-vplus-pc.json',
  'macos-enhanced': 'moonlight-macos-enhanced.json',
})

// These names are only the offline fallback used when the metadata proxy is
// unavailable. Normal requests use the current asset URL from release JSON.
const FALLBACK_ASSETS = Object.freeze({
  sunshine: 'Sunshine.v2026.0925.WindowsInstaller.exe',
  androidVplus: 'Moonlight.V+.12.12.12.apk',
  'macos-enhanced': 'Moonlight-macOS-Enhanced-universal.dmg',
  moonlightPc: Object.freeze({
    windows: 'Moonlight-VPlus-Setup-6.4.5.exe',
    macos: 'Moonlight-VPlus-6.4.5-arm64.dmg',
    linux: 'Moonlight-VPlus-6.4.5-x86_64.AppImage',
    steam: 'Moonlight-VPlus-SteamLink-6.4.5.zip',
  }),
})

const PRODUCT_KEYS = Object.freeze({
  'android-vplus': 'androidVplus',
  'moonlight-pc': 'moonlightPc',
})

const PRE_RELEASE_PATTERN = /(?:^|[-_.])(?:alpha|beta|rc|pre)(?:[-_.]|$)/i

const cnbReleaseUrl = (repository, assetName) =>
  `https://cnb.cool/${repository}/-/releases/latest/download/${encodeURIComponent(assetName)}`

const githubReleaseUrl = (repository, assetName) =>
  `https://github.com/${repository}/releases/latest/download/${encodeURIComponent(assetName)}`

const normalizeProductKey = productKey => PRODUCT_KEYS[productKey] || productKey

const getFallbackAssetName = (productKey, device = 'windows') => {
  const key = normalizeProductKey(productKey)
  return key === 'moonlightPc'
    ? FALLBACK_ASSETS.moonlightPc[device]
    : FALLBACK_ASSETS[key]
}

const getProductConfig = productKey => {
  const key = normalizeProductKey(productKey)
  if (!RELEASE_METADATA_FILES[key]) return null
  return {
    key,
    metadataFile: RELEASE_METADATA_FILES[key],
    cnbRepository: CNB_RELEASE_REPOSITORIES[key],
    githubRepository: GITHUB_RELEASE_REPOSITORIES[key],
  }
}

const getDirectUrls = (productKey, device = 'windows', assetName = null) => {
  const config = getProductConfig(productKey)
  const name = assetName || getFallbackAssetName(productKey, device)
  if (!config || !name) return { cnb: null, github: null, assetName: null }

  return {
    cnb: cnbReleaseUrl(config.cnbRepository, name),
    github: githubReleaseUrl(config.githubRepository, name),
    assetName: name,
  }
}

// Synchronous links are used immediately on first paint, before the metadata
// request finishes. They also provide the final offline fallback.
export const getReleaseDownloadUrls = (
  productKey,
  device = 'windows',
  githubAssetUrl = null,
  lang = 'zh',
) => {
  const fallback = getDirectUrls(productKey, device)
  const github = typeof githubAssetUrl === 'string' && githubAssetUrl
    ? githubAssetUrl
    : fallback.github
  const cnb = typeof githubAssetUrl === 'string' && githubAssetUrl.includes('/download/')
    ? cnbReleaseUrl(
      getProductConfig(productKey)?.cnbRepository,
      decodeURIComponent(githubAssetUrl.slice(githubAssetUrl.lastIndexOf('/') + 1)),
    )
    : fallback.cnb

  return lang === 'zh'
    ? { official: cnb, mirror: github }
    : { official: github, mirror: cnb }
}

export const getReleaseMetadataUrl = productKey => {
  const config = getProductConfig(productKey)
  return config ? `${RELEASE_METADATA_PATH}/${config.metadataFile}` : null
}

const pickAsset = (assets, predicates = []) => {
  for (const predicate of predicates) {
    const asset = (assets || []).find(item => predicate(item))
    if (asset) return asset
  }
  return null
}

const assetType = type => asset => asset?.type === type
const assetName = pattern => asset => pattern.test(asset?.name || '')

const assetPredicates = {
  sunshine: {
    windows: [assetType('windows-x64-installer'), assetName(/WindowsInstaller\.exe$/i)],
  },
  androidVplus: {
    android: [assetType('android-apk'), assetName(/\.apk$/i)],
  },
  moonlightPc: {
    windows: [assetType('windows-x64-installer'), assetName(/(?:setup|installer).*\.exe$/i)],
    macos: [assetType('macos-universal-dmg'), assetName(/universal.*\.dmg$/i), assetType('macos-arm64-dmg'), assetName(/arm64.*\.dmg$/i), assetType('macos-x64-dmg'), assetName(/(?:x86_64|x64).*\.dmg$/i)],
    linux: [assetType('linux-x64-appimage'), assetName(/x86_64.*\.appimage$/i)],
    steam: [assetType('steam-link-zip'), assetName(/steamlink.*\.zip$/i)],
  },
  'macos-enhanced': {
    macos: [assetType('macos-universal-dmg'), assetName(/universal.*\.dmg$/i), assetType('macos-arm64-dmg'), assetName(/arm64.*\.dmg$/i), assetType('macos-x64-dmg'), assetName(/(?:x86_64|x64).*\.dmg$/i)],
  },
}

const selectReleaseAsset = (productKey, device, assets) => {
  const key = normalizeProductKey(productKey)
  return pickAsset(assets, assetPredicates[key]?.[device] || [])
}

const isValidReleaseMetadata = data =>
  Boolean(data?.channels?.latest && Array.isArray(data.channels.latest.assets))

const metadataCache = new Map()
const METADATA_CACHE_TTL_MS = 10 * 60 * 1000

const fetchMetadata = async productKey => {
  const url = getReleaseMetadataUrl(productKey)
  if (!url) throw new Error(`Unknown release product: ${productKey}`)

  const cached = metadataCache.get(url)
  if (cached && Date.now() - cached.timestamp < METADATA_CACHE_TTL_MS) return cached.data

  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`Release metadata ${response.status}`)

  const data = await response.json()
  if (!isValidReleaseMetadata(data)) throw new Error('Invalid release metadata')

  metadataCache.set(url, { timestamp: Date.now(), data })
  return data
}

const githubReleaseCache = new Map()
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000

const fetchGithubLatestAsset = async (productKey, device) => {
  const config = getProductConfig(productKey)
  const predicates = assetPredicates[config?.key]?.[device] || []
  if (!config || !predicates.length) return null

  const cacheKey = `${config.githubRepository}:${device}`
  const cached = githubReleaseCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < GITHUB_CACHE_TTL_MS) return cached.asset

  const response = await fetch(
    `https://api.github.com/repos/${config.githubRepository}/releases?per_page=20`,
    { cache: 'no-store', headers: { Accept: 'application/vnd.github+json' } },
  )
  if (!response.ok) throw new Error(`GitHub release API ${response.status}`)

  const releases = await response.json()
  const release = Array.isArray(releases)
    ? releases.find(item => !item.draft && !item.prerelease && !PRE_RELEASE_PATTERN.test(item.tag_name || ''))
    : null
  const asset = release ? pickAsset(release.assets, predicates) : null
  githubReleaseCache.set(cacheKey, { timestamp: Date.now(), asset })
  return asset
}

// Resolve the links used by the download UI. For Chinese pages the order is:
// same-origin metadata proxy -> direct CNB -> GitHub. For other languages the
// order starts at GitHub and does not request the metadata proxy.
export const resolveReleaseDownloadUrls = async (productKey, device = 'windows', lang = 'zh') => {
  const fallback = getReleaseDownloadUrls(productKey, device, null, lang)
  const direct = getDirectUrls(productKey, device)

  if (lang !== 'zh') {
    try {
      const asset = await fetchGithubLatestAsset(productKey, device)
      if (asset?.browser_download_url) {
        return {
          official: asset.browser_download_url,
          mirror: direct.cnb,
          source: 'github',
          version: null,
          candidates: [asset.browser_download_url, direct.cnb].filter(Boolean),
        }
      }
    } catch {
      // The static GitHub latest-download URL remains usable as a fallback.
    }

    return {
      ...fallback,
      source: 'github-fallback',
      version: null,
      candidates: [fallback.official, direct.cnb].filter(Boolean),
    }
  }

  try {
    const metadata = await fetchMetadata(productKey)
    const channel = metadata.channels.latest
    const asset = selectReleaseAsset(productKey, device, channel.assets)
    if (asset?.url) {
      const github = asset.fallbackUrl || direct.github
      return {
        official: asset.url,
        mirror: github,
        source: 'release-metadata',
        version: channel.version || null,
        candidates: [asset.url, direct.cnb, github].filter((url, index, list) => url && list.indexOf(url) === index),
      }
    }
  } catch {
    // Fall through to direct CNB, then GitHub.
  }

  return {
    official: direct.cnb || direct.github,
    mirror: direct.github,
    source: direct.cnb ? 'cnb-fallback' : 'github-fallback',
    version: null,
    candidates: [direct.cnb, direct.github].filter(Boolean),
  }
}

export const buildCnbUrl = (repositoryKey, assetName) => {
  const repository = CNB_RELEASE_REPOSITORIES[repositoryKey]
  return repository && assetName ? cnbReleaseUrl(repository, assetName) : null
}

export const CNB_DOWNLOADS = Object.freeze({
  sunshine: getReleaseDownloadUrls('sunshine', 'windows').official,
  androidVplus: getReleaseDownloadUrls('androidVplus', 'android').official,
  'macos-enhanced': getReleaseDownloadUrls('macos-enhanced', 'macos').official,
  moonlightPc: Object.freeze({
    windows: getReleaseDownloadUrls('moonlightPc', 'windows').official,
    macos: getReleaseDownloadUrls('moonlightPc', 'macos').official,
    linux: getReleaseDownloadUrls('moonlightPc', 'linux').official,
    steam: getReleaseDownloadUrls('moonlightPc', 'steam').official,
  }),
})

export const GITHUB_DOWNLOADS = Object.freeze({
  sunshine: getReleaseDownloadUrls('sunshine', 'windows', null, 'en').official,
  androidVplus: getReleaseDownloadUrls('androidVplus', 'android', null, 'en').official,
  'macos-enhanced': getReleaseDownloadUrls('macos-enhanced', 'macos', null, 'en').official,
  moonlightPc: Object.freeze({
    windows: getReleaseDownloadUrls('moonlightPc', 'windows', null, 'en').official,
    macos: getReleaseDownloadUrls('moonlightPc', 'macos', null, 'en').official,
    linux: getReleaseDownloadUrls('moonlightPc', 'linux', null, 'en').official,
    steam: getReleaseDownloadUrls('moonlightPc', 'steam', null, 'en').official,
  }),
})
