import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  HTML_LANG,
  LANGUAGES,
  LANG_PATHS,
  OG_IMAGE,
  SITE_URL,
  absoluteUrl,
  buildJsonLd,
  siteMeta,
} from '../src/site-meta.js'

const rootDir = process.cwd()
const distDir = resolve(rootDir, 'dist')
const clientEntryPath = resolve(distDir, 'index.html')
const serverBundleDir = resolve(rootDir, 'dist-ssr')
const serverEntryUrl = pathToFileURL(resolve(serverBundleDir, 'entry-server.js')).href
const outlet = '<div id="app"><!--ssg-outlet--></div>'
const headStart = '<!--seo-head-start-->'
const headEnd = '<!--seo-head-end-->'

const escapeAttr = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

/** JSON-LD 直出到 <script> 里，只需防止 </script> 提前闭合。 */
const serializeJsonLd = data =>
  JSON.stringify(data).replaceAll('<', '\\u003c')

const buildHead = (lang) => {
  const meta = siteMeta[lang]
  const canonical = absoluteUrl(LANG_PATHS[lang])

  const alternates = LANGUAGES.map(
    code =>
      `    <link rel="alternate" hreflang="${HTML_LANG[code]}" href="${absoluteUrl(LANG_PATHS[code])}">`,
  )
  alternates.push(
    `    <link rel="alternate" hreflang="x-default" href="${absoluteUrl(LANG_PATHS.zh)}">`,
  )

  return [
    `    <title>${escapeAttr(meta.title)}</title>`,
    `    <meta name="description" content="${escapeAttr(meta.description)}">`,
    `    <meta name="keywords" content="${escapeAttr(meta.keywords)}">`,
    `    <link rel="canonical" href="${canonical}">`,
    ...alternates,
    '',
    '    <!-- Open Graph -->',
    `    <meta property="og:type" content="website">`,
    `    <meta property="og:site_name" content="${escapeAttr(meta.siteName)}">`,
    `    <meta property="og:title" content="${escapeAttr(meta.title)}">`,
    `    <meta property="og:description" content="${escapeAttr(meta.description)}">`,
    `    <meta property="og:url" content="${canonical}">`,
    `    <meta property="og:image" content="${OG_IMAGE}">`,
    `    <meta property="og:image:width" content="1024">`,
    `    <meta property="og:image:height" content="1024">`,
    `    <meta property="og:locale" content="${meta.ogLocale}">`,
    `    <meta property="og:locale:alternate" content="${meta.ogLocaleAlternate}">`,
    '',
    '    <!-- Twitter Card -->',
    `    <meta name="twitter:card" content="summary_large_image">`,
    `    <meta name="twitter:title" content="${escapeAttr(meta.title)}">`,
    `    <meta name="twitter:description" content="${escapeAttr(meta.description)}">`,
    `    <meta name="twitter:image" content="${OG_IMAGE}">`,
    '',
    '    <!-- Structured data -->',
    `    <script type="application/ld+json">${serializeJsonLd(buildJsonLd(lang))}</script>`,
  ].join('\n')
}

const renderPage = async (render, template, lang) => {
  const headBlock = template.slice(
    template.indexOf(headStart) + headStart.length,
    template.indexOf(headEnd),
  )

  const appHtml = await render(lang)

  return template
    .replace(`<html lang="zh-CN"`, `<html lang="${HTML_LANG[lang]}"`)
    .replace(headBlock, `\n${buildHead(lang)}\n    `)
    .replace(
      outlet,
      `<div id="app" data-prerendered data-lang="${lang}">${appHtml}</div>`,
    )
}

const buildSitemap = () => {
  // 两个语言首页互为 hreflang 备选，其余是独立的静态页。
  const alternates = LANGUAGES.map(
    code =>
      `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[code]}" href="${absoluteUrl(LANG_PATHS[code])}"/>`,
  ).join('\n')

  const localizedHomes = LANGUAGES.map(
    lang =>
      `  <url>\n    <loc>${absoluteUrl(LANG_PATHS[lang])}</loc>\n${alternates}\n  </url>`,
  )

  const standalonePages = ['/docs/', '/audio-haptics-demo.html'].map(
    path => `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n  </url>`,
  )

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...localizedHomes, ...standalonePages].join('\n')}
</urlset>
`
}

try {
  const [{ render }, template] = await Promise.all([
    import(serverEntryUrl),
    readFile(clientEntryPath, 'utf8'),
  ])

  if (!template.includes(outlet)) {
    throw new Error('Unable to find the SSG outlet in dist/index.html')
  }
  if (!template.includes(headStart) || !template.includes(headEnd)) {
    throw new Error('Unable to find the SEO head markers in dist/index.html')
  }

  for (const lang of LANGUAGES) {
    const html = await renderPage(render, template, lang)
    const outputPath = resolve(distDir, LANG_PATHS[lang].replace(/^\//, ''), 'index.html')
    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html, 'utf8')
    console.log(`Prerendered ${LANG_PATHS[lang]}`)
  }

  await writeFile(resolve(distDir, 'sitemap.xml'), buildSitemap(), 'utf8')
  await writeFile(
    resolve(distDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    'utf8',
  )
  console.log('Wrote sitemap.xml and robots.txt')
} finally {
  await rm(serverBundleDir, { recursive: true, force: true })
}
