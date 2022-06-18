<template>
  <table class="cgm-legend">
    <tr v-if="goals !== undefined">
      <th>mg/dL</th>
      <th></th>
      <th>goal</th>
    </tr>
    <tr v-for="i in [...COLOR_SCHEME.keys()].reverse()">
      <td class="color-legend" >
        {{ CGM_THRESHOLDS[i].x0 + "-" + (CGM_THRESHOLDS[i].x1 ?? "") }}
      </td>
      <td class="splitter" :style="{backgroundColor: COLOR_SCHEME[i]}"></td>
      <td v-if="goals !== undefined" class="goal-legend">
        {{i === 2 ? ">" : "<"}} {{goals[i]}}%
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import {CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";
import {computed, onMounted} from "vue";
const props = defineProps<{
  thresholds? : number[],
  goals?: number[],
}>()
const goalsCorrected = computed(() => [...props.goals ?? []].reverse())

const fisk = onMounted( () => console.log())
</script>

<style scoped>
.cgm-legend {
  table-layout: fixed;
  border-collapse:collapse;
  display: inline;
}
tr {
  padding: 0 5px;
  height: 30px;
  margin: 5px 0;
  border-radius: 5px;
}
tr:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 50%);
}

.color-legend {
  font-weight: bold;
  font-style: italic;
  font-size: 16px;
  text-align: end;
  padding: 0 10px;
}

.goal-legend {
  padding: 0 10px;
  font-style: italic;
}

th {
  font-weight: bold;
  font-style: italic;
  font-size: 12px;
}

.splitter {
  width: 10px;
}
</style>