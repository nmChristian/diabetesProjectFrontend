<template>
  <div>
    <h1>Vejrudsigt graf</h1>
    <forecast-graph
        :data="dataSplitIntoIntervals.get(lastThreeIntervals[2]) ?? []"
        :time-interval="timeInterval"
        :graph-layout="graphLayout"
    />
    <forecast-graph
        :data="dataSplitIntoIntervals.get(lastThreeIntervals[1]) ?? []"
        :time-interval="timeInterval"
        :graph-layout="graphLayout"
    />
    <forecast-graph
        :data="dataSplitIntoIntervals.get(lastThreeIntervals[0]) ?? []"
        :time-interval="timeInterval"
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
const timeInterval = d3.timeFriday
const lastDateInDataSet = computed( () => props.data.length === 0 ? new Date() : props.data[props.data.length - 1][0])
const lastThreeIntervals = computed( () => [0,1,2].map<Date>(back => timeInterval.offset(timeInterval(lastDateInDataSet.value), - back)))
const dataSplitIntoIntervals = computed( () => d3.group(props.data, ([date,]) => timeInterval(date)))

const graphLayout = new GraphLayout(1000,100, 0, 40, 20, 40)

</script>
