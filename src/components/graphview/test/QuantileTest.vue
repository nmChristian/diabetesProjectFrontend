<template>
  <div>
    <h1>Here is a working quantile graph</h1>
    <QuantileGraph
        :bucket-series-of-quantiles="bucketSeriesOfQuantiles"
        :median-data-in-hours="medianCGMInHours"
        :quantiles-used-in-bucket="quantiles"
        :cgm-ranges="cgmRanges"
    />
  </div>

</template>

<script lang="ts" setup>
import QuantileGraph from "@/components/charts/generic/QuantileGraph.vue"
import {computed} from "vue";
import type {BucketPoint, DateValue, Point} from "@/services/core/datatypes";
import {addEdgesToSplitBucket, SPLIT_BY_DAY, toBuckets} from "@/services/core/datatypes";
import {calculateQuantiles, toBucketSeries} from "@/services/graphs/generic/quantileGraph";
import type {CGMRanges} from "@/services/core/shared";

const props = defineProps<{
  cgm: DateValue[],
  medianCGMInHours: Point[],
  cgmRanges: CGMRanges,

}>()

const RESOLUTION = 96

const quantiles = [0.05, 0.25, 0.75, 0.95]

const bucketSeriesOfQuantiles = computed(() => {
  const split = SPLIT_BY_DAY

  const buckets: BucketPoint[] =
      toBuckets(props.cgm, split, RESOLUTION)

  const quantileBuckets: BucketPoint[] =
      calculateQuantiles(buckets, quantiles)

  addEdgesToSplitBucket(quantileBuckets, split)

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
