<template>
  <v-container fluid class="fill-height landing-bg">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <v-row justify="center" align="center" class="z-index-1 w-100">
      <v-col cols="12" sm="8" md="5" lg="4">
        
        <v-card class="pa-8 glass-card" elevation="0" rounded="xl">
          <div class="text-center mb-8">
            <v-avatar color="rgba(255,255,255,0.1)" size="80" class="mb-4 border-highlight">
              <v-icon icon="mdi-lock-reset" size="40" class="text-gradient-icon"></v-icon>
            </v-avatar>
            
            <h2 class="text-h4 font-weight-bold text-white mb-2">
              Recuperar Senha
            </h2>
            <p class="text-body-1 text-grey-lighten-1">
              Digite seu e-mail para receber o link de redefinição.
            </p>
          </div>

          <v-form ref="formRef" @submit.prevent="handleForgot" v-model="valid">
            <v-text-field
              v-model="email"
              label="E-mail cadastrado"
              placeholder="exemplo@empresa.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              bg-color="rgba(0,0,0,0.2)"
              color="primary-lighten-1"
              base-color="grey-lighten-2"
              rounded="lg"
              :rules="[rules.required, rules.email]"
              class="mb-6 text-white"
            ></v-text-field>

            <v-btn
              block
              size="x-large"
              type="submit"
              :loading="loading"
              class="text-none font-weight-bold btn-gradient text-white mb-4"
              rounded="xl"
              elevation="10"
            >
              Enviar Link
            </v-btn>

            <v-btn
              block
              variant="text"
              to="/login"
              class="text-grey-lighten-2 text-none"
              prepend-icon="mdi-arrow-left"
            >
              Voltar para o Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useSnackbarStore } from "@/stores/snackbar";

const auth = useAuthStore();

const formRef = ref(null);
const email = ref("");
const loading = ref(false);
const valid = ref(false);

const rules = {
  required: (v) => !!v || "Campo obrigatório",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
};

const handleForgot = async () => {
  const { valid: formValid } = await formRef.value.validate();
  if (!formValid) return;

  loading.value = true;
  try {
    await auth.forgotPassword(email.value);
    email.value = "";
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.landing-bg {
  background-color: #0f172a;
  background-image: radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
                    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
                    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
  position: relative;
  overflow: hidden;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.text-gradient-icon {
  background: linear-gradient(to right, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: #a855f7 !important; 
}

.border-highlight {
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.btn-gradient {
  background: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
  transition: opacity 0.3s ease;
}
.btn-gradient:hover {
  opacity: 0.9;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}
.blob-1 { width: 400px; height: 400px; background: #4f46e5; top: -100px; left: -100px; }
.blob-2 { width: 300px; height: 300px; background: #ec4899; bottom: -50px; right: -50px; }

.z-index-1 { position: relative; z-index: 1; }
</style>