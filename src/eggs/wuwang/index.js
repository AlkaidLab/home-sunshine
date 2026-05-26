import WuwangRoom from './WuwangRoom.vue'
import { members, variants } from './data.js'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const LAST_VARIANT_KEY = 'egg:wuwang:lastVariant'

const getLastVariantId = () => {
  try {
    return localStorage.getItem(LAST_VARIANT_KEY)
  } catch {
    return null
  }
}

const setLastVariantId = (id) => {
  try {
    localStorage.setItem(LAST_VARIANT_KEY, id)
  } catch {
    // localStorage can be unavailable in strict privacy contexts.
  }
}

const pickWeighted = (items, excludedId) => {
  const pool = items.length > 1 ? items.filter(item => item.id !== excludedId) : items
  const total = pool.reduce((sum, item) => sum + (item.weight || 1), 0)
  let cursor = Math.random() * total
  for (const item of pool) {
    cursor -= item.weight || 1
    if (cursor <= 0) return item
  }
  return pool[0]
}

export const createEgg = ({ sponsor } = {}) => {
  const variant = pickWeighted(variants, getLastVariantId())
  setLastVariantId(variant.id)

  return {
    revealName: '无妄之森',
    component: WuwangRoom,
    props: {
      sponsor,
      members: shuffle(members),
      room: {
        ...variant,
        instanceId: `${variant.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      },
    },
  }
}

export default { createEgg }
