<template>
  <table class="cgm-legend">
    <tr v-if="targets !== undefined || percentages !== undefined">
        <th>mg/dL</th>
      <th></th>
      <th v-if="targets !== undefined"> targets</th>
      <th v-if="percentages !== undefined">result</th>

    </tr>
    <tr v-for="i in [...COLOR_SCHEME.keys()].reverse()">
      <td class="threshold-legend">
        {{ranges[i][0].toFixed(0)}} - {{ranges[i][1]?.toFixed(0) ?? ""}}
      </td>
      <td class="color-legend" :style="{backgroundColor: COLOR_SCHEME[i]}"></td>
      <td v-if="targets !== undefined" class="target-legend">
        {{ i === CGM_TARGET_INDEX ? ">" : "<" }} {{ targets[i] * 100 }}%
      </td>
      <td v-if="percentages !== undefined" :class="['percentage', getClass(i)]">
        {{(percentages[i] * 100).toFixed(0)}}%
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import {COLOR_SCHEME, CGM_TARGET_INDEX} from "@/services/core/shared";
const props = defineProps<{
  ranges: [number, number?][],
  targets?: number[],
  percentages? : number[]
}>()
function getClass (index : number) : string {
  if (props.percentages === undefined || props.targets === undefined)
    return ""
  const below = (props.percentages[index] > props.targets[index])
  return (index === CGM_TARGET_INDEX ? !below : below) ? "fail" : "success"
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
.threshold-legend {
  font-weight: bold;
  font-size: 14px;
  text-align: end;
}
.target-legend {
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

.color-legend {
  width: 10px;
}

.success {
  text-decoration: 2px underline green;
}

.fail {
  text-decoration: 2px underline red;
}



</style>