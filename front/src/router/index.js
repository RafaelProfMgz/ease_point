import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

router.beforeEach(async (to, from, next) => {
  const localUser = localStorage.getItem("ponto_user");
  const publicPages = ["/", "/login", "/register", "/forgotPassword", "/resetPassword"];
  const authRequired = !publicPages.includes(to.path);

  if (to.hash && to.hash.includes("access_token")) {
    return next();
  }

  if (authRequired && !localUser) {
    return next("/login");
  } else if (publicPages.includes(to.path) && localUser) {
    return next("/dashboard");
  } else {
    next();
  }
});

router.onError((error, to) => {
  const isDynamicImportError = error?.message?.includes?.(
    "Failed to fetch dynamically imported module"
  );

  if (isDynamicImportError) {
    const hasReloadedBefore =
      localStorage.getItem("vuetify:dynamic-reload") === "true";

    if (hasReloadedBefore) {
      console.error(
        "Erro de importação dinâmica, recarregar página não resolveu o problema",
        error
      );
    } else {
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(error);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
