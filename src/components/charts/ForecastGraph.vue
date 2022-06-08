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


const props = defineProps<{
  data : DateValue[],
  graphLayout? : GraphLayout,
}>()

const graph = computed(() =>
    forecastGraph(props.data, d3.timeMonday, { graphLayout : props.graphLayout }))

</script>
