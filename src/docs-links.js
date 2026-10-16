// Paths are relative to the VitePress base. Register only published translations.
// Keep Chinese URLs stable while English chapters are added incrementally.
export const englishDocsPaths = ['/', '/getting-started/']

export function hasEnglishTranslation(path) {
  const canonical = path.endsWith('/') || path.endsWith('.html') ? path : `${path}.html`
  return englishDocsPaths.includes(canonical)
}

export function localizedDocPath(path = '/', lang = 'zh') {
  return lang === 'en' && hasEnglishTranslation(path) ? `/en${path}` : path
}

export function docsUrl(lang = 'zh', path = '/') {
  return `/docs${localizedDocPath(path, lang)}`
}
