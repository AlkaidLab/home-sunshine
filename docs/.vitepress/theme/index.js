import DefaultTheme from 'vitepress/theme-without-fonts'
import { useData } from 'vitepress'
import { defineAsyncComponent, watch } from 'vue'
import Layout from './Layout.vue'
import './teek.css'
import './teek-common.scss'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component(
      'DocsHome',
      defineAsyncComponent(() => import('./components/DocsHome.vue')),
    )
    app.component(
      'ManualDiagram',
      defineAsyncComponent(() => import('./components/ManualDiagram.vue')),
    )
    app.component(
      'SunshineTip',
      defineAsyncComponent(() => import('./components/SunshineTip.vue')),
    )
    app.component(
      'ScreenshotFocus',
      defineAsyncComponent(() => import('./components/ScreenshotFocus.vue')),
    )
  },
  /** Synchronize document theme changes with the homepage's saved preference. */
  setup() {
    const { isDark } = useData()
    if (typeof window !== 'undefined') {
      watch(
        isDark,
        (value) => {
          try {
            localStorage.setItem('theme', value ? 'chocolate' : 'gura')
          } catch {}
        },
        { immediate: true },
      )
    }
  },
}
