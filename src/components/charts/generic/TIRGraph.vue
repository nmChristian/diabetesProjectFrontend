<template>
  <Graph :svg="graph"/>
</template>

<script lang="ts" setup>
import Graph from "../shared/Graph.vue"

import {computed} from "vue";
import tirGraph from "@/services/graphs/generic/tirGraph";
import type {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  occurrences: number[],
  colors: string[]
  graphLayout?: GraphLayout,
  offset?: number,
  r? : number,
  rotate?: boolean,
}>()

const graph = computed(() =>
    tirGraph(props.occurrences, props.colors,
        {
          graphLayout: props.graphLayout,
          offset: props.offset,
          r: props.r,
          rotate: props.rotate,
        })
)
</script>

