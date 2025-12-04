import { defineStore } from "pinia";

export const useSnackbarStore = defineStore("snackbar", {
  state: () => ({
    show: false,
    text: "",
    color: "success",
    timeout: 4000,
  }),
  getters: {
    icon: (state) => {
      switch (state.color) {
        case "error":
          return "mdi-alert-circle";
        case "warning":
          return "mdi-alert";
        case "info":
          return "mdi-information";
        default:
          return "mdi-check-circle";
      }
    },
  },
  actions: {
    showSnackbar(text, color = "success") {
      this.text = text;
      this.color = color;
      this.show = true;
    },
  },
});
