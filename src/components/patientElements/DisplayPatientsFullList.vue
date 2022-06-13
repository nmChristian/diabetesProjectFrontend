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
import {ref} from 'vue'

import router from "@/router"
import type {DateValue, Point} from "@/services/core/datatypes"
import {bucketToMedian, SPLIT_BY_DAY, toBuckets, toDateValue} from "@/services/core/datatypes"
import {HealthLevel} from "@/services/core/shared";
import backend from "@/services/backend";
import type {UserDetails} from "@/services/core/dbtypes";

const daysBack = 28
const RESOLUTION = 96

const dataToMedian = (data: DateValue[], split: number): Point[] =>
    bucketToMedian(toBuckets(data, split, RESOLUTION))


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