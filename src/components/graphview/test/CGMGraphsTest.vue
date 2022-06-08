<template>
  <forecast-series :data="data"/>
</template>

<script setup lang="ts">
import type {DateValue} from "@/services/core/datatypes";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";


const props = defineProps<{
  data: DateValue[],
}>()


</script>
