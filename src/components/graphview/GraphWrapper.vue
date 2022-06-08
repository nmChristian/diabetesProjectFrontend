<template>
  <div>
    <nav>
      <router-link :to="{name: 'graphview.cgmgraphstest'}">CGM Graphs</router-link>
      <router-link :to="{name: 'graphview.icontest'}">Icon</router-link>
      <router-link :to="{name: 'graphview.linetest'}">Line</router-link>
      <router-link :to="{name: 'graphview.quantiletest'}">Quantile</router-link>
      <router-link :to="{name: 'graphview.tirtest'}">TIR (Time in Range)</router-link>

    </nav>

    <div class="user-info">
      <h2>Welcome {{ userDetails.first_name }} </h2>
      <p class="user-id"> with id {{ userDetails.last_name }}</p>
    </div>

    <router-view
        :data="data"
        :median-data-in-hours="medianDataInHours"
    />
  </div>
</template>

<script setup lang="ts">
import type {Ref} from "vue"
import {computed, onMounted, ref,} from "vue";
import type {DateValue, Point} from "@/services/core/datatypes"
import {addEdgesToSplit, bucketToMedian, SPLIT_BY_DAY, toBuckets} from "@/services/core/datatypes";
import backend from "@/services/backend";
import type {UserDetails} from "@/services/core/dbtypes";

// Loading data
let dataInDateValue: Ref<never[] | DateValue[]> = ref([])
let userDetails : Ref<{} | UserDetails> = ref({})

onMounted(() => {
  loadData()
  loadUserDetails()
})
async function loadUserDetails () {
  userDetails.value = await backend.getUserDetails()
}
async function loadData() {
  dataInDateValue.value = await backend.getCGMData(21)
}

const RESOLUTION = 96
const dataToMedian = (data: DateValue[], split: number): Point[] => {
  const splitData = toBuckets(data, split, RESOLUTION)
  const median: Point[] = bucketToMedian(splitData)
  addEdgesToSplit(median, split)
  return median
}
const medianDataInHours = computed(() =>
    dataInDateValue.value.length != 0 ?
        dataToMedian(dataInDateValue.value, SPLIT_BY_DAY) :
        []
)

const data = computed((): DateValue[] => dataInDateValue.value)

</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>