<template>
  <div>
    <h1>Here is a TIR graph</h1>
    <t-i-r-graph
        :quantiles="quantiles"
    />
  </div>
</template>

<script setup lang="ts">

import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import {computed} from "vue";

const quantiles = computed(() => [.1,.3,.2,.2,.2])

</script>
