<!-- Author: Jonas -->
<!-- Description: Component that displays the given elements as a table -->
<template>
  <div>
    <table class="element-table">
      <colgroup>
        <col span="1" class="col-dates">
        <col :span="columns.length" class="col-data">
        <col span="1" class="col-sub-titles">
      </colgroup>

      <thead>
      <tr class="time-of-day">
        <th></th>
        <th v-for="hour in columns">{{ hour }}:00</th>
        <th></th>
      </tr>
      </thead>

      <tbody v-for="[date, rows] in elements">
      <tr v-for="({title, values}, i) in rows"
          :class="i === 0 ? 'first-row' : i === (rows.length - 1) ? 'last-row' : 'center-row'">
        <th v-if="i === 0" class="day" rowspan="0">
          {{ d3.timeFormat("%a %e/%m")(date) }}
        </th>

        <td v-for="[value,color] in values" :style="dataStyle(value, color)">
          {{ isNaN(value) ? "" : value.toFixed(0) }}
        </td>

        <th class="sub-title">{{ title }}</th>
      </tr>
      </tbody>

      <tfoot>
      <tr class="time-of-day">
        <th></th>
        <th v-for="hour in columns">{{ hour }}:00</th>
        <th></th>
      </tr>
      </tfoot>

    </table>
  </div>

</template>

<script lang="ts" setup>
import * as d3 from "d3"

export type ElementRow = { title: string, values: [number, string?][] }

const props = defineProps<{
  elements: [Date, ElementRow []] [],
  columns: number[],
}>()

const defaultFontColor = "white"
const defaultAltFontColor = "black"

const dataStyle = (value: number, color: string | undefined) => isNaN(value) ?
    {} :
    {
      backgroundColor: color ?? "inherit",
      color: color ? defaultFontColor : defaultAltFontColor,
      fontWeight: color ? 'bold' : 'inherit'
    }

const dataBorder = "1px solid rgba(128, 128, 128, 0.4)"
const headerBorder = "1px solid black"
</script>


<style scoped>
.element-table {
  border: 2px solid grey;
  border-collapse: collapse;
}

.element-table td {
  width: 45px;
  text-align: right;
  font-weight: bold;
  color: white;
  padding: 2px 5px;
  font-size: 13px;
  opacity: 90%;
}


/*Borders through all columns */
.element-table .col-data {
  border-left: v-bind(dataBorder);
}

.element-table .first-row, .element-table .center-row {
  border-bottom: v-bind(dataBorder);
}

.element-table .last-row {
  border-top: v-bind(dataBorder);
}

/*Big bold borders between each day*/
.element-table tbody {
  border: v-bind(headerBorder);
}

/*Edges Border*/
.element-table th:last-child {
  border-left: v-bind(headerBorder);
}

.element-table tr th:first-child {
  border-right: v-bind(headerBorder);
}

/*HEADERS*/
.element-table th {
  font-weight: bold;
  font-size: 12px;
}

.element-table th.time-of-day {
  font-style: italic;
}

.element-table th.day {
  vertical-align: text-top;
  width: 80px;
}

.element-table th.sub-title {
  text-align: end;
  width: 100px;
  font-style: italic;
  font-weight: normal;
}

/*CHANGE COLORS*/
.element-table tbody:nth-child(even) {
  background-color: #f7f7f7;
}

.element-table tbody:nth-child(odd) {
  background-color: #ffffff;
}
</style>