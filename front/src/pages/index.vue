<template>
  <v-container class="fill-height bg-grey-darken-4 d-flex align-center justify-center" fluid>
    <v-row class="text-center align-center justify-center">
      <v-col cols="12" md="8">
        <v-icon icon="mdi-clock-fast" size="80" color="primary" class="mb-4"></v-icon>
        
        <h1 class="text-h2 font-weight-bold mb-4 text-white">
          Easy<span class="text-primary">Point</span>
        </h1>
        
        <p class="text-h5 text-grey-lighten-1 mb-8">
          Gestão de ponto inteligente para empresas modernas.<br>
          Controle jornadas, horas extras e banco de horas em um só lugar.
        </p>

        <div class="d-flex justify-center gap-4">
          <v-btn 
            size="x-large" 
            color="primary" 
            rounded="xl" 
            to="/login"
            class="font-weight-bold px-8"
            elevation="8"
          >
            Acessar Sistema
          </v-btn>
          
          <v-btn 
            size="x-large" 
            variant="outlined" 
            color="white" 
            rounded="xl" 
            to="/register"
            class="px-8 ml-4"
          >
            Criar Conta
          </v-btn>
        </div>

        <v-row class="mt-12">
          <v-col cols="12" md="4">
            <v-card class="bg-grey-darken-3 pa-4" elevation="0">
              <v-icon icon="mdi-domain" size="40" color="blue" class="mb-2"></v-icon>
              <div class="text-h6 text-white">Multi-Empresa</div>
              <div class="text-body-2 text-grey">Gerencie múltiplas filiais e equipes separadamente.</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="bg-grey-darken-3 pa-4" elevation="0">
              <v-icon icon="mdi-security" size="40" color="green" class="mb-2"></v-icon>
              <div class="text-h6 text-white">Seguro</div>
              <div class="text-body-2 text-grey">Dados criptografados e controle de acesso rigoroso.</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="bg-grey-darken-3 pa-4" elevation="0">
              <v-icon icon="mdi-chart-line" size="40" color="orange" class="mb-2"></v-icon>
              <div class="text-h6 text-white">Relatórios</div>
              <div class="text-body-2 text-grey">Visualize históricos e métricas em tempo real.</div>
            </v-card>
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Landing page simples, sem lógica complexa
</script>