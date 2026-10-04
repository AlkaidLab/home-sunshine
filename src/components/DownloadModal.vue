<script setup vapor>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import DeviceIcon from './DeviceIcon.vue'

const props = defineProps({
  product: { type: Object, required: true },
  copy: { type: Object, required: true },
})

const emit = defineEmits(['close', 'retry', 'continue'])

const dialog = ref(null)
let previousBodyOverflow = ''
let previousDocumentOverflow = ''

const statusTitle = computed(() => {
  const kind = props.product.kind
  if (kind === 'store') return props.copy.statusStore
  if (kind === 'page') return props.copy.statusPage
  return props.copy.status
})

const statusHint = computed(() => {
  const kind = props.product.kind
  if (kind === 'store') return props.copy.statusStoreHint
  if (kind === 'page') return ''
  return props.copy.statusHint
})

const helpUrl = computed(() => `${props.product.projectUrl || ''}/issues`)
const continueLabel = computed(() => props.product.scope === 'host' ? props.copy.continueAction : props.copy.continueBrowse)
const supportTitle = computed(() => props.copy.supportTitle.replace('{name}', props.product.projectName || ''))
const primaryActionLabel = computed(() => {
  if (props.product.kind === 'file') return props.copy.retryAction
  if (props.product.kind === 'store') return props.copy.openStoreAction
  return props.copy.openPageAction
})

const onKeydown = event => {
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  if (event.key !== 'Tab' || !dialog.value) return
  const focusable = [...dialog.value.querySelectorAll('a[href], button:not([disabled])')]
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  previousBodyOverflow = document.body.style.overflow
  previousDocumentOverflow = document.documentElement.style.overflow
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown)
  nextTick(() => dialog.value?.focus())
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousDocumentOverflow
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="download-overlay" @click.self="emit('close')">
    <div ref="dialog" class="download-card" role="dialog" aria-modal="true" aria-labelledby="download-modal-title" tabindex="-1">
      <header class="download-identity">
        <span class="download-product-icon"><DeviceIcon :name="product.icon" /></span>
        <div class="download-product-copy">
          <h3 id="download-modal-title">{{ product.title }}</h3>
          <p>{{ product.subtitle }}</p>
        </div>
        <button type="button" class="download-close" :aria-label="copy.close" @click="emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <section class="download-status">
        <span class="download-status-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
        </span>
        <div aria-live="polite">
          <p class="download-status-title">{{ statusTitle }}</p>
          <p v-if="statusHint" class="download-status-hint">{{ statusHint }}</p>
          <p v-if="product.kind === 'file'" class="download-status-hint">{{ copy.retryHint }}</p>
        </div>
      </section>

      <nav class="download-links">
        <a v-if="product.kind === 'file'" href="#" class="download-link" @click.prevent="emit('retry')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          {{ primaryActionLabel }}
        </a>
        <a v-else :href="product.downloadUrl" class="download-link" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          {{ primaryActionLabel }}
        </a>
        <span v-if="product.mirrorUrl" class="download-link-sep" aria-hidden="true"></span>
        <a
          v-if="product.mirrorUrl"
          :href="product.mirrorUrl"
          class="download-link"
          :target="product.kind === 'file' ? undefined : '_blank'"
          :rel="product.kind === 'file' ? undefined : 'noopener noreferrer'"
          :download="product.kind === 'file' || undefined"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
          {{ copy.mirrorAction }}
        </a>
        <span class="download-link-sep" aria-hidden="true"></span>
        <a :href="helpUrl" class="download-link download-link--muted" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          {{ copy.helpAction }}
        </a>
      </nav>

      <section class="download-support">
        <span class="download-github-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
        </span>
        <div class="download-support-copy">
          <p class="download-support-title">{{ supportTitle }}</p>
          <p class="download-support-desc">{{ copy.supportDesc }}</p>
          <a v-if="product.projectUrl" :href="product.projectUrl" class="download-star-btn" target="_blank" rel="noopener noreferrer" @click="emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            {{ copy.starAction }}
          </a>
        </div>
      </section>

      <footer class="download-footer">
        <button type="button" class="download-continue-btn" @click="emit('continue')">
          {{ continueLabel }}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="less">
.download-overlay {
 position: fixed;
 inset: 0;
 z-index: 100;
  display: flex;
 align-items: center;
  justify-content: center;
 overflow-y: auto;
  overscroll-behavior: contain;
  padding: clamp(1rem, 8vh, 7rem) 1.25rem max(1rem, env(safe-area-inset-bottom));
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(2px);
}

