<template>
  <div ref="div"></div>
</template>

<script setup lang="ts">
import type {Ref} from "vue"
import {ref, watchEffect} from "vue";

import applySVG from "@/services/core/applySVG";
import lineGraph from "@/services/graphs/lineGraph";
import type {DateValue} from "@/services/core/datatypes";
import type {GraphLayout} from "@/services/core/graphtypes";

const div : Ref<HTMLDivElement | null> = ref(null)

const props = defineProps<{
  data : DateValue[],
  graphLayout? : GraphLayout,
}>()

watchEffect(() => {
  const chart = lineGraph(props.data, { graphLayout : props.graphLayout })
  applySVG(div, chart)
})
</script>
