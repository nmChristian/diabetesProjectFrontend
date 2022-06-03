<template>
  <div ref="div"></div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch, watchEffect} from "vue";
import type {Ref} from "vue";

import applySVG from "@/services/core/applySVG";
import iconGraph from "@/services/graphs/iconGraph";
import type {Point} from "@/services/core/datatypes";
import type {HealthLevel} from "@/services/core/shared";

const props = defineProps<{
  medianDataInHours : Point[],
  healthLevel : HealthLevel,
}>()

const div : Ref<HTMLDivElement | null> = ref(null)

// WatchEffects gets called immediately and when any of the variables in it changes
watchEffect(() => {
  const chart = iconGraph(props.medianDataInHours, props.healthLevel, {})
  applySVG(div, chart)
})

</script>
