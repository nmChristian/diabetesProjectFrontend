<template>
  <div>
    <div style="display: flex">
      <div
          v-for="occurrence in occurences"
      >
        <h3>{{ occurrence[0] }}</h3>
        <t-i-r-graph
            :colors="colors"
            :graph-layout="graphLayout"
            :occurrences="occurrence[1]"
        />
      </div>
      <h3>24</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type {BucketPoint, DateValue} from "@/services/core/datatypes";
import {getCGMOccurrences, SPLIT_BY_DAY, TimeUnit} from "@/services/core/datatypes";
import {computed} from "vue";
import {COLOR_SCHEME, dateToSeconds} from "@/services/core/shared";
import * as d3 from "d3";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {GraphLayout} from "@/services/core/graphtypes";

const hoursPerRange = 1

const colors = COLOR_SCHEME
const graphLayout = new GraphLayout(30, 400, 0, 10, 0, 10)


const props = defineProps<{
  data: DateValue[]
}>()

// Ranges [0, 6, 12, 18], in seconds => [0, 6 * 3600, 12 * 3600, 18 * 3600]
const ranges: number[] = [...Array(24 / hoursPerRange).keys()].map<number>(hour => hour * hoursPerRange * 60 * 60)

// Split data into hour intervals of a day
const bins = computed(() => d3.bin<DateValue, number>()
    .value(([date,]) => dateToSeconds(date) % SPLIT_BY_DAY)
    .thresholds(ranges)(props.data))

const occurences = computed(() =>
    // Convert the bin into date values
    bins.value.map<BucketPoint>((bin: d3.Bin<DateValue, number>) =>
        [(bin.x0 ?? 0) / TimeUnit.Hour, getCGMOccurrences(bin)])
)


</script>