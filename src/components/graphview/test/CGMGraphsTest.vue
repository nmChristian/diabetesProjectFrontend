<template>
  <div>

    <c-g-m-legend/>
    <t-i-r-graph :occurrences="frequencies" :colors="COLOR_SCHEME"/>
    <t-i-r-daily-series :data="cgm"/>

    <forecast-series
        :cgm="cgm"
        :meals="meals"
        :showAdvanced="false"
    />

    <element-table-series
        :basal="daysBackData(basal, daysBack)"
        :bolus="daysBackData(bolus, daysBack)"
        :cgm="daysBackData(cgm, daysBack)"
        :meals="daysBackData(meals, daysBack)"
        :dates="dates"
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

import {COLOR_SCHEME, CGM_THRESHOLDS} from "@/services/core/shared";
import {computed} from "vue";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";
import RawSeries from "@/components/charts/graphseries/RawSeries.vue";
import TIRDailySeries from "@/components/charts/graphseries/TIRDailySeries.vue";
import ElementTableSeries from "@/components/charts/graphseries/ElementTableSeries.vue";
import CGMLegend from "@/components/charts/CGMLegend.vue";


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
const dates = computed( ()  =>
    [...Array(daysBack).keys()].map<Date>((offset) => d3.timeDay(
        d3.timeDay.offset(lastDateInDataSet.value, -offset))).reverse())

const daysBackData = (data : DateValue[], daysBack : number) => data.filter(([date,]) => date > d3.timeDay.offset(lastDateInDataSet.value, -daysBack))

</script>

<style scoped>

</style>