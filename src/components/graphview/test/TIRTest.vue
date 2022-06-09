<template>
  <div>
    <h1>Here is a TIR graph</h1>
    <t-i-r-graph
        :sizes="dateSplitIntoCGMThresholds"
        :colors="COLOR_SCHEME"
    />
  </div>
</template>

<script setup lang="ts">

import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {computed} from "vue";
import type {DateValue} from "@/services/core/datatypes";
import {CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";
import * as d3 from "d3";

const props = defineProps<{
  data: DateValue[],
}> ()

const dateSplitIntoCGMThresholds = computed( () => {
  const occurrences : number[] = Array(CGM_THRESHOLDS.length).fill(0)

  // Place each point based on the x0 value
  const bisect = d3.bisector<{x0 : number}, number>(d => d.x0)

  // Its weight is half the time between each neighbor date
  // For example, if a point is good and the next data is in the bad area in 1 hour, followed by good after 30 mins, then the data will be (30 mins of good, (30 + 15) mins of bad, 15 mins of good)
  props.data.map<number>(([date,value], i, data) => occurrences[bisect.right(CGM_THRESHOLDS, value) - 1] += (d3.timeSecond.count(data[i - 1]?.[0] ?? date, data[i + 1]?.[0] ?? date) / 2))
  const sum = d3.sum(occurrences)

  // HAHA, Ok so this will convert NaN to 0, since NaN is false
  // Damn i love js <3
  return occurrences.map<number>(v => v / sum || 0)
})

</script>
