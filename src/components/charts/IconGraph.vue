<template>
  <svg ref="svg"></svg>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref} from "vue";

import {GraphDrawer} from "@/services/graphs/graphs"
import type {DataPoint} from "@/services/graphs/graphs";

const drawer = new GraphDrawer();
const props = defineProps<{
  medianData : DataPoint[],
}>()

const svg : Ref<SVGElement | null> = ref(null)
onMounted(() => {
  const chart = drawer.iconChart(props.medianData, drawer.colorScheme[2], {})
  drawer.applySVG(svg, chart)
})
</script>
