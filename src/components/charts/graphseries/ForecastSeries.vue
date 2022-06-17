<template>
  <div class="forecast-series">
    <div v-if="showAdvanced">
      <h2>Forecast Graph</h2>
      <div style="display: grid; place-items: center;">
        <p>Split by</p>
        <select v-model="interval"
                style="font-size: 16px; text-align: center; width: 300px; height: 35px; border-radius: 20px;">
          <option :value="d3.timeMonday">Monday</option>
          <option :value="d3.timeSunday">Sunday</option>
        </select>
      </div>
      <div>
        <input
            type="checkbox" name="mealsEnabled"
            v-model="mealsEnabled"/>
        <label for="mealsEnabled">Show meals</label>
      </div>
      <br>
    </div>

    <div class="graphs">
      <div class="forecast-graphs">
        <Graph
            v-for="(graph, i) in graphs.values()"
            :svg="graph.svg"/>
      </div>
      <div class="selection-group">
        <div class="interval-indicator">
          <p v-for="date in (selectedRange ?? [lastThreeIntervals[2], lastDateInDataSet])">
            {{ d3.timeFormat("%a %H:%M [%d/%m]")(date) }}</p>
        </div>
        <TIRGraph class="tir-graph"
            :colors="COLOR_SCHEME"
            :graph-layout="tirLayout"
            :occurrences="getCGMOccurrences(selectedData)"
                  :rotate="true"
            :offset="1"
            :rx="1"
            :ry="1"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import type {Ref} from "vue"
import {computed, ref} from "vue";
import type {TimeInterval} from "d3";
import * as d3 from "d3";
import {GraphLayout} from "@/services/core/graphtypes";
import type {DateValue} from "@/services/core/datatypes";
import {getCGMOccurrences} from "@/services/core/datatypes";
import {COLOR_SCHEME} from "@/services/core/shared";
import forecastGraph from "@/services/graphs/forecastGraph";
import Graph from "@/components/charts/shared/Graph.vue";

const interval = ref(d3.timeMonday)
const mealsEnabled = ref(false)
const props = defineProps<{
  showAdvanced: boolean,
  cgm: DateValue[],
  meals: DateValue[],
}>()
const weeksBack = [0, 1, 2]
const lastDateInDataSet = computed(() => props.cgm.length === 0 ? new Date() : props.cgm[props.cgm.length - 1][0])
const lastThreeIntervals = computed(() => weeksBack.map<Date>(back => interval.value.offset(interval.value(lastDateInDataSet.value), -back)))

const cgmSplitIntoIntervals = computed(() => d3.group(props.cgm, ([date,]) => interval.value(date)))
const mealsSplitIntoIntervals = computed(() => d3.group(props.meals, ([date,]) => interval.value(date)))

const tirLayout = new GraphLayout(50, 250)
const width = 900, marginLeft = 40, marginRight = 20
const forecastLayout = new GraphLayout(width, 90, 15, marginRight, 20, marginLeft)

// TIR methods
const getDataBack = (dateValues: DateValue[], timeInterval: TimeInterval, back: number): DateValue[] =>
    dateValues.filter(([date,]) => date > timeInterval.offset(timeInterval(lastDateInDataSet.value), -back))


const lastThreeMondaysData = computed(() => getDataBack(props.cgm, d3.timeMonday, 2))

const selectedData = computed((): DateValue[] => {
  if (selectedRange.value === undefined)
    return lastThreeMondaysData.value

  const [start, stop] = selectedRange.value
  return props.cgm.filter(([date,]) => date >= start && date <= stop)
})


const selectedRange: Ref<[Date, Date] | undefined> = ref(undefined)
// THis
let currentGraph: any = null;

//TODO: FIX ERROR, SOMETIMES REACH MAX CALLSTACK ERROR, THIS IS BECAUSE THE EVENT CALLS ITSELF RECURSIVELY AND CAN
const brushEvent = (event: d3.D3BrushEvent<any>) => {
  const nextGraph = graphs.value.get(event.target)

  // Clear active graph
  if (nextGraph !== currentGraph)
    currentGraph?.brush.clear(currentGraph.brushGroup)

  // Set data for the tir graph
  //@ts-ignore
  selectedRange.value = event.selection?.map(nextGraph.xScale.invert) as [Date, Date]

  currentGraph = nextGraph
}
const graphs = computed(() => {
      // Used to sync up all the axis'
      const mealMaxValue = weeksBack.reduce((max, week) => Math.max(d3.max( mealsSplitIntoIntervals.value.get(lastThreeIntervals.value[week]) ?? [], ([, value]) => value) ?? 0,max), 0)

      const graphObjects =
          [...weeksBack].reverse().map((week) => {
            const cgmData = cgmSplitIntoIntervals.value.get(lastThreeIntervals.value[week]) ?? []
            const mealsData = mealsSplitIntoIntervals.value.get(lastThreeIntervals.value[week]) ?? []
            return forecastGraph(cgmData, interval.value,
                {
                  graphLayout: forecastLayout,
                  onBrushEnd: brushEvent,
                  mealsData: mealsEnabled.value ? mealsData : [],
                  mealMaxValue: mealMaxValue
                })
          })
      return new Map(graphObjects.map((graph) => [graph.brush, graph]))
    }
)


</script>

<style scoped>
.graphs {
  display: flex;
}
.forecast-graphs {
  flex: 1 0 auto;
}
.selection-group {
  display: flex;
  flex-direction: column;

  flex-basis: 130px;
  font-size: 14px;
}
.tir-graph {
  width: 50px;
  margin: auto;
}

.interval-indicator {
  text-align: center;
  width: 90%;
  margin: 0 auto 10px auto;
  border-bottom: 3px solid black;
}

</style>
