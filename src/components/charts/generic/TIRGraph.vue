<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import Graph from "../shared/Graph.vue"
import {computed} from "vue";
import tirGraph from "@/services/graphs/generic/tirGraph";
import type {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  quantiles : number[],
  graphLayout? : GraphLayout,
}>()

const graph = computed(() =>
    tirGraph(props.quantiles, { graphLayout : props.graphLayout }))
</script>

