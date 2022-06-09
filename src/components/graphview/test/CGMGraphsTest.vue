<template>
  <forecast-series :data="data"/>
  <t-i-r-graph
      :sizes=""
      :colors="COLOR_SCHEME"
    />
</template>

<script setup lang="ts">
import type {DateValue} from "@/services/core/datatypes";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {COLOR_SCHEME} from "@/services/core/shared";

const props = defineProps<{
  data: DateValue[],
}>()

const 

</script>
