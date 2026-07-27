import { createVaporSSRApp } from '@vue/runtime-vapor'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'

export const render = (lang = 'zh') =>
  renderToString(createVaporSSRApp(App, { lang }))
