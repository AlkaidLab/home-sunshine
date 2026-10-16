import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { SITE_URL, OG_IMAGE } from '../../src/site-meta.js'
import { tokenizeSearch } from './search.js'
import { manualNavigation, englishManualNavigation } from './manual-nav.js'
import { hasEnglishTranslation } from '../../src/docs-links.js'

export default defineConfig({
  lang: 'zh-CN',
  title: '瑶光流梦',
  titleTemplate: ':title - 瑶光流梦',
  description: '瑶光流梦使用手册：快速开始、Sunshine 服务端、Moonlight 客户端与故障排查。',
  base: '/docs/',
  cleanUrls: false,
  outDir: resolve(import.meta.dirname, '../../dist/docs'),
  appearance: { initialValue: 'light' },
  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },
    en: {
      label: 'English',
      lang: 'en',
      title: 'AlkaidLab',
      titleTemplate: ':title - AlkaidLab',
      description:
        'AlkaidLab documentation: get started with Sunshine and Moonlight, configure streaming, and troubleshoot issues.',
      themeConfig: {
        siteTitle: 'AlkaidLab · Docs',
        nav: [
          { text: 'Documentation', link: '/en/' },
          {
            text: 'Quick start',
            link: '/en/getting-started/',
            activeMatch: '/en/getting-started/',
          },
          { text: 'Website', link: `${SITE_URL}/en/`, target: '_self' },
        ],
        sidebar: [
          { text: 'Documentation', link: '/en/' },
          ...englishManualNavigation,
          {
            text: 'Articles (中文)',
            items: [
              { text: 'Dolby Vision dev journal', link: '/dolby-vision-dev-journal-zh' },
              { text: 'Controllers & haptics SDK', link: '/razer-haptics-sdk-announcement-zh' },
            ],
          },
        ],
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        editLink: {
          pattern: 'https://github.com/AlkaidLab/home-sunshine/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        langMenuLabel: 'Change language',
        darkModeSwitchLabel: 'Appearance',
        darkModeSwitchTitle: 'Switch to dark theme',
        lightModeSwitchTitle: 'Switch to light theme',
        sidebarMenuLabel: 'Documentation menu',
        returnToTopLabel: 'Back to top',
        skipToContentLabel: 'Skip to content',
        footerInfo: {
          theme: { name: 'Teek · AlkaidLab' },
          copyright: { show: false },
          bottomMessage: 'AlkaidLab',
        },
        notFound: {
          title: 'Page not found',
          quote: 'This page may have moved. Browse the documentation or try search.',
          linkLabel: 'Back to documentation',
          linkText: 'Back to documentation',
        },
      },
    },
  },
  markdown: {
    config(md) {
      // Keep native table layout inside a separate keyboard-scrollable viewport.
      md.renderer.rules.table_open = (tokens, index, options, env, self) =>
        `<div class="docs-table" role="region" aria-label="${env.relativePath?.startsWith('en/') ? 'Table' : '表格'}" tabindex="0">` +
        self.renderToken(tokens, index, options)
      md.renderer.rules.table_close = (tokens, index, options, env, self) =>
        self.renderToken(tokens, index, options) + '</div>\n'
    },
  },
  vite: { ssr: { noExternal: ['vitepress-theme-teek'] } },
  head: [
    [
      'script',
      { id: 'sync-site-theme' },
      `try {
      const theme = localStorage.getItem('theme')
      if (theme === 'gura' || theme === 'chocolate') {
        localStorage.setItem('vitepress-theme-appearance', theme === 'chocolate' ? 'dark' : 'light')
      }
    } catch {}`,
    ],
    ['link', { rel: 'icon', type: 'image/webp', href: `${SITE_URL}/favicon.webp` }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
  ],
  transformHead({ pageData }) {
    const english = pageData.relativePath.startsWith('en/')
    const path = `/docs/${pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '.html')}`
    const canonical = `${SITE_URL}${path}`
    const title = `${pageData.title} - ${english ? 'AlkaidLab' : '瑶光流梦'}`
    const counterpart = path.replace(/^\/docs\/en\//, '/docs/').slice('/docs'.length)
    const alternates = hasEnglishTranslation(counterpart)
      ? [
          ['link', { rel: 'alternate', hreflang: 'zh-CN', href: `${SITE_URL}/docs${counterpart}` }],
          ['link', { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/docs/en${counterpart}` }],
          [
            'link',
            { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/docs${counterpart}` },
          ],
        ]
      : []
    return [
      ...alternates,
      ['meta', { property: 'og:site_name', content: english ? 'AlkaidLab' : '瑶光流梦' }],
      ['meta', { property: 'og:locale', content: english ? 'en_US' : 'zh_CN' }],
      ['link', { rel: 'canonical', href: canonical }],
      [
        'meta',
        {
          property: 'og:type',
          content: /^(en\/)?index\.md$/.test(pageData.relativePath) ? 'website' : 'article',
        },
      ],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: pageData.description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: pageData.description }],
    ]
  },
  sitemap: { hostname: `${SITE_URL}/docs/` },
  themeConfig: {
    // Until every chapter is translated, the language menu opens the locale home.
    // Chapter links use the published-translation registry instead of guessing URLs.
    i18nRouting: false,
    langMenuLabel: '切换语言',
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
      {
        text: '使用手册',
        link: '/getting-started/',
        activeMatch: '/(getting-started|server|clients|troubleshooting)/',
      },
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
        locales: {
          en: {
            translations: {
              button: {
                buttonText: 'Search English docs',
                buttonAriaLabel: 'Search English documentation',
              },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Clear search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results found',
                footer: { selectText: 'Select', navigateText: 'Navigate', closeText: 'Close' },
              },
            },
          },
        },
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
