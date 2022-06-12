<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import Graph from "../shared/Graph.vue"

import {computed} from "vue";
import lineGraphCGM from "@/services/graphs/generic/lineGraphCGM";
import type {DateValue} from "@/services/core/datatypes";
import type {GraphLayout} from "@/services/core/graphtypes";


const props = defineProps<{
  data : DateValue[],
  graphLayout? : GraphLayout,
}>()

const graph = computed(() =>
    lineGraphCGM(props.data, { graphLayout : props.graphLayout }))

</script>
