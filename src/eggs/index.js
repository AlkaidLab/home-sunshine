export const eggRegistry = {
  wuwang: {
    clicks: 5,
    load: () => import('./wuwang/index.js'),
  },
}

const eggKeys = Object.keys(eggRegistry)
const LAST_EGG_KEY = 'egg:lastKey'

export const DEFAULT_EGG_CLICKS = 5

export const getEggEntry = key => {
  const entry = eggRegistry[key]
  return entry ? { key, ...entry } : null
}

const getLastEggKey = () => {
  try {
    return localStorage.getItem(LAST_EGG_KEY)
  } catch {
    return null
  }
}

const setLastEggKey = (key) => {
  try {
    localStorage.setItem(LAST_EGG_KEY, key)
  } catch {
    // localStorage can be unavailable in strict privacy contexts.
  }
}

export const getRandomEggEntry = () => {
  if (!eggKeys.length) return null
  const lastKey = getLastEggKey()
  const pool = eggKeys.length > 1 ? eggKeys.filter(key => key !== lastKey) : eggKeys
  const key = pool[Math.floor(Math.random() * pool.length)]
  setLastEggKey(key)
  return getEggEntry(key)
}
