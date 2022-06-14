<template>
  <div ref="table"></div>
</template>

<script lang="ts" setup>

import type {Ref} from "vue";
import {ref, watchEffect} from "vue";
import elementTable from "@/services/graphs/generic/elementTable";

const table : Ref<HTMLDivElement | null> = ref(null)


const props = defineProps<{
  elements : [Date, number[][]][]
}>()

watchEffect(() => {
  table.value?.children[0]?.remove();
  table.value?.append(elementTable(props.elements))
})

</script>

<style>
:root {
  --element-border-color: rgba(128, 128, 128, 0.4);
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
.elementTable tr {
  border: 1px solid var(--element-border-color);
}
.elementTable tr * {
  border-right: 1px solid var(--element-border-color);
}
.elementTable th {
  font-weight: bold;
  font-size: 12px;
}

.elementTable .time-of-day {
  font-style: italic;
}

.elementTable .day {
  width: 80px;
}
.elementTable tr:nth-child(odd) {
  background-color: #f9f9f9;
}
.elementTable tr:nth-child(even) {
  background-color: #ffffff;
}
</style>