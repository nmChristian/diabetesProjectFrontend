<template>
  <div ref="div"></div>
</template>

<script setup lang="ts">
import type {Ref} from "vue";
import {ref, watchEffect} from "vue";

import applySVG from "@/services/core/applySVG";
import iconGraph from "@/services/graphs/iconGraph";
import type {Point} from "@/services/core/datatypes";
import type {HealthLevel} from "@/services/core/shared";
import type {GraphLayout} from "@/services/core/graphtypes";

const div : Ref<HTMLDivElement | null> = ref(null)

const props = defineProps<{
  medianDataInHours : Point[],
  healthLevel : HealthLevel,
  graphLayout? : GraphLayout,
}>()


// WatchEffects gets called immediately and when any of the variables in it changes
watchEffect(() => {
  const chart = iconGraph(props.medianDataInHours, props.healthLevel, { graphLayout : props.graphLayout })
  applySVG(div, chart)
})

</script>
