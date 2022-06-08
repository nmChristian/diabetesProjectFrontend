<template>
  <div>
    <h1>Vejrudsigt graf</h1>
    <forecast-graph
        :data="dataSplitIntoMondays.get(lastThreeMondays[2]) ?? []"
        :graph-layout="graphLayout"
    />
    <forecast-graph
        :data="dataSplitIntoMondays.get(lastThreeMondays[1]) ?? []"
        :graph-layout="graphLayout"
    />
    <forecast-graph
        :data="dataSplitIntoMondays.get(lastThreeMondays[0]) ?? []"
        :graph-layout="graphLayout"
    />

  </div>
</template>

<script setup lang="ts">
import type {DateValue, Point} from "@/services/core/datatypes";
import {GraphLayout} from "@/services/core/graphtypes";
import ForecastGraph from "@/components/charts/ForecastGraph.vue";
import {computed} from "vue";
import {getLastMondays} from "@/services/core/dateMethods";
import * as d3 from "d3";

const props = defineProps<{
  data: DateValue[],
  medianDataInHours: Point[]}>
()

const lastDateInDataSet = computed( () => props.data.length === 0 ? new Date() : props.data[props.data.length - 1][0])
const lastThreeMondays = computed( () => [0,1,2].map<Date>(back => getLastMondays(lastDateInDataSet.value, back)))
const dataSplitIntoMondays = computed( () => d3.group(props.data, ([date,]) => d3.timeMonday(date)))

const graphLayout = new GraphLayout(1000,100, 0, 40, 20, 40)

</script>
