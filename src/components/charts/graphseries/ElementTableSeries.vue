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
import {getCGMColor} from "@/services/core/datatypes";
import {computed} from "vue";
import * as d3 from "d3";
import type {ElementRow} from "@/services/graphs/generic/elementTable";

const props = defineProps<{
  cgm: DateValue[],
  lastDaysBack: Date[],
}>()

const hourIncrement = 1 // MUST BE DIVISIBLE WITH 24

function splitByHour(dateValues: DateValue[]): number[][] {
  // Array containing numbers split into hours of day
  const values: number[][] = [...Array(Math.ceil(24 / hourIncrement))].map(_ => [])
  // Add to each based on hour
  dateValues.forEach(([date, value]) => values[Math.floor(date.getHours() / hourIncrement)].push(value))
  return values;
}

// Generate elements by adding titles to each row
const elements = computed(() => {
  console.log(cgmSplitIntoIntervals.value)
  const methods: [string, (values: number[]) => number | undefined, ((value: number) => string)?][] =
      [
        ["mean", d3.mean, getCGMColor],
        ["min", d3.min],
        ["max", d3.max],
      ]
  return cgmSplitIntoIntervals.value.map<[Date, ElementRow[]]>(([date, hoursValues]) =>
      [
        date,
        methods.map<ElementRow>(([title, method, color]) => ({
          title: title,
          values: hoursValues.map<number>(values => method(values) ?? NaN).map<[number, string?]>(value => [value, getCGMColor(value)]),
        }))
      ])
})
const cgmSplitIntoIntervals = computed(() => {
  const splitByDay = d3.group(props.cgm, ([date,]) => d3.timeDay(date))
  const arrayOfDaysBackData = props.lastDaysBack.map<[Date, DateValue[]]>((date) => [date, splitByDay.get(date) ?? []])

  // Get each hour, and get the mean value
  return arrayOfDaysBackData.map<[Date, number[][]]>(([date, dateValues]) => [date, splitByHour(dateValues)])
})


</script>
