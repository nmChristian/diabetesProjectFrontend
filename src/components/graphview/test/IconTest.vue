<template>
  <div>
    <h1>Icon graphs</h1>
    <IconGraph
        :health-level="HealthLevel.Good"
        :median-data-in-hours="medianCGMInHours"
    />

    <IconGraph
        :health-level="HealthLevel.High"
        :median-data-in-hours="medianCGMInHours"
    />
    <IconGraph
        :health-level="HealthLevel.VeryHigh"
        :median-data-in-hours="medianCGMInHours"
    />
    <IconGraph
        :health-level="HealthLevel.Low"
        :median-data-in-hours="medianCGMInHours"
    />
    <IconGraph
        :health-level="HealthLevel.VeryLow"
        :median-data-in-hours="medianCGMInHours"
    />


  </div>
</template>

<script lang="ts" setup>

import IconGraph from "@/components/charts/IconGraph.vue"
import {HealthLevel} from "@/services/core/shared";
import type {Point} from "@/services/core/datatypes";

const props = defineProps<{
  medianCGMInHours: Point[]
}>()


</script>
