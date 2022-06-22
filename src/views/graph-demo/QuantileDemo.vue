<!-- Author: Jonas -->
<!-- Description: Demo page that shows a quantile graph -->
<template>
  <div>
    <Graph :svg="quantileGraph(
        bucketSeriesOfQuantiles,
        quantiles,
        medianCGMInHours ?? cgmMedian(),
        cgmRanges,
        {})"/>
  </div>
</template>

<script lang="ts" setup>
import {calculateQuantiles, quantileGraph, toBucketSeries} from "@/services/graphs/generic/quantile-graph";
import {computed} from "vue";
import Graph from "@/components/charts/Graph.vue";
import {bucketToMedian, toBuckets} from "@/services/graphs/auxiliary/converter";
import {addEdgesToSplit, addEdgesToSplitBucket} from "@/services/graphs/auxiliary/edges";
import {SPLIT_BY_DAY} from "@/services/graphs/shared";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";

const props = defineProps<{
  cgm: DateValue[],
  medianCGMInHours?: Point[],
  cgmRanges: CGMRanges,

}>()

const RESOLUTION = 96, SPLIT = SPLIT_BY_DAY

const quantiles = [0.05, 0.25, 0.75, 0.95]


const buckets = computed(() => toBuckets(props.cgm, SPLIT, RESOLUTION))

function cgmMedian(): Point[] {
  const median: Point[] = bucketToMedian(buckets.value)
  addEdgesToSplit(median, SPLIT)
  return median
}

const bucketSeriesOfQuantiles = computed(() => {
  const quantileBuckets: BucketPoint[] =
      calculateQuantiles(buckets.value, quantiles)

  addEdgesToSplitBucket(quantileBuckets, SPLIT)

  // When generating the stack, you need to make it relative since the algorithm stacks the element on top of each other
  // (the first element is not gonna be relative though)
  const relativeQuantileBuckets = quantileBuckets.map<BucketPoint>(([x, values]) =>
      [x, values.map<number>((v, i) => v - (values[i - 1] ?? 0))])


  const quantileSeries: d3.Series<BucketPoint, number>[] =
      toBucketSeries(relativeQuantileBuckets)

  // Remove the lowest area (in this case 0% - 5%)
  quantileSeries.shift()

  return quantileSeries
})
</script>
