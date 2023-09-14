import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

window.CESIUM_BASE_URL = '/'

import { Ion } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1OGY1NjRjOC01MjI2LTRlODctOTkzZi00NzE4ODA3NjgzMjIiLCJpZCI6MTUzMjk5LCJpYXQiOjE2ODkxMzE2NjF9.lyR-uV7WfOyo61THwQq5IA6UXkJqQUPFKkF8XquKx6g'

createApp(App).mount('#app')
