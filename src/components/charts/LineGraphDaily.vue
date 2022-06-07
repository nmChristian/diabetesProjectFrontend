<template>
  <div ref="div"></div>
</template>

<script setup lang="ts">
import type {Ref} from "vue"
import {ref, watchEffect} from "vue";

import applySVG from "@/services/core/applySVG";
import type {Point} from "@/services/core/datatypes";
import lineGraphDaily from "@/services/graphs/refactorThis/lineGraphDaily";

const div : Ref<HTMLDivElement | null> = ref(null)

const props = defineProps<{
  data : Point[],
  xDomain? : [number, number]
}>()

watchEffect(() => {
  const chart = lineGraphDaily(props.data,
      {}, props.xDomain)
  applySVG(div, chart)
})
</script>
