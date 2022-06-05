<template>
  <div ref="div"></div>
</template>


<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Ref} from "vue"

import applySVG from "@/services/core/applySVG";
import {quantileGraph} from "@/services/graphs/quantileGraph";
import type {BucketPoint, Point} from "@/services/core/datatypes";

const div : Ref<HTMLDivElement | null> = ref(null)

const props = defineProps<{
  bucketSeriesOfQuantilesSplitByDayInHour : d3.Series<BucketPoint, number>[],
  quantilesUsedInBucket : number[]
  medianPointsSplitByDayInHour : Point[],
}>()

onMounted(() => {
  const chart = quantileGraph(
      props.bucketSeriesOfQuantilesSplitByDayInHour,
      props.quantilesUsedInBucket,
      props.medianPointsSplitByDayInHour,
      {})
  applySVG(div, chart)
})
</script>
