<!-- Author: Jonas -->
<!-- Description: Component that contains a TIR graph for each selectable amount of hours (ex. every 2 hours, so 12 graphs).
                  It also shows each sections average of its CGM and its GV (probably not that useful) -->
<template>
  <DateIntervalSelector
      :text="d3.timeFormat('%d/%m')(data[0]?.[0] ?? 0) + ' - ' + d3.timeFormat('%d/%m')(data[data.length - 1]?.[0] ?? 0) "/>
  <div class="tir-daily-series">
    <div v-if="showAdvanced" style="display: grid; place-items: center;">
      <p>Split by</p>
      <select v-model="hoursPerRange"
              style="font-size: 16px; text-align: center; width: 300px; height: 35px; border-radius: 20px;">
        <option
            v-for="intervalOption in [2,3,4,6,8,12,24]"
            :value="intervalOption"> {{ intervalOption }} hour{{ intervalOption === 1 ? "" : "s" }}
        </option>
      </select>
      <br>
    </div>
    <div class="tir-graphs">
      <div v-for="(hour, i) in hours">
        <p>{{ hour }} - {{ hours[i + 1] ?? 24 }}</p>
        <Graph class="tir-graph" :svg="tirGraph(occurrences[i], colors, {})"/>
        <p v-if="showAdvanced" :style="{borderBottom: '6px solid', borderColor: getCGMColor(averages[i], cgmRanges) }">
          {{ averages[i].toFixed(2) }}</p>
        <p v-if="showAdvanced" :style="{marginTop: '10px'}">{{ (deviations[i] * 100 / averages[i]).toFixed(0) }} %</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {computed, ref} from "vue";
import {COLOR_SCHEME, dateToSeconds, SPLIT_BY_DAY} from "@/services/graphs/shared";
import * as d3 from "d3";
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import DateIntervalSelector from "@/components/DateIntervalSelector.vue";
import tirGraph from "@/services/graphs/generic/tir-graph";
import Graph from "@/components/charts/Graph.vue";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {getCGMColor, getCGMOccurrences} from "@/services/graphs/auxiliary/cgm";

const hoursPerRange = ref(2)

const colors = COLOR_SCHEME
// Make width smaller if only 1 hour, so it can fit
const graphLayout = computed(() => new GraphLayout(hoursPerRange.value === 1 ? 40 : 60, 400))


const props = defineProps<{
  data: DateValue[],
  showAdvanced: boolean,
  cgmRanges: CGMRanges,
}>()

// Ranges [0, 6, 12, 18],
const hours = computed(() => [...Array(24 / hoursPerRange.value).keys()].map<number>(hour => hour * hoursPerRange.value))
// in seconds => [0, 6 * 3600, 12 * 3600, 18 * 3600]
const ranges = computed(() => hours.value.map<number>(hour => hour * 60 * 60))


// Split data into hour intervals of a day
const splitDateValues = computed(() => d3.bin<DateValue, number>()
    .value(([date,]) => dateToSeconds(date) % SPLIT_BY_DAY)
    .thresholds(ranges.value)(props.data) as DateValue[][]
)

// Convert the bin into date values
const occurrences = computed(() => splitDateValues.value.map<number[]>(val => getCGMOccurrences(val, props.cgmRanges)))

const averages = computed(() => splitDateValues.value.map<number>(dateValues => d3.mean(dateValues, ([, value]) => value) ?? NaN))
const deviations = computed(() => splitDateValues.value.map<number>(dateValues => d3.deviation(dateValues, ([, value]) => value) ?? NaN))


</script>

<style scoped>
.tir-daily-series {
  text-align: center;
}

.tir-graphs {
  display: flex;
  gap: 15px;
  justify-content: center;
  max-width: 80%;
  margin: auto;
}

.tir-graphs > div {
  max-width: 75px;
  flex: 1 1 0;
}

.tir-graph {
  margin: 10px 0 15px 0;
}

.tir-graphs p {
  border: 2px solid #e0e0e0;
  border-radius: 5px;
}
</style>