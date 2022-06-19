<template xmlns="http://www.w3.org/1999/html">
	<div class=outerGridHolder>
      <div v-for="index in Math.floor((usersWithData.length+1)/2)">
        <div class="column">
          <patient-card
              :id="usersWithData[index].user._id.$oid"
              :age="usersWithData[index].user.age"
              :eGFR="usersWithData[index].eGFR"
              :hbalc="usersWithData[index].HbALc"
              :hypos="usersWithData[index].hypos"
              :name="usersWithData[index].user.first_name"
              :weight="'n/a'">
          </patient-card>
          <div v-if="(index-1)*2 + 1 < usersWithData.length">
            <patient-card
                :id="usersWithData[index+1].user._id.$oid"
                :age="usersWithData[index+1].user.age"
                :eGFR="usersWithData[index+1].eGFR"
                :hbalc="usersWithData[index+1].HbALc"
                :hypos="usersWithData[index+1].hypos"
                :name="usersWithData[index+1].user.first_name"
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
import type {UserDetails} from "@/services/core/dbtypes";
import PatientCard from "@/components/patientElements/PatientCard.vue";

class UserWithDate {
  user: UserDetails;
  eGFR: string | undefined;
  HbALc: string | undefined;
  hypos: string | undefined;
}

let usersWithData =ref([] as UserWithDate[]);

const accessiblelUsersPromise = backend.getViewabel();

accessiblelUsersPromise.then((accessiblelUsers : Array<UserDetails>)  => {

  for(let i = 0; i < accessiblelUsers.length; i++){
    let recivedUser = accessiblelUsers[i]
    let newUser = new UserWithDate()

    newUser.user = recivedUser

    newUser.eGFR = "n/a"
    newUser.HbALc = "n/a"
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