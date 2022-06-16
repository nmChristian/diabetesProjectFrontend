<template>
  <div :id="id"
       @click="emit('selectedSection', id)"
       :class="currentlySelected !== id ? 'infoItem' : 'infoItemSelected'">
    <slot />
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
.infoItem {
  max-width: 1200px;
  padding: 10px;
  width: 100%;
  border: solid 1px #555;
  min-width: 1020px;
  background-color: #fcfcfc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -o-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 25px;
  margin: 10px;
}

.infoItemSmall {
  width: min-content;
  border: solid 1px #555;
  background-color: #fcfcfc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -o-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 25px;
  margin: 10px;
}

.infoItemSmall:hover {
  box-shadow: 0 0 20px black;
}

.infoItem:hover {
  box-shadow: 0 0 20px black;
}

.infoItemSelected {
  padding: 10px;
  width: 100%;
  border: solid 1px #555;
  min-width: 1300px;;
  max-width: calc(100% - 320px);
  background-color: #fcfcfc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -o-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 25px;
  margin: 10px;
}
</style>