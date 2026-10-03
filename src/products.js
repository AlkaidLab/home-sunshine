// Devices are entry points, not separate products. Keep release/project URLs here
// so the quick guide and the full catalogue cannot drift apart.

const CURRENT_RELEASE_ASSETS = {
  sunshine: 'Sunshine.v2026.0925.WindowsInstaller.exe',
  androidVplus: 'Moonlight.V+.12.12.12.apk',
  'macos-enhanced': 'Moonlight-macOS-Enhanced-universal.dmg',
  moonlightPc: {
    windows: 'Moonlight-VPlus-Setup-6.4.4.exe',
    macos: 'Moonlight-VPlus-6.4.4-arm64.dmg',
    linux: 'Moonlight-VPlus-6.4.4-x86_64.AppImage',
    steam: 'Moonlight-VPlus-SteamLink-6.4.4.zip',
  },
}

const cnbReleaseUrl = (repository, assetName) =>
  `https://cnb.cool/${repository}/-/releases/latest/download/${encodeURIComponent(assetName)}`

const githubReleaseUrl = (repository, assetName) =>
  `https://github.com/${repository}/releases/latest/download/${encodeURIComponent(assetName)}`

export const CNB_RELEASE_REPOSITORIES = {
  sunshine: 'AlkaidLab/foundation-sunshine-release',
  androidVplus: 'AlkaidLab/moonlight-vplus-android-release',
  moonlightPc: 'AlkaidLab/moonlight-vplus-pc-release',
  'macos-enhanced': 'AlkaidLab/moonlight-macos-enhanced-release',
}

const GITHUB_RELEASE_REPOSITORIES = {
  sunshine: 'AlkaidLab/foundation-sunshine',
  androidVplus: 'qiin2333/moonlight-vplus',
  moonlightPc: 'qiin2333/moonlight-qt',
  'macos-enhanced': 'skyhua0224/moonlight-macos-enhanced',
}

// CNB mirrors GitHub releases automatically. The download URLs below are only
// startup fallbacks — at runtime, getReleaseDownloadUrls() rebuilds CNB links
// from the GitHub API-resolved filename so new releases need no code changes.
export const CNB_DOWNLOADS = {
  sunshine: cnbReleaseUrl(CNB_RELEASE_REPOSITORIES.sunshine, CURRENT_RELEASE_ASSETS.sunshine),
  androidVplus: cnbReleaseUrl(CNB_RELEASE_REPOSITORIES.androidVplus, CURRENT_RELEASE_ASSETS.androidVplus),
  'macos-enhanced': cnbReleaseUrl(CNB_RELEASE_REPOSITORIES['macos-enhanced'], CURRENT_RELEASE_ASSETS['macos-enhanced']),
  moonlightPc: Object.fromEntries(Object.entries(CURRENT_RELEASE_ASSETS.moonlightPc).map(([device, assetName]) => [
    device,
    cnbReleaseUrl(CNB_RELEASE_REPOSITORIES.moonlightPc, assetName),
  ])),
}

export const GITHUB_DOWNLOADS = {
  sunshine: githubReleaseUrl(GITHUB_RELEASE_REPOSITORIES.sunshine, CURRENT_RELEASE_ASSETS.sunshine),
  androidVplus: githubReleaseUrl(GITHUB_RELEASE_REPOSITORIES.androidVplus, CURRENT_RELEASE_ASSETS.androidVplus),
  'macos-enhanced': githubReleaseUrl(GITHUB_RELEASE_REPOSITORIES['macos-enhanced'], CURRENT_RELEASE_ASSETS['macos-enhanced']),
  moonlightPc: Object.fromEntries(Object.entries(CURRENT_RELEASE_ASSETS.moonlightPc).map(([device, assetName]) => [
    device,
    githubReleaseUrl(GITHUB_RELEASE_REPOSITORIES.moonlightPc, assetName),
  ])),
}

export const getReleaseDownloadUrls = (productKey, device = 'windows', githubAssetUrl = null, lang = 'zh') => {
  const sourceKey = productKey === 'android-vplus' ? 'androidVplus' : productKey
  const cnbFallback = productKey === 'moonlightPc'
    ? CNB_DOWNLOADS.moonlightPc[device]
    : CNB_DOWNLOADS[sourceKey]
  const githubUrl = githubAssetUrl || (productKey === 'moonlightPc'
    ? GITHUB_DOWNLOADS.moonlightPc[device]
    : GITHUB_DOWNLOADS[sourceKey])
  const cnbUrl = githubAssetUrl && githubAssetUrl.includes('/download/')
    ? cnbReleaseUrl(CNB_RELEASE_REPOSITORIES[sourceKey], decodeURIComponent(githubAssetUrl.slice(githubAssetUrl.lastIndexOf('/') + 1)))
    : cnbFallback

  return lang === 'zh'
    ? { official: cnbUrl, mirror: githubUrl }
    : { official: githubUrl, mirror: cnbUrl }
}

