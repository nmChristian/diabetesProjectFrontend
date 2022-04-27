<template>
  <div>
    <div class="user-info">
      <h2>Welcome {{user.name}} </h2>
      <p class="user-id"> with id {{user.id}}</p>
    </div>

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

const props = defineProps<{
  user: User,
  cgmData : CGMData,
}>()

const medData = props.cgmData.medianData(28, 4)

</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>