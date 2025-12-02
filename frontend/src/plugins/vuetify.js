import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'myCustomDark',
    themes: {
      myCustomDark: {
        dark: true,
        colors: {
          background: '#0F172A', // Azul noturno profundo (quase preto)
          surface: '#1E293B',    // Um pouco mais claro para cartões
          primary: '#38BDF8',    // Azul Ciano brilhante para ações principais
          secondary: '#94A3B8',  // Cinza azulado para textos secundários
          error: '#EF4444',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
        },
        variables: {
          'border-color': '#334155',
          'border-opacity': 0.12,
        }
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      variant: 'flat',
      class: 'rounded-lg border-thin',
    },
    VBtn: {
      variant: 'flat',
      height: 44,
      class: 'text-none rounded-md',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
  },
})