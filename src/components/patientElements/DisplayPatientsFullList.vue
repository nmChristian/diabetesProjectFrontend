<template>
  <div>
    <ListViewPatientElement
        v-for="u in users"
        :user="u.user"
        :cpr = 'u.cpr'
        :medianDataInHours = 'u.medianDataInHours'
        :doctor="false"
        :selected="parseInt($route.params.id)"
        :healthLevel = 'u.healthLevel'
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

import {CGMData} from "@/services/graphs/oldgraphs"

import {User} from "@/services/user"
import router from "@/router"
import type {DateValue, Point} from "@/services/core/datatypes"
import {toDateValue, bucketToMedian, toBuckets, SPLIT_BY_DAY, SPLIT_BY_WEEK} from "@/services/core/datatypes"
import {HealthLevel} from "@/services/core/shared";

const cgmMGDL_083 = new CGMData(cgm_083)
const cgmMGDL_123 = new CGMData(cgm_123)
const cgmMGDL_200 = new CGMData(cgm_200)
const cgmMGDL_538 = new CGMData(cgm_538)

const daysBack = 28
const RESOLUTION = 96
const userlist = [
    new User(0, "Alexander", 199),
    new User(1, "Christian", 21),
    new User(2, "Niels", 34),
    new User(3, "Jonas", 21)]

const cgmToData = (cgmData : {date: string, cgm: number}[]) =>
    toDateValue(cgmData, (data => [new Date(data.date), data.cgm * 18]))

const dataToMedian = (data : DateValue[], split : number) : Point[] =>
    bucketToMedian(toBuckets(data, split, RESOLUTION))


/*
const users = computed(() =>
    [ {user: userlist[0], cpr:"ddmmyy-xxx1", status: 0 ,medData: cgmMGDL_083.medianData(cgmMGDL_083.getDataNDaysBack(daysBack) ?? [], DATA_POINTS_PER_HOUR)},
      {user: userlist[1], cpr:"ddmmyy-xxx2", status: 0, medData: cgmMGDL_123.medianData(cgmMGDL_123.getDataNDaysBack(daysBack) ?? [], DATA_POINTS_PER_HOUR)},
      {user: userlist[2], cpr:"ddmmyy-xxx3", status: 1, medData: cgmMGDL_200.medianData(cgmMGDL_200.getDataNDaysBack(daysBack) ?? [], DATA_POINTS_PER_HOUR)},
      {user: userlist[3], cpr:"ddmmyy-xxx4", status: -1, medData: cgmMGDL_538.medianData(cgmMGDL_538.getDataNDaysBack(daysBack) ?? [], DATA_POINTS_PER_HOUR)}
    ]
)*/

const users = computed(() =>
    [ {user: userlist[0], cpr:"ddmmyy-xxx1", healthLevel: HealthLevel.Good ,medianDataInHours: dataToMedian(cgmToData(cgm_083), SPLIT_BY_DAY)},
      {user: userlist[1], cpr:"ddmmyy-xxx2", healthLevel: HealthLevel.Good, medianDataInHours: dataToMedian(cgmToData(cgm_123), SPLIT_BY_DAY)},
      {user: userlist[2], cpr:"ddmmyy-xxx3", healthLevel: HealthLevel.High, medianDataInHours: dataToMedian(cgmToData(cgm_200), SPLIT_BY_DAY)},
      {user: userlist[3], cpr:"ddmmyy-xxx4", healthLevel: HealthLevel.Low, medianDataInHours: dataToMedian(cgmToData(cgm_538), SPLIT_BY_DAY)}
    ]
)

const clickedItem = (id: Number) => {
  router.push("/DisplayPatientsList/patientInfo/" + (id))
}

</script>


<style scoped>

</style>