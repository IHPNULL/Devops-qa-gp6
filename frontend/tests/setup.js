import { config } from '@vue/test-utils'
import vuetify from '../src/plugins/vuetify.js'

// As specs montam cada view direto (sem App.vue): registrar o Vuetify aqui evita
// repetir "global.plugins" em todas elas.
config.global.plugins = [vuetify]

// Componentes do Vuetify observam o tamanho do elemento; o jsdom nao implementa ResizeObserver.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Usado pelo v-app / display breakpoints do Vuetify.
global.matchMedia =
  global.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }))
