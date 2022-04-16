<template>
  <div>
    <ListViewPatientElement
        v-for="u in users"
        :name = 'u.name'
        :cpr = 'u.cpr'
        :age= 'u.age'
        :data = 'u.medData'
        :doctor="false"
        :selected="u.id === 1"
        :status = 'u.status'>

    </ListViewPatientElement>

    <icon-graph
      :median-data="users[1].medData"
      :status="users[1].status"></icon-graph>

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
    [{id:0, name: "Alexander",  age:2 , cpr:"ddmmyy-xxx1", status: 0 ,medData: editor.medianData(cgmMGDL_083, 7, 1 )},
      {id:1, name: "Christian", age:2 , cpr:"ddmmyy-xxx2", status: 0, medData: editor.medianData(cgmMGDL_123, 7, 1 )},
      {id:2, name: "Niels",     age:2 , cpr:"ddmmyy-xxx3", status: 1, medData: editor.medianData(cgmMGDL_200, 7, 1 )},
      {id:3, name: "Jonas",     age:2 , cpr:"ddmmyy-xxx4", status: -1, medData: editor.medianData(cgmMGDL_538, 7, 1 )}])


</script>

<style scoped>

</style>