<template>
  <div class="jonasdiv">
    <h2>All users</h2>
    <div class="users">
      <div class ="user"
          v-for="u in users"
          v-bind:key="u.id">
          <div>
          <IconGraph
              class="icon-graph"
              :median-data="u.medData"
              :status="u.status"
          />
          </div>
          <div class="container">
            <div><p class="user-name">{{ u.name }}</p></div>
            <div><p>Nej</p></div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import IconGraph from "@/components/charts/IconGraph.vue";
import cgm_083 from "@/assets/demo/users/cgm_083.json"  // 95% 5%
import cgm_123 from "@/assets/demo/users/cgm_123.json"  // 76% 21% 3%
import cgm_200 from "@/assets/demo/users/cgm_200.json"  // 2% 80% 15% 4%
import cgm_538 from "@/assets/demo/users/cgm_538.json"  // Lowest and nice 100%


import {CGMData} from "@/services/graphs/graphs";


const cgmMGDL_083 = new CGMData(cgm_083)
const cgmMGDL_123 = new CGMData(cgm_123)
const cgmMGDL_200 = new CGMData(cgm_200)
const cgmMGDL_538 = new CGMData(cgm_538)

const daysBack = 28
const dataPointsPerHour = 4
const users = computed(() =>
    [{id:0, name: "Alexander", status: 0 ,medData: cgmMGDL_083.medianData(daysBack, dataPointsPerHour)},
      {id:1, name: "Christian", status: 0, medData: cgmMGDL_123.medianData(daysBack, dataPointsPerHour)},
      {id:2, name: "Niels", status: 1, medData: cgmMGDL_200.medianData(daysBack, dataPointsPerHour)},
      {id:3, name: "Jonas", status: -1, medData: cgmMGDL_538.medianData(daysBack, dataPointsPerHour)}])

</script>

<style>
.user {
  display: flex;
  overflow: hidden;
  position: relative;

  margin: 10px 20px;

  height: 150px;

  border: 1px solid red;

}

.icon-graph {
  margin: auto;
  position: absolute;
}

.user-name {
  text-align: center;
  font-size: 30px;
}

.container {
  flex-grow: 1;
  padding: 5px;
}
.container>* {
  border: 1px solid grey;
  height: 50%;
}


</style>