<template>
  <div ref="div"></div>
</template>


<script setup lang="ts">
import type {Ref} from "vue"
import {ref, watchEffect} from "vue";

import applySVG from "@/services/core/applySVG";
import {quantileGraph} from "@/services/graphs/quantileGraph";
import type {BucketPoint, Point} from "@/services/core/datatypes";
import type {GraphLayout} from "@/services/core/graphtypes";

const div : Ref<HTMLDivElement | null> = ref(null)

const props = defineProps<{
  bucketSeriesOfQuantiles : d3.Series<BucketPoint, number>[],
  quantilesUsedInBucket : number[]
  medianDataInHours : Point[],
  graphLayout? : GraphLayout,
}>()

watchEffect(() => {
  const chart = quantileGraph(
      props.bucketSeriesOfQuantiles,
      props.quantilesUsedInBucket,
      props.medianDataInHours,
      { graphLayout : props.graphLayout })
  applySVG(div, chart)
})
</script>
