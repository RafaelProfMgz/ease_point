import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "siteTheme",
    themes: {
      siteTheme: {
        dark: true,
        colors: {},
        variables: {
          "border-color": "#E2E8F0",
          "border-opacity": 1,
        },
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      variant: "flat",
      class: "rounded-lg border-thin",
    },
    VBtn: {
      variant: "flat",
      height: 44,
      class: "text-none rounded-md",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      hideDetails: "auto",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
  },
});
