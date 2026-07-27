import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join, basename, resolve } from 'node:path'
import { OG_IMAGE, absoluteUrl } from '../src/site-meta.js'

const rootDir = process.cwd()
const sourceDir = resolve(rootDir, 'docs')
const outputDir = resolve(rootDir, 'dist', 'docs')

const escapeHtml = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const inlineMarkdown = value => {
  let html = escapeHtml(value)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  return html
}

const splitTableRow = line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim())
const isTableSeparator = line => /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line.trim())

function markdownToHtml(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n')
  const output = []
  let paragraph = []
  let index = 0

  const flushParagraph = () => {
    if (!paragraph.length) return
    output.push(`<p>${inlineMarkdown(paragraph.join(' ').trim())}</p>`)
    paragraph = []
  }

  while (index < lines.length) {
    const line = lines[index]

    if (line.trim() === '') {
      flushParagraph()
      index += 1
      continue
    }

    if (line.trim() === '---') {
      flushParagraph()
      output.push('<hr>')
      index += 1
      continue
    }

    if (line.trim() === '```text' || line.trim() === '```') {
      flushParagraph()
      const code = []
      index += 1
      while (index < lines.length && lines[index].trim() !== '```') {
        code.push(lines[index])
        index += 1
      }
      if (index < lines.length) index += 1
      output.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`)
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      const level = heading[1].length
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`)
      index += 1
      continue
    }

    if (line.startsWith('> ')) {
      flushParagraph()
      output.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`)
      index += 1
      continue
    }

    if (line.startsWith('|') && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      flushParagraph()
      const rows = [splitTableRow(line)]
      index += 2
      while (index < lines.length && lines[index].startsWith('|')) {
        rows.push(splitTableRow(lines[index]))
        index += 1
      }
      const head = `<thead><tr>${rows[0].map(cell => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead>`
      const body = rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')
      output.push(`<div class="table-wrap"><table>${head}<tbody>${body}</tbody></table></div>`)
      continue
    }

    if (line.startsWith('- ')) {
      flushParagraph()
      const items = []
      while (index < lines.length && lines[index].startsWith('- ')) {
        items.push(`<li>${inlineMarkdown(lines[index].slice(2))}</li>`)
        index += 1
      }
      output.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph()
      const items = []
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(`<li>${inlineMarkdown(lines[index].replace(/^\d+\.\s+/, ''))}</li>`)
        index += 1
      }
      output.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    paragraph.push(line.trim())
    index += 1
  }

  flushParagraph()
  return output.join('\n')
}

function pageTemplate(title, body, { description, canonicalPath } = {}) {
  const pageTitle = `${title} - 瑶光流梦`
  const summary = description || title
  const canonical = absoluteUrl(canonicalPath || '/docs/')

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(summary)}">
    <title>${escapeHtml(pageTitle)}</title>
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/webp" sizes="256x256" href="/favicon.webp">
    <link rel="preload" href="/fonts/plus-jakarta-sans-latin-variable.woff2" as="font" type="font/woff2" crossorigin>
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="瑶光流梦">
    <meta property="og:title" content="${escapeHtml(pageTitle)}">
    <meta property="og:description" content="${escapeHtml(summary)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${OG_IMAGE}">
    <meta property="og:locale" content="zh_CN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
    <meta name="twitter:description" content="${escapeHtml(summary)}">
    <meta name="twitter:image" content="${OG_IMAGE}">
    <style>
      :root { color-scheme: light; --ink: #213547; --muted: #667985; --line: #d8e2e8; --accent: #1769aa; --panel: #f4f8fa; --strong: #183b56; }
      * { box-sizing: border-box; }
      @font-face { font-family: 'Plus Jakarta Sans Variable'; font-style: normal; font-display: swap; font-weight: 200 800; src: url('/fonts/plus-jakarta-sans-latin-variable.woff2') format('woff2-variations'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
      /* 拉丁字体排在中文之前，否则英文会落到中文字体自带的人文主义字形上。 */
      body { margin: 0; background: #eef3f6; color: var(--ink); font-family: 'Plus Jakarta Sans Variable', -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif; line-height: 1.8; }
      .site-header { position: sticky; top: 0; z-index: 1; background: rgba(255,255,255,.94); border-bottom: 1px solid var(--line); backdrop-filter: blur(12px); }
      .header-inner { max-width: 1060px; margin: 0 auto; padding: 14px 22px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
      .brand { color: var(--strong); font-weight: 700; text-decoration: none; letter-spacing: .03em; }
      .back { color: var(--accent); text-decoration: none; font-size: .9rem; }
      .document { max-width: 1000px; margin: 36px auto 64px; padding: 48px 58px 60px; background: #fff; border: 1px solid var(--line); box-shadow: 0 16px 42px rgba(28, 62, 82, .08); }
      h1 { margin: 0 0 10px; color: var(--strong); font-size: clamp(1.8rem, 4vw, 2.65rem); line-height: 1.3; letter-spacing: .02em; }
      h2 { margin: 2.2em 0 .55em; padding-bottom: .25em; border-bottom: 2px solid #d7e7ef; color: var(--accent); font-size: 1.45rem; line-height: 1.4; }
      h3 { margin: 1.7em 0 .45em; color: #247b8f; font-size: 1.15rem; line-height: 1.5; }
      p { margin: .8em 0; }
      blockquote { margin: 1em 0; padding: 12px 18px; border-left: 4px solid #58a6b8; background: #f0f7f8; color: #1d4b5b; }
      strong { color: #173e5b; }
      a { color: var(--accent); }
      code { padding: .12em .35em; border-radius: 4px; background: #edf3f6; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .9em; }
      pre { overflow-x: auto; margin: 1em 0; padding: 16px 18px; border: 1px solid #bfd0d8; border-radius: 7px; background: var(--panel); color: #244b62; }
      pre code { padding: 0; background: transparent; }
      ul, ol { margin: .65em 0 1em; padding-left: 1.6em; }
      li { margin: .35em 0; }
      hr { margin: 2em 0; border: 0; border-top: 1px solid var(--line); }
      .table-wrap { overflow-x: auto; margin: 1.2em 0; }
      table { width: 100%; min-width: 650px; border-collapse: collapse; font-size: .9rem; line-height: 1.55; }
      th, td { padding: 9px 10px; border: 1px solid #b8c7d1; text-align: left; vertical-align: top; }
      th { background: var(--strong); color: #fff; font-weight: 700; }
      tbody tr:nth-child(even) { background: #f7fafc; }
      .site-footer { max-width: 1000px; margin: -36px auto 34px; padding: 0 22px; color: var(--muted); font-size: .82rem; text-align: center; }
      @media (max-width: 720px) {
        .header-inner { padding: 12px 16px; }
        .document { margin: 18px 10px 42px; padding: 30px 22px 38px; }
        body { line-height: 1.72; }
        h2 { font-size: 1.25rem; }
        table { font-size: .82rem; }
      }
    </style>
  </head>
  <body>
    <header class="site-header"><div class="header-inner"><a class="brand" href="/">瑶光流梦</a><a class="back" href="/">返回首页</a></div></header>
    <main class="document">${body}</main>
    <footer class="site-footer">本文档由瑶光流梦静态文档系统生成，源文件为 Markdown。</footer>
  </body>
</html>`
}

/** 取正文第一段做 meta description，避免所有文档页共用标题当描述。 */
const extractDescription = (markdown, fallback) => {
  const firstParagraph = markdown
    .replaceAll('\r\n', '\n')
    .split('\n')
    .find(line => {
      const text = line.trim()
      return text && !text.startsWith('#') && !text.startsWith('>') && !text.startsWith('|')
    })

  if (!firstParagraph) return fallback

  const plain = firstParagraph
    .trim()
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_]/g, '')

  return plain.length > 150 ? `${plain.slice(0, 150)}…` : plain
}

await mkdir(outputDir, { recursive: true })
const files = (await readdir(sourceDir)).filter(file => extname(file).toLowerCase() === '.md')
const builtDocs = []

for (const file of files) {
  const source = await readFile(join(sourceDir, file), 'utf8')
  const titleMatch = source.match(/^#\s+(.+)$/m)
  const title = titleMatch?.[1] || basename(file, '.md')
  const outputName = `${basename(file, '.md')}.html`
  const description = extractDescription(source, title)
  await writeFile(
    join(outputDir, outputName),
    pageTemplate(title, markdownToHtml(source), {
      description,
      canonicalPath: `/docs/${outputName}`,
    }),
    'utf8',
  )
  builtDocs.push({ title, outputName })
}

const indexBody = [
  '<h1>文档中心</h1>',
  '<p>这里收录瑶光流梦项目的公开说明、技术公告和使用资料。</p>',
  '<ul class="doc-index">',
  ...builtDocs.map(doc => `<li><a href="./${doc.outputName}">${inlineMarkdown(doc.title)}</a></li>`),
  '</ul>',
].join('\n')
await writeFile(
  join(outputDir, 'index.html'),
  pageTemplate('文档中心', indexBody, {
    description: '瑶光流梦文档中心，收录项目的公开说明、技术公告和使用资料。',
    canonicalPath: '/docs/',
  }),
  'utf8',
)

console.log(`Built ${files.length} static document(s) in ${outputDir}`)
