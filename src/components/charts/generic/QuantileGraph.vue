<template>
  <Graph :svg="graph"/>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import Graph from "../shared/Graph.vue"
import {quantileGraph} from "@/services/graphs/generic/quantileGraph";
import type {BucketPoint, Point} from "@/services/core/datatypes";
import type {GraphLayout} from "@/services/core/graphtypes";
import type {CGMRanges} from "@/services/core/shared";


const props = defineProps<{
  bucketSeriesOfQuantiles: d3.Series<BucketPoint, number>[],
  quantilesUsedInBucket: number[]
  medianDataInHours: Point[],
  cgmRanges: CGMRanges,
  graphLayout?: GraphLayout,
}>()

const graph = computed(() => quantileGraph(
    props.bucketSeriesOfQuantiles,
    props.quantilesUsedInBucket,
    props.medianDataInHours,
    props.cgmRanges,
    {graphLayout: props.graphLayout}))
</script>
