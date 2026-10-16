// Paths are relative to the VitePress base. Register only published translations.
// Keep Chinese URLs stable while English chapters are added incrementally.
export const englishDocsPaths = ['/', '/getting-started/']

/** Match published URLs, accepting extensionless links from the sidebar configuration. */
export function hasEnglishTranslation(path) {
  const canonical = path.endsWith('/') || path.endsWith('.html') ? path : `${path}.html`
  return englishDocsPaths.includes(canonical)
}

/** Use a published translation when available; otherwise keep the Chinese source URL. */
export function localizedDocPath(path = '/', lang = 'zh') {
  return lang === 'en' && hasEnglishTranslation(path) ? `/en${path}` : path
}

/** Build a website-to-document link with the VitePress base included. */
export function docsUrl(lang = 'zh', path = '/') {
  return `/docs${localizedDocPath(path, lang)}`
}
