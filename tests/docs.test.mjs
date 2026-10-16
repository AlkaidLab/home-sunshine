import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import config from '../docs/.vitepress/config.js'
import { SITE_URL } from '../src/site-meta.js'

const rootDir = resolve(import.meta.dirname, '..')
const docsDir = resolve(rootDir, 'dist/docs')
const legacyPages = ['dolby-vision-dev-journal-zh.html', 'razer-haptics-sdk-announcement-zh.html']
async function findMarkdownPages(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.filter(entry => !entry.name.startsWith('.')).map(entry => {
    const relative = `${prefix}${entry.name}`
    if (entry.isDirectory()) return findMarkdownPages(resolve(directory, entry.name), `${relative}/`)
    return entry.name.endsWith('.md') ? [relative.replace(/\.md$/, '.html')] : []
  }))).flat()
}
const pages = await findMarkdownPages(resolve(rootDir, 'docs'))
const pagePath = page => `/docs/${page.replace(/(^|\/)index\.html$/, '$1')}`
const htmlByPage = new Map(await Promise.all(pages.map(async page =>
  [page, await readFile(resolve(docsDir, page), 'utf8')],
)))

test('document theme bootstrap defaults to light and respects saved preferences', () => {
  const html = htmlByPage.get('index.html')
  const scripts = [...html.matchAll(/<script\b[^>]*\bid="(?:sync-site-theme|check-dark-mode)"[^>]*>([\s\S]*?)<\/script>/gu)]
  assert.equal(scripts.length, 2, 'both theme bootstrap scripts must be rendered')
  for (const systemDark of [false, true]) {
    for (const [saved, expectedDark] of [
      [{}, false],
      [{ theme: 'gura', 'vitepress-theme-appearance': 'dark' }, false],
      [{ theme: 'chocolate', 'vitepress-theme-appearance': 'light' }, true],
      [{ 'vitepress-theme-appearance': 'dark' }, true],
    ]) {
      const storage = new Map(Object.entries(saved))
      const classes = new Set()
      const context = {
        localStorage: {
          getItem: key => storage.get(key) ?? null,
          setItem: (key, value) => storage.set(key, value),
        },
        window: { matchMedia: () => ({ matches: systemDark }) },
        document: { documentElement: { classList: { add: value => classes.add(value) } } },
      }
      for (const [, source] of scripts) runInNewContext(source, context)
      assert.equal(classes.has('dark'), expectedDark, JSON.stringify({ saved, systemDark }))
    }
  }
})

test('all source documents have rendered pages, descriptions and correct canonical URLs', () => {
  for (const [page, html] of htmlByPage) {
    const pathname = pagePath(page)
    assert.match(html, /<h1\b[^>]*>[^<]+/u, page)
    assert.match(html, /<meta name="description" content="[^"]+"/u, page)
    assert.ok(html.includes(`<link rel="canonical" href="${SITE_URL}${pathname}">`), page)
    assert.ok(!html.includes('本文档由瑶光流梦静态文档系统生成'), page)
  }
  assert.ok(htmlByPage.get(legacyPages[0]).includes('同机对照，逐步排除假设'))
  assert.ok(htmlByPage.get(legacyPages[1]).includes('为什么我们决定自研触觉 SDK'))
})

test('the four manual sections and every document are reachable from the sidebar', () => {
  for (const section of ['快速开始', '服务端', '客户端', '故障排查']) {
    assert.ok(config.themeConfig.sidebar.some(group => group.text === section), section)
  }
  const collectLinks = items => items.flatMap(item => [
    ...(item.link ? [item.link] : []),
    ...collectLinks(item.items || []),
  ])
  const links = new Set(collectLinks(config.themeConfig.sidebar).map(link => {
    if (link === '/') return '/docs/'
    return `/docs${link}${link.endsWith('/') || link.endsWith('.html') ? '' : '.html'}`
  }))
  for (const page of pages) assert.ok(links.has(pagePath(page)), page)
})

test('document navigation, section anchors and bundled resources resolve in the final site', async () => {
  const brokenAnchors = []
  for (const [page, html] of htmlByPage) {
    const current = new URL(`/docs/${page}`, SITE_URL)
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gu)) {
      const target = new URL(href, current)
      if (target.origin !== SITE_URL) continue
      const pathname = decodeURIComponent(target.pathname)
      const file = resolve(rootDir, 'dist', `.${pathname}`, ...(pathname.endsWith('/') ? ['index.html'] : []))
      const targetHtml = await readFile(file, 'utf8')
      if (target.hash) {
        const id = decodeURIComponent(target.hash.slice(1))
        if (!targetHtml.includes(`id="${id}"`)) brokenAnchors.push(`${page}: ${href}`)
      }
    }
    for (const [, resource] of html.matchAll(/(?:src|href)="(\/docs\/assets\/[^"#?]+)"/gu)) {
      await readFile(resolve(rootDir, 'dist', `.${resource}`))
    }
  }
  assert.deepEqual(brokenAnchors, [], 'internal section links must resolve')
})

