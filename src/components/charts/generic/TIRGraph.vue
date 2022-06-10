<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import Graph from "../shared/Graph.vue"

import {computed} from "vue";
import tirGraph from "@/services/graphs/generic/tirGraph";
import type {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  occurrences : number[],
  colors : string[]
  graphLayout? : GraphLayout,
  offset?: number,
}>()

const graph = computed(() =>
    //@ts-ignore
    tirGraph(props.occurrences, props.colors,{ graphLayout : props.graphLayout, offset : props.offset})
)

</script>

