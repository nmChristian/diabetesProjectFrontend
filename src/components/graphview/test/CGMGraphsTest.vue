<template>
  <div>
    <h1>Working line graph over the span of days</h1>
    <line-graph
        :data="data"
    />
  </div>
</template>

<script setup lang="ts">
import LineGraph from "@/components/charts/LineGraph.vue"
import type {DateValue, Point} from "@/services/core/datatypes";

const props = defineProps<{
  data: DateValue[],
  medianDataInHours: Point[]}>
()

</script>
