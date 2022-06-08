<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import {computed} from "vue";
import * as d3 from "d3"

import Graph from "./shared/Graph.vue"
import type {GraphLayout} from "@/services/core/graphtypes";
import type {DateValue} from "@/services/core/datatypes";
import forecastGraph from "@/services/graphs/forecastGraph";
import type {TimeInterval} from "d3";


const props = defineProps<{
  data : DateValue[],
  timeInterval : TimeInterval,
  graphLayout? : GraphLayout,
}>()

const graph = computed(() =>
    forecastGraph(props.data, props.timeInterval, { graphLayout : props.graphLayout }))

</script>
