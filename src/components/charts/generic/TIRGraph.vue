<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import Graph from "../shared/Graph.vue"
import {computed} from "vue";
import tirGraph from "@/services/graphs/generic/tirGraph";
import type {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  sizes : number[],
  colors : string[]
  graphLayout? : GraphLayout,
}>()

const graph = computed(() =>
    tirGraph(props.sizes, props.colors,{ graphLayout : props.graphLayout }))
</script>

