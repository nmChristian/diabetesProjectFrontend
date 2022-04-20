<template>
  <div class="jonasdiv">
    <h2>Welcome user</h2>
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

defineProps<{}>()
</script>

<style>

</style>