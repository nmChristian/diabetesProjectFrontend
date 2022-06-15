<template>
  <div>
    <element-table-series
        :cgm="daysBackCGM"
        :last-days-back="lastDaysBack"
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
import ElementTableSeries from "@/components/charts/graphseries/ElementTableSeries.vue";


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


const daysBack = 7
const lastDaysBack = computed( ()  =>
    [...Array(daysBack).keys()].map<Date>((offset) => d3.timeDay(
        d3.timeDay.offset(lastDateInDataSet.value, -offset))).reverse()
)
const daysBackCGM = computed(() => props.cgm.filter(([date,]) => date > d3.timeDay.offset(lastDateInDataSet.value, -daysBack)))

</script>
