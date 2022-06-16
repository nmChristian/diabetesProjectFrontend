<template>
  <Graph :class="rotate ? 'rotate' : '' " :style="rotate ? rotatedStyle : ''" :svg="graph"/>
</template>

<script lang="ts" setup>
import Graph from "../shared/Graph.vue"

import {computed, watchEffect} from "vue";
import tirGraph from "@/services/graphs/generic/tirGraph";
import type {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  occurrences: number[],
  colors: string[]
  graphLayout?: GraphLayout,
  offset?: number,
  rx?: number,
  ry?: number,
  rotate?: boolean,
}>()
const graph = computed(() =>
    tirGraph(props.occurrences, props.colors,
        {
          graphLayout: props.graphLayout,
          offset: props.offset,
          rx: props.rx,
          ry: props.ry,
        })
)
const rotatedStyle = computed(() => ({width: graph.value.attr("height") + "px", height: graph.value.attr("width") + "px"}))

</script>

<style scoped>
.rotate {
  transform: translate(100%) rotate(90deg);
  transform-origin: top left;
}
</style>