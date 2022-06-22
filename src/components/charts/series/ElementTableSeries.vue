<!-- Author: Jonas -->
<!-- Description: Component that contains element table and settings for it, it generates the settings and manipulates the data itself -->
<template>
  <DateIntervalSelector v-if="days !== undefined" :text="'last ' + days + ' days'"/>
  <div style="display:flex; flex-direction: column; align-items: center; justify-content: center;">
    <div v-if="showAdvanced" class="groups">
      <div class="group" v-for="(group, i) in settingGroups">
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
import type {ElementRow} from "@/components/charts/others/ElementTable.vue"
import ElementTable from "@/components/charts/others/ElementTable.vue"

import type {Ref} from "vue"
import {computed, ref, watchEffect} from "vue";
import * as d3 from "d3";
import DateIntervalSelector from "@/components/DateIntervalSelector.vue";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {getCGMColor} from "@/services/graphs/auxiliary/cgm";

const props = defineProps<{
  showAdvanced: boolean,
  cgm: DateValue[],
  meals: DateValue[],
  basal: DateValue[],
  bolus: DateValue[],
  dates: Date[],
  cgmRanges: CGMRanges,
  days?: number,
}>()

const hourIncrement = 1 // 24 MUST BE DIVISIBLE WITH THIS,

// Outputs a list of columns with the title example,  [0, 4, 8, 12, 16, 20] or [0, 3, 6, 9, 12, 15, 18, 21]
const columns = [...Array(24 / hourIncrement).keys()].map<number>(hour => hour * hourIncrement)

// Split datevalues by its hour
function splitByHour(dateValues: DateValue[]): number[][] {
  // Array containing numbers split into hours of day
  const values: number[][] = columns.map(_ => [])
  // Add to each based on hour
  dateValues.forEach(([date, value]) => values[Math.floor(date.getHours() / hourIncrement)].push(value))
  return values;
}

// Splits datevalues first by day, then by hour
function splitDataIntoIntervals(data: DateValue[]): number[][][] {
  const splitByDay = d3.group(data, ([date,]) => d3.timeDay(date))
  return props.dates.map<number[][]>((date) => splitByHour(splitByDay.get(date) ?? []))
}

// Generate elements based on settings selected
const elements = computed(() => {
      return props.dates.map<[Date, ElementRow[]]>((date, i) =>
          [
            date,
            // For every group that is active, create a row
            settingGroups.filter(({active}) => active.value).map<ElementRow>(({title, data, selectedOption, colorMethod}) =>
                ({
                  title: selectedOption.value[0] + " - " + title.toUpperCase(),
                  // Compute the values in the row
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

class SettingGroup {
  title: string
  data: Ref<number[][][]>
  options: Option[]
  colorMethod: ColorMethod

  // Default selected options is false and not active by default
  selectedOption: Ref<Option>
  active: Ref<boolean> = ref(false)

  /**
   * Used to make settings for table
   * @param title - Name of the data (eg. CGM or Exercise)
   * @param data - The data passed as reference
   * @param colorMethod - Method that returns the background color based on value
   * @param options - The ways we can manipulate the data (eg. d3.mean, d3.min)
   * @param defaultOption - The option that is selected by default
   */
  constructor(title: string, data: Ref<number[][][]>, colorMethod: ColorMethod = defaultColorMethod, options: Option[] = defaultOptions, defaultOption: number = 0) {
    this.title = title;
    this.data = data
    this.colorMethod = colorMethod
    this.options = options;
    this.selectedOption = ref(options[defaultOption])
  }
}

const defaultColorMethod = () => ""
const defaultOptions: Option[] = [
  ["mean", d3.mean],
  ["max", d3.max],
  ["median", d3.median],
  ["min", d3.min],
]
const sumOptions: Option[] = [
  ["sum", (values) => {
    const sum = d3.sum(values);
    return sum === 0 ? NaN : sum
  }],
]

// A box is created for each of these
const settingGroups: SettingGroup[] =
    [
      new SettingGroup("CGM", computed(() => splitDataIntoIntervals(props.cgm)), (val) => getCGMColor(val, props.cgmRanges)),
      new SettingGroup("Meal", computed(() => splitDataIntoIntervals(props.meals)), defaultColorMethod, sumOptions),
      new SettingGroup("Bolus", computed(() => splitDataIntoIntervals(props.bolus)), defaultColorMethod, sumOptions),
      new SettingGroup("Basal", computed(() => splitDataIntoIntervals(props.basal))),
    ] as SettingGroup[]

const getGroupId = (i: number) => "group-" + i
const getOptionId = (i: number, j: number) => "option-" + i + "-" + j

// Set first two groups to be active
watchEffect(() => [0, 1].map(i => settingGroups[i].active.value = true))

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