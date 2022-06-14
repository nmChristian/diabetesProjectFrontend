<template>
  <div>


    <forecast-series
        :cgm="cgm"
        :meals="meals"
    />
    <t-i-r-daily-series :data="cgm"/>
    <h2>Table</h2>
    <div style="display:flex; justify-content: center;">
      <element-table
          :elements="cgmSplitIntoIntervals"
      />
    </div>
    <h3>24 Hour back Time in Range Graph</h3>
    <t-i-r-graph
        :colors="COLOR_SCHEME"
        :occurrences="frequencies"
    />

    <raw-series
        :basal="basal"
        :bolus="bolus"
        :cgm="cgm"
        :meals="meals"
    />
  </div>
</template>

<script lang="ts" setup>
import * as d3 from "d3";
import type {DateValue} from "@/services/core/datatypes";
import {getCGMOccurrences} from "@/services/core/datatypes";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";

import {COLOR_SCHEME} from "@/services/core/shared";
import {computed} from "vue";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";
import RawSeries from "@/components/charts/graphseries/RawSeries.vue";
import TIRDailySeries from "@/components/charts/graphseries/TIRDailySeries.vue";
import ElementTable from "@/components/charts/generic/ElementTable.vue";
import IconGraph from "@/components/charts/IconGraph.vue";


const props = defineProps<{
  cgm: DateValue[],
  meals: DateValue[],
  basal: DateValue[],
  bolus: DateValue[],
}>()

// TIR Methods
const lastDateInDataSet = computed(() => props.cgm.length === 0 ? new Date() : props.cgm[props.cgm.length - 1][0])
const lastDayData = computed(() => props.cgm.filter(([date,]) => date > d3.timeDay.offset(lastDateInDataSet.value, -1)))
const frequencies = computed(() => getCGMOccurrences(lastDayData.value))

const tableInterval = d3.timeDay
const intervalOffset = 14

const lastDaysBack = computed( ()  =>
    [...Array(intervalOffset).keys()].map<Date>((offset) => tableInterval(
    d3.timeDay.offset(lastDateInDataSet.value, -offset))).reverse()
)

function splitByHour (dateValues : DateValue[]) : number[][]{
  // Array containing numbers split into hours of day
  const values : number[][] = [...Array(24)].map(_ => [])
  // Add to each based on hour
  dateValues.forEach(([date, value]) => values[date.getHours()].push(value))
  return values;
}
const cgmSplitIntoIntervals = computed(() => {
  const splitByDay = d3.group(lastWeekCGM.value, ([date,]) => d3.timeDay(date))
  const arrayOfLastSevenDaysData = lastDaysBack.value.map<[Date, DateValue[]]>((date) => [date, splitByDay.get(date) ?? []])

  return arrayOfLastSevenDaysData.map(([date, dateValues]) => [date, splitByHour(dateValues).map((values : number[]) => d3.mean(values) ?? NaN)])
})

const lastWeekCGM = computed(() => props.cgm.filter(([date,]) => date > tableInterval.offset(lastDateInDataSet.value, -intervalOffset)))
</script>
