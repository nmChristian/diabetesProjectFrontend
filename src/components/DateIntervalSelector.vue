<template>
  <div class="date-interval">
    <p>{{ text }}</p>
    <!-- Add option to select the time interval here -->
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  text: string,
}>()

</script>

<style scoped>
.date-interval {
  top: 5px;
  right: 5px;
  position: absolute;
  font-size: 1em;
  font-style: italic;
}

.date-interval p {
  text-align: end;
  opacity: 0.8;
}

.date-interval select {
  font-size: 1em;
  text-align: center;
  width: 200px;
  height: 35px;
  border-radius: 5px;
}
</style>