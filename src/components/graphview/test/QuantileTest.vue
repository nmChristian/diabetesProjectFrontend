<template>
  <div>
    <h1>Here is a working quantile graph</h1>
    <quantile-graph
        :bucket-series-of-quantiles="bucketSeriesOfQuantiles"
        :quantiles-used-in-bucket="quantiles"
        :median-data-in-hours="medianDataInHours"
    />
  </div>

</template>

<script setup lang="ts">
import QuantileGraph from "@/components/charts/QuantileGraph.vue"
import {computed, onMounted, ref, Ref} from "vue";
import type {BucketPoint, DateValue, Point} from "@/services/core/datatypes";
import {
  addEdgesToSplit,
  addEdgesToSplitBucket,
  bucketToMedian,
  SPLIT_BY_DAY,
  toBuckets
} from "@/services/core/datatypes";
import {calculateQuantiles, toBucketSeries} from "@/services/graphs/quantileGraph";
import backend from "@/services/backend";


// Loading data
let dataInDateValue : Ref<never[] | DateValue[]>= ref([])
onMounted(() => {
  loadData()
})
async function loadData () {
  dataInDateValue.value = await backend.getCGMData(7)
}

const RESOLUTION = 96
const dataToMedian = (data : DateValue[], split : number) : Point[] => {
  const splitData = toBuckets(data, split, RESOLUTION)
  const median : Point[] = bucketToMedian(splitData)
  addEdgesToSplit(median, split)
  return median
}

const medianDataInHours = computed(() =>
    dataInDateValue.value.length != 0 ?
        dataToMedian(dataInDateValue.value, SPLIT_BY_DAY) :
        []
)

const quantiles = [0.05, 0.25, 0.75, 0.95]

const bucketSeriesOfQuantiles = computed(() => {
  const split = SPLIT_BY_DAY

  const buckets : BucketPoint[] =
      toBuckets(dataInDateValue.value, split, RESOLUTION)

  const quantileBuckets: BucketPoint[] =
      calculateQuantiles(buckets, quantiles)

  addEdgesToSplitBucket(quantileBuckets, split)

  // When generating the stack, you need to make it relative since the algorithm stacks the element on top of each other
  // (the first element is not gonna be relative though)
  const relativeQuantileBuckets = quantileBuckets.map<BucketPoint>(([x, values]) =>
      [x, values.map<number>((v, i) => v - (values[i - 1]??0))])



  const quantileSeries : d3.Series<BucketPoint, number>[] =
      toBucketSeries(relativeQuantileBuckets)

  // Remove the lowest area (in this case 0% - 5%)
  quantileSeries.shift()

  return quantileSeries
})
</script>

