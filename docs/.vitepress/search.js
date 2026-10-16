/**
 * Tokenize words and overlapping Han character pairs for consistent local search.
 * Keep this self-contained: VitePress serializes it for use in the browser.
 * @param {string} text Text to index or search.
 * @returns {string[]} Normalized search tokens.
 */
export function tokenizeSearch(text) {
  const normalized = text.normalize('NFKC').toLocaleLowerCase('zh-CN')
  const terms = normalized.match(/\p{Script=Han}+|[\p{L}\p{N}_]+/gu) ?? []
  return terms.flatMap(term => {
    if (!/\p{Script=Han}/u.test(term)) return [term]
    // Index characters and adjacent pairs, consistently in Node and older browsers.
    // This also finds Chinese substrings without requiring spaces or a dictionary.
    const characters = Array.from(term)
    return [...characters, ...characters.slice(1).map((character, index) => characters[index] + character)]
  })
}
