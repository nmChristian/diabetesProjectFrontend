<!-- Author: Jonas -->
<!-- Description: Component that contains 3 forecast graphs and a TIR graph.
                  also it creates settings for it and generates the data based on the settings itself -->
<template>
  <DateIntervalSelector :text="d3.timeFormat('%d/%m')(lastThreeIntervals[2]) + ' - ' + d3.timeFormat('%d/%m')(now)"/>
  <div class="forecast-series">
    <div v-if="showAdvanced">
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
            type="checkbox" name="meals-enabled"
            v-model="mealsEnabled"/>
        <label for="meals-enabled">Show meals</label>
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
          <p v-for="date in (selectedRange ?? [lastThreeIntervals[2], now])">
            <span class="day-of-week"> {{ d3.timeFormat("%a")(date) }} </span>
            <span class="time"> {{ d3.timeFormat("%H:%M")(date) }} </span>
            <span class="date"> {{ d3.timeFormat("%d/%m")(date) }}  </span>
          </p>
        </div>
        <Graph class="tir-graph" :svg="tirGraph(
            getCGMOccurrences(selectedData, cgmRanges),
            COLOR_SCHEME,
            {graphLayout: tirLayout, offset: 1, r: 1})"/>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import type {Ref} from "vue"
import {computed, ref} from "vue";
import type {TimeInterval} from "d3";
import * as d3 from "d3";
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {COLOR_SCHEME} from "@/services/graphs/shared";
import forecastGraph from "@/services/graphs/forecast-graph";
import Graph from "@/components/charts/Graph.vue";
import DateIntervalSelector from "@/components/DateIntervalSelector.vue";
import tirGraph from "@/services/graphs/generic/tir-graph";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {getCGMOccurrences} from "@/services/graphs/auxiliary/cgm";

const interval = ref(d3.timeMonday)
const mealsEnabled = ref(false)

// The start and stop date the brush has selected
const selectedRange: Ref<[Date, Date] | undefined> = ref(undefined)

const props = defineProps<{
  showAdvanced: boolean,
  cgm: DateValue[],
  meals: DateValue[],
  cgmRanges: CGMRanges,
}>()

// Layouts of the graphs
const tirLayout = new GraphLayout(50, 250)
const forecastLayout = new GraphLayout(900, 90, 15, 20, 20, 40)

// We give 3 weeks
const weeksBack = [0, 1, 2]
const lastThreeMondaysData = computed(() => getDataBack(props.cgm, d3.timeMonday, 2))

const now = new Date()

const lastThreeIntervals = computed(() => weeksBack.map<Date>(back => interval.value.offset(interval.value(now), -back)))
const cgmSplitIntoIntervals = computed(() => d3.group(props.cgm, ([date,]) => interval.value(date)))
const mealsSplitIntoIntervals = computed(() => d3.group(props.meals, ([date,]) => interval.value(date)))


// Returns DateValue[] of all the data that is after the given interval and back (eg. (d3.timeMonday, 2) returns data that is from 3 mondays back until today)
const getDataBack = (dateValues: DateValue[], timeInterval: TimeInterval, back: number): DateValue[] =>
    dateValues.filter(([date,]) => date > timeInterval.offset(timeInterval(now), -back))


// The array of the data selected
const selectedData = computed((): DateValue[] => {
  if (selectedRange.value === undefined)
    return lastThreeMondaysData.value

  const [start, stop] = selectedRange.value
  return props.cgm.filter(([date,]) => date >= start && date <= stop)
})



// The currently active graph with a brush
let currentGraph: any = null;

//TODO: MAYBE FIX ERROR, SOMETIMES REACH MAX CALLSTACK ERROR, THIS IS BECAUSE THE EVENT CALLS ITSELF RECURSIVELY AND CAN
// This event resets the other 2 graphs brushes, if their brushes were active.
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

// Generate the forecast graphs
const graphs = computed(() => {
      // Used to sync up all the axis'
      const mealMaxValue = weeksBack.reduce((max, week) => Math.max(d3.max(mealsSplitIntoIntervals.value.get(lastThreeIntervals.value[week]) ?? [], ([, value]) => value) ?? 0, max), 0)

      const graphObjects =
          [...weeksBack].reverse().map((week) => {
            const cgmData = cgmSplitIntoIntervals.value.get(lastThreeIntervals.value[week]) ?? []
            const mealsData = mealsSplitIntoIntervals.value.get(lastThreeIntervals.value[week]) ?? []
            return forecastGraph(cgmData, interval.value,
                props.cgmRanges,
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
  height: 600px;
}

.forecast-graphs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.forecast-graphs > div {
  flex: 1 1 auto;
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
  text-align: end;
  width: 90%;
  margin: 0 auto 10px auto;
  border-bottom: 2px solid black;
}

.interval-indicator span {
  margin-right: 5px;
}

.interval-indicator .date {
  font-style: italic;
}
</style>
