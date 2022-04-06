<template>

</template>

<script setup lang="ts">
import Vue from 'vue-class-component'

export class IconGraph extends Vue {
  // Initial data can be declared as instance properties
  message: string = 'Hello!'

  // Component methods can be declared as instance methods
  onClick (): void {
    window.alert(this.message)
  }
}
</script>

<style scoped>

</style>