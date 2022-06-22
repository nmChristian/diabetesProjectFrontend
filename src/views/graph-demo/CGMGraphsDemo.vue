<!-- Author: Jonas -->
<!-- Description: Demo page that shows a lot of graphs in the same page -->
<template>
  <div class="everything">
    <QuantileSeries :cgm-ranges="cgmRanges" :show-advanced="true" :cgm="cgm"/>
    <div style="display: flex; gap: 100px;">
      <CGMLegend :ranges="cgmRanges" :targets="[0.01, 0.04, 0.7, 0.25, 0.05]"
                 :percentages="[0.2, 0.3, 0.4, 0.05, 0.05]"/>
      <CGMLegend :ranges="cgmRanges" :percentages="[0.2, 0.3, 0.4, 0.05, 0.05]"/>
      <CGMLegend :ranges="cgmRanges" :targets="[0.01, 0.04, 0.7, 0.25, 0.05]"/>
      <CGMLegend :ranges="cgmRanges"/>
    </div>
    <ForecastSeries
        :cgm="cgm"
        :meals="meals"
        :cgm-ranges="cgmRanges"
        :show-advanced="true"
    />

    <ElementTableSeries
        :basal="daysBackData(basal, daysBack)"
        :bolus="daysBackData(bolus, daysBack)"
        :cgm="daysBackData(cgm, daysBack)"
        :meals="daysBackData(meals, daysBack)"
        :dates="dates"
        :cgm-ranges="cgmRanges"
        :show-advanced="true"
    />
    <TIRDailySeries
        :data="cgm"
        :cgm-ranges="cgmRanges"
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

import {computed} from "vue";
import ForecastSeries from "@/components/charts/series/ForecastSeries.vue";
import RawSeries from "@/components/charts/series/RawSeries.vue";
import TIRDailySeries from "@/components/charts/series/TIRDailySeries.vue";
import ElementTableSeries from "@/components/charts/series/ElementTableSeries.vue";
import CGMLegend from "@/components/charts/others/CGMLegend.vue";
import QuantileSeries from "@/components/charts/series/QuantileSeries.vue";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {getCGMOccurrences} from "@/services/graphs/auxiliary/cgm";


const props = defineProps<{
  cgm: DateValue[],
  meals: DateValue[],
  basal: DateValue[],
  bolus: DateValue[],
  cgmRanges: CGMRanges
}>()


// TIR Methods
const now = new Date();

const lastDayData = computed(() => props.cgm.filter(([date,]) => date > d3.timeDay.offset(now, -1)))
const frequencies = computed(() => getCGMOccurrences(lastDayData.value, props.cgmRanges))


const daysBack = 7
const dates = computed(() =>
    [...Array(daysBack).keys()].map<Date>((offset) => d3.timeDay(
        d3.timeDay.offset(now, -offset))).reverse())

const daysBackData = (data: DateValue[], daysBack: number) => data.filter(([date,]) => date > d3.timeDay.offset(now, -daysBack))

</script>

<style scoped>
.everything {
  display: flex;
  flex-direction: column;
}

.everything > * {
  width: 80%;
  margin: auto;
}
</style>