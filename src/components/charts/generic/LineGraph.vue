<template>
  <Graph :svg="graph"/>
</template>

<script lang="ts" setup>
import Graph from "../shared/Graph.vue"

import {computed} from "vue";
import lineGraph from "@/services/graphs/generic/lineGraph";
import type {DateValue} from "@/services/core/datatypes";
import type {GraphLayout} from "@/services/core/graphtypes";


const props = defineProps<{
  data: DateValue[],
  graphLayout?: GraphLayout,
}>()

const graph = computed(() =>
    lineGraph(props.data, {graphLayout: props.graphLayout}))

</script>
