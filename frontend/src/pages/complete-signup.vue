<template>
  <v-container class="fill-height landing-bg overflow-hidden" fluid>
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>

    <v-row justify="center" align="center" class="z-index-1 w-100">
      <v-col cols="12" md="8" lg="5" xl="4">
        <v-fade-transition appear>
          <v-card class="glass-card pa-8" rounded="xl" elevation="0">
            <div class="text-center mb-8">
              <div class="d-inline-block p-relative mb-4">
                <v-avatar
                  color="rgba(99, 102, 241, 0.2)"
                  size="80"
                  class="border-highlight elevation-5"
                >
                  <v-img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    alt="Foto do Perfil"
                    cover
                  ></v-img>

                  <v-icon
                    v-else
                    icon="mdi-account-circle"
                    size="40"
                    class="text-gradient-icon"
                  ></v-icon>
                </v-avatar>
              </div>

              <h2 class="text-h4 font-weight-bold text-white mb-2">
                Quase lá!
              </h2>
              <p class="text-body-1 text-grey-lighten-1">
                Olá,
                <strong class="text-white">{{ form.name || "Usuário" }}</strong
                >.<br />
                Confirme seus dados para continuar.
              </p>
            </div>

            <v-form @submit.prevent="submitForm" v-model="isValid">
              <span
                class="text-caption font-weight-bold text-uppercase text-primary-lighten-2 letter-spacing-1 mb-2 d-block"
              >
                Seu Perfil
              </span>

              <v-text-field
                v-model="form.name"
                label="Seu Nome Completo"
                placeholder="Como você quer ser chamado?"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                bg-color="rgba(0,0,0,0.2)"
                color="primary-lighten-1"
                base-color="rgba(255,255,255,0.2)"
                class="text-white mb-4"
                rounded="lg"
                :rules="[rules.required]"
              ></v-text-field>

              <v-divider class="mb-6 border-opacity-20"></v-divider>

              <span
                class="text-caption font-weight-bold text-uppercase text-primary-lighten-2 letter-spacing-1 mb-2 d-block"
              >
                Sua Empresa
              </span>

              <v-text-field
                v-model="form.companyName"
                label="Nome da Empresa"
                placeholder="Ex: Minha Startup Ltda"
                prepend-inner-icon="mdi-domain"
                variant="outlined"
                bg-color="rgba(0,0,0,0.2)"
                color="primary-lighten-1"
                base-color="rgba(255,255,255,0.2)"
                class="text-white mb-2"
                rounded="lg"
                :rules="[rules.required]"
              ></v-text-field>

              <v-select
                v-model="form.plan"
                :items="planOptions"
                label="Selecione um Plano"
                prepend-inner-icon="mdi-star-outline"
                variant="outlined"
                bg-color="rgba(0,0,0,0.2)"
                color="primary-lighten-1"
                base-color="rgba(255,255,255,0.2)"
                class="text-white mb-6"
                rounded="lg"
                item-title="title"
                item-value="value"
                menu-icon="mdi-chevron-down"
              ></v-select>

              <v-scale-transition>
                <div
                  v-if="errorMsg"
                  class="d-flex align-center bg-red-lighten-5 rounded-lg pa-3 mb-4 text-red-darken-4"
                >
                  <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
                  <span class="text-caption font-weight-bold">{{
                    errorMsg
                  }}</span>
                </div>
              </v-scale-transition>

              <v-btn
                block
                size="x-large"
                type="submit"
                class="btn-gradient text-white text-none font-weight-bold mb-4"
                rounded="xl"
                elevation="10"
                :loading="loading"
                :disabled="!isValid"
              >
                Concluir Configuração
                <template v-slot:append>
                  <v-icon icon="mdi-arrow-right"></v-icon>
                </template>
              </v-btn>
            </v-form>
          </v-card>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import { useSnackbarStore } from "@/stores/snackbar";

const router = useRouter();
const authStore = useAuthStore();
const snackbar = useSnackbarStore();

const isValid = ref(false);
const loading = ref(false);
const errorMsg = ref("");
const avatarUrl = ref(null);

const planOptions = [
  { title: "Bronze - Gratuito", value: "bronze" },
  { title: "Prata - Intermediário", value: "prata" },
  { title: "Ouro - Completo", value: "ouro" },
];

const form = reactive({
  name: "",
  companyName: "",
  plan: "bronze",
});

const rules = {
  required: (v) => !!v || "Este campo é obrigatório",
};

onMounted(async () => {
  const token = localStorage.getItem("ponto_token");

  if (!token) {
    router.push("/login");
    return;
  }

  authStore.setToken(token);

  try {
    const { data } = await api.get("/provider/provider-data");
    if (data.name) form.name = data.name;
    if (data.avatar_url) avatarUrl.value = data.avatar_url;
  } catch (error) {
    console.warn("Não foi possível carregar dados do provedor", error);
  }
});

const submitForm = async () => {
  if (!isValid.value) return;

  loading.value = true;
  errorMsg.value = "";

  try {
    const response = await api.post("/provider/google-complete", {
      name: form.name,
      companyName: form.companyName,
      plan: form.plan,
    });

    if (response.data.user) {
      authStore.setSession(authStore.token, response.data.user);
    }

    snackbar.showSnackbar("Ambiente configurado com sucesso!", "success");
    router.push("/dashboard");
  } catch (error) {
    console.error(error);
    errorMsg.value =
      error.response?.data?.error || "Ocorreu um erro ao salvar.";
  } finally {
    loading.value = false;
  }
};
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
}
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
  pointer-events: none;
  animation: float 10s infinite ease-in-out;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: #4f46e5;
  top: -10%;
  left: -10%;
}
.blob-2 {
  width: 300px;
  height: 300px;
  background: #ec4899;
  bottom: -10%;
  right: -5%;
  animation-delay: 2s;
}
.blob-3 {
  width: 250px;
  height: 250px;
  background: #06b6d4;
  top: 40%;
  left: 60%;
  opacity: 0.2;
  animation-delay: 4s;
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 40px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.glass-card {
  background: rgba(20, 20, 30, 0.6) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.btn-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}
.btn-gradient:hover {
  opacity: 0.95;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
  transform: translateY(-2px);
}

.text-gradient-icon {
  background: linear-gradient(to bottom right, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.z-index-1 {
  position: relative;
  z-index: 1;
}
.letter-spacing-1 {
  letter-spacing: 1px;
}
.border-highlight {
  border: 2px solid rgba(99, 102, 241, 0.3);
}
.border-opacity-20 {
  border-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
