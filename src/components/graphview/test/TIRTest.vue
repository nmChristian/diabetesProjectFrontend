<template>
  <div>
    <h1>Here is a TIR graph</h1>
    <div class="graphs">
      <TIRGraph
          v-for="offset in [5,0,10,20,50]"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :occurrences="occurrences"
          :offset="offset"
      />
    </div>
    <h2>Testing offset</h2>
    <div class="graphs">
      <TIRGraph
          v-for="offset in [5, 0]"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :occurrences="[0.2, 0.1, 0.2, 0.3, 0.2]"
          :offset="offset"
      />
      <TIRGraph
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :occurrences="[0.2, 0, 0.2, 0.3, 0.3]"
          :offset="5"
      />
      <TIRGraph
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :occurrences="[0.5, 0.2, 0, 0.3, 0]"
          :offset="5"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {computed} from "vue";
import type {DateValue} from "@/services/core/datatypes";
import {getCGMOccurrences} from "@/services/core/datatypes";
import type {CGMRanges} from "@/services/core/shared";
import {COLOR_SCHEME} from "@/services/core/shared";
import {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  cgm: DateValue[],
  cgmRanges: CGMRanges,
}>()

const occurrences = computed(() => getCGMOccurrences(props.cgm, props.cgmRanges))

const layout = new GraphLayout(50, 400, 0, 10, 0, 10)

</script>

<style scoped>
.graphs {
  display: flex;
}
</style>