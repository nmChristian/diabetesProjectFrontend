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
import cgm from "@/assets/demo/cgm.json";
import cgm_083 from "@/assets/demo/users/cgm_083.json"  // 95% 5%
import cgm_123 from "@/assets/demo/users/cgm_123.json"  // 76% 21% 3%
import cgm_200 from "@/assets/demo/users/cgm_200.json"  // 2% 80% 15% 4%
import cgm_538 from "@/assets/demo/users/cgm_538.json"  // Lowest and nice 100%


import {DataEdit} from "@/services/graphs/graphs";

export default {
  data(){
    let editor = new DataEdit ()
    let cgmMGDL = cgm.map((d) => ({date: new Date(d.date), value: d.cgm * 18}))
    let cgmMGDL_083 =  editor.convertToMGDL(cgm_083)
    let cgmMGDL_123 = editor.convertToMGDL(cgm_123)
    let cgmMGDL_200 = editor.convertToMGDL(cgm_200)
    let cgmMGDL_538 = editor.convertToMGDL(cgm_538)
    return {

      medData:  computed(() => editor.medianData(cgmMGDL, 7, 1 )),
      users: computed(() =>
          [{id:0, name: "Alexander",  age:2 , cpr:"ddmmyy-xxx1", status: 0 ,medData: editor.medianData(cgmMGDL_083, 7, 1 )},
            {id:1, name: "Christian", age:2 , cpr:"ddmmyy-xxx2", status: 0, medData: editor.medianData(cgmMGDL_123, 7, 1 )},
            {id:2, name: "Niels",     age:2 , cpr:"ddmmyy-xxx3", status: 1, medData: editor.medianData(cgmMGDL_200, 7, 1 )},
            {id:3, name: "Jonas",     age:2 , cpr:"ddmmyy-xxx4", status: -1, medData: editor.medianData(cgmMGDL_538, 7, 1 )}])

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