<script setup>
import { onMounted, ref, computed } from "vue";
import {
  getTrabajadores,
  getLastRegister,
  getLastsRegisters,
  postStartRegister,
  postFinishRegister,
} from "./services/index.js";
import dayjs from "dayjs";

const trabajadores = ref([]);

let intervalId = null;
const isLoading = ref(false);
const trabajadorSeleccionado = ref(null);
const ultimoRegistro = ref({});
const ultimosRegistros = ref([]);
const duration = ref(0);
const error = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    trabajadores.value = await getTrabajadores();
    error.value = false;
  } catch (err) {
    alert("Hay algún problema con el servidor.");
    error.value = true;
    reiniciarValores()
  } finally {
    isLoading.value = false;
  }
});

// Funcion para iniciar
const reiniciarValores = () => {
  isLoading.value = false;
  trabajadorSeleccionado.value = null;
  ultimoRegistro.value = {};
  ultimosRegistros.value = [];
  duration.value = 0;
}

const reiniciarApp = async () => {
  clearInterval(intervalId);
  reiniciarValores()

  try {
    isLoading.value = true;
    trabajadores.value = await getTrabajadores();
    error.value = false;
  } catch (err) {
    alert("Hay algún problema con el servidor.");
    error.value = true;
    reiniciarValores()
  } finally {
    isLoading.value = false;
  }
};

// Event handlers
const handleTrabajadorChange = async () => {
  try {
    isLoading.value = true;
    ultimoRegistro.value = {};
    ultimosRegistros.value = [];
    clearInterval(intervalId);
    ultimoRegistro.value = await getLastRegister(
      trabajadorSeleccionado.value.id
    );
    ultimosRegistros.value = await getLastsRegisters(
      trabajadorSeleccionado.value.id
    );

    getDuration();
    intervalId = setInterval(getDuration, 1000);
  } catch (err) {
    alert("Hay algún problema con el servidor.");
    error.value = true;
    reiniciarValores()
  } finally {
    isLoading.value = false;
  }
};

const handleStartRegistro = async () => {
  if (!confirm("¿Seguro que quieres iniciar?")) return;
  try {
    isLoading.value = true;
    ultimoRegistro.value = {};
    ultimosRegistros.value = [];
    clearInterval(intervalId);
    await postStartRegister(trabajadorSeleccionado.value.id);
    ultimoRegistro.value = await getLastRegister(
      trabajadorSeleccionado.value.id
    );
    ultimosRegistros.value = await getLastsRegisters(
      trabajadorSeleccionado.value.id
    );

    getDuration();
    intervalId = setInterval(getDuration, 1000);
  } catch (err) {
    alert("Hay algún problema con el servidor.");
    error.value = true;
    reiniciarValores()
  } finally {
    isLoading.value = false;
  }
};

const handleFinishRegistro = async () => {
  if (!confirm("¿Seguro que quieres terminar?")) return;
  try {
    isLoading.value = true;
    ultimoRegistro.value = {};
    ultimosRegistros.value = [];
    clearInterval(intervalId);
    await postFinishRegister(trabajadorSeleccionado.value.id);
    ultimoRegistro.value = await getLastRegister(
      trabajadorSeleccionado.value.id
    );
    ultimosRegistros.value = await getLastsRegisters(
      trabajadorSeleccionado.value.id
    );

    getDuration();
    intervalId = setInterval(getDuration, 1000);
  } catch (err) {
    alert("Hay algún problema con el servidor.");
    error.value = true;
    reiniciarValores()
  } finally {
    isLoading.value = false;
  }
};

// Formatos para filtros de templates
const formatDate = (date) => {
  if (!date) return "";
  const d = dayjs(date);
  return d.format("HH:mm:ss DD-MM-YYYY");
};

const formatDuration = (ms) => {
  const zeroPad = (num, places) => String(num).padStart(places, "0");
  let h, m, s;
  h = Math.floor(ms / 1000 / 60 / 60);
  m = Math.floor((ms / 1000 / 60 / 60 - h) * 60);
  s = Math.floor(((ms / 1000 / 60 / 60 - h) * 60 - m) * 60);

  return `${zeroPad(h, 2)}:${zeroPad(m, 2)}:${zeroPad(s, 2)}`;
};

