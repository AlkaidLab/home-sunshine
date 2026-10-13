// Download and release metadata policy.
//
// Chinese pages resolve release metadata through the same-origin
// website metadata -> CNB metadata -> GitHub stable releases. English pages
// resolve directly from GitHub. Never guess a versioned installer filename:
// if every lookup fails, let the user choose a file on the release page.

export const RELEASE_METADATA_PATH = '/website-release-metadata'
const CNB_METADATA_BASE = 'https://cnb.cool/AlkaidLab/release-metadata/-/releases/download/latest'

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

const PRODUCT_KEYS = Object.freeze({
  'android-vplus': 'androidVplus',
  'moonlight-pc': 'moonlightPc',
})

const PRE_RELEASE_PATTERN = /(?:^|[-_.])(?:alpha|beta|rc|pre)(?:[-_.]|$)/i

const cnbReleaseUrl = (repository, assetName) =>
  `https://cnb.cool/${repository}/-/releases/latest/download/${encodeURIComponent(assetName)}`

const normalizeProductKey = productKey => PRODUCT_KEYS[productKey] || productKey

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

// Preserve the resolved release tag and filename when switching mirrors.
const getCnbAssetUrl = (config, githubUrl) => {
  const suffix = githubUrl?.match(/\/releases\/(latest\/download\/[^/?#]+|download\/[^/]+\/[^/?#]+)$/)?.[1]
  return suffix ? `https://cnb.cool/${config.cnbRepository}/-/releases/${suffix}` : null
}

// Before the click-time lookup finishes, links point to release pages only.
export const getReleaseDownloadUrls = (
  productKey,
  device = 'windows',
  githubAssetUrl = null,
  lang = 'zh',
) => {
  const config = getProductConfig(productKey)
  if (!config) return { official: null, mirror: null }
  const github = githubAssetUrl || `https://github.com/${config.githubRepository}/releases/latest`
  const cnb = getCnbAssetUrl(config, githubAssetUrl)
    || `https://cnb.cool/${config.cnbRepository}/-/releases/latest`

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
  Boolean(data?.channels?.latest && !data.channels.latest.prerelease && Array.isArray(data.channels.latest.assets))

const metadataCache = new Map()
const METADATA_CACHE_TTL_MS = 10 * 60 * 1000
const RELEASE_REQUEST_TIMEOUT_MS = 5000

const fetchReleaseJson = async (url, accept = 'application/json') => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), RELEASE_REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: accept },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`Release lookup ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timeout)
  }
}

const fetchMetadata = async url => {
  const cached = metadataCache.get(url)
  if (cached && Date.now() - cached.timestamp < METADATA_CACHE_TTL_MS) return cached.data

  const data = await fetchReleaseJson(url)
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

  const releases = await fetchReleaseJson(
    `https://api.github.com/repos/${config.githubRepository}/releases?per_page=20`,
    'application/vnd.github+json',
  )
  const release = Array.isArray(releases)
    ? releases.find(item => !item.draft && !item.prerelease && !PRE_RELEASE_PATTERN.test(item.tag_name || ''))
    : null
  const asset = release ? pickAsset(release.assets, predicates) : null
  githubReleaseCache.set(cacheKey, { timestamp: Date.now(), asset })
  return asset
}

// Resolve the links used by the download UI. For Chinese pages the order is:
// same-origin metadata proxy -> CNB metadata -> GitHub. For other languages the
// order starts at GitHub and does not request the metadata proxy.
export const resolveReleaseDownloadUrls = async (productKey, device = 'windows', lang = 'zh') => {
  const fallback = getReleaseDownloadUrls(productKey, device, null, lang)
  const config = getProductConfig(productKey)
  if (!config) return { ...fallback, source: 'release-page', version: null, candidates: [] }

  if (lang === 'zh') {
    for (const [source, url] of [
      ['release-metadata', getReleaseMetadataUrl(productKey)],
      ['cnb-metadata', `${CNB_METADATA_BASE}/${config.metadataFile}`],
    ]) {
      try {
        const metadata = await fetchMetadata(url)
        const channel = metadata.channels.latest
        const asset = selectReleaseAsset(productKey, device, channel.assets)
        if (!asset?.url) continue
        const github = asset.fallbackUrl || `https://github.com/${config.githubRepository}/releases/latest`
        return {
          official: asset.url,
          mirror: github,
          source,
          version: channel.version || null,
          candidates: [asset.url, github],
        }
      } catch {
        // Try the next metadata source, including malformed/HTML responses.
      }
    }
  }

  try {
    const asset = await fetchGithubLatestAsset(productKey, device)
    if (asset?.browser_download_url) {
      const github = asset.browser_download_url
      const cnb = getCnbAssetUrl(config, github)
        || `https://cnb.cool/${config.cnbRepository}/-/releases/latest`
      return {
        official: github,
        mirror: cnb,
        source: 'github',
        version: null,
        candidates: [github, cnb].filter(Boolean),
      }
    }
  } catch {
    // No file address could be resolved. Offer release pages, never an old file.
  }

  return {
    official: `https://github.com/${config.githubRepository}/releases/latest`,
    mirror: `https://cnb.cool/${config.cnbRepository}/-/releases/latest`,
    source: 'release-page',
    version: null,
    candidates: [],
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
