<!-- Author: Jonas -->
<!-- Description: Demo page that shows multiple TIR graphs with different offsets and values  -->
<template>
  <div>
    <h1>Here is a TIR graph</h1>
    <div class="graphs">
      <Graph
          v-for="offset in [5,0,10,20,50]"
          :svg="tirGraph(occurrences, COLOR_SCHEME,
          {graphLayout: layout, offset: offset})"/>
    </div>
    <h2>Testing offset</h2>
    <div class="graphs">
      <Graph
          v-for="offset in [5, 0]"
          :svg="tirGraph([0.2, 0.1, 0.2, 0.3, 0.2], COLOR_SCHEME,
          {graphLayout: layout, offset: offset})"/>
      <Graph
          :svg="tirGraph([0.2, 0, 0.2, 0.3, 0.3], COLOR_SCHEME,
          {graphLayout: layout, offset: 5})"/>
      <Graph
          :svg="tirGraph([0.5, 0.2, 0, 0.3, 0], COLOR_SCHEME,
          {graphLayout: layout, offset: 5})"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {COLOR_SCHEME} from "@/services/graphs/shared";
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import tirGraph from "@/services/graphs/generic/tir-graph";
import Graph from "@/components/charts/Graph.vue";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {getCGMOccurrences} from "@/services/graphs/auxiliary/cgm";

const props = defineProps<{
  cgm: DateValue[],
  cgmRanges: CGMRanges,
}>()

const occurrences = computed(() => getCGMOccurrences(props.cgm, props.cgmRanges))

const layout = new GraphLayout(50, 400, 0, 10, 0, 10)

</script>

<style scoped>
.graphs {
  display: flex;
}
</style>