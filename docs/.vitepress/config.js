import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { SITE_URL, OG_IMAGE } from '../../src/site-meta.js'
import { tokenizeSearch } from './search.js'
import { manualNavigation } from './manual-nav.js'

export default defineConfig({
  lang: 'zh-CN',
  title: '瑶光流梦',
  titleTemplate: ':title - 瑶光流梦',
  description: '瑶光流梦使用手册：快速开始、Sunshine 服务端、Moonlight 客户端与故障排查。',
  base: '/docs/',
  cleanUrls: false,
  outDir: resolve(import.meta.dirname, '../../dist/docs'),
  appearance: { initialValue: 'light' },
  markdown: {
    config(md) {
      // Keep native table layout inside a separate keyboard-scrollable viewport.
      md.renderer.rules.table_open = (tokens, index, options, env, self) =>
        '<div class="docs-table" role="region" aria-label="表格" tabindex="0">' +
        self.renderToken(tokens, index, options)
      md.renderer.rules.table_close = (tokens, index, options, env, self) =>
        self.renderToken(tokens, index, options) + '</div>\n'
    },
  },
  vite: { ssr: { noExternal: ['vitepress-theme-teek'] } },
  head: [
    ['script', { id: 'sync-site-theme' }, `try {
      const theme = localStorage.getItem('theme')
      if (theme === 'gura' || theme === 'chocolate') {
        localStorage.setItem('vitepress-theme-appearance', theme === 'chocolate' ? 'dark' : 'light')
      }
    } catch {}`],
    ['link', { rel: 'icon', type: 'image/webp', href: `${SITE_URL}/favicon.webp` }],
    ['meta', { property: 'og:site_name', content: '瑶光流梦' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
  ],
  transformHead({ pageData }) {
    const path = `/docs/${pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '.html')}`
    const canonical = `${SITE_URL}${path}`
    const title = `${pageData.title} - 瑶光流梦`
    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:type', content: pageData.relativePath === 'index.md' ? 'website' : 'article' }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: pageData.description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: pageData.description }],
    ]
  },
  sitemap: { hostname: `${SITE_URL}/docs/` },
  themeConfig: {
    teekHome: false,
    pageStyle: 'default',
    themeEnhance: { enabled: false },
    windowTransition: false,
    viewTransition: { enabled: false },
    anchorScroll: false,
    breadcrumb: { enabled: false },
    articleAnalyze: { showInfo: false },
    articleUpdate: { enabled: false },
    codeBlock: { enabled: true },
    backTop: { enabled: true },
    toComment: { enabled: false },
    footerInfo: {
      theme: { name: 'Teek · 瑶光定制' },
      copyright: { show: false },
      bottomMessage: '瑶光流梦 · AlkaidLab',
    },
    siteTitle: '瑶光流梦 · 文档',
    nav: [
      { text: '文档中心', link: '/' },
      { text: '使用手册', link: '/getting-started/', activeMatch: '/(getting-started|server|clients|troubleshooting)/' },
      { text: '返回官网', link: SITE_URL, target: '_self' },
    ],
    sidebar: [
      { text: '文档中心', link: '/' },
      ...manualNavigation,
      {
        text: '开发手记',
        items: [{ text: '杜比视界：从元数据到原生输出', link: '/dolby-vision-dev-journal-zh' }],
      },
      {
        text: '技术公告',
        items: [{ text: '手柄支持与自研触觉 SDK', link: '/razer-haptics-sdk-announcement-zh' }],
      },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    editLink: {
      pattern: 'https://github.com/AlkaidLab/home-sunshine/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: { tokenize: tokenizeSearch },
          searchOptions: { combineWith: 'AND', prefix: true, fuzzy: 0.2 },
        },
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清除搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到相关内容',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换至深色模式',
    lightModeSwitchTitle: '切换至浅色模式',
    sidebarMenuLabel: '文档导航',
    returnToTopLabel: '返回顶部',
    skipToContentLabel: '跳转到正文',
    externalLinkIcon: true,
    notFound: {
      title: '页面未找到',
      quote: '这个页面可能已移动，请返回文档中心或使用搜索查找。',
      linkLabel: '返回文档中心',
      linkText: '返回文档中心',
    },
  },
})
