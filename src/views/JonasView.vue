<template>
  <div class="jonasdiv">
    <h2>All users</h2>
    <div class="users">
      <div
          v-for="u in users"
          v-bind:key="u.id">
          <p>{{ u.name }}</p>
          <IconGraph
              :median-data="u.medData"
              :status="u.status"
          />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {computed} from 'vue'
import IconGraph from "@/components/charts/IconGraph.vue";
import cgm from "@/assets/demo/cgm.json";
import cgm_083 from "@/assets/demo/users/cgm_083.json"  // 95% 5%
import cgm_123 from "@/assets/demo/users/cgm_123.json"  // 76% 21% 3%
import cgm_200 from "@/assets/demo/users/cgm_200.json"  // 2% 80% 15% 4%
import cgm_538 from "@/assets/demo/users/cgm_538.json"  // Lowest and nice 100%


import {DataEdit} from "@/services/graphs/graphs";

const editor = new DataEdit ();


// Convert from mmol/L to mg/dL
const cgmMGDL = cgm.map((d) => ({date: new Date(d.date), value: d.cgm * 18}))
const cgmMGDL_083 = editor.convertToMGDL(cgm_083)
const cgmMGDL_123 = editor.convertToMGDL(cgm_123)
const cgmMGDL_200 = editor.convertToMGDL(cgm_200)
const cgmMGDL_538 = editor.convertToMGDL(cgm_538)

const medData = computed(() => editor.medianData(cgmMGDL, 7, 1 ))
const users = computed(() =>
    [{id:0, name: "Alexander", status: 0 ,medData: editor.medianData(cgmMGDL_083, 7, 1 )},
      {id:1, name: "Christian", status: 0, medData: editor.medianData(cgmMGDL_123, 7, 1 )},
      {id:2, name: "Niels", status: 1, medData: editor.medianData(cgmMGDL_200, 7, 1 )},
      {id:3, name: "Jonas", status: -1, medData: editor.medianData(cgmMGDL_538, 7, 1 )}])



</script>