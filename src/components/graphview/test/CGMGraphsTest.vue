<template>
  <div>
    <h2>Get last three mondays </h2>
    <p>{{ lastThreeMondays }}</p>

    <h1>Vejrudsigt graf</h1>
    <forecast-graph
        :data="data"
        :graph-layout="graphLayout"
    />
    <forecast-graph
        :data="data"
        :graph-layout="graphLayout"
    />
    <forecast-graph
        :data="data"
        :graph-layout="graphLayout"
    />
  </div>
</template>

<script setup lang="ts">
import type {DateValue, Point} from "@/services/core/datatypes";
import {GraphLayout} from "@/services/core/graphtypes";
import ForecastGraph from "@/components/charts/ForecastGraph.vue";
import {computed} from "vue";
import * as d3 from "d3";
import {getLastMondays} from "@/services/core/dateMethods";

const props = defineProps<{
  data: DateValue[],
  medianDataInHours: Point[]}>
()

const lastDateInDataSet = computed( () => props.data.length === 0 ? new Date() : props.data[props.data.length - 1][0])
const lastThreeMondays = computed( () => [0,1,2].map<Date>(back => getLastMondays(lastDateInDataSet.value, back)))


const graphLayout = new GraphLayout(1000,100, 30, 40, 40, 40)

</script>
