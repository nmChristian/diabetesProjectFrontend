<!-- Author: Jonas -->
<!-- Description: View used to test graphs, this is hidden from the patient and doctor, can only be reached through url /graph-demo -->
<template>
  <div>
    <nav>
      <router-link :to="{name: 'graphview.cgmgraphstest'}">CGM Graphs</router-link>
      <router-link :to="{name: 'graphview.icontest'}">Icon</router-link>
      <router-link :to="{name: 'graphview.linetest'}">Line</router-link>
      <router-link :to="{name: 'graphview.quantiletest'}">Quantile</router-link>
      <router-link :to="{name: 'graphview.tirtest'}">TIR (Time in Range)</router-link>
    </nav>

    <div class="user-info">
      <h2>Welcome {{ userDetails.first_name }} </h2>
      <p class="user-id"> with id {{ userDetails.last_name }}</p>
    </div>

    <router-view
        :basal="basalInDateValue"
        :bolus="bolusInDateValue"
        :cgm="cgmInDateValue"
        :meals="mealsInDateValue"
        :median-c-g-m-in-hours="medianCGMInHours"
        :cgm-ranges="[[0,54],[54,70],[70,180],[180,250],[250,undefined]]"
    />
  </div>
</template>

<script lang="ts" setup>
import type {Ref} from "vue"
import {computed, onMounted, ref,} from "vue";
import backend from "@/services/backend";
import type {UserDetails} from "@/services/db-types";
import {bucketToMedian, timeSeriesToDateValue, toBuckets} from "@/services/graphs/auxiliary/converter";
import {addEdgesToSplit} from "@/services/graphs/auxiliary/edges";
import {mMolPerLToMgPerDL} from "@/services/graphs/auxiliary/cgm";
import {SPLIT_BY_DAY} from "@/services/graphs/shared";

// Loading data
let cgmInDateValue: Ref<DateValue[]> = ref([])
let mealsInDateValue: Ref<DateValue[]> = ref([])
let basalInDateValue: Ref<DateValue[]> = ref([])
let bolusInDateValue: Ref<DateValue[]> = ref([])

let userDetails: Ref<{} | UserDetails> = ref({})

onMounted(() => {
  loadData()
  loadUserDetails()
})

async function loadUserDetails() {
  const result = await backend.getUserDetails()
  if (result) {
    userDetails.value = result
  }
}

//, "basal", "meals", "bolus", "exercise"
async function loadData() {
  const response = await backend.getData(21, ["cgm", "meals", "basal", "bolus"])
  cgmInDateValue.value = timeSeriesToDateValue(response.cgm, mMolPerLToMgPerDL)
  mealsInDateValue.value = timeSeriesToDateValue(response.meals)
  basalInDateValue.value = timeSeriesToDateValue(response.basal)
  bolusInDateValue.value = timeSeriesToDateValue(response.bolus)
}

const RESOLUTION = 96
const dataToMedian = (data: DateValue[], split: number): Point[] => {
  const splitData = toBuckets(data, split, RESOLUTION)
  const median: Point[] = bucketToMedian(splitData)
  addEdgesToSplit(median, split)
  return median
}
const medianCGMInHours = computed(() =>
    cgmInDateValue.value.length != 0 ?
        dataToMedian(cgmInDateValue.value, SPLIT_BY_DAY) :
        []
)


</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>