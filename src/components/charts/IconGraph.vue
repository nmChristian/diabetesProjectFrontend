<template>
  <svg ref="svg"></svg>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue";

import applySVG from "@/services/core/applySVG";
import iconGraph from "@/services/graphs/iconGraph";
import type {Point} from "@/services/core/datatypes";
import type {HealthLevel} from "@/services/core/shared";

const props = defineProps<{
  healthLevel : HealthLevel,
  medianData : Point[],
}>()

const svg : Ref<SVGElement | null> = ref(null)
onMounted(() => {
  const chart = iconGraph(props.medianData, props.healthLevel,{})
  applySVG(svg, chart)
})
</script>
