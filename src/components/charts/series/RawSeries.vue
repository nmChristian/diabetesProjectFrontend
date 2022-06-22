<!-- Author: Jonas -->
<!-- Description: Component that shows all the sample data in simple line or bar graphs -->
<template>
  <DateIntervalSelector
      :text="d3.timeFormat('%d/%m')(cgm[0]?.[0] ?? 0) + ' - ' + d3.timeFormat('%d/%m')(cgm[cgm.length - 1]?.[0] ?? 0) "/>
  <div v-if="showAdvanced">
    <div class="graphs">
      <div v-for="dataset in datasets">
        <p>{{ dataset.title }}</p>
        <Graph
            :svg="dataset.graph"
        />
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {computed} from "vue";
import lineGraph from "@/services/graphs/generic/line-graph";
import Graph from "@/components/charts/Graph.vue";
import barGraph from "@/services/graphs/generic/bar-graph";
import * as d3 from "d3";
import DateIntervalSelector from "@/components/DateIntervalSelector.vue";

const props = defineProps<{
  cgm: DateValue[],
  meals: DateValue[],
  basal: DateValue[],
  bolus: DateValue[],
  showAdvanced: boolean
}>()
// Zip titles and values
const datasets = computed(() => titles.map((title, i) => ({
  title: title,
  data: values.value[i],
  graph: graphs.value[i]
})))

const titles = ["CGM", "MEALS", "BASAL", "BOLUS"]
const values = computed(() => [props.cgm, props.meals, props.basal, props.bolus])
const graphs = computed(() => values.value.map((data, i) => {
  if (i == 1 || i == 3)
    return barGraph(data, {graphLayout: graphLayout})
  else
    return lineGraph(data, {graphLayout: graphLayout})
}))

const graphLayout = new GraphLayout(1000, 150, 20, 20, 20, 40)
</script>

<style scoped>
</style>