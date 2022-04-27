<template>
  <div>
    <ListViewPatientElement
        v-for="u in users"
        :user="u.user"
        :cpr = 'u.cpr'
        :data = 'u.medData'
        :doctor="false"
        :selected="u.user.id === 1"
        :status = 'u.status'
        @click="clickedItem(u.user.id)">
    </ListViewPatientElement>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import cgm_083 from "@/assets/demo/users/cgm_083.json"  // 95% 5%
import cgm_123 from "@/assets/demo/users/cgm_123.json"  // 76% 21% 3%
import cgm_200 from "@/assets/demo/users/cgm_200.json"  // 2% 80% 15% 4%
import cgm_538 from "@/assets/demo/users/cgm_538.json"  // Lowest and nice 100%

import {CGMData} from "@/services/graphs/graphs"
import {User} from "@/services/user"
import router from "@/router";

const cgmMGDL_083 = new CGMData(cgm_083)
const cgmMGDL_123 = new CGMData(cgm_123)
const cgmMGDL_200 = new CGMData(cgm_200)
const cgmMGDL_538 = new CGMData(cgm_538)

const daysBack = 28
const dataPointsPerHour = 4
const userlist = [
    new User(0, "Alexander", 199),
    new User(1, "Christian", 21),
    new User(2, "Niels", 34),
    new User(3, "Jonas", 21)]

const users = computed(() =>
    [ {user: userlist[0], cpr:"ddmmyy-xxx1", status: 0 ,medData: cgmMGDL_083.medianData(daysBack, dataPointsPerHour)},
      {user: userlist[1], cpr:"ddmmyy-xxx2", status: 0, medData: cgmMGDL_123.medianData(daysBack, dataPointsPerHour)},
      {user: userlist[2], cpr:"ddmmyy-xxx3", status: 1, medData: cgmMGDL_200.medianData(daysBack, dataPointsPerHour)},
      {user: userlist[3], cpr:"ddmmyy-xxx4", status: -1, medData: cgmMGDL_538.medianData(daysBack, dataPointsPerHour)}])

const clickedItem = (id: Number) => {
  router.push("/DisplayPatientsList/patientInfo/" + (id))
}

</script>


<style scoped>

</style>