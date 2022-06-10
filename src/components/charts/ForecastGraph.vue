<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {TimeInterval} from "d3";

import Graph from "./shared/Graph.vue"
import type {GraphLayout} from "@/services/core/graphtypes";
import type {DateValue} from "@/services/core/datatypes";
import forecastGraph from "@/services/graphs/forecastGraph";


const props = defineProps<{
  data : DateValue[],
  timeInterval : TimeInterval,
  graphLayout? : GraphLayout,
  onBrushEnd? : any,
}>()

const graph = computed(() =>
    forecastGraph(props.data, props.timeInterval, { graphLayout : props.graphLayout, onBrushEnd : props.onBrushEnd }))

</script>
