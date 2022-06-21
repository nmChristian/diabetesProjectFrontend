<template>
  <div class="tir-overview">
    <Graph class="tir-graph" :svg="tirGraph(
        frequencies,
        COLOR_SCHEME,
        {graphLayout: new GraphLayout(400,50), rotate: true})"/>
    <CGMLegend :ranges="ranges" :targets="targets" :percentages="frequencies" />
  </div>
</template>

<script lang="ts" setup>

import {defineProps} from "vue";
import {GraphLayout} from "@/services/core/graphtypes";
import type {CGMRanges} from "@/services/core/shared";
import {COLOR_SCHEME} from "@/services/core/shared";
import CGMLegend from "@/components/charts/CGMLegend.vue";
import Graph from "@/components/charts/shared/Graph.vue";
import tirGraph from "@/services/graphs/generic/tirGraph";

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