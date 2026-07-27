/**
 * 多语言翻译配置
 * Internationalization (i18n) translations
 */
export const translations = {
  zh: {
    title: '瑶光流梦',
    tagline: '让游戏串流更优雅',
      subtitle: 'Sunshine，一个自托管的 Moonlight 游戏串流服务端，现已提供 HDR 友好的分支版本，集成了虚拟显示器和控制面板等功能。',
    nav: {
      features: '特性',
      download: '下载',
      clients: '客户端',
      stats: 'Star 趋势',
      docs: '文档',
      sponsors: '赞助'
    },
    hero: {
      badge: '游戏串流平台',
      h1Prefix: '瑶光流梦 Sunshine 游戏串流服务端 —',
      download: '立即下载',
      github: 'GitHub开源仓库',
      mirror: '镜像下载',
      moonlightClient: '下载 Moonlight 客户端',
      stats: ['低延迟', 'HDR 支持', '基地虚拟显示器']
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
      githubReleases: 'GitHub Releases',
      mirrorDownload: '镜像下载',
      domesticSpeed: '国内加速',
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
      title: 'Star 趋势',
      subtitle: '查看项目的 GitHub Star 增长趋势',
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
      copyright: '© 2024 瑶光流梦. 基于 LizardByte/Sunshine 修改.',
      icp: '蜀ICP备2025162900号-3',
      icpLink: 'https://beian.miit.gov.cn/',
      policePlaceholder: '川公网安备51130202000571号',
      policeBadgeAlt: '公安备案警徽'
    }
  },
  en: {
    title: 'AlkaidLab Sunshine',
    tagline: 'Make Game Streaming Greater',
    subtitle: 'Sunshine, a self-hosted game-stream host for Moonlight, now features an HDR-friendly fork that integrates virtual displays and control panels.',
    nav: {
      features: 'Features',
      download: 'Download',
      clients: 'Clients',
      stats: 'Star History',
      docs: 'Docs',
      sponsors: 'Sponsors'
    },
    hero: {
      badge: 'Game Streaming Platform',
      h1Prefix: 'AlkaidLab Sunshine game streaming host —',
      download: 'Download Now',
      github: 'GitHub Repository',
      mirror: 'Mirror Download',
      moonlightClient: 'Download Moonlight Client',
      stats: ['Low Latency', 'HDR Support', 'Virtual Display']
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
      githubReleases: 'GitHub Releases',
      mirrorDownload: 'Mirror Download',
      domesticSpeed: 'Domestic Speed',
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
      title: 'Star History',
      subtitle: 'View GitHub Star growth trends',
      loading: 'Loading Star History...',
      error: 'Unable to load Star History chart',
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
      copyright: '© 2025 AlkaidLab Sunshine. Modified from LizardByte/Sunshine.',
      icp: 'Shu ICP 2025162900-3',
      icpLink: 'https://beian.miit.gov.cn/',
      policePlaceholder: 'Sichuan Public Security No. 51130202000571',
      policeBadgeAlt: 'Public security filing badge'
    }
  }
}
