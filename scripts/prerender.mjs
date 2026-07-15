import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const rootDir = process.cwd()
const clientEntryPath = resolve(rootDir, 'dist', 'index.html')
const serverBundleDir = resolve(rootDir, 'dist-ssr')
const serverEntryUrl = pathToFileURL(resolve(serverBundleDir, 'entry-server.js')).href
const outlet = '<div id="app"><!--ssg-outlet--></div>'

try {
  const [{ render }, template] = await Promise.all([
    import(serverEntryUrl),
    readFile(clientEntryPath, 'utf8'),
  ])

  if (!template.includes(outlet)) {
    throw new Error('Unable to find the SSG outlet in dist/index.html')
  }

  const appHtml = await render()
  const html = template.replace(
    outlet,
    `<div id="app" data-prerendered>${appHtml}</div>`,
  )

  await writeFile(clientEntryPath, html)
} finally {
  await rm(serverBundleDir, { recursive: true, force: true })
}
