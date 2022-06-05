<template>
  <div>
    <div class="user-info">
      <h2>Welcome {{user.name}} </h2>
      <p class="user-id"> with id {{user.id}}</p>
    </div>



    <h1>Here is the icon graph</h1>
    <icon-graph
        :medianDataInHours="medianDataSplitByDayInHours"
        :healthLevel="HealthLevel.Good"
    />

    <h1>Here is the Line Graph graph</h1>

    <line-graph
      :data="data"
    />

    <h1>Here is the quantile  graph</h1>
    <quantile-graph
        :bucket-series-of-quantiles-split-by-day-in-hour="bucketSeriesOfQuantilesSplitByDayInHour"
        :quantiles-used-in-bucket="quantiles"
        :median-points-split-by-day-in-hour="medianDataSplitByDayInHours"
      />







  </div>
</template>

<script setup lang="ts">

import type {User} from "@/services/user";
import {computed, onMounted, ref} from "vue";
import type {Ref} from "vue"

import LineGraph from "@/components/charts/LineGraph.vue"
import QuantileGraph from "@/components/charts/QuantileGraph.vue"

import axios from "axios";
import backend from "@/services/backend";
import type {BucketPoint, DateValue, Point} from "@/services/core/datatypes";
import {bucketToMedian, SPLIT_BY_DAY, toBuckets, toDateValue} from "@/services/core/datatypes";
import {HealthLevel} from "@/services/core/shared";
import {calculateQuantiles, toBucketSeries} from "@/services/graphs/quantileGraph";

const props = defineProps<{
  user: User,
}>()



let dataInDateValue : Ref<never[] | DateValue[]>= ref([])
onMounted(() => {
  axios.post(backend.getUrlData(),
      backend.getCGMDaysBack(7),
      backend.getHeader(200))
      .then(response => {
        //        react = reactive({data: response.data})
        dataInDateValue.value = toDateValue<{t : number, v : number}>(
            response.data.cgm,
            ({t, v}) => [new Date(t* 1000), v * 18])
        console.log("RESPONSE")
      })
})

const RESOLUTION = 96
const dataToMedian = (data : DateValue[], split : number) : Point[] =>
    bucketToMedian(toBuckets(data, split, RESOLUTION))

const medianDataSplitByDayInHours = computed(() =>
    dataInDateValue.value.length != 0 ?
        dataToMedian(dataInDateValue.value, SPLIT_BY_DAY) :
        []
)

const data = computed(() => dataInDateValue.value)

const quantiles = [0.05, 0.25, 0.75, 0.95]

const bucketSeriesOfQuantilesSplitByDayInHour = computed(() => {
  const buckets : BucketPoint[] =
      toBuckets(dataInDateValue.value, SPLIT_BY_DAY, RESOLUTION)
  const quantileBuckets: BucketPoint[] =
      calculateQuantiles(buckets, quantiles)

  // When generating the stack, you need to make it relative since the algorithm stacks the element on top of each other
  // (the first element is not gonna be relative though)
  const relativeQuantileBuckets = quantileBuckets.map<BucketPoint>(([x, values]) =>
      [x, values.map<number>((v, i) => v - (values[i - 1]??0))])

  const quantileSeries : d3.Series<BucketPoint, number>[] =
      toBucketSeries(relativeQuantileBuckets)

  quantileSeries.shift()
  console.log(quantileSeries)
  return quantileSeries
})

</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>