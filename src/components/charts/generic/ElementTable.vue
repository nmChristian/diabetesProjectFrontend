<template>
  <div ref="table"></div>
</template>

<script lang="ts" setup>
import type {Ref} from "vue";
import {ref, watchEffect} from "vue";
import {elementTable} from "@/services/graphs/generic/elementTable";
import type {ElementRow} from "@/services/graphs/generic/elementTable";

const table : Ref<HTMLDivElement | null> = ref(null)


const props = defineProps<{
  elements : [Date, ElementRow[]][]
  columns : number[]
}>()

watchEffect(() => {
  table.value?.children[0]?.remove();
  table.value?.append(elementTable(props.elements, props.columns))
})

const dataBorder = "1px solid rgba(128, 128, 128, 0.4)"
const headerBorder = "1px solid black"
</script>

<style>
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
.element-table tr th:first-child{
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
.elementTable tbody:nth-child(odd) {
  background-color: #ffffff;
}
</style>