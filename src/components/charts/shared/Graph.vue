<template>
  <div ref="div"></div>
</template>

<script lang="ts" setup>
import type {Ref} from "vue";
import {compile, computed, ref, watchEffect} from "vue";

const div: Ref<HTMLDivElement | null> = ref(null)
const props = defineProps<{
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined>
}>()

// WatchEffects gets called immediately and when any of the variables in it changes
watchEffect(() => {
  div.value?.children[0]?.remove();
  div.value?.append(props.svg.node() ?? "")
})
</script>

<style scoped>
</style>