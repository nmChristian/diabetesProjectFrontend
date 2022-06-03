<template>
  <div>
    <div class="user-info">
      <h2>Welcome {{user.name}} </h2>
      <p class="user-id"> with id {{user.id}}</p>
    </div>

    <h1>Here is the Line Graph graph</h1>
    <p>{{fisk}}</p>

    <h1>Here is the icon graph</h1>

<!--
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

        <icon-graph
        :status="0"
        :median-data="fisk.medData"
    />
    -->




  </div>
</template>

<script setup lang="ts">

import type {User} from "@/services/user";
import {CGMData} from "@/services/graphs/oldgraphs";
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import backend from "@/services/backend";

const props = defineProps<{
  user: User,
  cgmData : CGMData,
}>()


let react : any = ref({data: []})
onMounted(() => {
  console.log("Mounted")
  axios.post(backend.getUrlData(),
      backend.getCGMDaysBack(1),
      backend.getHeader(200))
      .then(response => {
//        react = reactive({data: response.data})
        react.value.data = response.data.cgm.map((d : any) => ({date: new Date(d.t).toString(), cgm: d.v}))
        console.log("RESPONSE")
        console.log(response.data)
        console.log(react.value.data)
      })
})



const fisk = computed(() =>
{
  if (react.value.data.length == 0)
    return []
  console.log("fisk")
  console.log(react.value)
  let val = new CGMData(react.value.data)
  const wD = val.getDataNDaysBack(7) ?? []
  const mD = val.getDataNDaysBack(28) ?? []
  console.log(val)
  console.log(wD)
  console.log(mD)
  return {
    val,
    weekBackData: wD,
    monthBackData: mD,
    medData: val.medianData(mD, 4) ?? [],
    quantileData: val.quantileStack(mD, 2) ?? []
  }
})

</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>