<template>
  <div>
    <!-- TODO soter listen efter hvor kritisk de er -->

    <ListViewPatientElement
        v-for="u in usersWithData"
        :user="u.user"
        :cpr = 'u.cpr'
        :medianDataInHours = 'u.medianDataInHours'
        :doctor="false"
        :selected="($route.params.id)"
        :healthLevel = 'u.healthLevel'
        @click="clickedItem(u.user._id.$oid)">
    </ListViewPatientElement>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'

import cgm_083 from "@/assets/demo/users/cgm_083.json" // 95% 5%
import cgm_123 from "@/assets/demo/users/cgm_123.json" // 76% 21% 3%
import cgm_200 from "@/assets/demo/users/cgm_200.json" // 2% 80% 15% 4%
import cgm_538 from "@/assets/demo/users/cgm_538.json" // Lowest and nice 100%
import {User} from "@/services/user"
import router from "@/router"
import type {DateValue, Point} from "@/services/core/datatypes"
import {bucketToMedian, SPLIT_BY_DAY, toBuckets, toDateValue} from "@/services/core/datatypes"
import {HealthLevel} from "@/services/core/shared";
import backend from "@/services/backend";
import {UserDetails} from "@/services/core/dbtypes";

const daysBack = 28
const RESOLUTION = 96
const userlist = [
    new User(0, "Alexander", 199),
    new User(1, "Christian", 21),
    new User(2, "Niels", 34),
    new User(3, "Jonas", 21)]

const cgmToData  = (cgmData : {date: string, cgm: number}[]) : DateValue[] =>
    toDateValue(cgmData, (data => [new Date(data.date), data.cgm * 18]))

const dataToMedian = (data: DateValue[], split: number): Point[] =>
    bucketToMedian(toBuckets(data, split, RESOLUTION))


const users = computed(() =>
    [ {user: userlist[0], cpr:"ddmmyy-xxx1", healthLevel: HealthLevel.Good ,medianDataInHours: dataToMedian(cgmToData(cgm_083), SPLIT_BY_DAY)},
      {user: userlist[1], cpr:"ddmmyy-xxx2", healthLevel: HealthLevel.Good, medianDataInHours: dataToMedian(cgmToData(cgm_123), SPLIT_BY_DAY)},
      {user: userlist[2], cpr:"ddmmyy-xxx3", healthLevel: HealthLevel.High, medianDataInHours: dataToMedian(cgmToData(cgm_200), SPLIT_BY_DAY)},
      {user: userlist[3], cpr:"ddmmyy-xxx4", healthLevel: HealthLevel.Low, medianDataInHours: dataToMedian(cgmToData(cgm_538), SPLIT_BY_DAY)}
    ]
)

class UserWithDate {
  user: UserDetails | undefined;
  cpr: string | undefined;
  healthLevel: number | undefined;
  medianDataInHours: any;
}


let usersWithData =ref([] as UserWithDate[]);

const accessiblelUsersPromise = backend.getViewvabel();


accessiblelUsersPromise.then((accessiblelUsers : Array<UserDetails>)  => {

  accessiblelUsers.forEach(user => {
    backend.getCGMDataPatient(daysBack,user._id.$oid).then(CGMForUser  => {
      let newUser = new UserWithDate()
      user.age =Math.round(Math.random()*100)

      newUser.user = user

      newUser.cpr = "Currently not used"

      //Do some calculation
      newUser.healthLevel = 1
      newUser.medianDataInHours = dataToMedian((CGMForUser), SPLIT_BY_DAY)

      usersWithData.value.push(newUser)
    })
  })
})

const clickedItem = (id: Number) => {
  router.push("/DisplayPatientsList/patientInfo/" + (id))
}

</script>


<style scoped>

</style>