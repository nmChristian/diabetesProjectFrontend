<template>
  <svg ref="svg"></svg>
</template>


<script setup lang="ts">
import {onMounted, ref, Ref} from "vue";

import {GraphDrawer} from "@/services/graphs/oldgraphs"
import type {DataPoint, QuantileStack} from "@/services/graphs/oldgraphs";

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
