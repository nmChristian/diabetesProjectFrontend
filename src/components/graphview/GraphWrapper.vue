<template>
  <div>
    <div class="user-info">
      <h2>Welcome {{user.name}} </h2>
      <p class="user-id"> with id {{user.id}}</p>
    </div>
    <router-link to=""></router-link>
    <router-view></router-view>
    <icon-test :median-data-in-hours="medianDataInHours"/>
    <h1> Testing whether it is possible to do 24 hours with dates</h1>
    <line-graph
        :data="medianDateInDateValue"
    />


    <h1>Here is two graphs used for comparing functionality</h1>
    <p>Dynamic domain</p>
    <line-graph-daily
        :data="medianDataInHours"
    />
    <p>Fixed domain [0,24]</p>
    <line-graph-daily
        :data="medianDataInHours"
        :x-domain="[0, 24]"
    />




    <h1>Here is the Line Graph graph</h1>
    <line-graph
      :data="data"
    />

    <h1>Here is the quantile  graph</h1>
    <quantile-graph
        :bucket-series-of-quantiles="bucketSeriesOfQuantiles"
        :quantiles-used-in-bucket="quantiles"
        :median-data-in-hours="medianDataInHours"
      />
  </div>
</template>

<script setup lang="ts">

import type {User} from "@/services/user";
import {computed, onMounted, ref} from "vue";
import type {Ref} from "vue"

import IconTest from "@/components/graphview/IconTest.vue"

import LineGraph from "@/components/charts/LineGraph.vue"
import QuantileGraph from "@/components/charts/QuantileGraph.vue"
import LineGraphDaily from "@/components/charts/LineGraphDaily.vue";

import axios from "axios";
import backend from "@/services/backend";
import type {BucketPoint, DateValue, Point} from "@/services/core/datatypes";
import {
  addEdgesToSplit,
  addEdgesToSplitBucket,
  bucketToMedian, dateValueIsValid,
  SPLIT_BY_DAY, SPLIT_BY_WEEK,
  toBuckets,
  toDateValue
} from "@/services/core/datatypes";

import {HealthLevel} from "@/services/core/shared";
import {calculateQuantiles, toBucketSeries} from "@/services/graphs/quantileGraph";

const props = defineProps<{
  user: User,
}>()


let dataInDateValue : Ref<never[] | DateValue[]>= ref([])
onMounted(() => {
  axios.post(backend.getUrlData(),
      backend.getCGMDaysBack(7),
      backend.generateHeader())
      .then(response => {
        //        react = reactive({data: response.data})
        dataInDateValue.value = toDateValue<{t : number, v : number}>(
            response.data.cgm,
            ({t, v}) => [new Date(t* 1000), v * 18])
        console.log("Updated data in GraphWrapper.vue")
      })
})

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

const data = computed(() => dataInDateValue.value)

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


const medianDateInDateValue = computed(() =>
  medianDataInHours.value.map<DateValue>(([x,y]) =>
  { const date = new Date(); date.setHours(x); return [date, y]})
)
</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>