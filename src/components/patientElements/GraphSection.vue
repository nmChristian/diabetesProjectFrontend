<template>
  <div :id="id"
       @click="emit('selectedSection', id)"
       :class="currentlySelected !== id ? 'infoItem' : 'infoItemSelected'">
    <slot
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  id: string,
  currentlySelected : string,
}>()
const emit = defineEmits<{
    (e: 'selectedSection', id: string) : void
}>()
</script>

<style scoped>

</style>