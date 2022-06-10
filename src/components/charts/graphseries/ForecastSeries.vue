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
    <div style="display: flex">
      <div>
          <forecast-graph
              v-for="week in  [...weeksBack].reverse()"
              :data="dataSplitIntoIntervals.get(lastThreeIntervals[week]) ?? []"
              :time-interval="interval"
              :graph-layout="forecastLayout"
              :on-brush-end="brushEvent"
          />
      </div>
      <div style="margin: auto 50px;">
        <t-i-r-graph
            :occurrences="getCGMOccurrences(selectedData)"
            :colors="COLOR_SCHEME"
            :graph-layout="tirLayout"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ForecastGraph from "@/components/charts/ForecastGraph.vue";
import {computed, onMounted, ref} from "vue";
import type {Ref} from "vue"
import * as d3 from "d3";
import {GraphLayout} from "@/services/core/graphtypes";
import type {DateValue} from "@/services/core/datatypes";
import {getCGMOccurrences} from "@/services/core/datatypes";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {COLOR_SCHEME} from "@/services/core/shared";
import type {TimeInterval} from "d3";
import type {BrushSelection} from "d3-brush";

const interval = ref(d3.timeMonday)

const props = defineProps< {
  data: DateValue[],
}>()
const weeksBack = [0,1,2]
const lastDateInDataSet = computed( () => props.data.length === 0 ? new Date() : props.data[props.data.length - 1][0])
const lastThreeIntervals = computed( () => weeksBack.map<Date>(back => interval.value.offset(interval.value(lastDateInDataSet.value), - back)))
const dataSplitIntoIntervals = computed( () => d3.group(props.data, ([date,]) => interval.value(date)))

const tirLayout = new GraphLayout(50, 250)
const forecastLayout = new GraphLayout(1000,100, 15, 0, 5, 40)

// TIR methods
const getDataBack = (dateValues : DateValue[], timeInterval : TimeInterval, back : number) : DateValue[] =>
    dateValues.filter(([date,]) => date > timeInterval.offset(timeInterval(lastDateInDataSet.value), -back))


const lastThreeMondaysData = computed( () => getDataBack(props.data, d3.timeMonday, 2))
const lastDayData = computed( () => getDataBack(props.data, d3.timeDay, 1))

const selectedData = computed( () : DateValue[] => {
  if (datesData.value === undefined)
    return lastThreeMondaysData.value

  const [start, stop] = datesData.value
  return props.data.filter(([date,]) => date >= start && date <= stop)
})


const datesData : Ref<[Date, Date] | undefined> = ref(undefined)
// THis
let currentlySelected : any = null;
const brushEvent = (event : d3.D3BrushEvent<any>, graphData : any) => {
  const {group: newGroup, xScale} = graphData
  // Remove last selected
  if (currentlySelected?.group !== newGroup)
    currentlySelected?.brush.clear(currentlySelected.group)

  currentlySelected = { brush: event.target, group: newGroup }
  datesData.value = event.selection?.map<Date>(d => xScale.invert(d)) as [Date, Date] ;
}
</script>
