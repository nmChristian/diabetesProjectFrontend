<template>
  <div class="forecast-series">
    <h2>Vejrudsigt graf</h2>

    <div style="display: grid; place-items: center;">
      <p>Split by</p>
      <select v-model="interval"
              style="font-size: 16px; text-align: center; width: 300px; height: 35px; border-radius: 20px;">
        <option :value="d3.timeMonday">Monday</option>
        <option :value="d3.timeSunday">Sunday</option>
        <option :value="d3.timeMonth">Month</option>
        <option :value="d3.timeHour">Hour</option>
      </select>
    </div>
    <br>
    <div style="display: flex; justify-content: center;">
      <div>
        <Graph
            v-for="graph in graphs.values()"
            :svg="graph.svg"
        />
      </div>
      <div style="margin: auto 50px;">
        <t-i-r-graph
            :colors="COLOR_SCHEME"
            :graph-layout="tirLayout"
            :occurrences="getCGMOccurrences(selectedData)"
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

const props = defineProps<{
  data: DateValue[],
}>()
const weeksBack = [0, 1, 2]
const lastDateInDataSet = computed(() => props.data.length === 0 ? new Date() : props.data[props.data.length - 1][0])
const lastThreeIntervals = computed(() => weeksBack.map<Date>(back => interval.value.offset(interval.value(lastDateInDataSet.value), -back)))
const dataSplitIntoIntervals = computed(() => d3.group(props.data, ([date,]) => interval.value(date)))

const tirLayout = new GraphLayout(50, 250)
const forecastLayout = new GraphLayout(1000, 100, 15, 0, 5, 40)

// TIR methods
const getDataBack = (dateValues: DateValue[], timeInterval: TimeInterval, back: number): DateValue[] =>
    dateValues.filter(([date,]) => date > timeInterval.offset(timeInterval(lastDateInDataSet.value), -back))


const lastThreeMondaysData = computed(() => getDataBack(props.data, d3.timeMonday, 2))
const lastDayData = computed(() => getDataBack(props.data, d3.timeDay, 1))

const selectedData = computed((): DateValue[] => {
  if (datesData.value === undefined)
    return lastThreeMondaysData.value

  const [start, stop] = datesData.value
  return props.data.filter(([date,]) => date >= start && date <= stop)
})


const datesData: Ref<[Date, Date] | undefined> = ref(undefined)
// THis
let currentGraph: any = null;

const brushEvent = (event: d3.D3BrushEvent<any>) => {
  const nextGraph = graphs.value.get(event.target)

  // Clear active graph
  if (nextGraph !== currentGraph)
    currentGraph?.brush.clear(currentGraph.brushGroup)

  // Set data for the tir graph
  //@ts-ignore
  datesData.value = event.selection?.map(nextGraph.xScale.invert) as [Date, Date]

  currentGraph = nextGraph
}
const graphs = computed(() => {
      const graphObjects =
          [...weeksBack].reverse().map((week) => {
            const data = dataSplitIntoIntervals.value.get(lastThreeIntervals.value[week]) ?? []
            return forecastGraph(data, interval.value,
                {
                  graphLayout: forecastLayout, onBrushEnd: brushEvent,
                })
          })
      return new Map(graphObjects.map((graph) => [graph.brush, graph]))
    }
)


</script>

<style scoped>
.forecast-series {
  background-color: #fcfcfc;
  padding: 10px 0 50px 0;
}
</style>
