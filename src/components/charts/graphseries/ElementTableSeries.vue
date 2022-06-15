<template>
  <h2>Table</h2>
  <div style="display:flex; flex-direction: column; align-items: center; justify-content: center;">
    <element-table
        :elements="elements"
    />
    <div class="groups">
      <div class="group" v-for="(group, i) in dataGroups">
        <div>
          <input type="checkbox" :id="getGroupId(i)" v-model="group.active"/>
          <label class="group-label" :for="getGroupId(i)">{{ group.title }}</label>
        </div>
        <div class="option" v-for="(option, j) in group.options">
          <input type="radio" :name="getGroupId(i)" :id="getOptionId(i,j)" v-model="group.selectedOption" :value="option"
                 :checked="j === 0" :disabled="!group.active"/>
          <label class="option-label" :for="getOptionId(i,j)">{{ option[0].toLowerCase() }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import ElementTable from "@/components/charts/generic/ElementTable.vue"
import type {DateValue} from "@/services/core/datatypes";
import {getCGMColor} from "@/services/core/datatypes";
import type {Ref} from "vue"
import {computed, ref} from "vue";
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
  const methods: [string, (values: number[]) => number | undefined][] =
      [
        ["mean", d3.mean],
        ["median", d3.median],
        ["min", d3.min],
        ["max", d3.max],
      ]
  return cgmSplitIntoIntervals.value.map<[Date, ElementRow[]]>(([date, hoursValues]) =>
      [
        date,
        methods.map<ElementRow>(([title, method]) => ({
          title: title,
          values: hoursValues.map<number>(values => method(values) ?? NaN).map<[number, string?]>(value => [value, getCGMColor(value)]),
        }))
      ])
})
/*
const elements = computed(() => {
  const methods: [string, (values: number[]) => number | undefined][] =
      [
        ["mean", d3.mean],
        ["median", d3.median],
        ["min", d3.min],
        ["max", d3.max],
      ]
  return cgmSplitIntoIntervals.value.map<[Date, ElementRow[]]>(([date, hoursValues]) =>
      [
        date,
        methods.map<ElementRow>(([title, method]) => ({
          title: title,
          values: hoursValues.map<number>(values => method(values) ?? NaN).map<[number, string?]>(value => [value, getCGMColor(value)]),
        }))
      ])
})*/
const cgmSplitIntoIntervals = computed(() => {
  const splitByDay = d3.group(props.cgm, ([date,]) => d3.timeDay(date))
  const arrayOfDaysBackData = props.lastDaysBack.map<[Date, DateValue[]]>((date) => [date, splitByDay.get(date) ?? []])

  // Get each hour, and get the mean value
  return arrayOfDaysBackData.map<[Date, number[][]]>(([date, dateValues]) => [date, splitByHour(dateValues)])
})


// Settings
type ColorMethod = (value: number) => string
type Option = [string, (values: number[]) => number | undefined]
class Group {
  title: string
  options: Option[]
  colorMethod : ColorMethod
  // Default selected options is false and not active by default
  selectedOption: (Option | undefined) = undefined
  active: boolean = false

  constructor(title: string, colorMethod : ColorMethod = () => "inherit", options: Option[] = defaultOptions) {
    this.title = title;
    this.colorMethod = colorMethod
    this.options = options;
  }
}

const defaultOptions: Option[] = [
  ["mean", d3.mean],
  ["median", d3.median],
  ["max", d3.max],
  ["min", d3.min],
]

const dataGroups: Ref<Group[]> = ref(
    [
      new Group("CGM", getCGMColor),
      new Group("Meal"),
      new Group("Bolus"),
      new Group("Basal"),
    ] as Group[])

const getGroupId = (i: number) => "group-" + i
const getOptionId = (i: number, j: number) => "option-" + i + "-" + j

</script>

<style scoped>
.groups {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.group {
  min-width: 150px;
  padding: 4px 10px;
  border: 1px solid black;
  border-radius: 6px;
}

.group-label {
  padding-left: 10px;
}

.option {
  margin-left: 10px;
  font-style: italic;
  font-size: 14px;
}

.option-label {
  padding-left: 10px;
}

</style>