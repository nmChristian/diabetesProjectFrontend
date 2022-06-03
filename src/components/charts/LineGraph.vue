<template>
  <div ref="div"></div>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from "vue";
import type {Ref} from "vue"

import applySVG from "@/services/core/applySVG";
import lineGraph from "@/services/graphs/lineGraph";
import type {DateValue, Point} from "@/services/core/datatypes";

const div : Ref<HTMLDivElement | null> = ref(null)

const props = defineProps<{
  data : DateValue[],
}>()

watchEffect(() => {
  console.log(props.data)
  const chart = lineGraph(props.data, {})
  applySVG(div, chart)
})
</script>
