import assert from 'node:assert/strict'
import test from 'node:test'

let moduleId = 0
const loadDownloads = () => import(`../src/downloads.js?test=${++moduleId}`)
const githubFile = 'https://github.com/AlkaidLab/foundation-sunshine/releases/download/v2099.0101/Sunshine.v2099.0101.WindowsInstaller.exe'
const cnbFile = 'https://cnb.cool/AlkaidLab/foundation-sunshine-release/-/releases/download/v2099.0101/Sunshine.v2099.0101.WindowsInstaller.exe'
const metadata = {
  channels: {
    latest: {
      version: 'v2099.0101',
      assets: [{ type: 'windows-x64-installer', url: cnbFile, fallbackUrl: githubFile }],
    },
    'pre-latest': {
      assets: [{ type: 'windows-x64-installer', url: 'https://example.com/beta.exe' }],
    },
  },
}

test('initial links are release pages and importing does not fetch', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', () => { throw new Error('unexpected fetch') })
  const { getReleaseDownloadUrls } = await loadDownloads()
  for (const key of ['sunshine', 'android-vplus', 'moonlight-pc', 'macos-enhanced']) {
    for (const lang of ['zh', 'en']) {
      const urls = getReleaseDownloadUrls(key, 'windows', null, lang)
      assert.ok(urls.official.endsWith('/releases/latest'))
      assert.ok(urls.mirror.endsWith('/releases/latest'))
    }
  }
  assert.equal(fetch.mock.callCount(), 0)
})

test('website metadata returns the stable asset and is cached', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async url => {
    assert.equal(url, '/website-release-metadata/foundation-sunshine.json')
    return Response.json(metadata)
  })
  const { resolveReleaseDownloadUrls } = await loadDownloads()
  const result = await resolveReleaseDownloadUrls('sunshine', 'windows', 'zh')
  assert.equal(result.official, cnbFile)
  assert.equal(result.mirror, githubFile)
  assert.equal(result.source, 'release-metadata')
  assert.deepEqual(await resolveReleaseDownloadUrls('sunshine', 'windows', 'zh'), result)
  assert.equal(fetch.mock.callCount(), 1)
})

test('a website HTML response falls back to CNB metadata', async t => {
  const urls = []
  t.mock.method(globalThis, 'fetch', async url => {
    urls.push(url)
    return urls.length === 1 ? new Response('<html>homepage</html>') : Response.json(metadata)
  })
  const { resolveReleaseDownloadUrls } = await loadDownloads()
  const result = await resolveReleaseDownloadUrls('sunshine', 'windows', 'zh')
  assert.equal(result.official, cnbFile)
  assert.equal(result.source, 'cnb-metadata')
  assert.deepEqual(urls, [
    '/website-release-metadata/foundation-sunshine.json',
    'https://cnb.cool/AlkaidLab/release-metadata/-/releases/download/latest/foundation-sunshine.json',
  ])
})

const releases = [
  { tag_name: 'beta', prerelease: true, assets: [{ name: 'WindowsInstaller.exe', browser_download_url: 'https://example.com/beta.exe' }] },
  { tag_name: 'v2099.0101', assets: [{ name: 'Sunshine.v2099.0101.WindowsInstaller.exe', browser_download_url: githubFile }] },
]

test('failed metadata sources fall back to GitHub stable release, retaining mirror version', async t => {
  const urls = []
  t.mock.method(globalThis, 'fetch', async url => {
    urls.push(url)
    return url.startsWith('https://api.github.com/') ? Response.json(releases) : new Response('', { status: 503 })
  })
  const { resolveReleaseDownloadUrls } = await loadDownloads()
  const result = await resolveReleaseDownloadUrls('sunshine', 'windows', 'zh')
  assert.equal(result.official, githubFile)
  assert.equal(result.mirror, cnbFile)
  assert.equal(result.source, 'github')
  assert.equal(urls.length, 3)
  assert.ok(urls[2].startsWith('https://api.github.com/'))
})

test('English goes straight to GitHub without requesting metadata', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async url => {
    assert.ok(url.startsWith('https://api.github.com/'))
    return Response.json(releases)
  })
  const { resolveReleaseDownloadUrls } = await loadDownloads()
  const result = await resolveReleaseDownloadUrls('sunshine', 'windows', 'en')
  assert.equal(result.official, githubFile)
  assert.equal(result.mirror, cnbFile)
  assert.equal(fetch.mock.callCount(), 1)
})

test('all lookup failures return release pages, never a stale installer', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('offline') })
  const { resolveReleaseDownloadUrls } = await loadDownloads()
  for (const lang of ['zh', 'en']) {
    const result = await resolveReleaseDownloadUrls('sunshine', 'windows', lang)
    assert.equal(result.source, 'release-page')
    assert.ok(result.official.endsWith('/releases/latest'))
    assert.ok(result.mirror.endsWith('/releases/latest'))
    assert.deepEqual(result.candidates, [])
  }
})

test('a hanging lookup times out and advances to the next source', async t => {
  const urls = []
  t.mock.method(globalThis, 'fetch', async (url, { signal }) => {
    urls.push(url)
    if (urls.length > 1) return Response.json(metadata)
    return new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true })
    })
  })
  const { resolveReleaseDownloadUrls } = await loadDownloads()
  const result = await resolveReleaseDownloadUrls('sunshine', 'windows', 'zh')
  assert.equal(result.source, 'cnb-metadata')
  assert.equal(result.official, cnbFile)
  assert.equal(urls.length, 2)
})
