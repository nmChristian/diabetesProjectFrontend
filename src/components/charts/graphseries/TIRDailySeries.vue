<template>
  <div class="tir-daily-series">
    <div style="display: grid; place-items: center;">
      <p>Split by</p>
      <select v-model="hoursPerRange"
              style="font-size: 16px; text-align: center; width: 300px; height: 35px; border-radius: 20px;">
        <option
            v-for="intervalOption in [1,2,3,4,6,8,12,24]"
            :value="intervalOption"> {{ intervalOption }} hour{{intervalOption === 1 ? "" : "s"}}
        </option>
      </select>
    </div>

    <br>
    <div class="tir-graphs">
      <div v-for="(hour, i) in hours">
        <p>{{ hour }} - {{ hours[i + 1] ?? 24 }}</p>
        <t-i-r-graph
            :colors="colors"
            :graph-layout="graphLayout"
            :occurrences="occurrences[i]"
        />
        <p :style="{borderBottom: '7px solid', borderColor: getCGMColor(averages[i]) }">{{ averages[i].toFixed(2) }}</p>
        <p :style="{borderBottom: '3px solid', borderColor: getCGMDeviationColor(deviations[i]), marginTop: '10px' }">{{ deviations[i].toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type {DateValue} from "@/services/core/datatypes";
import {getCGMColor, getCGMDeviationColor, getCGMOccurrences, SPLIT_BY_DAY} from "@/services/core/datatypes";
import {computed, ref} from "vue";
import {COLOR_SCHEME, dateToSeconds} from "@/services/core/shared";
import * as d3 from "d3";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {GraphLayout} from "@/services/core/graphtypes";

const hoursPerRange = ref(2)

const colors = COLOR_SCHEME
// Make width smaller if only 1 hour, so it can fit
const graphLayout = computed ( () => new GraphLayout(hoursPerRange.value === 1 ? 40 : 50, 400, 10,0,20))


const props = defineProps<{
  data: DateValue[]
}>()

// Ranges [0, 6, 12, 18],
const hours = computed (() => [...Array(24 / hoursPerRange.value).keys()].map<number>(hour => hour * hoursPerRange.value))
// in seconds => [0, 6 * 3600, 12 * 3600, 18 * 3600]
const ranges = computed ( () => hours.value.map<number>(hour => hour * 60 * 60))


// Split data into hour intervals of a day
const splitDateValues = computed(() => d3.bin<DateValue, number>()
    .value(([date,]) => dateToSeconds(date) % SPLIT_BY_DAY)
    .thresholds(ranges.value)(props.data) as DateValue[][]
)

// Convert the bin into date values
const occurrences = computed(() => splitDateValues.value.map<number[]>(getCGMOccurrences))

const averages = computed(() => splitDateValues.value.map<number>(dateValues => d3.mean(dateValues, ([, value]) => value) ?? NaN))
const deviations = computed(() => splitDateValues.value.map<number>(dateValues => d3.deviation(dateValues, ([, value]) => value) ?? NaN))


</script>

<style scoped>
.tir-daily-series {
  background-color: #c0c0c0;
  padding: 10px 0 30px 0;

}
.tir-graphs {
  display: flex;
  justify-content: center;
  gap: 15px;
  text-align: center;
}
.tir-graphs p {
  background-color: white;
  border-radius: 5px;
}
</style>