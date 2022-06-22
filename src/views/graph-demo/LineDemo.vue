<!-- Author: Jonas -->
<!-- Description: Component that displays a linegraphs and some of its features  -->
<template>
  <div>
    <h1> Testing whether it is possible to do 24 hours with dates</h1>
    <Graph :svg="lineGraph(cgm, {})"/>

    <h1>Here is two graphs used for comparing functionality</h1>
    <p>Dynamic domain</p>
    <Graph :svg="lineGraphDaily(medianCGMInHours, cgmRanges, {})"/>

    <p>Fixed domain [0,24]</p>
    <Graph :svg="lineGraphDaily(medianCGMInHours, cgmRanges, {}, [0,24])"/>

    <h1>Working line graph over the span of days</h1>
    <Graph :svg="lineGraph(cgm, {})"/>
  </div>
</template>

<script lang="ts" setup>
import Graph from "@/components/charts/Graph.vue";
import lineGraph from "@/services/graphs/generic/line-graph";
import lineGraphDaily from "@/services/graphs/generic/line-graph-daily";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";

const props = defineProps<{
  cgm: DateValue[],
  cgmRanges: CGMRanges,
  medianCGMInHours: Point[]
}>()

</script>