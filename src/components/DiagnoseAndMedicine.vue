<template>
  <div class="diagnoseAndMedicine">
    <p class="diagnoseAndMedicinLabels">Diagnoses</p>
    <p class="diagnoseAndMedicinLabels">Medicine</p>

    <template v-if="data && data.length !==0" v-for="diag in data">
      <p class="diagnoseAndMedicinItems">{{ diag.name }}</p>

      <p class="diagnoseAndMedicinItems">{{ listToString(diag.medicine) }}</p>
    </template>
    <p v-else>No diagnoses registered for this patient</p>

  </div>

</template>

<script setup lang="ts">

import type {Diagnosis} from "@/services/core/dbtypes";
import {computed} from "vue";

const props = defineProps<{
  data: Diagnosis[],
  isDoctor: boolean,
  id: string,
  showAdvanced: boolean
}>()

function listToString(inListe: string | any[] | undefined) {
  let re = ""
  if (inListe === undefined) {
    return ""
  }
  for (let i = 0; i < inListe.length; i++) {
    re += String(inListe[i])
    if (i < inListe.length - 1) {
      re += ", "
    }
  }
  return re;
}

</script>

<style scoped>
.diagnoseAndMedicine {
  width: 100%;
  margin: 10px;
  display: grid;
  grid-template-columns: auto auto;
}
.diagnoseAndMedicine {
  display: grid;
  grid-template-columns: auto auto;
}

.diagnoseAndMedicinLabels {
  font-size: 30px;
  text-decoration: underline rgba(128, 128, 128, 0.62);
}

.diagnoseAndMedicinItems {
  font-size: 15px;

}

</style>