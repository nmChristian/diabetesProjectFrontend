<template>
  <div>

    <forecast-series
        :data="cgm"
    />
    <h3>24 Hour back Time in Range Graph</h3>
      <t-i-r-graph
          :occurrences="frequencies"
          :colors="COLOR_SCHEME"
      />
    <raw-series
      :cgm="cgm"
      :meals="meals"
      :basal="basal"
      :bolus="bolus"
    />
  </div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import type {DateValue} from "@/services/core/datatypes";
import {getCGMOccurrences} from "@/services/core/datatypes";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";

import {COLOR_SCHEME} from "@/services/core/shared";
import {computed} from "vue";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";
import RawSeries from "@/components/charts/graphseries/RawSeries.vue";


const props = defineProps<{
  cgm: DateValue[],
  meals: DateValue[],
  basal: DateValue[],
  bolus: DateValue[],
}>()

// TIR Methods
const lastDateInDataSet = computed( () => props.cgm.length === 0 ? new Date() : props.cgm[props.cgm.length - 1][0])
const lastDayData = computed (() => props.cgm.filter(([date,]) => date > d3.timeDay.offset(lastDateInDataSet.value, -1)))
const frequencies = computed(() => getCGMOccurrences(lastDayData.value))

</script>
