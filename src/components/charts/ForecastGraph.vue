<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import {computed} from "vue";

import Graph from "./shared/Graph.vue"
import type {GraphLayout} from "@/services/core/graphtypes";
import lineGraph from "@/services/graphs/generic/lineGraph";
import type {DateValue} from "@/services/core/datatypes";


const props = defineProps<{
  data : DateValue[],
  graphLayout? : GraphLayout,
}>()

const graph = computed(() =>
    lineGraph(props.data, { graphLayout : props.graphLayout }))

</script>