// Calculo duracion para mostrar en template
const getDuration = () => {
  if (!ultimoRegistro.value.inicio) return (duration.value = 0);

  const i = dayjs(ultimoRegistro.value.inicio);
  if (ultimoRegistro.value.final) {
    const f = dayjs(ultimoRegistro.value.final);
    return (duration.value = f.diff(i));
  } else {
    return (duration.value = dayjs().diff(i));
  }
};

// Ultimos registros computados
const ultimosRegistrosComputados = computed(() => {
  return ultimosRegistros.value.map((registro) => {
    const i = dayjs(registro.inicio).format("HH:mm:ss DD-MM-YY");
    const f = dayjs(registro.final).format("HH:mm:ss DD-MM-YY");

    return {
      duracion: registro.duration,
      inicio: i,
      // final: f,
    };
  });
});
</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <!-- <v-app-bar title="Fichar horas"></v-app-bar> -->
      <v-main class="bg-grey-lighten-4">
        <v-container>
          <v-select
            label="Trabajador"
            variant="solo"
            bg-color="white"
            :loading="isLoading"
            :disabled="isLoading"
            :items="trabajadores"
            :item-title="'nombre'"
            :return-object="true"
            v-model="trabajadorSeleccionado"
            @update:modelValue="handleTrabajadorChange"
          ></v-select>
          <v-card
            v-if="!error"
            :loading="isLoading"
            :disabled="isLoading || !ultimoRegistro.id"
          >
            <v-container>
              <v-row class="d-flex align-center">
                <v-col class="text-h7">Inicio</v-col>
                <v-col cols="8" class="text-h7">
                  <span v-if="!isLoading && ultimoRegistro.inicio">{{
                    formatDate(ultimoRegistro.inicio)
                  }}</span>
                  <span class="font-weight-thin text-disabled" v-if="isLoading"
                    >Cargando...</span
                  >
                  <span
                    class="font-weight-thin text-disabled"
                    v-if="!isLoading && !ultimoRegistro.id"
                    >Selecciona un usuario</span
                  >
                </v-col>
              </v-row>
              <v-row class="d-flex align-center">
                <v-col class="text-h7">Final</v-col>
                <v-col cols="8" class="text-h7">
                  <span v-if="!isLoading && ultimoRegistro.final">{{
                    formatDate(ultimoRegistro.final)
                  }}</span>
                  <span class="font-weight-thin text-disabled" v-if="isLoading"
                    >Cargando...</span
                  >
                  <span
                    class="font-weight-thin text-disabled"
                    v-if="!isLoading && !ultimoRegistro.id"
                    >Selecciona un usuario</span
                  >
                  <span
                    v-if="
                      ultimoRegistro.id && !ultimoRegistro.final && !isLoading
                    "
                  >
                    -
                  </span>
                </v-col>
              </v-row>
              <v-row class="d-flex align-center">
                <v-col class="text-h7">Duración</v-col>
                <v-col cols="8" class="text-h7"
                  ><span v-if="duration"
                    ><strong>{{ formatDuration(getDuration()) }}</strong></span
                  >
                  <span class="font-weight-thin text-disabled" v-if="isLoading"
                    >Cargando...</span
                  >
                  <span
                    class="font-weight-thin text-disabled"
                    v-if="!isLoading && !ultimoRegistro.id"
                    >Selecciona un usuario</span
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <v-btn
            v-if="ultimoRegistro.final"
            :loading="isLoading"
            class="mt-7"
            block
            color="primary"
            size="x-large"
            @click="handleStartRegistro"
            :disabled="isLoading"
            >Iniciar</v-btn
          >
          <v-btn
            v-if="error"
            :loading="isLoading"
            class="mt-7"
            block
            color="primary"
            size="x-large"
            @click="reiniciarApp"
            :disabled="isLoading"
            >Reiniciar</v-btn
          >
          <v-btn
            v-if="ultimoRegistro.inicio && !ultimoRegistro.final"
            :loading="isLoading"
            class="mt-7"
            block
            color="error"
            size="x-large"
            @click="handleFinishRegistro"
            :disabled="isLoading"
            >Finalizar</v-btn
          >
        </v-container>
        <v-container>
          <v-card v-if="!error">
            <v-data-table
              loading-text="Cargando..."
              :loading="isLoading"
              :items="ultimosRegistrosComputados"
              hide-default-footer
              hover
              no-data-text="No hay datos"
              density="compact"
            ></v-data-table>
          </v-card>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style>
html,body,#app {
  margin: 0;
  overflow: hidden;
}
</style>
