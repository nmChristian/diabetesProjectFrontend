<template>
  <div>
    <h1>Icon graphs</h1>
    <icon-graph
        :median-data-in-hours="medianDataInHours"
        :health-level="HealthLevel.Good"
    />

    <icon-graph
        :median-data-in-hours="medianDataInHours"
        :health-level="HealthLevel.High"
    />
    <icon-graph
        :median-data-in-hours="medianDataInHours"
        :health-level="HealthLevel.Low"
    />
    <icon-graph
        :median-data-in-hours="medianDataInHours"
        :health-level="HealthLevel.VeryHigh"
    />
  </div>
</template>

<script setup lang="ts">

import IconGraph from "@/components/charts/IconGraph.vue"
import {HealthLevel} from "@/services/core/shared";
import type {Point} from "@/services/core/datatypes";
import {addEdgesToSplit, bucketToMedian, DateValue, SPLIT_BY_DAY, toBuckets} from "@/services/core/datatypes";
import {computed, onMounted, ref, Ref} from "vue";
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
</script>
