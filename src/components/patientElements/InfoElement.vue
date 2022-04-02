<template>
  <div class="infoBox">
    <div class="inderBox" @click="showDataInternal()">
      <p class="title">{{title}}</p>
      <h1 class="number">{{number}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoElement",
  props: ['title','number'],
  methods:{
    showDataInternal(){
      console.log("Vi er i info elementet")
      this.$emit('showData')
    }
  }
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