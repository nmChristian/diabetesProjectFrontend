<template>
  <div>
    <div class="user-info">
      <h2>Welcome {{user.name}} </h2>
      <p class="user-id"> with id {{user.id}}</p>
    </div>



    <h1>Here is the icon graph</h1>

<!--
    <h1>Here is the Line Graph graph</h1>

    <line-graph
      :data="data.weekBackData"
    />

    <h1>Here is the quantile  graph</h1>
    <quantile-chart
        :median-data="data.medData"
        :quantile-stack="data.quantileData"
    />

    <h1>Here is the icon graph</h1>
    <icon-graph
      :status="0"
      :median-data="data.medData"
    />


    -->
    <icon-graph
        :medianDataInHours="medianDataInHours"
        :healthLevel="HealthLevel.Good"
    />


  </div>
</template>

<script setup lang="ts">

import type {User} from "@/services/user";
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import backend from "@/services/backend";
import type {DateValue, Point} from "@/services/core/datatypes";
import {bucketToMedian, SPLIT_BY_DAY, toBuckets} from "@/services/core/datatypes";
import {HealthLevel} from "@/services/core/shared";

const props = defineProps<{
  user: User,
}>()



let dataInDateValue = ref({data:[]})
onMounted(() => {
  console.log("Mounted")
  axios.post(backend.getUrlData(),
      backend.getCGMDaysBack(7),
      backend.getHeader(200))
      .then(response => {
        //        react = reactive({data: response.data})
        dataInDateValue.value.data = response.data.cgm.map((d : {t : number, v : number}) => [new Date(d.t * 1000), d.v * 18])
        console.log("RESPONSE")
      })
})

const RESOLUTION = 96
const dataToMedian = (data : DateValue[], split : number) : Point[] =>
    bucketToMedian(toBuckets(data, split, RESOLUTION))

const medianDataInHours = computed(() =>
{
    return dataInDateValue.value.data.length != 0 ?
        dataToMedian(dataInDateValue.value.data, SPLIT_BY_DAY) :
        []
})

</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>