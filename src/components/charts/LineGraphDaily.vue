<template>
  <div ref="div"></div>
</template>

<script setup lang="ts">
import type {Ref} from "vue"
import {ref, watchEffect} from "vue";

import applySVG from "@/services/core/applySVG";
import type {Point} from "@/services/core/datatypes";
import lineGraphDaily from "@/services/graphs/refactorThis/lineGraphDaily";
import type {GraphLayout} from "@/services/core/graphtypes";

const div : Ref<HTMLDivElement | null> = ref(null)

const props = defineProps<{
  data : Point[],
  xDomain? : [number, number]
  graphLayout? : GraphLayout,
}>()

watchEffect(() => {
  const chart = lineGraphDaily(props.data,
      { graphLayout : props.graphLayout }, props.xDomain)
  applySVG(div, chart)
})
</script>
