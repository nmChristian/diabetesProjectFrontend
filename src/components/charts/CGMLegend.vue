<template>
  <p style="font-weight: bold">CGM Legend</p>
  <div class="cgm-legend">
    <div v-for="(color,i) in COLOR_SCHEME" :style="{borderRight:'10px solid ' + color}">
      <p class="color-legend">
        {{ CGM_THRESHOLDS[i].x0 + "-" + (CGM_THRESHOLDS[i].x1 ?? "") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";
const props = defineProps<{

}>()

</script>

<style scoped>
.cgm-legend {
  display: flex;
  flex-direction: column-reverse;
  align-items: end;
  width: 120px;
  padding: 5px 10px;
}

.cgm-legend > div {
  height: 30px;
  margin: 5px 0;
  border: 1px dashed rgba(0, 0, 0, 50%);
  border-radius: 5px;

}

p.color-legend {
  padding: 0 5px;
  font-weight: bold;
  font-style: italic;
  font-size: 16px;
  text-align: end;
}
</style>