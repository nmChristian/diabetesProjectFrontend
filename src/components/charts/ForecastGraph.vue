<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import {computed} from "vue";

import Graph from "./shared/Graph.vue"
import type {GraphLayout} from "@/services/core/graphtypes";
import type {DateValue} from "@/services/core/datatypes";
import forecastGraph from "@/services/graphs/forecastGraph";


const props = defineProps<{
  data : DateValue[],
  graphLayout? : GraphLayout,
}>()

const graph = computed(() =>
    forecastGraph(props.data, { graphLayout : props.graphLayout }))

</script>
