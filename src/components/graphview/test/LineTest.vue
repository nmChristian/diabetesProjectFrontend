<template>
  <div>
    <h1> Testing whether it is possible to do 24 hours with dates</h1>
    <LineGraph
        :data="cgm"
    />
    <h1>Here is two graphs used for comparing functionality</h1>
    <p>Dynamic domain</p>
    <LineGraphDaily
        :data="medianCGMInHours"
        :cgm-ranges="cgmRanges"
    />
    <p>Fixed domain [0,24]</p>
    <LineGraphDaily
        :data="medianCGMInHours"
        :x-domain="[0, 24]"
        :cgm-ranges="cgmRanges"
    />
    <h1>Working line graph over the span of days</h1>
    <LineGraph
        :data="cgm"
    />
  </div>
</template>

<script lang="ts" setup>
import LineGraph from "@/components/charts/generic/LineGraph.vue"
import LineGraphDaily from "@/components/charts/generic/LineGraphDaily.vue";
import type {DateValue, Point} from "@/services/core/datatypes";
import type {CGMRanges} from "@/services/core/shared";

const props = defineProps<{
  cgm: DateValue[],
  cgmRanges: CGMRanges,
  medianCGMInHours: Point[]
}>
()

</script>