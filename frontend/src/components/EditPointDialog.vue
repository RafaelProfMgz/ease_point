<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card class="rounded-xl pa-4">
      <v-card-title class="text-h6 font-weight-bold">
        Editar Registro
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-select
            v-model="editedItem.type"
            label="Tipo de Registro"
            :items="typeOptions"
            item-title="text"
            item-value="value"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-select>

          <v-text-field
            v-model="editedTime"
            label="Horário"
            type="time"
            variant="outlined"
            density="comfortable"
            hint="Altera apenas a hora, mantém a data original"
            persistent-hint
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" color="grey" @click="close">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" :loading="loading" @click="save">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { usePointsStore } from "@/stores/points";

const props = defineProps({
  modelValue: Boolean,
  point: Object,
});

const emit = defineEmits(["update:modelValue", "saved"]);
const pointsStore = usePointsStore();

const loading = ref(false);
const editedItem = ref({});
const editedTime = ref("");

const typeOptions = [
  { text: "Entrada", value: "entrada" },
  { text: "Saída para Almoço", value: "saida_intervalo" },
  { text: "Volta do Almoço", value: "volta_intervalo" },
  { text: "Saída", value: "saida" },
];

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

watch(
  () => props.point,
  (newPoint) => {
    if (newPoint) {
      editedItem.value = { ...newPoint };

      if (newPoint.created_at) {
        const date = new Date(newPoint.created_at);
        editedTime.value = date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }
  },
  { immediate: true }
);

const close = () => {
  dialog.value = false;
};

const save = async () => {
  loading.value = true;
  try {
    const originalDate = new Date(props.point.created_at);
    const [hours, minutes] = editedTime.value.split(":");

    originalDate.setHours(parseInt(hours), parseInt(minutes));

    const payload = {
      type: editedItem.value.type,
      created_at: originalDate.toISOString(),
    };

    await pointsStore.updatePoint(props.point.id, payload);

    emit("saved");
    close();
  } catch (error) {
    console.error("Erro ao salvar", error);
  } finally {
    loading.value = false;
  }
};
</script>
