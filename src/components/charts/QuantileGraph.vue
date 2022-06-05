<template>
  <div ref="div"></div>
</template>


<script setup lang="ts">
import {onMounted, ref, watchEffect} from "vue";
import type {Ref} from "vue"

import applySVG from "@/services/core/applySVG";
import {quantileGraph} from "@/services/graphs/quantileGraph";
import type {BucketPoint, Point} from "@/services/core/datatypes";

const div : Ref<HTMLDivElement | null> = ref(null)

const props = defineProps<{
  bucketSeriesOfQuantiles : d3.Series<BucketPoint, number>[],
  quantilesUsedInBucket : number[]
  medianDataInHours : Point[],
}>()

watchEffect(() => {
  const chart = quantileGraph(
      props.bucketSeriesOfQuantiles,
      props.quantilesUsedInBucket,
      props.medianDataInHours,
      {})
  applySVG(div, chart)
})
</script>
