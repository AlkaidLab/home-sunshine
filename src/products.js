// Devices are entry points, not separate products. Keep catalogue and project
// URLs here; release resolution lives in downloads.js so every download entry
// uses the same language-aware fallback policy.

export const PRODUCTS = [
  { id: 'sunshine', kind: 'host', icon: 'sun', devices: ['windows'], download: 'https://github.com/AlkaidLab/foundation-sunshine/releases/latest', project: 'https://github.com/AlkaidLab/foundation-sunshine' },
  { id: 'android-vplus', kind: 'client', icon: 'android', devices: ['android', 'android-tv', 'quest'], download: 'https://github.com/qiin2333/moonlight-vplus/releases', project: 'https://github.com/qiin2333/moonlight-vplus' },
  { id: 'moonlight-pc', kind: 'client', icon: 'windows', devices: ['windows', 'macos', 'linux', 'steam'], download: 'https://github.com/qiin2333/moonlight-qt/releases', project: 'https://github.com/qiin2333/moonlight-qt' },
  { id: 'harmonyos-vplus', kind: 'client', icon: 'harmony', devices: ['harmony'], download: 'https://appgallery.huawei.com/app/detail?id=com.alkaidlab.sdream', project: 'https://github.com/AlkaidLab/moonlight-harmony', store: true },
  { id: 'ios', kind: 'client', icon: 'apple', devices: ['ios'], download: null, project: null },
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
