<template>
  <div>
    <div style="display: flex; text-align: center;">
      <div
          v-for="(hour, i) in hours"
      >
        <p>{{ hour }} - {{ hours[i + 1] ?? 24 }}</p>
        <t-i-r-graph
            :colors="colors"
            :graph-layout="graphLayout"
            :occurrences="occurences[i]"
        />
        <p>{{ averages[i].toFixed(2) }}</p>
        <p>{{ deviations[i].toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type {DateValue} from "@/services/core/datatypes";
import {getCGMOccurrences, SPLIT_BY_DAY} from "@/services/core/datatypes";
import {computed} from "vue";
import {COLOR_SCHEME, dateToSeconds} from "@/services/core/shared";
import * as d3 from "d3";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {GraphLayout} from "@/services/core/graphtypes";

const hoursPerRange = 2

const colors = COLOR_SCHEME
const graphLayout = new GraphLayout(50, 400, 0, 10, 0, 10)


const props = defineProps<{
  data: DateValue[]
}>()

// Ranges [0, 6, 12, 18],
const hours: number[] = [...Array(24 / hoursPerRange).keys()].map(hour => hour * hoursPerRange)
// in seconds => [0, 6 * 3600, 12 * 3600, 18 * 3600]
const ranges: number[] = hours.map<number>(hour => hour * 60 * 60)

// Split data into hour intervals of a day
const splitDateValues = computed(() => d3.bin<DateValue, number>()
    .value(([date,]) => dateToSeconds(date) % SPLIT_BY_DAY)
    .thresholds(ranges)(props.data) as DateValue[][]
)

// Convert the bin into date values
const occurences = computed(() => splitDateValues.value.map<number[]>(getCGMOccurrences))

const averages = computed(() => splitDateValues.value.map<number>(dateValues => d3.mean(dateValues, ([, value]) => value) ?? NaN))
const deviations = computed(() => splitDateValues.value.map<number>(dateValues => d3.deviation(dateValues, ([, value]) => value) ?? NaN))


</script>