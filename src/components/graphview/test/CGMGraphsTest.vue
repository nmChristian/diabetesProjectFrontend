<template>
  <div>
    <h1>Working line graph over the span of days</h1>
    <forecast-graph
        :data="data"
        :graph-layout="graphLayout"
    />
  </div>
</template>

<script setup lang="ts">
import type {DateValue, Point} from "@/services/core/datatypes";
import {GraphLayout} from "@/services/core/graphtypes";
import ForecastGraph from "@/components/charts/ForecastGraph.vue";

const props = defineProps<{
  data: DateValue[],
  medianDataInHours: Point[]}>
()

const graphLayout = new GraphLayout(400,100, 30, 40, 40, 40)

</script>
