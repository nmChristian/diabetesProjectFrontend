<template>
  <div ref="div"></div>
</template>


<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue"

import {GraphDrawer} from "@/services/graphs/oldgraphs"
import type {DataPoint, QuantileStack} from "@/services/graphs/oldgraphs";
import applySVG from "@/services/core/applySVG";

const div : Ref<HTMLDivElement | null> = ref(null)

const drawer = new GraphDrawer();
const props = defineProps<{
  quantileStack : QuantileStack,
  medianDataInHours : DataPoint[],
}>()

onMounted(() => {
  const chart = drawer.quantileChart(props.quantileStack, props.medianDataInHours, {})
  applySVG(div, chart)
})
</script>
