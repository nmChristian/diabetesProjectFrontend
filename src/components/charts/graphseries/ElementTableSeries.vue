<template>
  <div style="display:flex; flex-direction: column; align-items: center; justify-content: center;">
    <VueTable
        :elements="elements"
        :columns="columns"
    />
    <div v-if="showAdvanced" class="groups">
      <div class="group" v-for="(group, i) in dataGroups">
        <div>
          <input type="checkbox" :id="getGroupId(i)" v-model="group.active.value"/>
          <label class="group-label" :for="getGroupId(i)">{{ group.title }}</label>
        </div>
        <div class="option" v-for="(option, j) in group.options">
          <input type="radio" :name="getGroupId(i)" :id="getOptionId(i,j)" v-model="group.selectedOption.value"
                 :value="option"
                 :disabled="!group.active.value"/>
          <label class="option-label" :for="getOptionId(i,j)">{{ option[0].toLowerCase() }}</label>
        </div>
      </div>
    </div>
    <ElementTable
        :elements="elements"
        :columns="columns"
    />
  </div>
</template>

<script lang="ts" setup>

import ElementTable from "@/components/charts/generic/ElementTable.vue"
import type {DateValue} from "@/services/core/datatypes";
import {getCGMColor} from "@/services/core/datatypes";
import type {ComputedRef, Ref} from "vue"
import {computed, reactive, ref, watchEffect} from "vue";
import * as d3 from "d3";
import type {ElementRow} from "@/services/graphs/generic/elementTable";
import {select} from "d3";
import VueTable from "@/services/graphs/generic/VueTable.vue";

const props = defineProps<{
  showAdvanced: boolean,
  cgm: DateValue[],
  meals: DateValue[],
  basal: DateValue[],
  bolus: DateValue[],
  dates: Date[],
}>()


const hourIncrement = 1 // MUST BE DIVISIBLE WITH 24

// Outputs a list of columns with the title example,  [0, 4, 8, 12, 16, 20] or [0, 3, 6, 9, 12, 15, 18, 21]
const columns = [...Array(24 / hourIncrement).keys()].map<number>(hour => hour * hourIncrement)

function splitByHour(dateValues: DateValue[]): number[][] {
  // Array containing numbers split into hours of day
  const values: number[][] = columns.map(_ => [])
  // Add to each based on hour
  dateValues.forEach(([date, value]) => values[Math.floor(date.getHours() / hourIncrement)].push(value))
  return values;
}

function splitDataIntoIntervals(data: DateValue[]): number[][][] {
  const splitByDay = d3.group(data, ([date,]) => d3.timeDay(date))
  return props.dates.map<number[][]>((date) => splitByHour(splitByDay.get(date) ?? []))
}

const elements = computed(() => {
  return props.dates.map<[Date, ElementRow[]]>((date, i) =>
          [
            date,
            // For every group that is active
            dataGroups.filter(({active}) => active.value).map<ElementRow>(({title, data, selectedOption, colorMethod}) =>
                ({
                  title: selectedOption.value[0] + " - " + title.toUpperCase(),
                  // Compute the values
                  values: data.value[i].map<number>(values => selectedOption.value[1](values) ?? NaN).map<[number, string?]>(value => [value, colorMethod(value)]),
                })
            )
          ]
      )
    }
)

// Settings
type ColorMethod = (value: number) => string
type Option = [string, (values: number[]) => number | undefined]
const defaultColorMethod = () => ""

class Group {
  title: string
  data: Ref<number[][][]>
  options: Option[]
  colorMethod: ColorMethod
  // Default selected options is false and not active by default
  selectedOption: Ref<Option>
  active: Ref<boolean> = ref(false)

  constructor(title: string, data: Ref<number[][][]>, colorMethod: ColorMethod = defaultColorMethod, options: Option[] = defaultOptions, defaultOption : number = 0) {
    this.title = title;
    this.data = data
    this.colorMethod = colorMethod
    this.options = options;
    this.selectedOption = ref(options[defaultOption])
  }
}
const defaultOptions: Option[] = [
  ["mean", d3.mean],
  ["max", d3.max],
  ["median", d3.median],
  ["min", d3.min],
]
const sumOptions : Option[] = [
    ["sum", (values) => { const sum = d3.sum(values); return sum === 0 ? NaN : sum} ],
]
const dataGroups: Group[] =
    [
      new Group("CGM",  computed( () => splitDataIntoIntervals(props.cgm)), getCGMColor),
      new Group("Meal", computed( () => splitDataIntoIntervals(props.meals)), defaultColorMethod, sumOptions),
      new Group("Bolus", computed( () => splitDataIntoIntervals(props.bolus)), defaultColorMethod, sumOptions),
      new Group("Basal", computed( () => splitDataIntoIntervals(props.basal))),//*/
    ] as Group[]

const getGroupId = (i: number) => "group-" + i
const getOptionId = (i: number, j: number) => "option-" + i + "-" + j

// Set first group to be active
watchEffect(() => [0,1].map(i => dataGroups[i].active.value = true))

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