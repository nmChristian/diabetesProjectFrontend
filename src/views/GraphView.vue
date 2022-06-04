<template>
  <div class="graphdiv">
    <GraphWrapper
      :user="user"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
import cgm_083 from "@/assets/demo/users/cgm_083.json"  // 95% 5%
import cgm_123 from "@/assets/demo/users/cgm_123.json"  // 76% 21% 3%
import cgm_200 from "@/assets/demo/users/cgm_200.json"  // 2% 80% 15% 4%
import cgm_538 from "@/assets/demo/users/cgm_538.json"  // Lowest and nice 100%



import {CGMData} from "@/services/graphs/oldgraphs";
import {User} from "@/services/user";

import axios from "axios";
import GraphWrapper from "@/components/graphview/GraphWrapper.vue";

const cgmMGDL_083 = new CGMData(cgm_083)
const cgmMGDL_200 = new CGMData(cgm_200)

const user = new User(0, "Alexander", 66)



</script>

<style>

</style>