<template>
  <v-container class="py-8">
    
    <div v-if="!user" class="d-flex justify-center align-center fill-height" style="min-height: 80vh;">
      <div class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-grey">Sincronizando dados...</p>
      </div>
    </div>

    <div v-else>
      <v-row align="center" class="mb-6">
        <v-col cols="12" md="8" class="d-flex align-center">
          <v-avatar size="64" class="mr-4 elevation-5" border>
            <v-img :src="user.user_metadata?.avatar_url" alt="Foto"></v-img>
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
        <v-col cols="12" md="5">
          <v-card class="elevation-10 rounded-xl bg-grey-darken-4 text-center py-8">
            <v-card-title class="text-overline text-grey-lighten-1">HORA ATUAL</v-card-title>
            <div class="text-h2 font-weight-black my-4 text-primary">{{ horarioAtual }}</div>
            <div class="text-subtitle-1 mb-6 text-grey">{{ dataAtual }}</div>
            
            <v-divider class="mx-8 mb-6"></v-divider>

            <v-card-text>
              <div class="d-flex flex-column gap-3 px-4">
                <v-btn color="green-darken-1" size="x-large" class="mb-3" elevation="4" :loading="loading" @click="baterPonto('ENTRADA')">
                  🟢 Entrada
                </v-btn>
                <div class="d-flex gap-2 justify-center mb-3">
                  <v-btn color="orange-darken-3" class="flex-grow-1" @click="baterPonto('SAIDA_ALMOCO')">🍛 Saída Almoço</v-btn>
                  <v-btn color="orange-darken-3" class="flex-grow-1" @click="baterPonto('VOLTA_ALMOCO')">🔙 Volta Almoço</v-btn>
                </div>
                <v-btn color="red-darken-1" size="x-large" elevation="4" :loading="loading" @click="baterPonto('SAIDA')">
                  🔴 Encerrar Expediente
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Painel Direito (Tabela) -->
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
                  <td>{{ formatarData(ponto.created_at) }}</td>
                  <td>
                    <v-chip size="small" :color="getCorTipo(ponto.tipo)" class="font-weight-bold">
                      {{ ponto.tipo.replace('_', ' ') }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn icon="mdi-delete" size="x-small" color="grey" variant="text" @click="deletarPonto(ponto.id)"></v-btn>
                  </td>
                </tr>
                <tr v-if="historico.length === 0">
                  <td colspan="3" class="text-center py-4 text-grey">Nenhum registro encontrado hoje.</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top">
      {{ snackbar.text }}
      <template v-slot:actions><v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn></template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const loading = ref(false)
const historico = ref([])
const horarioAtual = ref('')
const dataAtual = ref('')
const snackbar = ref({ show: false, text: '', color: 'success' })
let relogioInterval = null

watch(user, (novoUser) => {
  if (novoUser) {
    console.log("Usuário detectado pelo Watch, carregando...")
    carregarHistorico()
  }
})

const carregarHistorico = async () => {
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
  if (!user.value) return
  loading.value = true
  try {
    const corpo = {
      usuario_email: user.value.email,
      usuario_nome: user.value.user_metadata?.full_name || 'Usuário',
      tipo: tipo,
      observacao: 'Via Dashboard'
    }
    const res = await fetch('http://localhost:3001/api/pontos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    })
    if (res.ok) {
      mostrarAviso(`Ponto de ${tipo} registrado!`, 'success')
      await carregarHistorico()
    } else {
      throw new Error('Falha ao salvar')
    }
  } catch (erro) {
    mostrarAviso('Erro ao bater ponto', 'error')
  } finally {
    loading.value = false
  }
}

const deletarPonto = async (id) => {
  if (!confirm('Excluir este registro?')) return
  try {
    await fetch(`http://localhost:3001/api/pontos/${id}`, { method: 'DELETE' })
    mostrarAviso('Registro removido', 'info')
    carregarHistorico()
  } catch (erro) {
    mostrarAviso('Erro ao excluir', 'error')
  }
}

const handleLogout = async () => {
  await authStore.logout()
}

const atualizarRelogio = () => {
  const agora = new Date()
  horarioAtual.value = agora.toLocaleTimeString('pt-BR')
  dataAtual.value = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}
const mostrarAviso = (text, color) => { snackbar.value = { show: true, text, color } }
const formatarData = (d) => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
const getCorTipo = (t) => ({'ENTRADA':'green','SAIDA_ALMOCO':'orange','VOLTA_ALMOCO':'amber','SAIDA':'red'}[t] || 'grey')

onMounted(async () => {
  atualizarRelogio()
  relogioInterval = setInterval(atualizarRelogio, 1000)
  
  if (user.value) {
    console.log("Usuário já existe no LocalStorage, carregando...")
    carregarHistorico()
  }
})

onUnmounted(() => clearInterval(relogioInterval))
</script>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>