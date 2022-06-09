<template>
  <div>
    <h1>Here is a TIR graph</h1>
    <div class="graphs">
      <t-i-r-graph
          :frequencies="frequencies"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="5"
      />
      <t-i-r-graph
          :frequencies="frequencies"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="0"
      />
      <t-i-r-graph
          :frequencies="frequencies"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="10"
      />
      <t-i-r-graph
          :frequencies="frequencies"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="20"
      />
      <t-i-r-graph
          :frequencies="frequencies"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="50"
      />
    </div>
    <h2>Testing offset</h2>
    <div class="graphs">
      <t-i-r-graph
          :frequencies="[0.2, 0.1, 0.2, 0.3, 0.2]"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="5"
      />
      <t-i-r-graph
          :frequencies="[0.2, 0.1, 0.2, 0.3, 0.2]"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="0"
      />
      <t-i-r-graph
          :frequencies="[0.2, 0, 0.2, 0.3, 0.3]"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="5"
      />
      <t-i-r-graph
          :frequencies="[0.5, 0.2, 0, 0.3, 0]"
          :colors="COLOR_SCHEME"
          :graph-layout="layout"
          :offset="5"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {computed} from "vue";
import type {DateValue} from "@/services/core/datatypes";
import {getCGMFrequency} from "@/services/core/datatypes";
import {COLOR_SCHEME} from "@/services/core/shared";
import {GraphLayout} from "@/services/core/graphtypes";

const props = defineProps<{
  data: DateValue[],
}> ()

const frequencies = computed (() => getCGMFrequency(props.data))

const layout = new GraphLayout(50, 400, 0, 10, 0, 10)

</script>

<style scoped>
.graphs {
  display: flex;
}
</style>