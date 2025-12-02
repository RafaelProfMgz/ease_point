<route lang="yaml">
meta:
  layout: blank
</route>
<template>
  <v-app>
    <v-app-bar color="transparent" elevation="0" class="px-md-12 pt-4" absolute>
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-clock-fast"
          color="primary"
          size="32"
          class="mr-2"
        ></v-icon>
        <span class="text-h6 font-weight-bold text-white">EasyPoint</span>
      </div>
      <v-spacer></v-spacer>
      <v-btn variant="text" color="white" to="/login" class="mr-2">Login</v-btn>
      <v-btn
        color="primary"
        variant="flat"
        rounded="xl"
        to="/register"
        class="font-weight-bold"
      >
        Começar Agora
      </v-btn>
    </v-app-bar>

    <v-main class="landing-bg fill-height">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-row
          class="text-center align-center justify-center relative z-index-1"
        >
          <v-col cols="12" md="10" lg="8" class="mt-16 mt-md-0">
            <v-chip
              color="primary"
              variant="outlined"
              class="mb-6 animate-fade-in"
              size="small"
            >
              Gestão de RH 2.0
            </v-chip>

            <h1
              class="text-h3 text-md-h1 font-weight-black text-white mb-6 lh-tight"
            >
              Controle de ponto <br />
              <span class="text-transparent bg-clip-text bg-gradient-primary">
                simples e inteligente
              </span>
            </h1>

            <p
              class="text-h6 text-grey-lighten-2 mb-10 font-weight-regular px-md-16"
            >
              Abandone as planilhas. Gerencie jornadas, horas extras e banco de
              horas com a segurança e a agilidade que sua empresa moderna
              precisa.
            </p>

            <div class="d-flex justify-center flex-wrap gap-4 mb-16">
              <v-btn
                size="x-large"
                color="primary"
                rounded="xl"
                to="/login"
                class="font-weight-bold px-10 elevation-10"
                prepend-icon="mdi-rocket-launch"
                height="64"
              >
                Acessar Sistema
              </v-btn>

              <v-btn
                size="x-large"
                variant="outlined"
                color="white"
                rounded="xl"
                to="/docs"
                class="px-8"
                prepend-icon="mdi-book-open-page-variant"
                height="64"
              >
                Documentação
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" class="mt-8">
            <v-row>
              <v-col cols="12" md="4" v-for="(feature, i) in features" :key="i">
                <v-hover v-slot="{ isHovering, props }">
                  <v-card
                    v-bind="props"
                    class="glass-card pa-6 transition-swing"
                    :elevation="isHovering ? 12 : 0"
                    :class="{ 'transform-up': isHovering }"
                  >
                    <v-avatar
                      :color="feature.color"
                      variant="tonal"
                      size="64"
                      class="mb-4"
                    >
                      <v-icon :icon="feature.icon" size="32"></v-icon>
                    </v-avatar>

                    <h3 class="text-h5 font-weight-bold text-white mb-2">
                      {{ feature.title }}
                    </h3>

                    <p class="text-body-1 text-grey-lighten-1">
                      {{ feature.text }}
                    </p>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div class="bg-blob blob-1"></div>
        <div class="bg-blob blob-2"></div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const features = ref([
  {
    icon: "mdi-domain",
    color: "blue",
    title: "Multi-Empresa",
    text: "Painel centralizado para gerenciar filiais, departamentos e equipes remotas sem complicações.",
  },
  {
    icon: "mdi-shield-check",
    color: "green",
    title: "Segurança Total",
    text: "Criptografia de ponta a ponta, backups automáticos e conformidade com a legislação trabalhista.",
  },
  {
    icon: "mdi-chart-box-outline",
    color: "orange",
    title: "Relatórios Vivos",
    text: "Dashboards em tempo real para acompanhar horas extras, atrasos e produtividade do time.",
  },
]);
</script>

<style scoped>
.landing-bg {
  background-color: #0f172a;
  background-image: radial-gradient(
      at 0% 0%,
      hsla(253, 16%, 7%, 1) 0,
      transparent 50%
    ),
    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
  position: relative;
  overflow: hidden;
}

.bg-gradient-primary {
  background: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
}
.text-transparent {
  color: transparent;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important;
  cursor: default;
}

.transform-up {
  transform: translateY(-10px);
  border-color: rgba(99, 102, 241, 0.5);
}

.transition-swing {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.gap-4 {
  gap: 16px;
}

.lh-tight {
  line-height: 1.1;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: #4f46e5;
  top: -100px;
  left: -100px;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: #ec4899;
  bottom: -50px;
  right: -50px;
}

.z-index-1 {
  z-index: 1;
  position: relative;
}
</style>
