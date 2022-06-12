<template>
  <div>
    <h1> Testing whether it is possible to do 24 hours with dates</h1>
    <line-graph
        :data="cgm"
    />
    <h1>Here is two graphs used for comparing functionality</h1>
    <p>Dynamic domain</p>
    <line-graph-daily
        :data="medianCGMInHours"
    />
    <p>Fixed domain [0,24]</p>
    <line-graph-daily
        :data="medianCGMInHours"
        :x-domain="[0, 24]"
    />
    <h1>Working line graph over the span of days</h1>
    <line-graph
        :data="cgm"
    />
  </div>
</template>

<script setup lang="ts">
import LineGraph from "@/components/charts/generic/LineGraph.vue"
import LineGraphDaily from "@/components/charts/generic/LineGraphDaily.vue";
import type {DateValue, Point} from "@/services/core/datatypes";

const props = defineProps<{
  cgm: DateValue[],
  medianCGMInHours: Point[]}>
()

</script>