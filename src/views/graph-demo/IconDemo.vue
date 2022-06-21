<template>
  <div>
    <h1>Icon graphs</h1>
    <Graph v-for="healthLevel in healthLevels"
           :svg="iconGraph(medianCGMInHours, healthLevel, {})"/>
  </div>
</template>

<script lang="ts" setup>
import {HealthLevel} from "@/services/core/shared";
import type {Point} from "@/services/core/datatypes";
import Graph from "@/components/charts/shared/Graph.vue";
import iconGraph from "@/services/graphs/icon-graph";

const healthLevels : HealthLevel[] = [HealthLevel.Good, HealthLevel.High, HealthLevel.VeryHigh, HealthLevel.Low, HealthLevel.VeryLow]
const props = defineProps<{
  medianCGMInHours: Point[]
}>()


</script>
