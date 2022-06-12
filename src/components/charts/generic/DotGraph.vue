<template>
  <Graph :svg="graph"/>
</template>

<script lang="ts" setup>
import Graph from "../shared/Graph.vue"

import {computed} from "vue";
import type {DateValue} from "@/services/core/datatypes";
import type {GraphLayout} from "@/services/core/graphtypes";
import dotGraph from "@/services/graphs/generic/dotGraph";


const props = defineProps<{
  data: DateValue[],
  graphLayout?: GraphLayout,
}>()

const graph = computed(() =>
    dotGraph(props.data, {graphLayout: props.graphLayout}))

</script>
