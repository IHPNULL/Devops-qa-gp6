import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify.js'
import router from './router/index.js'

createApp(App).use(vuetify).use(router).mount('#app')
