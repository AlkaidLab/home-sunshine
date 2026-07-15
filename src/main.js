import { createVaporApp, createVaporSSRApp } from '@vue/runtime-vapor'
import './styles/global.less'
import App from './App.vue'

const root = document.querySelector('#app')
const isPrerendered = root?.hasAttribute('data-prerendered')
const app = isPrerendered ? createVaporSSRApp(App) : createVaporApp(App)

app.mount(root)
