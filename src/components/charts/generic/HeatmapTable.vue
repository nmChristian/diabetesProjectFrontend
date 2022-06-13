<template>
  <div ref="table"></div>
</template>

<script lang="ts" setup>

import type {Ref} from "vue";
import {ref, watchEffect} from "vue";
import heatmapTable from "@/services/graphs/generic/heatmapTable";

const table : Ref<HTMLDivElement | null> = ref(null)


const props = defineProps<{
  elements : [Date, number[]][]
}>()

watchEffect(() => {
  table.value?.children[0]?.remove();
  table.value?.append(heatmapTable(props.elements))
})

</script>

<style>
.heatmap {
  border: 2px solid grey;
  border-collapse: collapse;
}
.heatmap td {
  width: 60px;
  text-align: right;
  font-weight: bold;
  color: white;
  padding: 2px 5px;
  font-size: 16px;
}
.heatmap tr {
  border: 1px solid black;
}
.heatmap tr * {
}
.heatmap th {
  font-weight: bold;
  font-size: 12px;
}

.heatmap .time-of-day {
  font-style: italic;
}

.heatmap .day {
  width: 80px;
}
.heatmap tr:nth-child(odd) {
  background-color: #f9f9f9;
}
.heatmap tr:nth-child(even) {
  background-color: #ffffff;
}
</style>