export const buildCnbUrl = (repositoryKey, assetName) =>
  cnbReleaseUrl(CNB_RELEASE_REPOSITORIES[repositoryKey], assetName)

export const PRODUCTS = [
  { id: 'sunshine', kind: 'host', icon: 'sun', devices: ['windows'], download: 'https://github.com/AlkaidLab/foundation-sunshine/releases/latest', project: 'https://github.com/AlkaidLab/foundation-sunshine' },
  { id: 'android-vplus', kind: 'client', icon: 'android', devices: ['android', 'android-tv', 'quest'], download: 'https://github.com/qiin2333/moonlight-vplus/releases', project: 'https://github.com/qiin2333/moonlight-vplus' },
  { id: 'moonlight-pc', kind: 'client', icon: 'windows', devices: ['windows', 'macos', 'linux', 'steam'], download: 'https://github.com/qiin2333/moonlight-qt/releases', project: 'https://github.com/qiin2333/moonlight-qt' },
  { id: 'harmonyos-vplus', kind: 'client', icon: 'harmony', devices: ['harmony'], download: 'https://appgallery.huawei.com/app/detail?id=com.alkaidlab.sdream', project: 'https://github.com/AlkaidLab/moonlight-harmony', store: true },
  { id: 'ios', kind: 'client', icon: 'apple', devices: ['ios'], download: null, project: null },
  // Stable asset names allow a version-free latest-download URL without an API call.
  { id: 'macos-enhanced', kind: 'client', icon: 'apple', devices: ['macos'], download: 'https://github.com/skyhua0224/moonlight-macos-enhanced/releases/latest/download/Moonlight-macOS-Enhanced-universal.dmg', project: 'https://github.com/skyhua0224/moonlight-macos-enhanced' },
  { id: 'apple-tv', kind: 'client', icon: 'tv', devices: ['apple-tv'], download: null, project: null },
]

export const DEVICES = [
  { id: 'android', icon: 'android' },
  { id: 'windows', icon: 'windows' },
  { id: 'harmony', icon: 'harmony' },
  { id: 'ios', icon: 'apple' },
  { id: 'macos', icon: 'apple' },
  { id: 'linux', icon: 'linux' },
  { id: 'steam', icon: 'steam' },
  { id: 'android-tv', icon: 'tv' },
  { id: 'quest', icon: 'vr' },
  { id: 'apple-tv', icon: 'tv' },
]

export const FRIEND_LINKS = [
  {
    id: 'voidlink-ios',
    devices: ['ios'],
    name: 'VoidLink',
    urls: {
      zh: 'https://apps.apple.com/cn/app/voidlink/id6747717070',
      en: 'https://apps.apple.com/us/app/voidlink-extreme/id6755103808',
    },
  },
  {
    id: 'voidlink-apple-tv',
    devices: ['apple-tv'],
    name: 'VoidLink',
    urls: {
      zh: 'https://testflight.apple.com/join/k7gs61mZ',
      en: 'https://testflight.apple.com/join/k7gs61mZ',
    },
  },
]

export const getClientsForDevice = id =>
  PRODUCTS.filter(product => product.kind === 'client' && product.devices.includes(id))

export const isDeviceId = id => DEVICES.some(device => device.id === id)

export const DEVICE_STORAGE_KEY = 'alkaidlab-playing-device'

// Called only after mounting: SSR and hydration start in the same neutral state.
// Specific Android devices must be tested before the broad Android match.
export const detectDevice = ({ userAgent = '', platform = '', maxTouchPoints = 0 } = {}) => {
  if (/OculusBrowser|Meta Quest|Quest [23Pro]/i.test(userAgent)) return 'quest'
  if (/Android TV|GoogleTV|Google TV|Android.*(?:\bAFT\w*|\bTV\b)/i.test(userAgent)) return 'android-tv'
  if (/Steam Link|SteamLink/i.test(userAgent)) return 'steam'
  if (/AppleTV|Apple TV|tvOS/i.test(userAgent)) return 'apple-tv'
  if (/HarmonyOS|OpenHarmony/i.test(userAgent)) return 'harmony'
  if (/Android/i.test(userAgent)) return 'android'
  if (/iPhone|iPad|iPod/i.test(userAgent) || (/Mac/i.test(platform) && maxTouchPoints > 1)) return 'ios'
  if (/Windows/i.test(userAgent)) return 'windows'
  if (/Macintosh|Mac OS X/i.test(userAgent)) return 'macos'
  if (/Linux/i.test(userAgent)) return 'linux'
  return null
}
