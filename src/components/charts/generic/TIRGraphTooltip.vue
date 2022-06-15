<template>
  <Graph :svg="graph"/>
</template>

<script lang="ts" setup>
import Graph from "../shared/Graph.vue"

import {computed} from "vue";
import tirGraphWithTooltip from "@/services/graphs/generic/tirGraphWithTooltip";
import type {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  occurrences: number[],
  colors: string[]
  graphLayout?: GraphLayout,
  offset?: number,
  rx? : number,
  ry? : number
}>()

const graph = computed(() =>
    tirGraphWithTooltip(props.occurrences, props.colors, {graphLayout: props.graphLayout, offset: props.offset, rx: props.rx, ry: props.ry})
)

</script>

