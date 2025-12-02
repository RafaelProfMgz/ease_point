<template>
  <div class="landing-bg min-h-screen position-relative">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <v-container class="fill-height align-center  position-relative z-index-1" fluid>
      <v-row class="mt-4">
            <v-col cols="12">
              <v-btn
                prepend-icon="mdi-arrow-left"
                variant="text"
                color="white"
                to="/"
                class="glass-btn"
              >
                Voltar ao Início
              </v-btn>
            </v-col>
      </v-row>
    </v-container>

    <v-container class="fill-height align-center  position-relative z-index-1" fluid>
  
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="10" lg="8" class="text-center mt-6">
          <v-chip
            class="glass-chip font-weight-bold text-white mb-6"
            prepend-icon="mdi-rocket-launch-outline"
            size="default"
          >
            Versão 1.0
          </v-chip>
          
          <h1 class="text-h3 text-md-h2 font-weight-black text-white mb-6 lh-tight">
            Documentação do
            <span class="text-transparent bg-clip-text bg-gradient-primary">
              Sistema
            </span>
          </h1>
          
          <p class="text-h6 text-grey-lighten-1 font-weight-regular px-md-16">
            Guia completo para gestão de ponto inteligente, horas extras e
            controle de jornada com a tecnologia EasyPoint.
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          
          <v-card class="mb-8 glass-card" elevation="0" rounded="xl">
            <div class="d-flex flex-column flex-md-row align-start align-md-center pa-8">
              <v-avatar color="rgba(99, 102, 241, 0.2)" size="64" rounded="lg" class="mb-4 mb-md-0 mr-md-6 border-highlight">
                <v-icon icon="mdi-book-open-page-variant" color="indigo-lighten-1" size="32"></v-icon>
              </v-avatar>
              
              <div>
                <h2 class="text-h5 font-weight-bold text-white mb-2">Visão Geral</h2>
                <div class="text-body-1 text-grey-lighten-1">
                  O <strong>EasyPoint</strong> é uma solução SaaS projetada para eliminar a burocracia do RH. 
                  Centralizamos o registro de ponto e a gestão de funcionários em uma interface intuitiva. 
                  Ideal para empresas que buscam conformidade e agilidade.
                </div>
              </div>
            </div>
          </v-card>

          <div class="d-flex align-center mb-6 mt-10">
            <v-icon icon="mdi-star-four-points" color="primary-lighten-1" class="mr-2"></v-icon>
            <h3 class="text-h5 font-weight-bold text-white">Principais Funcionalidades</h3>
          </div>

          <v-row class="mb-8">
            <v-col cols="12" md="4" v-for="(feature, i) in features" :key="i">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  class="h-100 glass-card pa-6 transition-swing"
                  :class="{ 'transform-up': isHovering }"
                  elevation="0"
                  rounded="xl"
                >
                  <v-avatar
                    :color="feature.bgInfo"
                    variant="flat"
                    size="56"
                    class="mb-6"
                  >
                    <v-icon :icon="feature.icon" size="28" :color="feature.color"></v-icon>
                  </v-avatar>
                  
                  <h3 class="text-h6 font-weight-bold text-white mb-3">
                    {{ feature.title }}
                  </h3>
                  <p class="text-body-2 text-grey-lighten-1 line-height-relaxed">
                    {{ feature.desc }}
                  </p>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>

          <v-card class="mb-12 glass-card pa-8" elevation="0" rounded="xl">
             <div class="d-flex align-center mb-8">
                <v-icon icon="mdi-timeline-text-outline" color="secondary-lighten-1" class="mr-2"></v-icon>
                <h3 class="text-h5 font-weight-bold text-white">Fluxo de Uso</h3>
             </div>

            <v-timeline align="start" side="end" line-color="rgba(255,255,255,0.1)">
              <v-timeline-item dot-color="indigo" icon="mdi-domain" size="small" fill-dot>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-white">Cadastro da Empresa</span>
                  <span class="text-body-2 text-grey-lighten-1">O administrador cria a conta, configura os turnos e define as regras.</span>
                </div>
              </v-timeline-item>

              <v-timeline-item dot-color="purple" icon="mdi-email-fast" size="small" fill-dot>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-white">Convite aos Colaboradores</span>
                  <span class="text-body-2 text-grey-lighten-1">Funcionários recebem acesso via e-mail e criam suas senhas.</span>
                </div>
              </v-timeline-item>

              <v-timeline-item dot-color="pink" icon="mdi-fingerprint" size="small" fill-dot>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-white">Registro Diário</span>
                  <span class="text-body-2 text-grey-lighten-1">Entradas, saídas e intervalos registrados em tempo real no Dashboard.</span>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card>


          <div class="d-flex align-center mb-6">
            <v-icon icon="mdi-chat-question-outline" color="primary-lighten-1" class="mr-2"></v-icon>
            <h3 class="text-h5 font-weight-bold text-white">Perguntas Frequentes</h3>
          </div>

          <v-expansion-panels variant="accordion" class="glass-panels mb-12">
            <v-expansion-panel
              v-for="(faq, i) in faqs"
              :key="i"
              class="mb-2 rounded-lg border-glass"
              elevation="0"
              bg-color="transparent"
              eager 
            >
              <v-expansion-panel-title 
                class="font-weight-bold text-white" 
                expand-icon="mdi-chevron-down" 
                color="transparent"
              >
                {{ faq.question }}
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                {{ faq.answer }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";

const features = ref([
  {
    title: "Controle de Ponto",
    desc: "Registros precisos com geolocalização e carimbo de tempo seguro, prevenindo fraudes.",
    icon: "mdi-clock-check-outline",
    color: "white",
    bgInfo: "indigo-darken-2"
  },
  {
    title: "Banco de Horas",
    desc: "Cálculo automático de saldo positivo ou negativo, facilitando a compensação de jornadas.",
    icon: "mdi-scale-balance",
    color: "white",
    bgInfo: "purple-darken-2"
  },
  {
    title: "Relatórios PDF",
    desc: "Exporte a folha de ponto mensal pronta para assinatura e contabilidade em um clique.",
    icon: "mdi-file-document-outline",
    color: "white",
    bgInfo: "pink-darken-2"
  },
]);

const faqs = ref([
  {
    question: "O sistema funciona sem internet?",
    answer:
      "O layout carrega offline (PWA), mas o registro de ponto requer conexão mínima para garantir a integridade e segurança dos dados no servidor em nuvem.",
  },
  {
    question: "Como recupero minha senha?",
    answer:
      'Na tela de login, clique em "Esqueceu a senha?". Um link seguro de redefinição com validade temporária será enviado ao seu e-mail cadastrado.',
  },
  {
    question: "É seguro?",
    answer:
      "Sim. Utilizamos criptografia de ponta a ponta (SSL), banco de dados seguro no Supabase e autenticação via Token JWT, além de suporte a OAuth (Google/GitHub).",
  },
]);
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.landing-bg {
  background-color: #0f172a;
  background-image: radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
                    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
                    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
  background-attachment: fixed;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.glass-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bg-gradient-primary {
  background: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
}
.text-transparent { color: transparent; }

:deep(.v-timeline-divider__dot) {
  background: transparent !important;
  box-shadow: none;
}
:deep(.v-timeline-divider__inner-dot) {
  box-shadow: 0 0 10px currentColor;
}

.glass-panels :deep(.v-expansion-panel-title) {
  color: white !important;
}

.glass-panels :deep(.v-expansion-panel-text__wrapper) {
  color: #e0e0e0 !important; 
  padding-bottom: 24px;    
  line-height: 1.6;      
}

.glass-panels :deep(.v-expansion-panel-title__overlay) {
  opacity: 0 !important;
}
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.02) !important;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}
.blob-1 { width: 500px; height: 500px; background: #4f46e5; top: -100px; left: -100px; }
.blob-2 { width: 400px; height: 400px; background: #ec4899; bottom: 0; right: -100px; }

.z-index-1 { position: relative; z-index: 1; }

.transform-up {
  transform: translateY(-5px);
  border-color: rgba(168, 85, 247, 0.4);
  background: rgba(255, 255, 255, 0.06) !important;
}

.transition-swing {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.border-highlight {
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.line-height-relaxed {
  line-height: 1.6;
}
</style>