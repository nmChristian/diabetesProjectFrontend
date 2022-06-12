<template>
  <div>
    <h2>Raw Data Graph Series</h2>
    <div v-for="dataset in datasets">
      <p>{{dataset.title}}</p>
    <line-graph
                :data="dataset.data"
                :graph-layout="graphLayout"
    />
    </div>
  </div>

</template>

<script setup lang="ts">
import type {DateValue} from "@/services/core/datatypes";
import LineGraph from "@/components/charts/generic/LineGraph.vue";
import {GraphLayout} from "@/services/core/graphtypes";
import {computed} from "vue";

const props = defineProps<{
  cgm: DateValue[],
  meals: DateValue[],
  basal: DateValue[],
  bolus: DateValue[],
}>()
// Zip titles and values
const datasets = computed ( () => titles.map((title, i) => ({title: title, data: values.value[i]})))

const titles = ["CGM", "MEALS", "BASAL", "BOLUS"]
const values = computed( () => [props.cgm, props.meals, props.basal, props.bolus])
const graphLayout = new GraphLayout(800, 100, 20, 0, 20, 40)
</script>
