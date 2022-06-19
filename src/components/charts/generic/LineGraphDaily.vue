<template>
  <Graph :svg="graph"/>
</template>

<script lang="ts" setup>

import {computed} from "vue";

import Graph from "../shared/Graph.vue"
import type {Point} from "@/services/core/datatypes";
import lineGraphDaily from "@/services/graphs/generic/lineGraphDaily";
import type {GraphLayout} from "@/services/core/graphtypes";
import type {CGMRanges} from "@/services/core/shared";


const props = defineProps<{
  data: Point[],
  cgmRanges: CGMRanges,
  xDomain?: [number, number]
  graphLayout?: GraphLayout,
}>()

const graph = computed(() =>
    lineGraphDaily(props.data, props.cgmRanges,{graphLayout: props.graphLayout}, props.xDomain))
</script>
