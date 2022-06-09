<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import Graph from "../shared/Graph.vue"

import {computed} from "vue";
import tirGraph from "@/services/graphs/generic/tirGraph";
import type {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  frequencies : number[],
  colors : string[]
  graphLayout? : GraphLayout,
  offset?: number,
}>()

const graph = computed(() =>
    tirGraph(props.frequencies, props.colors,{ graphLayout : props.graphLayout, offset : props.offset}))

</script>

