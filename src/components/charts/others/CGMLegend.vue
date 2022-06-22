<!-- Author: Jonas -->
<!-- Description: Component that contains a legend for CGM data, this includes the ranges, and can include the goal and the actual values -->
<template>
  <table class="cgm-legend">
    <tr v-if="targets !== undefined || percentages !== undefined">
      <th>mg/dL</th>
      <th></th>
      <th v-if="percentages !== undefined">result</th>
      <th v-if="targets !== undefined"> targets</th>
    </tr>
    <tr v-for="i in [...COLOR_SCHEME.keys()].reverse()">
      <td class="threshold-legend">
        {{ ranges[i][0].toFixed(0) }} - {{ ranges[i][1]?.toFixed(0) ?? "" }}
      </td>
      <td class="color-legend"><span :style="{backgroundColor: COLOR_SCHEME[i]}" class="circle"></span></td>
      <td v-if="percentages !== undefined" :class="['percentage', getClass(i)]">
        {{ (percentages[i] * 100).toFixed(1) }}%
      </td>
      <td v-if="targets !== undefined" class="target-legend">
        {{ i === CGM_TARGET_INDEX ? ">" : "<" }} {{ targets[i] * 100 }}%
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import {COLOR_SCHEME} from "@/services/graphs/shared";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {CGM_TARGET_INDEX} from "@/services/graphs/auxiliary/cgm";

const props = defineProps<{
  ranges: CGMRanges,
  targets?: number[],
  percentages?: number[]
}>()

function getClass(index: number): string {
  if (props.percentages === undefined || props.targets === undefined)
    return ""
  const below = (props.percentages[index] > props.targets[index])
  return (index === CGM_TARGET_INDEX ? !below : below) ? "fail" : "success"
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.cgm-legend {
  table-layout: fixed;
  border-collapse: collapse;
  display: inline;
}

tr:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 50%);
}

td {
  font-style: italic;
  padding: 0 10px;
}

.threshold-legend {
  font-weight: bold;
  font-size: 0.8em;
  text-align: end;
}

.target-legend {
  font-size: 0.8em;
}

.percentage {
  font-style: normal;
  font-weight: bold;
}

th {
  font-weight: bold;
  font-style: italic;
  font-size: 0.8em;
}

.color-legend {
  padding: 0;
}

.circle {
  display: block;
  background-color: blue;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin: 0;
}

.success {
  border-right: 5px solid green;
}

.fail {
  border-right: 5px solid red;
}


</style>