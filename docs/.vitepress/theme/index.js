import DefaultTheme from 'vitepress/theme-without-fonts'
import { useData } from 'vitepress'
import { watch } from 'vue'
import './style.css'

export default {
  extends: DefaultTheme,
  setup() {
    const { isDark } = useData()
    if (typeof window !== 'undefined') {
      watch(isDark, value => {
        try {
          localStorage.setItem('theme', value ? 'chocolate' : 'gura')
        } catch {}
      }, { immediate: true })
    }
  },
}
