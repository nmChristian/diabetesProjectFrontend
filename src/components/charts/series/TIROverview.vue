<!-- Author: Jonas -->
<!-- Description: Component contains a rotated tir graph and a legend for it -->
<template>
  <div class="tir-overview">
    <Graph class="tir-graph" :svg="tirGraph(
        frequencies,
        COLOR_SCHEME,
        {graphLayout: new GraphLayout(400,50), rotate: true})"/>
    <CGMLegend :ranges="ranges" :targets="targets" :percentages="frequencies"/>
  </div>
</template>

<script lang="ts" setup>

import {defineProps} from "vue";
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {COLOR_SCHEME} from "@/services/graphs/shared";
import CGMLegend from "@/components/charts/others/CGMLegend.vue";
import Graph from "@/components/charts/Graph.vue";
import tirGraph from "@/services/graphs/generic/tir-graph";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";

const props = defineProps<{
  ranges: CGMRanges,
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