<template>
  <div class="jonasdiv">
    <h1> Chart is here </h1>
    <Chart
        :axisData="axisData"
        :coupons="coupons"
        title="Tickets vs. Value"
        :companies="companies"
    />
  </div>
</template>


<script setup lang="ts">
import Chart from "@/components/Chart.vue"
import { coupons } from "@/assets/coupons.json"

import { computed } from 'vue'

const axisData = computed(() => coupons
    .filter((el : any) => el.promotion_type === 'percent-off')
    .map((el : any) => ({x: el.coupon_id, y: el.value, company: el.webshop_id})))

const companies = computed( ()=> [...new Set(coupons.map((el : any) => el.webshop_id))])

</script>