<template>
  <div ref="div"></div>
</template>

<script setup lang="ts">

import type {Ref} from "vue";
import {ref, watchEffect} from "vue";
import applySVG from "@/services/core/applySVG";

const div : Ref<HTMLDivElement | null> = ref(null)
const props = defineProps<{
  svg : SVGSVGElement
}>()

// WatchEffects gets called immediately and when any of the variables in it changes
watchEffect(() => applySVG(div, props.svg))
</script>
