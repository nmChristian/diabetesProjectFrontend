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

  overflow: auto;
  flex: 1;
  width: 100%;
}
.list{
  display: inline-block;
}
.info{
  display: inline-block;
}
</style>