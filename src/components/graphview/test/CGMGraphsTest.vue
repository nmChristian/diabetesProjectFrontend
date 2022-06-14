<template>
  <div>
    <h2>Table</h2>
    {{ elements }}
    {{ lastSevenDays }}
    <element-table
        :elements="[
            [new Date('2022-01-29'), [10, 20, 30, 40]],
            [new Date('2022-01-28'), [24, 20, 30, 11]],
            [new Date('2022-01-27'), [55, 20, 190, 100]],
            [new Date('2022-01-26'), [10, 6, 30, 40]],
            ]"
    />

    <forecast-series
        :cgm="cgm"
        :meals="meals"
    />
    <t-i-r-daily-series :data="cgm"/>
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

const tableInterval = d3.timeWeek
const lastSevenDays = computed( ()  =>
    [...Array(7).keys()].map<Date>((offset) => d3.timeDay(
    d3.timeDay.offset(lastDateInDataSet.value, -offset))
))

const elements = computed(() => {
  console.log(cgmSplitIntoIntervals.value);
})
const cgmSplitIntoIntervals = computed(() => {
  const splitByDay = d3.group(lastWeekCGM.value, ([date,]) => d3.timeDay(date))
  return lastSevenDays.value.map((key, i) => [i, splitByDay.get(key)])
})

const lastWeekCGM = computed(() => props.cgm.filter(([date,]) => date > tableInterval.offset(lastDateInDataSet.value, -1)))
</script>
