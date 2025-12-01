<template>
  <v-app-bar color="primary">
    <v-app-bar-title>Painel do Colaborador</v-app-bar-title>
    <v-spacer></v-spacer>
    <div class="mr-4">Olá, {{ auth.user?.name }}</div>
    <v-btn icon="mdi-logout" @click="auth.logout()"></v-btn>
  </v-app-bar>

  <v-container class="mt-10">
    <!-- Cartão de Registro -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="text-center pa-6" elevation="3">
          <div class="text-h4 mb-4">{{ currentTime }}</div>
          <div class="text-subtitle-1 mb-6 text-grey">Registre seu ponto agora</div>

          <div class="d-flex justify-center gap-4 flex-wrap">
            <v-btn color="green-darken-1" size="x-large" @click="registerPoint('ENTRADA')" :loading="loading">
              <v-icon start>mdi-login</v-icon> Entrada
            </v-btn>
            <v-btn color="orange-darken-1" size="x-large" class="ml-4" @click="registerPoint('SAIDA')" :loading="loading">
              <v-icon start>mdi-logout</v-icon> Saída
            </v-btn>
             <v-btn color="blue" size="x-large" class="ml-4" @click="registerPoint('INTERVALO')" :loading="loading">
              <v-icon start>mdi-coffee</v-icon> Intervalo
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabela de Histórico -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="10">
        <v-card title="Histórico de Pontos">
          <v-data-table :items="history" :headers="headers" :loading="fetching">
            <template v-slot:item.created_at="{ item }">
              {{ formatDate(item.created_at) }}
            </template>
            <template v-slot:item.type="{ item }">
              <v-chip :color="getColor(item.type)">{{ item.type }}</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const auth = useAuthStore();
const history = ref([]);
const loading = ref(false);
const fetching = ref(true);
const currentTime = ref('');

// Configuração da Tabela
const headers = [
  { title: 'Data/Hora', key: 'created_at' },
  { title: 'Tipo', key: 'type' },
  { title: 'Descrição', key: 'description' },
];

// Relógio em tempo real
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('pt-BR');
};
let timer = setInterval(updateTime, 1000);
onUnmounted(() => clearInterval(timer));

// Funções
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

const getColor = (type) => {
  if (type === 'ENTRADA') return 'green';
  if (type === 'SAIDA') return 'red';
  return 'blue';
};

const fetchHistory = async () => {
  fetching.value = true;
  try {
    // Chama o endpoint GET /points
    const { data } = await axios.get('/points');
    history.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    fetching.value = false;
  }
};

const registerPoint = async (type) => {
  loading.value = true;
  try {
    // Chama o endpoint POST /points
    await axios.post('/points', {
      type: type,
      description: 'Registro via Web'
    });
    await fetchHistory(); // Atualiza a tabela
  } catch (error) {
    alert('Erro ao registrar ponto');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchHistory();
  updateTime();
});
</script>