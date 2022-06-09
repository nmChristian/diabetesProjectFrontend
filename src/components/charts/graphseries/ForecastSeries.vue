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

    <div class="side-by-side">
      <div>
        <forecast-graph
            :data="dataSplitIntoIntervals.get(lastThreeIntervals[2]) ?? []"
            :time-interval="interval"
            :graph-layout="forecastLayout"
        />
        <forecast-graph
            :data="dataSplitIntoIntervals.get(lastThreeIntervals[1]) ?? []"
            :time-interval="interval"
            :graph-layout="forecastLayout"
        />
        <forecast-graph
            :data="dataSplitIntoIntervals.get(lastThreeIntervals[0]) ?? []"
            :time-interval="interval"
            :graph-layout="forecastLayout"
        />
      </div>
      <div style="margin: auto 50px;">
        <t-i-r-graph
            :occurrences="getCGMOccurrences(lastThreeMondaysData)"
            :colors="COLOR_SCHEME"
            :graph-layout="tirLayout"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ForecastGraph from "@/components/charts/ForecastGraph.vue";
import {computed, ref} from "vue";
import * as d3 from "d3";
import {GraphLayout} from "@/services/core/graphtypes";
import type {DateValue} from "@/services/core/datatypes";
import {getCGMOccurrences} from "@/services/core/datatypes";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {COLOR_SCHEME} from "@/services/core/shared";
import type {TimeInterval} from "d3";

const interval = ref(d3.timeMonday)

const props = defineProps< {
  data: DateValue[],
}>()

const lastDateInDataSet = computed( () => props.data.length === 0 ? new Date() : props.data[props.data.length - 1][0])
const lastThreeIntervals = computed( () => [0,1,2].map<Date>(back => interval.value.offset(interval.value(lastDateInDataSet.value), - back)))
const dataSplitIntoIntervals = computed( () => d3.group(props.data, ([date,]) => interval.value(date)))

const tirLayout = new GraphLayout(50, 250)
const forecastLayout = new GraphLayout(1000,100, 15, 0, 5, 40)

// TIR methods
const getDataBack = (dateValues : DateValue[], timeInterval : TimeInterval, back : number) : DateValue[] =>
    dateValues.filter(([date,]) => date > timeInterval.offset(timeInterval(lastDateInDataSet.value), -back))


const lastThreeMondaysData = computed( () => getDataBack(props.data, d3.timeMonday, 2))
const lastDayData = computed( () => getDataBack(props.data, d3.timeDay, 1))
const frequencies = computed(() => getCGMOccurrences(getDataBack(props.data, d3.timeDay, -1)))


</script>


<style scoped>
div.side-by-side {
  display: flex;
}
</style>
<style>
.fem {
  border: solid blue 10px;
}
.fem:hover {
  border: solid red 10px;
}
</style>