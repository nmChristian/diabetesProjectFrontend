<template>
  <h2>Table</h2>
  <div style="display:flex; justify-content: center;">
    <element-table
        :elements="elements"
    />
  </div>
</template>

<script lang="ts" setup>

import ElementTable from "@/components/charts/generic/ElementTable.vue"
import type {DateValue} from "@/services/core/datatypes";
import {computed} from "vue";
import * as d3 from "d3";

const props = defineProps<{
  cgm: DateValue[],
  lastDaysBack: Date[],
}>()

const hourIncrement = 1 // MUST BE DIVISIBLE WITH 24

function splitByHour (dateValues : DateValue[]) : number[][]{
  // Array containing numbers split into hours of day
  const values : number[][] = [...Array(Math.ceil(24 / hourIncrement))].map(_ => [])
  // Add to each based on hour
  dateValues.forEach(([date, value]) => values[Math.floor(date.getHours() / hourIncrement)].push(value))
  return values;
}
function manipulateData (valuesArray: number[][], methods : ((values : number[]) => (number | undefined))[]) : number[][] {
  return valuesArray.map<number[]>( values => methods.map<number>(method => method(values) ?? NaN))
}

// Generate elements by adding titles to each row
const elements = computed( () => {
  console.log(cgmSplitIntoIntervals.value)
  const methods = [
    ["mean", d3.mean],
    ["min", d3.min],
    ["max", d3.max],
      ]
  methods.map<[Date, [string, number[]]]>(([title, method]) =>

  )

  return cgmSplitIntoIntervals.value;
})
const cgmSplitIntoIntervals = computed(() => {
  const splitByDay = d3.group(props.cgm, ([date,]) => d3.timeDay(date))
  const arrayOfDaysBackData = props.lastDaysBack.map<[Date, DateValue[]]>((date) => [date, splitByDay.get(date) ?? []])

  // Get each hour, and get the mean value
  return arrayOfDaysBackData.map(([date, dateValues]) => [date, splitByHour(dateValues)])
})


</script>
