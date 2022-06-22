<!-- Author: Christian, Jonas -->
<!-- Description: Component that is used in Patient info, just a big box that fills the screen, emits and event when clicked and changes style -->
<template>
  <div :id="id"
       class="graph-section"
       @click="emit('selectedSection', id)"
       :class="[currentlySelected !== id ? 'infoItem' : 'infoItemSelected','graph-section']">
    <div class="slot">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  id: string,
  currentlySelected: string,
  daysBackOptions?: number[],
  showAdvanced?: boolean,
}>()
const emit = defineEmits<{
  (e: 'selectedSection', id: string): void
}>()
</script>

<style scoped>

.wrapper h1 {
  border: 1px solid red;
  text-align: center;
}
</style>