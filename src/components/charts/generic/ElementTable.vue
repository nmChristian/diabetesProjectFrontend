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

</script>

<style>
:root {
  --element-data-border-color: rgba(128, 128, 128, 0.4);
  --element-header-border: 1px solid black;
}
.elementTable {
  border: 2px solid grey;
  border-collapse: collapse;
}

.elementTable td {
  width: 45px;
  text-align: right;
  font-weight: bold;
  color: white;
  padding: 2px 5px;
  font-size: 13px;
  opacity: 90%;
}


/*Borders through all columns */
.elementTable .col-data {
  border-left: 1px solid var(--element-data-border-color);
}
.elementTable .first-row, .elementTable .center-row {
  border-bottom: 1px solid var(--element-data-border-color)
}
.elementTable .last-row {
  border-top: 1px solid var(--element-data-border-color)
}

/*Big bold borders between each day*/
.elementTable tbody {
  border: var(--element-header-border)
}

/*Edges Border*/
.elementTable th:last-child {
  border-left: var(--element-header-border)
}
.elementTable tr th:first-child{
  border-right: var(--element-header-border)
}

/*HEADERS*/
.elementTable th {
  font-weight: bold;
  font-size: 12px;
}
.elementTable th.time-of-day {
  font-style: italic;
}
.elementTable th.day {
  vertical-align: text-top;
  width: 80px;
}
.elementTable th.sub-title {
  text-align: end;
  width: 100px;
  font-style: italic;
  font-weight: normal;
}

/*CHANGE COLORS*/
.elementTable tbody:nth-child(even) {
  background-color: #f7f7f7;
}
.elementTable tbody:nth-child(odd) {
  background-color: #ffffff;
}
</style>