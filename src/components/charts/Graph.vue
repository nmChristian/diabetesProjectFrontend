<!-- Author: Jonas -->
<!-- Description: Assigns the given SVG element to the div -->
<template>
  <div ref="div"></div>
</template>

<script lang="ts" setup>
import type {Ref} from "vue";
import {ref, watchEffect} from "vue";
import type {SVG} from "@/services/graphs/drawers/svg-drawer";

const div: Ref<HTMLDivElement | null> = ref(null)
const props = defineProps<{
  svg: SVG
}>()

// WatchEffects gets called immediately and when any of the variables in it changes
watchEffect(() => {
  div.value?.children[0]?.remove();
  div.value?.append(props.svg.node() ?? "")
})
</script>

<style scoped>
</style>