.download-card {
  width: min(100%, 540px);
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  padding: 1.75rem 2rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  background: var(--background-primary);
  box-shadow: 0 24px 72px rgba(15, 23, 42, 0.22);
  text-align: left;
}

.download-identity {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.download-product-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--primary-color) 10%, var(--background-secondary));
  color: var(--primary-color);
  flex-shrink: 0;

  svg { width: 26px; height: 26px; }
}

.download-product-copy {
  min-width: 0;
  flex: 1;

  h3 {
    margin: 0;
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.35;
  }

  p {
    margin: 0.15rem 0 0;
    color: var(--text-secondary);
    font-family: var(--font-sans);
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

.download-close {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;

  svg { width: 18px; height: 18px; }
  &:hover { background: color-mix(in srgb, var(--primary-color) 12%, transparent); color: var(--text-primary); }
}

.download-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.7rem;
}

.download-status-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--primary-color) 13%, var(--background-secondary));
  color: var(--primary-color);
  flex-shrink: 0;

  svg { width: 25px; height: 25px; }
}

.download-status-title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.35;
}

.download-status-hint {
  margin: 0.2rem 0 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  line-height: 1.55;
}

.download-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.55rem 0.95rem;
  margin-top: 1.05rem;
  padding-left: calc(52px + 1rem);
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 40px;
  color: var(--primary-strong);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 400;
  text-decoration: none;
  white-space: nowrap;

  svg { width: 16px; height: 16px; flex-shrink: 0; }
  &:hover { opacity: 0.8; }
}

.download-link--muted { color: var(--text-secondary); }

.download-link-sep {
  width: 1px;
  height: 16px;
  background: var(--border-color);
}

.download-support {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 1.45rem;
  padding: 1.15rem 1.3rem;
  border-radius: 16px;
  background: var(--background-secondary);
}

.download-github-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--background-primary);
  color: var(--text-primary);
  flex-shrink: 0;

  svg { width: 23px; height: 23px; }
}

.download-support-copy { min-width: 0; flex: 1; }

.download-support-title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
}

.download-support-desc {
  margin: 0.3rem 0 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  line-height: 1.6;
}

.download-star-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.9rem;
  padding: 0.5rem 1.05rem;
  border: 1px solid color-mix(in srgb, var(--primary-color) 40%, var(--border-color));
  border-radius: 8px;
  min-height: 44px;
  color: var(--primary-strong);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;

  svg { width: 15px; height: 15px; flex-shrink: 0; }
  &:hover { background: color-mix(in srgb, var(--primary-color) 10%, transparent); }
}

.download-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.4rem;
}

.download-continue-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 44px;
  padding: 0.55rem 1.2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  cursor: pointer;
  white-space: nowrap;

  svg { width: 15px; height: 15px; flex-shrink: 0; }
  &:hover { border-color: var(--primary-color); color: var(--primary-color); }
}

a:focus-visible, button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
}

@media (max-width: 640px) {
  .download-overlay { padding: max(0.5rem, env(safe-area-inset-top)) 0.75rem max(0.5rem, env(safe-area-inset-bottom)); }
  .download-card { width: 100%; max-height: calc(100vh - 1rem); max-height: calc(100dvh - 1rem); padding: 1rem 0.9rem 0.9rem; border-radius: 16px; }
  .download-product-icon { width: 44px; height: 44px; border-radius: 12px; }
  .download-product-icon svg { width: 22px; height: 22px; }
  .download-product-copy h3 { font-size: 1.1rem; }
  .download-product-copy p { font-size: 0.8125rem; }
  .download-status { margin-top: 1.35rem; }
  .download-status-icon { width: 44px; height: 44px; }
  .download-status-icon svg { width: 22px; height: 22px; }
  .download-status-title { font-size: 1.1rem; }
  .download-status-hint { font-size: 0.8125rem; }
  .download-links { padding-left: 0; margin-top: 0.75rem; gap: 0.15rem 0.7rem; }
  .download-support { gap: 0.7rem; margin-top: 0.9rem; padding: 0.8rem 0.85rem; border-radius: 12px; }
  .download-github-icon { width: 36px; height: 36px; border-radius: 9px; }
  .download-github-icon svg { width: 18px; height: 18px; }
  .download-support-desc { font-size: 0.8rem; line-height: 1.45; }
  .download-star-btn { margin-top: 0.6rem; padding: 0.4rem 0.75rem; font-size: 0.8125rem; }
  .download-footer { display: block; }
  .download-continue-btn { width: 100%; }
}
</style>
