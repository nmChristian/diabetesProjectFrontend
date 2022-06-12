<template>
  <div>
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
    <div style="display: flex; text-align: center;">
      <div
          v-for="(hour, i) in hours"
      >
        <p>{{ hour }} - {{ hours[i + 1] ?? 24 }}</p>
        <t-i-r-graph
            :colors="colors"
            :graph-layout="graphLayout"
            :occurrences="occurrences[i]"
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
import {computed, ref} from "vue";
import {COLOR_SCHEME, dateToSeconds} from "@/services/core/shared";
import * as d3 from "d3";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {GraphLayout} from "@/services/core/graphtypes";

const hoursPerRange = ref(2)

const colors = COLOR_SCHEME
// Make width smaller if only 1 hour, so it can fit
const graphLayout = computed ( () => new GraphLayout(hoursPerRange.value === 1 ? 40 : 50, 400, 0, 10, 0, 10))


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