import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

/**
 * Tema do GameEducator: verde sobre branco.
 * O verde carrega a barra, o menu lateral e as acoes; as superficies ficam brancas,
 * destacadas sobre um fundo levemente esverdeado.
 */
const gameEducator = {
  dark: false,
  colors: {
    primary: '#2E7D32',
    secondary: '#66BB6A',
    background: '#F5F8F5',
    surface: '#FFFFFF',
    'surface-variant': '#E8F5E9',
    'on-surface-variant': '#1B3D21',
    'on-surface': '#1A1C1A',
    success: '#2E7D32',
    error: '#C62828',
    warning: '#EF6C00',
    info: '#00695C',
  },
}

export default createVuetify({
  // 'md' garante o menu lateral fixo em telas a partir de 960px (inclusive a
  // janela de 1280px usada pela suite de UI), e o menu retratil abaixo disso.
  display: { mobileBreakpoint: 'md' },
  theme: {
    defaultTheme: 'gameEducator',
    themes: { gameEducator },
  },
  defaults: {
    VCard: { variant: 'flat', rounded: 'lg', border: true },
    VBtn: { color: 'primary', rounded: 'lg', class: 'text-none' },
    VChip: { rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'comfortable', hideDetails: 'auto' },
    VAlert: { variant: 'tonal', rounded: 'lg' },
  },
})
