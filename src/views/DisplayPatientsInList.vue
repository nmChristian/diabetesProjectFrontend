<template>
  <div class="holder">
    <PatientsFullList class="list">

    </PatientsFullList>

    <div class="info">
      <RouterView />
      <h1>{{$route.params.id}}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.holder{
  border: green dashed 1px;
  overflow: auto;
  flex: 1;
  width: 100%;
}
.list{
  border: red solid 1px;
  display: inline-block;
}
.info{
  display: inline-block;
  border: blue solid 1px;
}
</style>