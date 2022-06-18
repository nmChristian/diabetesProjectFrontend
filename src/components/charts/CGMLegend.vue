<template>
  <table class="cgm-legend">
    <tr v-if="goals !== undefined">
      <th>mg/dL</th>
      <th></th>
      <th>goal</th>
      <th v-if="percentages !== undefined">result</th>

    </tr>
    <tr v-for="i in [...COLOR_SCHEME.keys()].reverse()">
      <td class="color-legend" >
        {{ CGM_THRESHOLDS[i].x0 + "-" + (CGM_THRESHOLDS[i].x1 ?? "") }}
      </td>
      <td class="splitter" :style="{backgroundColor: COLOR_SCHEME[i]}"></td>
      <td v-if="goals !== undefined" class="goal-legend">
        {{i === 2 ? ">" : "<"}} {{goals[i] * 100}}%
      </td>
      <td v-if="percentages !== undefined" :class="['percentage', getClass(i)]">
        {{percentages[i] * 100}}%
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
  percentages? : number[]
}>()

function getClass (index : number) : string {
  if (props.percentages === undefined || props.goals === undefined)
    return ""
  const below = (props.percentages[index] > props.goals[index])
  return (index == 2 ? !below : below) ? "fail" : "success"
}
</script>

<style scoped>
* {  box-sizing: border-box; }
.cgm-legend {
  table-layout: fixed;
  border-collapse:collapse;
  display: inline;
}

tr:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 50%);
  border-radius: 5px;
}

td {
  font-style: italic;
  padding: 0 10px;
}
.color-legend {
  font-weight: bold;
  font-size: 14px;
  text-align: end;
}
.goal-legend {
  font-size: 12px;
}
.percentage {
  font-style: normal;
  font-weight: bold;
}

th {
  font-weight: bold;
  font-style: italic;
  font-size: 12px;
}

.splitter {
  width: 10px;
}

.success {
  text-decoration: 2px underline green;
}

.fail {
  text-decoration: 2px underline red;
}



</style>