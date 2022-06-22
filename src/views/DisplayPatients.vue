<!-- Author: Christian -->
<!-- Description: Shows available patients and shows them in a grid with a brief overview -->
<template xmlns="http://www.w3.org/1999/html">
  <div class=outerGridHolder>
    <div v-for="index in Math.floor((usersWithData.length+1)/2)">
      <div class="column">
        <patient-card
            :id="usersWithData[(index-1)*2].user._id.$oid"
            :age="usersWithData[(index-1)*2].user.age"
            :eGFR="usersWithData[(index-1)*2].eGFR"
            :hba1c="usersWithData[(index-1)*2].HbA1c"
            :hypos="usersWithData[(index-1)*2].hypos"
            :name="usersWithData[(index-1)*2].user.first_name"
            :weight="'n/a'">
        </patient-card>
        <div v-if="(index-1)*2 + 1 < usersWithData.length">
          <patient-card
              :id="usersWithData[(index-1)*2+1].user._id.$oid"
              :age="usersWithData[(index-1)*2+1].user.age"
              :eGFR="usersWithData[(index-1)*2+1].eGFR"
              :hba1c="usersWithData[(index-1)*2+1].HbA1c"
              :hypos="usersWithData[(index-1)*2+1].hypos"
              :name="usersWithData[(index-1)*2+1].user.first_name"
              :weight="'n/a'">
          </patient-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import backend from "@/services/backend";
import type {UserDetails} from "@/services/db-types";
import {defaultUserDetails} from "@/services/db-types";
import PatientCard from "@/components/patient-elements/PatientCard.vue";

class UserWithData {
  user: UserDetails = defaultUserDetails;
  eGFR: string | undefined;
  HbA1c: string | undefined;
  hypos: string | undefined;
}

let usersWithData = ref([] as UserWithData[]);

const accessiblelUsersPromise = backend.getViewabel();

accessiblelUsersPromise.then((accessiblelUsers: Array<UserDetails>) => {

  for (let i = 0; i < accessiblelUsers.length; i++) {
    let recivedUser = accessiblelUsers[i]
    let newUser = new UserWithData()

    newUser.user = recivedUser

    newUser.eGFR = "n/a"
    newUser.HbA1c = "n/a"
    newUser.hypos = "n/a"

    usersWithData.value.push(newUser)
  }
})

</script>


<style scoped>
.column {
  display: flex;
}

.outerGridHolder {
  margin: auto;
  padding-top: 20px;
  width: 60%;
  min-width: 740px;
  max-width: 900px;
}
</style>