<template>
  <div class="everything">
    <div style="display: flex; gap: 100px;">
      <CGMLegend :ranges="cgmRanges" :targets="[0.01, 0.04, 0.7, 0.25, 0.05]" :percentages="[0.2, 0.3, 0.4, 0.05, 0.05]"/>
      <CGMLegend :ranges="cgmRanges" :percentages="[0.2, 0.3, 0.4, 0.05, 0.05]"/>
      <CGMLegend :ranges="cgmRanges" :targets="[0.01, 0.04, 0.7, 0.25, 0.05]" />
      <CGMLegend :ranges="cgmRanges"/>
    </div>
    <ForecastSeries
        :cgm="cgm"
        :meals="meals"
        :show-advanced="true"
    />

    <ElementTableSeries
        :basal="daysBackData(basal, daysBack)"
        :bolus="daysBackData(bolus, daysBack)"
        :cgm="daysBackData(cgm, daysBack)"
        :meals="daysBackData(meals, daysBack)"
        :dates="dates"
        :show-advanced="true"
    />
    <TIRGraph style="width: 100px; height: 140px;" :occurrences="frequencies" :colors="COLOR_SCHEME"/>
    <TIRDailySeries
        :data="cgm"
        :show-advanced="true"
    />



    <RawSeries
        :basal="basal"
        :bolus="bolus"
        :cgm="cgm"
        :meals="meals"
        :show-advanced="true"
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

// Constants
const cgmRanges : [number, number?][]= CGM_THRESHOLDS.map(({x0,x1}) => [x0,x1])

</script>

<style scoped>
.everything {
  display: flex;
  flex-direction: column;
}
.everything>* {
  width: 80%;
  margin: auto;
}
</style>