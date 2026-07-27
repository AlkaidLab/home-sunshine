/**
 * 站点级 SEO 元信息，供客户端（App.vue）与构建脚本（scripts/*.mjs）共用。
 * 这里只依赖纯 JS，Node 可以直接 import，避免两边各写一份导致漂移。
 */

export const SITE_URL = 'https://www.alkaidlab.com'
export const OG_IMAGE = `${SITE_URL}/log.png`
export const DEFAULT_LANGUAGE = 'zh'

export const LANGUAGES = ['zh', 'en']

/** 每种语言对应的入口路径，同时也是 hreflang / canonical 的依据。 */
export const LANG_PATHS = {
  zh: '/',
  en: '/en/',
}

export const HTML_LANG = {
  zh: 'zh-CN',
  en: 'en',
}

export const siteMeta = {
  zh: {
    title: '瑶光流梦 - 让游戏串流更优雅',
    description:
      '瑶光流梦是基于 LizardByte/Sunshine 官方分支修改的自托管游戏串流服务端，提供 HDR 友好支持、内置虚拟显示器、远程麦克风与高级控制面板，配合 Moonlight 客户端实现低延迟串流。',
    keywords:
      'AlkaidLab,瑶光流梦,游戏串流,Sunshine,Moonlight,HDR串流,虚拟显示器,远程串流,游戏流媒体,串流服务端',
    ogLocale: 'zh_CN',
    ogLocaleAlternate: 'en_US',
    siteName: '瑶光流梦',
  },
  en: {
    title: 'AlkaidLab Sunshine - Make Game Streaming Greater',
    description:
      'AlkaidLab Sunshine is a self-hosted game streaming host forked from LizardByte/Sunshine, adding HDR-friendly encoding, a built-in virtual display, remote microphone support and an advanced control panel for low-latency Moonlight streaming.',
    keywords:
      'AlkaidLab,Sunshine,game streaming,Moonlight,HDR streaming,virtual display,remote play,self-hosted game stream',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'zh_CN',
    siteName: 'AlkaidLab Sunshine',
  },
}

export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

/** 结构化数据：这是一个可下载的 Windows 软件，用 SoftwareApplication 最贴切。 */
export const buildJsonLd = (lang) => {
  const meta = siteMeta[lang]
  const url = absoluteUrl(LANG_PATHS[lang])

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: meta.siteName,
      alternateName: lang === 'zh' ? 'AlkaidLab Sunshine' : '瑶光流梦',
      description: meta.description,
      url,
      image: OG_IMAGE,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Windows 10 22H2 or later',
      softwareRequirements:
        lang === 'zh'
          ? '支持硬件编码的显卡（Intel VAAPI / AMD VCE 1.0+ / NVIDIA NVENC），4GB 以上内存'
          : 'A GPU with hardware encoding (Intel VAAPI / AMD VCE 1.0+ / NVIDIA NVENC) and 4GB+ RAM',
      downloadUrl: 'https://github.com/AlkaidLab/foundation-sunshine/releases/latest',
      softwareHelp: absoluteUrl('/docs/'),
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY',
      },
      author: {
        '@type': 'Organization',
        name: 'AlkaidLab',
        url: SITE_URL,
      },
      isBasedOn: 'https://github.com/LizardByte/Sunshine',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: meta.siteName,
      url,
      inLanguage: HTML_LANG[lang],
      publisher: {
        '@type': 'Organization',
        name: 'AlkaidLab',
        url: SITE_URL,
        logo: OG_IMAGE,
      },
    },
  ]
}
