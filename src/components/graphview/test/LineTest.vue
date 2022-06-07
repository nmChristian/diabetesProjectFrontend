<template>
  <div>
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
    <h1>Working line graph over the span of days</h1>
    <line-graph
        :data="data"
    />
  </div>
</template>

<script setup lang="ts">
import LineGraph from "@/components/charts/LineGraph.vue"
import LineGraphDaily from "@/components/charts/LineGraphDaily.vue";
import {computed, onMounted, ref, Ref} from "vue";
import {addEdgesToSplit, bucketToMedian, DateValue, Point, SPLIT_BY_DAY, toBuckets} from "@/services/core/datatypes";
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
const medianDataInHours = computed( () =>
    dataInDateValue.value.length != 0 ?
        dataToMedian(dataInDateValue.value, SPLIT_BY_DAY) :
        []
)

const medianDateInDateValue = computed(() =>
    medianDataInHours.value.map<DateValue>(([x,y]) =>
    { const date = new Date(); date.setHours(x); return [date, y]})
)
const data = computed(() => dataInDateValue.value)


</script>