<template>
  <div>
    <div class="user-info">
      <h2>Welcome {{user.name}} </h2>
      <p class="user-id"> with id {{user.id}}</p>
    </div>

    <h1>Here is the Line Graph graph</h1>

    <line-graph
      :data="weekBackData"
    />

    <h1>Here is the quantile  graph</h1>
    <quantile-chart
        :median-data="medData"
        :quantile-stack="quantileData"
    />

    <h1>Here is the icon graph</h1>
    <icon-graph
      :status="0"
      :median-data="medData"
    />



  </div>
</template>

<script setup lang="ts">

import type {User} from "@/services/user";
import type {CGMData} from "@/services/graphs/graphs";
import IconGraph from "@/components/charts/IconGraph.vue";
import QuantileChart from "@/components/charts/QuantileChart.vue";
import LineGraph from "@/components/charts/LineGraph.vue";

const props = defineProps<{
  user: User,
  cgmData : CGMData,
}>()


const weekBackData = props.cgmData.getDataNDaysBack(7)
const monthBackData = props.cgmData.getDataNDaysBack(28)
const medData = props.cgmData.medianData(monthBackData ?? [] , 4)
const quantileData = props.cgmData.quantileStack(monthBackData ?? [], 2)


</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>