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
import {
  bucketToMedian,
  mMolPerLToMgPerL,
  SPLIT_BY_DAY,
  timeSeriesToDateValue,
  toBuckets,
  toDateValue
} from "@/services/core/datatypes"
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


let dataForAllUsers = backend.getCGMDataMGDLForAllWiewabel(daysBack);

function medianDataToMedianAndData(values: number[]) : Point[]{
  const re = []
  for(let i = 0; i < values.length; i++){
    re.push([i,  mMolPerLToMgPerL(values[i])] as Point)
  }
  return re
}

function calcHealthLevel(problems: number[]){
  let count = 0;
  for(let i =0; i < problems.length; i++){
    if(problems[i] ===0 || problems[i] == 4){
      return 2
    }
    count++
  }
  if(count >=2){
    return 2
  }
  return count
}

accessiblelUsersPromise.then((accessiblelUsers : Array<UserDetails>)  => {

  let tempList :  UserWithDate[] = []

  dataForAllUsers.then((returnedDAta : {_id: any , patient: any ,values: number[],problems: number []}[]) => {
    console.log(returnedDAta)
    for(let i = 0; i < accessiblelUsers.length; i++){
        for(let j = 0; j < accessiblelUsers.length; j++){
          if(accessiblelUsers[i]._id.$oid === returnedDAta[j].patient.$oid){
            let recivedUser = accessiblelUsers[i]
            let newUser = new UserWithDate()


            newUser.user = recivedUser

            newUser.cpr = "Currently not used"
            //TODO Do some calculation
            newUser.healthLevel = calcHealthLevel(returnedDAta[j].problems)
            //newUser.healthLevel = Math.round(Math.random()*4)
            newUser.medianDataInHours = medianDataToMedianAndData(returnedDAta[j].values)

            tempList.push(newUser)
          }
        }
    }

    tempList.sort((a, b) => {
      if(a.healthLevel === b.healthLevel){
        return  (a.user.first_name).localeCompare(b.user.first_name);
      }
    
      return  (b.healthLevel || 0) - (a.healthLevel || 0)
    })
    usersWithData.value = tempList
  })


})



const clickedItem = (id: Number) => {
  router.push("/DisplayPatientsList/patientInfo/" + (id))
}

</script>


<style scoped>

</style>