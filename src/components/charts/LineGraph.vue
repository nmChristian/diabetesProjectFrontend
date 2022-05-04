<template>
  <svg ref="svg"></svg>
</template>


<script setup lang="ts">
import {onMounted, ref, Ref} from "vue";

import {GraphDrawer} from "@/services/graphs/graphs"
import type {DataPoint, SortedData} from "@/services/graphs/graphs";

const drawer = new GraphDrawer();
const props = defineProps<{
  data : SortedData,
}>()

const svg : Ref<SVGElement | null> = ref(null)
onMounted(() => {
  const chart = drawer.lineChart(props.data, {})
  drawer.applySVG(svg, chart)
})
</script>
