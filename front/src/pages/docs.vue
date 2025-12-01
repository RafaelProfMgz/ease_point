<template>
  <v-container class="bg-grey-lighten-5 fill-height align-start pb-16" fluid>
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="10" lg="8" class="text-center mt-10">
        <v-chip
          color="primary"
          variant="outlined"
          class="mb-4 font-weight-bold"
        >
          Versão 1.0
        </v-chip>
        <h1 class="text-h3 font-weight-bold text-primary mb-4">
          Documentação do Sistema
        </h1>
        <p class="text-h6 text-medium-emphasis font-weight-regular">
          Guia completo para gestão de ponto inteligente, horas extras e
          controle de jornada.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="mb-8 rounded-xl" elevation="2">
          <v-card-item class="pa-6">
            <template v-slot:prepend>
              <v-avatar color="primary" variant="tonal" rounded="lg">
                <v-icon icon="mdi-book-open-page-variant"></v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h5 font-weight-bold"
              >Visão Geral</v-card-title
            >
            <v-card-subtitle>O que é o EasyPoint?</v-card-subtitle>
          </v-card-item>

          <v-card-text class="text-body-1 text-grey-darken-1 px-6 pb-6">
            O <strong>EasyPoint</strong> é uma solução SaaS (Software as a
            Service) projetada para eliminar a burocracia do RH. Nossa
            plataforma centraliza o registro de ponto, cálculo automático de
            horas e gestão de funcionários em uma interface intuitiva e segura.
            Ideal para empresas que buscam conformidade com a legislação
            trabalhista e agilidade operacional.
          </v-card-text>
        </v-card>

        <div class="text-h5 font-weight-bold mb-4 ml-2 text-grey-darken-3">
          Principais Funcionalidades
        </div>

        <v-row class="mb-8">
          <v-col cols="12" md="4" v-for="(feature, i) in features" :key="i">
            <v-card
              class="h-100 rounded-lg border-thin"
              variant="flat"
              color="white"
            >
              <v-card-text class="text-center pa-6">
                <v-icon
                  :icon="feature.icon"
                  size="48"
                  color="primary"
                  class="mb-4"
                ></v-icon>
                <h3 class="text-h6 font-weight-bold mb-2">
                  {{ feature.title }}
                </h3>
                <p class="text-body-2 text-grey-darken-1">{{ feature.desc }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="mb-8 rounded-xl pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4"
            >Fluxo de Uso</v-card-title
          >

          <v-timeline align="start" side="end">
            <v-timeline-item
              dot-color="primary"
              icon="mdi-account-plus"
              size="small"
            >
              <div class="d-flex flex-column">
                <span class="text-subtitle-1 font-weight-bold"
                  >Cadastro da Empresa</span
                >
                <span class="text-body-2 text-grey"
                  >O administrador cria a conta e configura os turnos.</span
                >
              </div>
            </v-timeline-item>

            <v-timeline-item
              dot-color="success"
              icon="mdi-account-group"
              size="small"
            >
              <div class="d-flex flex-column">
                <span class="text-subtitle-1 font-weight-bold"
                  >Convite aos Colaboradores</span
                >
                <span class="text-body-2 text-grey"
                  >Funcionários recebem acesso via e-mail.</span
                >
              </div>
            </v-timeline-item>

            <v-timeline-item
              dot-color="warning"
              icon="mdi-fingerprint"
              size="small"
            >
              <div class="d-flex flex-column">
                <span class="text-subtitle-1 font-weight-bold"
                  >Registro Diário</span
                >
                <span class="text-body-2 text-grey"
                  >Entradas, saídas e intervalos registrados em tempo
                  real.</span
                >
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card>

        <div class="text-h5 font-weight-bold mb-4 ml-2 text-grey-darken-3">
          Perguntas Frequentes
        </div>

        <v-expansion-panels variant="popout" class="mb-12">
          <v-expansion-panel v-for="(faq, i) in faqs" :key="i">
            <v-expansion-panel-title class="font-weight-medium">
              {{ faq.question }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-grey-darken-2">
              {{ faq.answer }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const features = ref([
  {
    title: "Controle de Ponto",
    desc: "Registros precisos de entrada, saída e intervalos com geolocalização e carimbo de tempo seguro.",
    icon: "mdi-clock-check-outline",
  },
  {
    title: "Banco de Horas",
    desc: "Cálculo automático de saldo positivo ou negativo, facilitando a compensação de jornadas.",
    icon: "mdi-scale-balance",
  },
  {
    title: "Relatórios PDF",
    desc: "Exporte a folha de ponto mensal pronta para assinatura e contabilidade em um clique.",
    icon: "mdi-file-document-outline",
  },
]);

const faqs = ref([
  {
    question: "O sistema funciona sem internet?",
    answer:
      "O registro de ponto requer conexão para garantir a integridade dos dados no servidor (nuvem), mas o layout carrega offline.",
  },
  {
    question: "Como recupero minha senha?",
    answer:
      'Na tela de login, clique em "Esqueceu a senha?". Um link de redefinição será enviado ao seu e-mail corporativo.',
  },
  {
    question: "É seguro?",
    answer:
      "Sim. Utilizamos criptografia de ponta a ponta e autenticação segura via Token JWT e OAuth (Google/GitHub).",
  },
]);
</script>

<style scoped>
.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
