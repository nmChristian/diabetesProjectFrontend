<!-- Author: Christian -->
<!-- Description: Shows a patients name age and average data fro the last week, coloured depending on how well the
                  patient is doing, meant to be used in "DisplayPatientsFullList.vue"-->
<template>
  <div
      class="outerHolder"
      v-bind:class="{outerHolderSelected:(user._id.$oid === selected)}">
    <div class="icon">
      <Graph :svg="iconGraph(medianDataInHours, healthLevel, {})"/>
    </div>
    <div class="generalInfo">
      <p class="name">{{ user.first_name }}</p>
      <p v-if="doctor" class="cprNumber">{{ cpr }}</p>
      <p v-else class="age">{{ getAgeText(user.age) }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {UserDetails} from "@/services/db-types";
import Graph from "@/components/charts/Graph.vue";
import iconGraph from "@/services/graphs/icon-graph";

defineProps<{
  user: UserDetails,
  cpr: string,
  medianDataInHours: object,
  doctor: boolean,
  selected: string,
  healthLevel: number,
}>()

function getAgeText(age) {
  if (age === undefined) {
    return "Birthday not given"
  } else {
    return "age: " + String(age) + " years old"
  }
}

</script>

<style scoped>
.outerHolder {
  width: 300px;
  height: 80px;
  border: solid 1px #555;
  flex: 1;
  display: flex;
  background-color: #ffffff;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 1px;
}

.outerHolder:hover {
  background-color: #ececec;
}

.outerHolderSelected {
  width: 305px;
  height: 80px;
  border: solid 1px #555;
  margin-top: 3px;
  margin-bottom: 3px;
  flex: 1;
  display: flex;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #ececec;
}

.generalInfo {
  padding: 10px;
}

.icon {
  width: 90px;
  height: 70px;
  padding: 5px;
  place-self: center;
  display: inline;
}

.name {
  display: block;
  color: #181818;
  font-size: 22px;
}

.cprNumber {
  font-size: 18px;
  color: #757474;
  display: block;
}

.age {
  font-size: 18px;
  color: #757474;
  display: block;
}
</style>