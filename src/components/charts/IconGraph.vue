<template>
  <Graph :svg="graph"/>
</template>

<script lang="ts" setup>
import {computed} from "vue";

import Graph from "./shared/Graph.vue"
import iconGraph from "@/services/graphs/iconGraph";
import type {Point} from "@/services/core/datatypes";
import type {HealthLevel} from "@/services/core/shared";
import type {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  medianDataInHours: Point[],
  healthLevel: HealthLevel,
  graphLayout?: GraphLayout,
}>()

const graph = computed(() =>
    iconGraph(props.medianDataInHours, props.healthLevel, {graphLayout: props.graphLayout}))

</script>