test('the deployed search index finds Chinese text and mixed Chinese/English terms', async () => {
  // Resolve the same MiniSearch version VitePress uses, including nested npm layouts.
  const MiniSearch = createRequire(import.meta.resolve('vitepress'))('minisearch')
  const chunksDir = resolve(docsDir, 'assets/chunks')
  const searchChunk = (await readdir(chunksDir)).find(file => file.startsWith('@localSearchIndexroot.'))
  assert.ok(searchChunk, 'missing local search index')
  const { default: indexJSON } = await import(pathToFileURL(resolve(chunksDir, searchChunk)).href)
  const { options, searchOptions } = config.themeConfig.search.options.miniSearch
  const index = MiniSearch.loadJSON(indexJSON, {
    fields: ['title', 'titles', 'text'],
    storeFields: ['title', 'titles'],
    ...options,
    searchOptions,
  })
  for (const [query, page] of [
    ['杜比视界', legacyPages[0]],
    ['黑屏', legacyPages[0]],
    ['视界', legacyPages[0]],
    ['低延迟', legacyPages[0]],
    ['Profile 8.4', legacyPages[0]],
    ['触觉', legacyPages[1]],
    ['SDK', legacyPages[1]],
    ['ＳＤＫ', legacyPages[1]],
    ['开放触觉 SDK', legacyPages[1]],
    ['配对', 'getting-started/index.html'],
    ['ZakoDisplay', 'server/display.html'],
    ['麦克风', 'server/audio-input.html'],
    ['Crown', 'clients/android.html'],
    ['503', 'troubleshooting/black-screen.html'],
    ['中继', 'server/network.html'],
    ['平台支持', 'getting-started/features.html'],
    ['ICC', 'server/hdr.html'],
    ['DLSS NR', 'server/enhancements.html'],
    ['只读', 'server/collaboration.html'],
    ['USB 转发', 'server/collaboration.html'],
    ['超级指令', 'server/automation.html'],
    ['Webhook', 'server/automation.html'],
    ['AI 日志诊断', 'server/integrations.html'],
    ['Crown', 'clients/crown.html'],
    ['HD Haptics', 'clients/controllers.html'],
    ['PyroWave', 'clients/advanced-video.html'],
    ['插帧引擎', 'clients/advanced-video.html'],
    ['渲染尺寸', 'clients/settings.html'],
  ]) {
    const results = index.search(query)
    assert.ok(results.some(result => result.id.startsWith(`${pagePath(page)}#`)), query)
    for (const result of results) {
      const [path, anchor] = result.id.split('#')
      const relative = path.replace('/docs/', '')
      const html = htmlByPage.get(relative.endsWith('/') || !relative ? `${relative}index.html` : relative)
      assert.ok(html?.includes(`id="${decodeURIComponent(anchor)}"`), result.id)
    }
  }
  assert.deepEqual(index.search('zznonexistentxq987654'), [])
})

test('document sitemap uses /docs/ and is advertised by robots.txt', async () => {
  const sitemap = await readFile(resolve(docsDir, 'sitemap.xml'), 'utf8')
  const urls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu), match => match[1])
  assert.deepEqual(urls.sort(), pages.map(page => `${SITE_URL}${pagePath(page)}`).sort())
  const robots = await readFile(resolve(rootDir, 'dist/robots.txt'), 'utf8')
  assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`))
  assert.ok(robots.includes(`Sitemap: ${SITE_URL}/docs/sitemap.xml`))
})

test('building docs preserves both prerendered homepages', async () => {
  for (const [page, lang] of [['index.html', 'zh'], ['en/index.html', 'en']]) {
    const html = await readFile(resolve(rootDir, 'dist', page), 'utf8')
    assert.ok(html.includes(`data-prerendered data-lang="${lang}"`), page)
    assert.ok(html.includes('href="/docs/"'), page)
    assert.ok(html.includes('href="/docs/getting-started/"'), page)
    assert.ok(html.includes('href="/docs/getting-started/features.html"'), page)
    assert.ok(!html.includes('docs.qq.com'), page)
  }
})

test('deployment has root and document 404 pages with valid recovery routes', async () => {
  // Cloudflare Pages uses a top-level 404.html to disable its implicit SPA fallback.
  const root404 = await readFile(resolve(rootDir, 'dist/404.html'), 'utf8')
  const docs404 = await readFile(resolve(docsDir, '404.html'), 'utf8')
  for (const html of [root404, docs404]) {
    assert.ok(html.includes('404'))
    assert.ok(!html.includes('data-prerendered data-lang='), '404 must not be the home page')
  }
  assert.match(root404, /<meta name="robots" content="noindex"/u)
  for (const pathname of ['/', '/en/', '/docs/']) {
    assert.ok(root404.includes(`href="${pathname}"`), pathname)
    await readFile(resolve(rootDir, 'dist', `.${pathname}`, 'index.html'))
  }
})
