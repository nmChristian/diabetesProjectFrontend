<template>
  <div class="holder">
    <PatientsFullList class="list">

    </PatientsFullList>

    <div class="info">
      <RouterView class="routerInfo"/>
      <!--<h1>{{$route.params.id}}</h1> -->
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.routerInfo {
  height: 100%;
  width: 100%;
}

.holder {
  display: grid;
  grid-template-columns: max-content auto;
  width: 100%;
  height: 100%;
}

.list {
}

.info {
  height: 100%;
}
</style>