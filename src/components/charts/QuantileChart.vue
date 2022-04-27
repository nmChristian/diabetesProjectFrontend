<template>
  <h1>Here is the quantile  graph</h1>
  <svg ref="svg"></svg>
</template>


<script setup lang="ts">
import {onMounted, ref, Ref} from "vue";

import {GraphDrawer} from "@/services/graphs/graphs"
import type {DataPoint, QuantileStack} from "@/services/graphs/graphs";

const drawer = new GraphDrawer();
const props = defineProps<{
  quantileStack : QuantileStack,
  medianData : DataPoint[],
}>()

const svg : Ref<SVGElement | null> = ref(null)
onMounted(() => {
  const chart = drawer.quantileChart(props.quantileStack, props.medianData, {})
  drawer.applySVG(svg, chart)
})
</script>
