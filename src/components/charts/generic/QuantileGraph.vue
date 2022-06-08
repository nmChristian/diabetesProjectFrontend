<template>
  <Graph :svg="graph"/>
</template>

<script setup lang="ts">
import {computed} from "vue";
import Graph from "../shared/Graph.vue"
import {quantileGraph} from "@/services/graphs/generic/quantileGraph";
import type {BucketPoint, Point} from "@/services/core/datatypes";
import type {GraphLayout} from "@/services/core/graphtypes";


const props = defineProps<{
  bucketSeriesOfQuantiles : d3.Series<BucketPoint, number>[],
  quantilesUsedInBucket : number[]
  medianDataInHours : Point[],
  graphLayout? : GraphLayout,
}>()

const graph = computed(() =>quantileGraph(
    props.bucketSeriesOfQuantiles,
    props.quantilesUsedInBucket,
    props.medianDataInHours,
    { graphLayout : props.graphLayout }))
</script>
