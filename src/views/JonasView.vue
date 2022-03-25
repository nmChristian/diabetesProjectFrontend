<template>
  <div class="jonasdiv">
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


<script setup lang="ts">
// https://vuejsexamples.com/an-interactive-vue-and-d3-js-app-that-fetches-data-from-a-json-file-and-displays-data-on-a-chart/
import { coupons } from "@/assets/chart/examples/coupons.json"
import { unemployment } from "@/assets/chart/examples/unemployment.json"

import {computed} from 'vue'
import Histogram from "@/components/charts/Histogram.vue";
import HistoBetter from "@/components/charts/HistoBetter.vue"
import Tidytree from "@/components/charts/Tidytree.vue"

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

// https://observablehq.com/@d3/histogram


</script>