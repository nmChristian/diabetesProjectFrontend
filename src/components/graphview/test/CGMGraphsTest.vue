<template>
  <div>
    <h2>Days since last data </h2>
    <p>{{daysSinceLastData}}</p>

    <h1>Mandage</h1>
    <h3>{{mondeyThisWeek}}</h3>
    <p>{{weeksFor}}</p>
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

const props = defineProps<{
  data: DateValue[],
  medianDataInHours: Point[]}>
()
const daysSinceLastData = computed(() => d3.timeDays(new Date("2022-01-29"), new Date()).length)
const mondeyThisWeek = computed(() => props.data.length === 0 ? new Date() : d3.timeMondays((props.data[props.data.length - 1][0]), new Date(),1))
const weeksFor = computed(() => props.data.length === 0 ? new Date() : d3.timeDay.offset(new Date(),1))

const graphLayout = new GraphLayout(1000,100, 30, 40, 40, 40)

</script>
