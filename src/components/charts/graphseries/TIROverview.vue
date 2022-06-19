<template>
  <div class="tir-overview">
    <TIRGraph class="tir-graph" :rotate="true" :graph-layout="new GraphLayout(400, 50)" :occurrences="frequencies" :colors="COLOR_SCHEME"/>
    <CGMLegend :ranges="ranges" :targets="targets" :percentages="frequencies" />
  </div>
</template>

<script lang="ts" setup>

import {defineProps} from "vue";
import {GraphLayout} from "@/services/core/graphtypes";
import {COLOR_SCHEME} from "@/services/core/shared";
import CGMLegend from "@/components/charts/CGMLegend.vue";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";

const props = defineProps<{
  ranges: [number, number?][],
  targets?: number[],
  frequencies?: number[],

}>()
</script>

<style scoped>
.tir-overview {
  margin: 15px;
}
.tir-graph {
  width: 100%;
}
</style>