<!-- Author: Christian, Jonas -->
<!-- Description: A small box containing a value with a title and a unit -->
<template>
  <div class="info-box">
    <div class="inner-box">
      <p class="title">{{ title }}</p>
      <p class="number">{{ value }} <span class="unit"> {{ unit }} </span></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";

const props = defineProps<{
  title: string,
  value: string,
  unit?: string,
}>()
</script>

<style scoped>
.info-box {
  flex: 1;
}

.inner-box {
  padding: 5px;
}

.title {
  font-weight: bold;
  font-size: 1em;
  color: #181818;
}

.number {
  font-size: 2em;
  color: #181818;
}

.unit {
  font-size: .5em;
  color: #555;
}

</style>