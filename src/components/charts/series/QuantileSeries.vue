<!-- Author: Jonas -->
<!-- Description: Component that contains the quantile graph as well as settings to change the quantiles. -->
<template>
  <DateIntervalSelector
      :text="d3.timeFormat('%d/%m')(cgm[0]?.[0] ?? 0) + ' - ' + d3.timeFormat('%d/%m')(cgm[cgm.length - 1]?.[0] ?? 0) "/>
  <div class="quantile-series">
    <div v-if="showAdvanced" class="quantile-settings">
      <p>Change quantiles</p>
      <div class="input-range">
        <input type="range" step="0.01" min="0" max=".24" name="lowest-quantile" v-model="lowestQuantile">
        <label for="lowest-quantile">{{ (lowestQuantile * 100).toFixed(0) }}%</label>
      </div>

      <div class="input-range">
        <input type="range" step="0.01" min=".25" max=".49" name="highest-quantile" v-model="highestQuantile">
        <label for="highest-quantile">{{ (highestQuantile * 100).toFixed(0) }}%</label>
      </div>
    </div>
    <Graph class="quantile-graph" :svg="quantileGraph(
        bucketSeriesOfQuantiles,
        quantiles,
        medianCGMInHours ?? cgmMedian(),
        cgmRanges,
        {})"/>
  </div>

</template>

<script lang="ts" setup>

import {computed, ref} from "vue";
import {calculateQuantiles, quantileGraph, toBucketSeries} from "@/services/graphs/generic/quantile-graph";
import DateIntervalSelector from "@/components/DateIntervalSelector.vue";
//@ts-ignore
import * as d3 from "d3";
import Graph from "@/components/charts/Graph.vue";
import {bucketToMedian, toBuckets} from "@/services/graphs/auxiliary/converter";
import {addEdgesToSplit, addEdgesToSplitBucket} from "@/services/graphs/auxiliary/edges";
import {SPLIT_BY_DAY} from "@/services/graphs/shared";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";


const lowestQuantile = ref(.05)
const highestQuantile = ref(.25)


const props = defineProps<{
  cgm: DateValue[],
  medianCGMInHours?: Point[],
  cgmRanges: CGMRanges,
  showAdvanced: boolean,

}>()
const RESOLUTION = 96, SPLIT = SPLIT_BY_DAY

const quantiles = computed(() => [lowestQuantile.value, highestQuantile.value, 1 - highestQuantile.value, 1 - lowestQuantile.value])
const buckets = computed(() => toBuckets(props.cgm, SPLIT, RESOLUTION))

function cgmMedian(): Point[] {
  const median: Point[] = bucketToMedian(buckets.value)
  addEdgesToSplit(median, SPLIT)
  return median
}

const bucketSeriesOfQuantiles = computed(() => {
  const quantileBuckets: BucketPoint[] =
      calculateQuantiles(buckets.value, quantiles.value)

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

<style scoped>
.quantile-series {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.quantile-graph {
  width: 90%;
}

.quantile-settings {
  margin-bottom: 20px;
}

.input-range input {
  width: 200px;
}

.input-range label {
  font-size: 1em;
  font-style: italic;
  margin-left: 20px;
}
</style>