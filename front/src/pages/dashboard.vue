<template>
  <v-container class="py-8">
    
    <!-- TELA DE CARREGAMENTO (Enquanto o Supabase busca o usuário) -->
    <div v-if="!user" class="d-flex justify-center align-center fill-height" style="min-height: 80vh;">
      <div class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-grey">Carregando seus dados...</p>
      </div>
    </div>

    <!-- CONTEÚDO DO DASHBOARD (Só aparece quando o usuário chegou) -->
    <div v-else>
      
      <!-- 1. CABEÇALHO COM DADOS DO USUÁRIO -->
      <v-row align="center" class="mb-6">
        <v-col cols="12" md="8" class="d-flex align-center">
          <v-avatar size="64" class="mr-4 elevation-5" border>
            <!-- Foto do Google -->
            <v-img :src="user.user_metadata?.avatar_url" alt="Foto de Perfil" cover></v-img>
          </v-avatar>
          <div>
            <h1 class="text-h4 font-weight-bold">Olá, {{ user.user_metadata?.full_name }}!</h1>
            <p class="text-grey">{{ user.email }}</p>
          </div>
        </v-col>
        
        <v-col cols="12" md="4" class="text-md-right">
          <v-btn color="red-darken-3" variant="outlined" prepend-icon="mdi-logout" @click="handleLogout">
            Sair do Sistema
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="mb-8"></v-divider>

      <v-row>
        <!-- 2. CARTÃO DE REGISTRO DE PONTO (ESQUERDA) -->
        <v-col cols="12" md="5">
          <v-card class="elevation-10 rounded-xl bg-grey-darken-4 text-center py-8">
            <v-card-title class="text-overline text-grey-lighten-1">
              HORA ATUAL
            </v-card-title>
            
            <div class="text-h2 font-weight-black my-4 text-primary">
              {{ horarioAtual }}
            </div>
            
            <div class="text-subtitle-1 mb-6 text-grey">
              {{ dataAtual }}
            </div>

            <v-divider class="mx-8 mb-6"></v-divider>

            <v-card-text>
              <p class="mb-4 font-weight-bold">Registrar Ponto:</p>
              
              <div class="d-flex flex-column gap-3 px-4">
                <v-btn 
                  color="green-darken-1" 
                  size="x-large" 
                  class="mb-3" 
                  elevation="4"
                  :loading="loading"
                  @click="baterPonto('ENTRADA')"
                >
                  🟢 Entrada
                </v-btn>

                <div class="d-flex gap-2 justify-center mb-3">
                  <v-btn color="orange-darken-3" class="flex-grow-1" @click="baterPonto('SAIDA_ALMOCO')">
                    🍛 Saída Almoço
                  </v-btn>
                  <v-btn color="orange-darken-3" class="flex-grow-1" @click="baterPonto('VOLTA_ALMOCO')">
                    🔙 Volta Almoço
                  </v-btn>
                </div>

                <v-btn 
                  color="red-darken-1" 
                  size="x-large" 
                  elevation="4"
                  :loading="loading"
                  @click="baterPonto('SAIDA')"
                >
                  🔴 Encerrar Expediente
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 3. TABELA DE HISTÓRICO (DIREITA) -->
        <v-col cols="12" md="7">
          <v-card class="elevation-6 rounded-xl h-100">
            <v-card-title class="d-flex align-center py-4 px-6 bg-surface-light">
              <v-icon icon="mdi-history" class="mr-2"></v-icon>
              Histórico Recente
              <v-spacer></v-spacer>
              <v-btn icon="mdi-refresh" variant="text" size="small" @click="carregarHistorico"></v-btn>
            </v-card-title>

            <v-table class="bg-transparent">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ponto in historico" :key="ponto.id">
                  <td>
                    {{ formatarData(ponto.created_at) }}
                  </td>
                  <td>
                    <v-chip 
                      size="small" 
                      :color="getCorTipo(ponto.tipo)" 
                      class="font-weight-bold"
                    >
                      {{ ponto.tipo.replace('_', ' ') }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn icon="mdi-delete" size="x-small" color="grey" variant="text" @click="deletarPonto(ponto.id)"></v-btn>
                  </td>
                </tr>
                <tr v-if="historico.length === 0">
                  <td colspan="3" class="text-center py-4 text-grey">
                    Nenhum registro encontrado hoje.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Snackbar para avisos -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue' // <--- IMPORTANTE: adicionei watch
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Computado: sempre que a store mudar, essa variável muda também
const user = computed(() => authStore.user)

const loading = ref(false)
const historico = ref([])
const horarioAtual = ref('')
const dataAtual = ref('')
const snackbar = ref({ show: false, text: '', color: 'success' })
let relogioInterval = null

// --- CORREÇÃO PRINCIPAL: O VIGILANTE ---
// Assim que o usuário deixar de ser "null" e virar um objeto real, carregamos a tabela
watch(user, (novoValor) => {
  if (novoValor) {
    console.log("Usuário chegou! Carregando histórico...", novoValor)
    carregarHistorico()
  }
})

const atualizarRelogio = () => {
  const agora = new Date()
  horarioAtual.value = agora.toLocaleTimeString('pt-BR')
  dataAtual.value = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

const carregarHistorico = async () => {
  // Se ainda for null, cancela e espera o watch chamar de novo
  if (!user.value?.email) return 

  try {
    const resposta = await fetch(`http://localhost:3001/api/pontos?email=${user.value.email}`)
    const dados = await resposta.json()
    historico.value = dados
  } catch (erro) {
    mostrarAviso('Erro ao carregar histórico: ' + erro.message, 'error')
  }
}

const baterPonto = async (tipo) => {
  if (!user.value) return;

  loading.value = true
  try {
    const corpoRequisicao = {
      usuario_email: user.value.email,
      usuario_nome: user.value.user_metadata?.full_name || 'Usuário',
      tipo: tipo,
      observacao: 'Registro via Dashboard'
    }

    const resposta = await fetch('http://localhost:3001/api/pontos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpoRequisicao)
    })

    if (resposta.ok) {
      mostrarAviso(`Ponto de ${tipo} registrado com sucesso!`, 'success')
      await carregarHistorico()
    } else {
      throw new Error('Falha ao salvar')
    }
  } catch (erro) {
    mostrarAviso('Erro ao bater ponto.', 'error')
  } finally {
    loading.value = false
  }
}

const deletarPonto = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este registro?')) return

  try {
    await fetch(`http://localhost:3001/api/pontos/${id}`, { method: 'DELETE' })
    mostrarAviso('Registro removido.', 'info')
    carregarHistorico()
  } catch (erro) {
    mostrarAviso('Erro ao excluir.', 'error')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const mostrarAviso = (texto, cor) => {
  snackbar.value = { show: true, text: texto, color: cor }
}

const formatarData = (dataIso) => {
  return new Date(dataIso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const getCorTipo = (tipo) => {
  const cores = {
    'ENTRADA': 'green',
    'SAIDA_ALMOCO': 'orange',
    'VOLTA_ALMOCO': 'amber',
    'SAIDA': 'red'
  }
  return cores[tipo] || 'grey'
}

onMounted(async () => {
  atualizarRelogio()
  relogioInterval = setInterval(atualizarRelogio, 1000)
  
  if (user.value) {
    carregarHistorico()
  } else {
    await authStore.checkSession()
  }
})

onUnmounted(() => {
  clearInterval(relogioInterval)
})
</script>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>