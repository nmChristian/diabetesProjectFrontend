<template>
  <div>
    <ListViewPatientElement
        v-for="u in this.$data.users"
        :name = 'u.name'
        :cpr = 'u.cpr'
        :age= 'u.age'
        :data = 'u.medData'
        :doctor="false"
        :selected="u.id === 1"
        :status = 'u.status'
        @click="clickedItem(u.id)">

    </ListViewPatientElement>

  </div>
</template>

<script lang="ts">
import {computed} from 'vue'
import IconGraph from "@/components/charts/IconGraph.vue";
import cgm_083 from "@/assets/demo/users/cgm_083.json"  // 95% 5%
import cgm_123 from "@/assets/demo/users/cgm_123.json"  // 76% 21% 3%
import cgm_200 from "@/assets/demo/users/cgm_200.json"  // 2% 80% 15% 4%
import cgm_538 from "@/assets/demo/users/cgm_538.json"  // Lowest and nice 100%


import {CGMData} from "@/services/graphs/graphs";

const daysBack = 28
const dataPointsPerHour = 4

export default {
  data(){
    let cgmMGDL_083 = new CGMData(cgm_083)
    let cgmMGDL_123 = new CGMData(cgm_123)
    let cgmMGDL_200 = new CGMData(cgm_200)
    let cgmMGDL_538 = new CGMData(cgm_538)
    return {

      users: computed(() =>
          [{id:0, name: "Alexander",  age:2 , cpr:"ddmmyy-xxx1", status: 0 ,medData: cgmMGDL_083.medianData(daysBack, dataPointsPerHour)},
            {id:1, name: "Christian", age:2 , cpr:"ddmmyy-xxx2", status: 0, medData: cgmMGDL_123.medianData(daysBack, dataPointsPerHour)},
            {id:2, name: "Niels",     age:2 , cpr:"ddmmyy-xxx3", status: 1, medData: cgmMGDL_200.medianData(daysBack, dataPointsPerHour)},
            {id:3, name: "Jonas",     age:2 , cpr:"ddmmyy-xxx4", status: -1, medData: cgmMGDL_538.medianData(daysBack, dataPointsPerHour)}])

    }

  },
  methods:{
    clickedItem(id: Number){
      alert("hey" + (id))
    }
  }
}
</script>


<style scoped>

</style>