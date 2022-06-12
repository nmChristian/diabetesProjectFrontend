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
        :cgm="cgmInDateValue"
        :median-c-g-m-in-hours="medianCGMInHours"
        :meals="mealsInDateValue"
        :basal="basalInDateValue"
        :bolus="bolusInDateValue"
    />
  </div>
</template>

<script setup lang="ts">
import type {Ref} from "vue"
import {computed, onMounted, ref,} from "vue";
import type {DateValue, Point} from "@/services/core/datatypes"
import {
  addEdgesToSplit,
  bucketToMedian,
  mMolPerLToMgPerL,
  SPLIT_BY_DAY,
  timeSeriesToDateValue,
  toBuckets
} from "@/services/core/datatypes";
import backend from "@/services/backend";
import type {UserDetails} from "@/services/core/dbtypes";

// Loading data
let cgmInDateValue: Ref<never[] | DateValue[]> = ref([])
let mealsInDateValue: Ref<never[] | DateValue[]> = ref([])
let basalInDateValue: Ref<never[] | DateValue[]> = ref([])
let bolusInDateValue: Ref<never[] | DateValue[]> = ref([])

let userDetails: Ref<{} | UserDetails> = ref({})

onMounted(() => {
  loadData()
  loadUserDetails()
})

async function loadUserDetails() {
  userDetails.value = await backend.getUserDetails()
}

//, "basal", "meals", "bolus", "exercise"
async function loadData() {
  const response = await backend.getData(21, ["cgm", "meals", "basal", "bolus"])
  cgmInDateValue.value = timeSeriesToDateValue(response.cgm, mMolPerLToMgPerL)
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