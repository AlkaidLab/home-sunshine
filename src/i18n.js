/**
 * 多语言翻译配置
 * Internationalization (i18n) translations
 */
export const translations = {
  zh: {
    title: '瑶光流梦',
    tagline: '在手机、电视和掌机上玩电脑游戏',
    subtitle: '用 Sunshine 串流主机连接全平台 Moonlight 客户端',
    nav: {
      brand: '瑶光流梦 · AlkaidLab',
      github: 'GitHub 仓库',
      bilibili: 'B 站频道',
      features: '特性',
      download: '下载',
      clients: '客户端',
      stats: '点亮Star',
      docs: '文档',
      sponsors: '赞助',
      start: '开始使用',
      support: '文档与支持',
      toDark: '切换至深色模式',
      toLight: '切换至浅色模式'
    },
    hero: {
      title: '电脑游戏，换个屏幕玩',
      h1Prefix: '瑶光流梦 — PC 游戏串流到手机、电视与 VR —',
      start: '开始串流！',
      github: '访问开源仓库',
      moonlightClient: '选择客户端',
      intro: ['瑶光流梦提供增强版 Sunshine 与多平台 Moonlight 客户端，', '从游戏电脑到手边设备，持续打磨画质、操控与连接体验。'],
      tags: ['HDR 画面优化', '自定义触控', '虚拟显示器'],
      metrics: '已有 1 万+ 位玩家点亮 Star，下载量 100 万+ 次',
      note: '使用时，需要你的游戏电脑保持开机并联网。',
      stats: ['低延迟串流', 'HDR 支持', '虚拟显示器']
    },
    guide: {
      title: '开始你的串流体验',
      subtitle: '游戏电脑安装 Sunshine，游玩设备选择对应客户端。',
      browse: '浏览全部产品',
      hostStep: '游戏电脑安装 Sunshine',
      hostName: 'Sunshine',
      hostPlatform: 'Windows 10 22H2+',
      hostDescription: '负责发送画面，执行操作。',
      hostDownload: '获取应用',
      star: '加星星 ↗',
      clientStep: '游玩设备安装 Moonlight',
      clientDescription: '接收画面，将你的操作传回电脑。',
      alternateHint: '两个版本都能连接主机，任选其一安装即可。',
      platformGroup: '客户端平台',
      devicesLabel: '适配：',
      download: '获取应用',
      project: '项目主页 ↗',
      friendTitle: '友情链接',
      friendAction: '查看 ↗',
      friendDescription: '社区维护的 iOS 客户端',
      comingSoon: '敬请期待',
      empty: '选择游玩设备，查看对应客户端。',
      detected: '已按当前浏览设备预选，你也可以选择其他设备。',
      store: '前往应用市场',
      moreActions: '更多操作',
      menuProject: '项目主页',
      menuMirror: '镜像下载',
      menuStar: 'Star 仓库',
      helpAskCommunity: '需要帮助？',
      helpAskIssue: '想要提建议？',
      communityQq: '加入交流群 ↗',
      communityIssue: '提交 Issue ↗',
      downloadModal: {
        productTitle: '瑶光流梦 Sunshine',
        productSubtitle: '游戏电脑串流核心',
        status: '已发起下载请求',
        statusHint: '请在浏览器的下载列表中查看。',
        retryHint: '如果没有开始下载，可以尝试重新下载或使用镜像下载。',
        statusPage: '请在下载页面选择安装包',
        statusStore: '正在打开应用市场',
        statusStoreHint: '请在应用市场中获取应用。',
        retryAction: '重新下载',
        openPageAction: '手动打开下载页面',
        openStoreAction: '手动打开应用市场',
        mirrorAction: '镜像下载',
        helpAction: '下载遇到问题?',
        supportTitle: '支持 {name}',
        supportDesc: '喜欢这个项目？欢迎前往 GitHub 点亮 Star。',
        starAction: '去 GitHub 点 Star ↗',
        continueAction: '继续选择客户端',
        continueBrowse: '继续浏览',
        close: '关闭'
      },
      platforms: {
        android: { label: 'Android', name: 'Android 客户端', detail: 'Moonlight V+ · 手机 · 平板' },
        windows: { label: 'Windows', name: 'Windows 客户端', detail: 'PC Moonlight V+ · 电脑' },
        harmony: { label: '鸿蒙 NEXT', name: '鸿蒙客户端', detail: 'Moonlight V+ · 应用市场下载' },
        ios: { label: 'iPhone / iPad', name: '基地版 iOS 客户端', detail: '适用于 iPhone 与 iPad' },
        macos: { label: 'macOS', name: 'macOS 客户端', detail: 'PC Moonlight V+', alternateName: 'macOS 增强客户端', alternateDetail: 'Moonlight macOS Enhanced · 基地成员维护' },
        linux: { label: 'Linux', name: 'Linux 客户端', detail: 'PC Moonlight V+ · 桌面端' },
        steam: { label: 'Steam Link', name: 'Steam Link 客户端', detail: 'PC Moonlight V+ · Steam Link 设备' },
        'android-tv': { label: 'Android TV', name: 'Android TV 客户端', detail: 'Moonlight V+ · 电视大屏' },
        quest: { label: 'Quest VR', name: 'Quest VR 客户端', detail: 'Moonlight V+ · VR 头显' },
        'apple-tv': { label: 'Apple TV', name: 'Apple TV 客户端', detail: '适用于 Apple TV' }
      }
    },
    catalog: {
      title: '产品矩阵',
      subtitle: '找到适合你的串流工具，从主机到各平台客户端。',
      filters: { all: '全部产品', host: '主机', client: '客户端', friend: '友情链接' },
      filterLabel: '产品分类',
      empty: '这个分类暂无对应产品。',
      note: '生态客户端包含社区项目，具体功能、系统要求与收费情况以各项目页面为准。',
      friends: '友情链接',
      friendProducts: {
        'voidlink-ios': { name: 'VoidLink', description: '社区开发的 iPhone / iPad 客户端，已上架 App Store，免费下载，连接电脑即可游玩。' },
        'voidlink-apple-tv': { name: 'VoidLink', description: '社区开发的 Apple TV 客户端，通过 TestFlight 安装体验版，在大屏上畅玩电脑游戏。' }
      },
      friendAction: '查看 ↗',
      products: {
        sunshine: { name: 'Sunshine', description: '安装在游戏电脑上，运行游戏并将画面串流到其他设备。' },
        'android-vplus': { name: 'Android 客户端', description: 'Moonlight V+ · 在手机、平板与电视上连接游戏电脑。' },
        'moonlight-pc': { name: 'PC 客户端', description: 'PC Moonlight V+ · 适用于 Windows、macOS 与 Linux。' },
        'harmonyos-vplus': { name: '鸿蒙客户端', description: 'Moonlight V+ · 前往应用市场安装。' },
        ios: { name: '基地版 iOS 客户端', description: 'iPhone 与 iPad 客户端，敬请期待。' },
        'macos-enhanced': { name: 'macOS 增强客户端', description: 'Moonlight macOS Enhanced · 基地成员维护。' },
        'apple-tv': { name: 'Apple TV 客户端', description: 'Apple TV 客户端，敬请期待。' },
        upcoming: { name: '更多客户端', description: '基地版 iOS、Apple TV 与 Xbox 客户端正在开发中，敬请期待。', platforms: 'iPhone / iPad · Apple TV · Xbox' }
      }
    },
    features: {
      title: '核心特性',
      items: [
        {
          title: 'HDR友好支持',
          description: '经过优化的HDR处理管线，提供真正的HDR游戏流媒体体验'
        },
        {
          title: '虚拟显示器',
          description: '内置虚拟显示器管理，无需额外软件即可创建和管理虚拟显示器'
        },
        {
          title: '远程麦克风',
          description: '支持接收客户端麦克风，提供高音质的语音直通功能'
        },
        {
          title: '低延迟传输',
          description: '结合最新硬件能力优化的编码处理，提供流畅的游戏体验'
        },
        {
          title: '高级控制面板',
          description: '直观的Web控制界面，提供实时监控和配置管理'
        },
        {
          title: '智能配对',
          description: '智能管理配对设备的对应配置文件'
        }
      ]
    },
    download: {
      title: '下载 瑶光流梦 Sunshine',
      latestVersion: '最新版本',
      checkUpdate: '检查更新',
      checking: '正在检查最新版本...',
      error: '无法检查版本信息，使用默认下载地址',
      retry: '重试',
      requirements: '系统要求',
      requirementsList: [
        '系统: Windows10 22H2+',
        'CPU: Intel Core i3 / AMD Ryzen 3 以上',
        'GPU: 支持硬件编码的显卡, 支持VCE 1.0或更高版本, Intel VAAPI / AMD VCE / <a target="_blank" rel="noopener noreferrer" href="https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new">Nvidia NVENC</a>',
        'RAM: 4GB 或更多',
        '网络: 5GHz, 802.11ac'
      ],
      windowsLatest: 'Windows 最新版',
      recommended: '推荐使用',
      allVersions: '所有版本',
      releasesSource: '查看历史安装包',
      mirrorDownload: '镜像下载',
      mirrorSource: '备用下载渠道',
      moonlightClient: '下载 Moonlight 客户端',
      moonlightClientDesc: '查看推荐客户端',
      prerelease: '预发布版本可用',
      prereleaseFound: '发现新的预发布版本',
      viewPrerelease: '查看预发布版本'
    },
    clients: {
      title: '推荐的 Moonlight 客户端',
      subtitle: '建议使用以下经过优化的客户端获得最佳的串流体验',
      downloadBtn: '下载',
      comingSoon: '待发布'
    },
    stats: {
      title: '点亮Star',
      subtitle: '点亮 Star，收藏项目并支持我们持续开发',
      trendIntro: '下面是 AlkaidLab 主力项目的仓库 Star 趋势~',
      repositoryTabs: '选择要查看的仓库',
      repositories: {
        sunshine: 'Foundation Sunshine',
        androidMoonlight: '安卓 Moonlight V+',
        moonlightPc: 'PC Moonlight V+',
        macosEnhanced: 'macOS enhanced'
      },
      selectRepository: '点击上方仓库查看 Star 趋势',
      loading: '正在加载 Star 趋势...',
      error: '无法加载 Star 趋势图表',
      viewManually: '手动查看',
      giveStar: '给个 Star',
      viewStats: '查看详细统计'
    },
    docs: {
      title: '文档与支持',
      userGuide: '使用文档',
      userGuideDesc: '详细的使用指南和配置说明',
      docCenter: '文档中心',
      docCenterDesc: '技术公告与项目说明合集',
      officialDocs: '官方文档',
      officialDocsDesc: 'LizardByte 官方文档参考',
      bilibili: 'B 站频道',
      bilibiliDesc: '观看功能演示与教程视频，关注频道获取更新动态。',
      qqGroup: 'QQ 交流群',
      qqGroupDesc: '加入社区获取帮助'
    },
    sponsors: {
      title: '感谢赞助者',
      subtitle: '正是他们的支持让这个项目得以持续发展',
      becomeSponsor: '成为赞助者',
      ifdian: '爱发电赞助',
      wechat: '微信赞赏',
      alipay: '支付宝赞赏',
      wechatModalBadge: '官方收款码',
      wechatModalTitle: '微信扫码赞赏工作室',
      wechatModalSubtitle: '支持我们持续开发与维护',
      wechatModalNote: '',
      closeModal: '关闭弹层',
      commercial: '金牌赞助商',
      emptyCommercial: '虚位以待，等待您的加入',
      gold: '金牌赞助者',
      silver: '银牌赞助者',
      bronze: '铜牌赞助者',
      emptyGold: '虚位以待，等待您的加入',
      emptySilver: '您的名字将展示在这里',
      emptyBronze: '支持开源，从小额开始'
    },
    footer: {
      title: '瑶光流梦',
      subtitle: '让游戏串流更优雅',
      links: '相关链接',
      copyright: '© 2024 瑶光流梦 · AlkaidLab',
      icp: '蜀ICP备2025162900号-3',
      icpLink: 'https://beian.miit.gov.cn/',
      policePlaceholder: '川公网安备51130202000571号',
      policeBadgeAlt: '公安备案警徽'
    }
  },
  en: {
    title: 'AlkaidLab Sunshine',
    tagline: 'Play PC games on any screen',
    subtitle: 'Connect a Sunshine host to Moonlight clients on every platform',
    nav: {
      brand: 'AlkaidLab Sunshine',
      github: 'GitHub repository',
      bilibili: 'Bilibili channel',
      features: 'Features',
      download: 'Get App',
      clients: 'Clients',
      stats: 'Stars',
      docs: 'Docs',
      sponsors: 'Sponsors',
      start: 'Get started',
      support: 'Docs & support',
      toDark: 'Switch to dark mode',
      toLight: 'Switch to light mode'
    },
    hero: {
      title: 'PC games, on any screen',
      h1Prefix: 'AlkaidLab — Stream PC games to phones, TVs and VR —',
      start: 'Get the App →',
      github: 'Open Repository',
      moonlightClient: 'Choose a client',
      intro: ['AlkaidLab offers an enhanced Sunshine host and Moonlight clients for every platform,', 'polishing picture quality, controls and connectivity from your gaming PC to the device in your hand.'],
      tags: ['HDR picture', 'Custom touch controls', 'Virtual display'],
      metrics: '10k+ Stars · 1M+ downloads from players worldwide',
      note: 'Your gaming PC needs to stay on and online while you play.',
      stats: ['Low Latency', 'HDR Support', 'Virtual Display']
    },
    guide: {
      title: 'Start your streaming experience',
      subtitle: 'Install Sunshine on your gaming PC, then pick the right client for your device.',
      browse: 'Browse all products',
      hostStep: 'Install Sunshine on your gaming PC',
      hostName: 'Sunshine',
      hostPlatform: 'Windows 10 22H2+',
      hostDescription: 'Streams the picture and carries out your input.',
      hostDownload: 'Get App',
      star: 'Star on GitHub ↗',
      clientStep: 'Install Moonlight on your play device',
      clientDescription: 'Receives the picture and sends your controls back to the PC.',
      alternateHint: 'Both clients work with the host — pick either one.',
      platformGroup: 'Client platform',
      devicesLabel: 'Supports: ',
      download: 'Get App',
      project: 'Project ↗',
      friendTitle: 'Friendly Links',
      friendAction: 'View ↗',
      friendDescription: 'Community-maintained iOS client',
      comingSoon: 'Coming soon',
      empty: 'Choose your playing device to find a client.',
      detected: 'Selected for your current device. You can choose any other device.',
      store: 'Open AppGallery',
      moreActions: 'More',
      menuProject: 'Project',
      menuMirror: 'Mirror download',
      menuStar: 'Star repo',
      helpAskCommunity: 'Need help?',
      helpAskIssue: 'Have suggestions?',
      communityQq: 'Join the community ↗',
      communityIssue: 'Open an issue ↗',
      downloadModal: {
        productTitle: 'AlkaidLab Sunshine',
        productSubtitle: 'Game streaming core for your PC',
        status: 'Download request sent',
        statusHint: 'Check your browser’s download list.',
        retryHint: 'If the download didn’t start, try again or use the mirror.',
        statusPage: 'Pick the installer on the download page',
        statusStore: 'Opening the app store',
        statusStoreHint: 'Get the app from the store.',
        retryAction: 'Download again',
        openPageAction: 'Open the download page',
        openStoreAction: 'Open the app store',
        mirrorAction: 'Mirror download',
        helpAction: 'Download issues?',
        supportTitle: 'Support {name}',
        supportDesc: 'Like this project? Visit GitHub and leave a Star.',
        starAction: 'Star on GitHub ↗',
        continueAction: 'Continue to clients',
        continueBrowse: 'Keep browsing',
        close: 'Close'
      },
      platforms: {
        android: { label: 'Android', name: 'Android Client', detail: 'Moonlight V+ · Phones · Tablets' },
        windows: { label: 'Windows', name: 'Windows Client', detail: 'PC Moonlight V+ · Desktop' },
        harmony: { label: 'HarmonyOS NEXT', name: 'HarmonyOS Client', detail: 'Moonlight V+ · AppGallery' },
        ios: { label: 'iPhone / iPad', name: 'AlkaidLab iOS Client', detail: 'For iPhone and iPad' },
        macos: { label: 'macOS', name: 'macOS Client', detail: 'PC Moonlight V+', alternateName: 'macOS Enhanced Client', alternateDetail: 'Moonlight macOS Enhanced · Lab member maintained' },
        linux: { label: 'Linux', name: 'Linux Client', detail: 'PC Moonlight V+ · Desktop' },
        steam: { label: 'Steam Link', name: 'Steam Link Client', detail: 'PC Moonlight V+ · Steam Link' },
        'android-tv': { label: 'Android TV', name: 'Android TV Client', detail: 'Moonlight V+ · TV' },
        quest: { label: 'Quest VR', name: 'Quest VR Client', detail: 'Moonlight V+ · VR Headset' },
        'apple-tv': { label: 'Apple TV', name: 'Apple TV Client', detail: 'For Apple TV' }
      }
    },
    catalog: {
      title: 'Product ecosystem',
      subtitle: 'Find the streaming host and clients that work for you.',
      filters: { all: 'All products', host: 'Hosts', client: 'Clients', friend: 'Friend links' },
      filterLabel: 'Product category',
      empty: 'No products in this category for this platform.',
      note: 'The ecosystem includes community projects. Features, system requirements and pricing are determined by each project.',
      friends: 'Friends of AlkaidLab',
      friendProducts: {
        'voidlink-ios': { name: 'VoidLink', description: 'A community-built iPhone / iPad client on the App Store — free to download and play.' },
        'voidlink-apple-tv': { name: 'VoidLink', description: 'A community-built Apple TV client, installed via TestFlight for big-screen play.' }
      },
      friendAction: 'View ↗',
      products: {
        sunshine: { name: 'Sunshine', description: 'Install on your gaming PC to stream games to other devices.' },
        'android-vplus': { name: 'Android Client', description: 'Moonlight V+ · Connect from phones, tablets and TVs.' },
        'moonlight-pc': { name: 'PC Client', description: 'PC Moonlight V+ · For Windows, macOS and Linux.' },
        'harmonyos-vplus': { name: 'HarmonyOS Client', description: 'Moonlight V+ · Available on AppGallery.' },
        ios: { name: 'AlkaidLab iOS client', description: 'An iPhone and iPad client. Coming soon.' },
        'macos-enhanced': { name: 'macOS Enhanced Client', description: 'Moonlight macOS Enhanced · Maintained by a lab member.' },
        'apple-tv': { name: 'Apple TV client', description: 'An Apple TV client. Coming soon.' },
        upcoming: { name: 'More clients', description: 'AlkaidLab iOS, Apple TV and Xbox clients are in development. Stay tuned.', platforms: 'iPhone / iPad · Apple TV · Xbox' }
      }
    },
    features: {
      title: 'Core Features',
      items: [
        {
          title: 'HDR-Friendly Support',
          description: 'Optimized HDR processing pipeline for true HDR game streaming experience'
        },
        {
          title: 'Virtual Display',
          description: 'Built-in virtual display management without additional software'
        },
        {
          title: 'Remote Microphone',
          description: 'Support client microphone with high-quality voice passthrough'
        },
        {
          title: 'Low Latency',
          description: 'Optimized encoding with latest hardware capabilities for smooth gaming'
        },
        {
          title: 'Advanced Control Panel',
          description: 'Intuitive web interface with real-time monitoring and configuration'
        },
        {
          title: 'Smart Pairing',
          description: 'Intelligently manage configuration files for paired devices'
        }
      ]
    },
    download: {
      title: 'Download AlkaidLab Sunshine',
      latestVersion: 'Latest Version',
      checkUpdate: 'Check Update',
      checking: 'Checking latest version...',
      error: 'Unable to check version info, using default download link',
      retry: 'Retry',
      requirements: 'System Requirements',
      requirementsList: [
        'OS: Windows 10 22H2+',
        'CPU: Intel Core i3 / AMD Ryzen 3 or higher',
        'GPU: Hardware encoding support, VCE 1.0+, Intel VAAPI / AMD VCE / <a target="_blank" rel="noopener noreferrer" href="https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new">Nvidia NVENC</a>',
        'RAM: 4GB or more',
        'Network: 5GHz, 802.11ac'
      ],
      windowsLatest: 'Windows Latest',
      recommended: 'Recommended',
      allVersions: 'All Versions',
      releasesSource: 'Browse past installers',
      mirrorDownload: 'Mirror Download',
      mirrorSource: 'Alternate download channel',
      moonlightClient: 'Download Moonlight Client',
      moonlightClientDesc: 'View recommended clients',
      prerelease: 'Pre-release Available',
      prereleaseFound: 'New pre-release version found',
      viewPrerelease: 'View Pre-release'
    },
    clients: {
      title: 'Recommended Moonlight Clients',
      subtitle: 'Use these optimized clients for the best streaming experience',
      downloadBtn: 'Download',
      comingSoon: 'Coming soon'
    },
    stats: {
      title: 'Star',
      subtitle: 'Star our projects on GitHub to support development',
      trendIntro: 'Here are the repository Star trends of AlkaidLab\'s core projects~',
      repositoryTabs: 'Choose a repository to view',
      repositories: {
        sunshine: 'Foundation Sunshine',
        androidMoonlight: 'Android Moonlight V+',
        moonlightPc: 'PC Moonlight V+',
        macosEnhanced: 'macOS enhanced'
      },
      selectRepository: 'Choose a repository above to view its Stars',
      loading: 'Loading Stars...',
      error: 'Unable to load the Stars chart',
      viewManually: 'View Manually',
      giveStar: 'Give a Star',
      viewStats: 'View Detailed Stats'
    },
    docs: {
      title: 'Documentation & Support',
      userGuide: 'User Guide',
      userGuideDesc: 'Detailed usage guide and configuration instructions',
      docCenter: 'Doc Center',
      docCenterDesc: 'Technical announcements and project write-ups',
      officialDocs: 'Official Docs',
      officialDocsDesc: 'LizardByte official documentation reference',
      bilibili: 'Bilibili Channel',
      bilibiliDesc: 'Watch feature demos and tutorials — follow for updates.',
      qqGroup: 'QQ Group',
      qqGroupDesc: 'Join the community for help'
    },
    sponsors: {
      title: 'Sponsors',
      subtitle: 'Their support makes this project possible',
      becomeSponsor: 'Become a Sponsor',
      ifdian: 'Afdian (ifdian)',
      wechat: 'WeChat Pay',
      alipay: 'Alipay',
      wechatModalBadge: 'Studio Support',
      wechatModalTitle: 'Support The Studio Via WeChat',
      wechatModalSubtitle: 'Scan with WeChat Pay to support the studio and ongoing maintenance.',
      wechatModalNote: 'If you would like your name shown in the sponsors section, contact the studio after donating.',
      closeModal: 'Close dialog',
      gold: 'Gold Sponsors',
      silver: 'Silver Sponsors',
      bronze: 'Bronze Sponsors',
      commercial: 'Commercial Sponsors',
      emptyCommercial: 'Your logo here — become the first!',
      emptyGold: 'Your logo here — become the first!',
      emptySilver: 'Your name will appear here',
      emptyBronze: 'Support open source, start small'
    },
    footer: {
      title: 'AlkaidLab Sunshine',
      subtitle: 'Make Game Streaming Greater',
      links: 'Links',
      copyright: '© 2024 AlkaidLab Sunshine',
      icp: 'Shu ICP 2025162900-3',
      icpLink: 'https://beian.miit.gov.cn/',
      policePlaceholder: 'Sichuan Public Security No. 51130202000571',
      policeBadgeAlt: 'Public security filing badge'
    }
  }
}
