<template>
  <div class="jonasdiv">
    <svg ref ="svg"></svg>
    <h1> Chart is here </h1>
    <Tidytree
        title="Fisk Chart"
    />
    <Histogram
        :axisData="axisData"
        title="Tickets vs. Value"
        :companies="companies"
    />
    <HistoBetter
      title="My Chart"
      :data="unemployment"
      :att="att"
    />
  </div>
</template>

<script lang="ts">

</script>
<script setup lang="ts">
// https://vuejsexamples.com/an-interactive-vue-and-d3-js-app-that-fetches-data-from-a-json-file-and-displays-data-on-a-chart/
import { ref, Ref, onMounted } from 'vue'
import { coupons } from "@/assets/chart/examples/coupons.json"
import { unemployment } from "@/assets/chart/examples/unemployment.json"
import cgm from "@/assets/demo/cgm.json"


import {computed} from 'vue'
import Histogram from "@/components/charts/Histogram.vue";
import HistoBetter from "@/components/charts/HistoBetter.vue"
import Tidytree from "@/components/charts/Tidytree.vue"
import Graph from "@/services/graphs/graphs"

const graph = new Graph ();
const cgmMGDL = cgm.map((d) => ({date: new Date(d.date), value: d.cgm * 18}))


const att = {
    value: (d : any) => d.rate,
    label: "unemployment rate",
    height: 500,
    color: "green",
}


const axisData = computed(() => coupons
    .filter((el : any) => el.promotion_type === 'percent-off')
    .map((el : any) => ({x: el.coupon_id, y: el.value, company: el.webshop_id})))
const companies = computed( ()=> [...new Set(coupons.map((el : any) => el.webshop_id))])

// Reference
const svg : Ref<SVGElement | null> = ref(null)
onMounted(() => {
  const medData = graph.medianData(cgmMGDL, 2, 1 )
  const chart = graph.iconChart(medData, graph.colorScheme[2], {})
  graph.applySVG(svg, chart)

})


</script>