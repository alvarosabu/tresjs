import { createApp } from 'vue'
import TresJSPlugin from '/@/plugin'
import router from './router'

import App from './App.vue'

import './index.css'

export const app = createApp(App)

app.use(TresJSPlugin)
app.use(router)

console.log('app', app)
app.mount('#app')
