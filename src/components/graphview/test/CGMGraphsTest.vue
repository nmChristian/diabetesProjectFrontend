<template>
  <div>
    <h1>Vejrudsigt graf</h1>

    <div style ="display: grid; place-items: center;">
      <p>Split by</p>
      <select v-model="interval" style="font-size: 16px; text-align: center; width: 300px; height: 35px; border-radius: 20px;" >
        <option :value="d3.timeMonday">Monday</option>
        <option :value="d3.timeSunday">Sunday</option>
        <option :value="d3.timeMonth">Month</option>
        <option :value="d3.timeHour">Hour</option>
      </select>
    </div>
      <br>

    <forecast-graph
        :data="dataSplitIntoIntervals.get(lastThreeIntervals[2]) ?? []"
        :time-interval="interval"
        :graph-layout="graphLayout"
    />
    <forecast-graph
        :data="dataSplitIntoIntervals.get(lastThreeIntervals[1]) ?? []"
        :time-interval="interval"
        :graph-layout="graphLayout"
    />
    <forecast-graph
        :data="dataSplitIntoIntervals.get(lastThreeIntervals[0]) ?? []"
        :time-interval="interval"
        :graph-layout="graphLayout"
    />

  </div>
</template>

<script setup lang="ts">
import type {DateValue, Point} from "@/services/core/datatypes";
import {GraphLayout} from "@/services/core/graphtypes";
import ForecastGraph from "@/components/charts/ForecastGraph.vue";
import {computed, ref} from "vue";
import * as d3 from "d3";


const interval = ref(d3.timeMonday)

const props = defineProps<{
  data: DateValue[],
  medianDataInHours: Point[]}>
()
const lastDateInDataSet = computed( () => props.data.length === 0 ? new Date() : props.data[props.data.length - 1][0])
const lastThreeIntervals = computed( () => [0,1,2].map<Date>(back => interval.value.offset(interval.value(lastDateInDataSet.value), - back)))
const dataSplitIntoIntervals = computed( () => d3.group(props.data, ([date,]) => interval.value(date)))

const graphLayout = new GraphLayout(1000,100, 0, 40, 20, 40)

</script>
