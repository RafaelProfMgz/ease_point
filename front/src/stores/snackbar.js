import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    show: false,
    text: '',
    color: 'success',
    timeout: 4000
  }),
  actions: {
    showSnackbar(text, color = 'success') {
      this.text = text
      this.color = color
      this.show = true
    }
  }
})