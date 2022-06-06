<template>
  <div>
    <h1>Icon graphs</h1>
    <icon-graph
        :median-data-in-hours="medianDataInHours"
        :health-level="HealthLevel.Good"
    />

    <icon-graph
        :median-data-in-hours="medianDataInHours"
        :health-level="HealthLevel.High"
    />
    <icon-graph
        :median-data-in-hours="medianDataInHours"
        :health-level="HealthLevel.Low"
    />
    <icon-graph
        :median-data-in-hours="medianDataInHours"
        :health-level="HealthLevel.VeryHigh"
    />
  </div>
</template>

<script setup lang="ts">

import IconGraph from "@/components/charts/IconGraph.vue"
import {HealthLevel} from "@/services/core/shared";
import type {Point} from "@/services/core/datatypes";

const props = defineProps<{
  medianDataInHours : Point[]
}>()

</script>

<style scoped>

</style>