<template>
  <svg ref="svg"></svg>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref} from "vue";

import {GraphDrawer} from "@/services/graphs/oldgraphs"
import type {DataPoint} from "@/services/graphs/oldgraphs";

const drawer = new GraphDrawer();
const props = defineProps<{
  status : number,
  medianData : DataPoint[],
}>()

const svg : Ref<SVGElement | null> = ref(null)
onMounted(() => {
  const chart = drawer.iconChart(props.medianData, drawer.colorScheme[props.status + 2], {})
  drawer.applySVG(svg, chart)
})
</script>
