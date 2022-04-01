<template>
  <div class="infoBox">
    <div class="inderBox" onclick="$emit('showData')">
      <p class="title">{{title}}</p>
      <button @click="$emit('showData')">Enlarge text</button>
      <h1 class="number">{{number}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoElement",
  props: ['title','number'],
  emits: ['showData']
}
</script>

<style scoped>
  .infoBox{
    flex: 1;
    padding: 5px;
  }
  .inderBox{
    padding: 5px;
  }
  .inderBox:hover{
    border: solid 1px #555;
    border-radius: 5px;
  }
  .title{
    color: #181818;
  }
  .number{
    color: #181818;
  }
</style>