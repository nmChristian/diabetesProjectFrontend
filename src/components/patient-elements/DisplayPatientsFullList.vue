<!-- Author: Christian -->
<!-- Description: Takes information from the backend and uses it to create a list of "ListViewPatientElement.vue" -->
<template>
  <div>
    <ListViewPatientElement
        v-for="u in usersWithData"
        :user="u.user"
        :cpr='u.cpr'
        :medianDataInHours='u.medianDataInHours'
        :doctor="false"
        :selected="($route.params.id || 'a')"
        :healthLevel='u.healthLevel'
        @click="clickedItem(u.user._id.$oid)">
    </ListViewPatientElement>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

import router from "@/index"
import backend from "@/services/backend";
import type {UserDetails} from "@/services/db-types";
import {bucketToMedian, toBuckets} from "@/services/graphs/auxiliary/converter";
import {mMolPerLToMgPerDL} from "@/services/graphs/auxiliary/cgm";

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


let usersWithData = ref([] as UserWithDate[]);

const accessiblelUsersPromise = backend.getViewabel();


let dataForAllUsers = backend.getPreviews();

function medianDataToMedianAndData(values: number[]): Point[] {
  const re = []
  for (let i = 0; i < values.length; i++) {
    re.push([i, mMolPerLToMgPerDL(values[i])] as Point)
  }
  return re
}

function calcHealthLevel(problems: number[]) {
  let count = 0;
  //TODO måske erstart med en grå
  if (problems == undefined) {
    return 2
  }
  for (let i = 0; i < problems.length; i++) {
    if (problems[i] === 0 || problems[i] == 4) {
      return 0
    }
    count++
  }
  if (count >= 2) {
    return 0
  }
  return 2 - count
}

accessiblelUsersPromise.then((accessiblelUsers: Array<UserDetails>) => {

  let tempList: UserWithDate[] = []

  if (accessiblelUsers.length === 1) {
    router.replace('/patient-info/' + accessiblelUsers[0]._id.$oid)
    return
  }

  dataForAllUsers.then((returnedDAta: { _id: any, patient: any, values: number[], problems: number [] }[]) => {
    for (let i = 0; i < accessiblelUsers.length; i++) {
      for (let j = 0; j < accessiblelUsers.length; j++) {
        if (accessiblelUsers[i]._id.$oid === returnedDAta[j].patient.$oid) {
          let recivedUser = accessiblelUsers[i]
          let newUser = new UserWithDate()


          newUser.user = recivedUser

          newUser.cpr = "Currently not used"
          newUser.healthLevel = calcHealthLevel(returnedDAta[j].problems)
          newUser.medianDataInHours = medianDataToMedianAndData(returnedDAta[j].values)

          tempList.push(newUser)
        }
      }
    }

    tempList.sort((a, b) => {
      if (a.healthLevel === b.healthLevel) {
        return (a.user.first_name).localeCompare(b.user.first_name);
      }

      return (a.healthLevel || 0) - (b.healthLevel || 0)
    })
    usersWithData.value = tempList
  })


})


const clickedItem = (id: Number) => {
  router.push("/display-patients-list/patient-info/" + (id))
}

</script>


<style scoped>

</style>