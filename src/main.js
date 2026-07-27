import { createVaporApp, createVaporSSRApp } from '@vue/runtime-vapor'
import './styles/global.less'
import App from './App.vue'

const root = document.querySelector('#app')
const isPrerendered = root?.hasAttribute('data-prerendered')

// 语言由 URL 决定，必须和预渲染时使用的值一致，否则 hydration 会失配。
// 预渲染页面上 data-lang 已经写好；开发模式下退回按路径判断。
const lang = root?.dataset.lang
  ?? (location.pathname.startsWith('/en') ? 'en' : 'zh')
const props = { lang: lang === 'en' ? 'en' : 'zh' }

const app = isPrerendered
  ? createVaporSSRApp(App, props)
  : createVaporApp(App, props)

app.mount(root)
