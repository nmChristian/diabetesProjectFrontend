<template>
  <div>
    <h2>Raw Data Graph Series</h2>
    <div v-for="dataset in datasets">
      <p>{{dataset.title}}</p>
      <graph
          :svg="dataset.graph"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import type {DateValue} from "@/services/core/datatypes";
import {GraphLayout} from "@/services/core/graphtypes";
import {computed} from "vue";
import dotGraph from "@/services/graphs/generic/dotGraph";
import lineGraph from "@/services/graphs/generic/lineGraph";
import Graph from "@/components/charts/shared/Graph.vue";
import barGraph from "@/services/graphs/generic/barGraph";

const props = defineProps<{
  cgm: DateValue[],
  meals: DateValue[],
  basal: DateValue[],
  bolus: DateValue[],
}>()
// Zip titles and values
const datasets = computed ( () => titles.map((title, i) => ({title: title, data: values.value[i], graph: graphs.value[i]})))

const titles = ["CGM", "MEALS", "BASAL", "BOLUS"]
const values = computed( () => [props.cgm, props.meals, props.basal, props.bolus])
const graphs = computed( () => values.value.map((data, i)  => {
  if (i == 3)
    return dotGraph(data, {graphLayout : graphLayout} )
  if (i == 1)
    return barGraph(data, {graphLayout : graphLayout})
  else
    return lineGraph(data, {graphLayout : graphLayout} )
}))

const graphLayout = new GraphLayout(1000, 150, 20, 20, 20, 40)
</script>
