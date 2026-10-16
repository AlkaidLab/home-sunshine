import { computed } from 'vue'
import { useData } from 'vitepress'
import { localizedDocPath } from '../../../src/docs-links.js'

export const messages = {
  zh: {
    center: '文档中心',
    breadcrumb: '当前位置',
    journal: '开发手记',
    announcement: '技术公告',
    start: '从这里开始',
    startDetail: '完成你的第一次串流',
    help: '太阳娘陪你排查',
    helpDetail: '别着急，我们从现象开始。',
    helpLink: '打开故障排查',
    tip: '太阳娘的进阶技巧',
    screenshot: '查看完整截图，重点区域',
    home: {
      eyebrow: '瑶光流梦 · 文档中心',
      title: '游戏的下一站，',
      emphasis: '由你决定。',
      description: ['从游戏电脑到手边的屏幕。', '在这里，开始串流、探索设置，让每一次游玩更自在。'],
      start: '开始第一次串流',
      clients: '选择客户端',
      common: '常用内容',
      visual: '太阳娘陪你，完成第一次串流',
      host: '游戏电脑',
      device: '你的设备',
      kicker: '一步一步，找到你的节奏',
      guideTitle: '你想从哪里开始？',
      guideNote: '四个章节，一份完整的使用指南',
      rescueTitle: '遇到问题，也有路可循。',
      rescueText: '先找到现象，再检查设置。我们把常见问题整理在了一起。',
      rescueLink: '查看故障排查',
      articlesKicker: '不止于使用',
      articlesTitle: '走近瑶光的开发现场',
      articlesNote: '开发手记与技术公告',
      read: '阅读文章',
      footer: '每一次连接，都离游戏更近一点。',
      upstream: 'Sunshine 上游文档',
      issues: '问题反馈',
      guides: [
        [
          '快速开始',
          '第一次串流，从这里开始',
          '准备设备、安装和 PIN 配对，再按功能与平台支持导航探索进阶用法。',
          '跟着步骤，完成连接',
        ],
        [
          '服务端',
          '准备好你的游戏电脑',
          '配置虚拟显示器、HDR、画质增强、文件共享与会话自动化。',
          'Sunshine 配置指南',
        ],
        [
          '客户端',
          '找到适合你的游玩方式',
          '选择客户端，调整画质，使用王冠、手柄与兼容的增强功能。',
          'Moonlight 设备指南',
        ],
        [
          '故障排查',
          '让串流重新流畅起来',
          '连接失败、黑屏、卡顿或没有声音？按遇到的现象逐步排查。',
          '从问题找到解决方法',
        ],
      ],
      topics: ['功能与平台支持', '虚拟显示器', 'HDR 与校准', '外网访问', '连接与配对'],
      articles: [
        [
          '开发手记 · 显示与画质',
          '杜比视界：从元数据到原生输出',
          '沿着真实的适配过程，了解原生输出与设备黑屏的排查思路。',
        ],
        [
          '技术公告 · 操作与反馈',
          '手柄支持与自研触觉 SDK',
          '探索触觉支持的技术路线，以及更多设备的扩展方向。',
        ],
      ],
    },
  },
  en: {
    center: 'Documentation',
    breadcrumb: 'You are here',
    journal: 'Dev journals',
    announcement: 'Announcements',
    start: 'Start here',
    startDetail: 'Complete your first stream',
    help: 'Troubleshoot with Sunshine Girl',
    helpDetail: 'Start with what you see.',
    helpLink: 'Troubleshooting',
    tip: 'Sunshine Girl’s advanced tips',
    screenshot: 'View full screenshot, focus region',
    home: {
      eyebrow: 'AlkaidLab · Documentation',
      title: 'Your next screen.',
      emphasis: 'Your choice.',
      description: [
        'From your gaming PC to the screen in your hands.',
        'Start streaming, explore the settings, and make yourself at home.',
      ],
      start: 'Start your first stream',
      clients: 'Choose a client',
      common: 'Popular topics',
      visual: 'Stream with Sunshine Girl',
      host: 'Gaming PC',
      device: 'Your device',
      kicker: 'Find your own pace',
      guideTitle: 'Where would you like to start?',
      guideNote: 'Four sections, one streaming guide',
      translationNote:
        'English chapters are being added. Links marked 中文 open the Chinese manual. Search covers pages in the current language.',
      rescueTitle: 'Find a way through.',
      rescueText: 'Identify the symptom, then check the settings with our troubleshooting guides.',
      rescueLink: 'Troubleshooting',
      articlesKicker: 'Behind the experience',
      articlesTitle: 'Inside AlkaidLab development',
      articlesNote: 'Dev journals and announcements',
      read: 'Read article',
      footer: 'Every connection brings you closer to your game.',
      upstream: 'Upstream Sunshine docs',
      issues: 'Report an issue',
      guides: [
        [
          'Quick start',
          'Your first stream starts here',
          'Prepare your devices, install the apps, pair with a PIN, and check your first connection.',
          'Follow the steps to connect',
        ],
        [
          'Server',
          'Prepare your gaming PC',
          'Set up virtual displays, HDR, video enhancements, file sharing, and session automation.',
          'Sunshine setup',
        ],
        [
          'Clients',
          'Find your way to play',
          'Choose a client, tune video quality, and explore Crown layouts, controllers, and supported enhancements.',
          'Moonlight devices',
        ],
        [
          'Troubleshooting',
          'Get your stream running smoothly',
          'Work through connection failures, black screens, stuttering, or missing audio by symptom.',
          'Find a solution',
        ],
      ],
      topics: [
        'Features & platforms',
        'Virtual displays',
        'HDR & calibration',
        'Remote access',
        'Connection & pairing',
      ],
      articles: [
        [
          'Dev journal · Video',
          'Dolby Vision: from metadata to native output',
          'Follow real device integration and investigate black screens and native output.',
        ],
        [
          'Announcement · Input',
          'Controllers and our haptics SDK',
          'Explore the technical direction of haptics support and plans for more devices.',
        ],
      ],
    },
  },
}

export function useDocsI18n() {
  const { lang } = useData()
  const locale = computed(() => (lang.value.startsWith('en') ? 'en' : 'zh'))
  return {
    locale,
    copy: computed(() => messages[locale.value]),
    docPath: (path) => localizedDocPath(path, locale.value),
    languageSuffix: (path) =>
      locale.value === 'en' && localizedDocPath(path, 'en') === path ? ' (中文)' : '',
  }
}
