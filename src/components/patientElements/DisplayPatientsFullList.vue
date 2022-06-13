<template>
  <div>
    <ListViewPatientElement
        v-for="u in usersWithData"
        :user="u.user"
        :cpr = 'u.cpr'
        :medianDataInHours = 'u.medianDataInHours'
        :doctor="false"
        :selected="($route.params.id || 'a')"
        :healthLevel = 'u.healthLevel'
        @click="clickedItem(u.user._id.$oid)">
    </ListViewPatientElement>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'

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

  let tempList :  UserWithDate[] = []

  accessiblelUsers.forEach(user => {
    backend.getCGMDataPatient(daysBack,user._id.$oid).then(CGMForUser  => {
      let newUser = new UserWithDate()
      user.age =Math.round(Math.random()*100)

      newUser.user = user

      newUser.cpr = "Currently not used"

      //TODO Do some calculation
      newUser.healthLevel = Math.round(Math.random()*4)
      newUser.medianDataInHours = dataToMedian((CGMForUser), SPLIT_BY_DAY)

      tempList.push(newUser)

      if(tempList.length === accessiblelUsers.length){
        tempList.sort((a, b) => {
          if(a.healthLevel === b.healthLevel){
            return  (a.user.first_name).localeCompare(b.user.first_name);
          }
          if(a.healthLevel === 2)
            return 1
          if(b.healthLevel === 2){
            return -1
          }
          return (b.healthLevel || 0) - (a.healthLevel || 0)
        })
        usersWithData.value = tempList
      }
    })
  })

})



const clickedItem = (id: Number) => {
  router.push("/DisplayPatientsList/patientInfo/" + (id))
}

</script>


<style scoped>

</style>