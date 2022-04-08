<template>
  <div class="jonasdiv">
    <IconGraph
        :median-data="medData"
    />
    <IconGraph
        :median-data="medData"
    />
    <IconGraph
        :median-data="medData"
    />
  </div>
</template>

<script lang="ts">

</script>
<script setup lang="ts">
import {computed} from 'vue'
import IconGraph from "@/components/charts/IconGraph.vue";
import cgm from "@/assets/demo/cgm.json";



import {DataEdit} from "@/services/graphs/graphs";

const editor = new DataEdit ();

// Data from one user
const cgmMGDL = cgm.map((d) => ({date: new Date(d.date), value: d.cgm * 18}))

// Compute
const medData = computed(() => editor.medianData(cgmMGDL, 2, 1 ))


</script>