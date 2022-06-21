<!-- Author: Christian -->
<!-- Description: Shows a list of all patients available to the user and lets you select one to get more information about -->
<template>
  <div :class="{holder: !sidebarHidden, holderWithHiddenList: sidebarHidden}">
    <PatientsFullList :class="{list : !sidebarHidden, hidden: sidebarHidden}">

    </PatientsFullList>

    <div class="info">
      <RouterView class="routerInfo" @hideSidebar="hideSidebar"/>
      <!--<h1>{{$route.params.id}}</h1> -->
    </div>
  </div>
</template>

<script lang="ts" setup>

import {ref} from "vue";

let sidebarHidden = ref(false)

function hideSidebar() {
  sidebarHidden.value = !sidebarHidden.value
}


</script>

<style scoped>
.routerInfo {
  height: 100%;
  width: 100%;
}

.hidden {
  display: none;
}

.holderWithHiddenList {
  width: 100%;
  height: 100%;
}

.holder {
  display: grid;
  grid-template-columns: min-content auto;
  width: 100%;
  height: 100%;
}

.list {
  min-width: 300px;;
}

.info {
  height: 100%;
  width: 100%;
}
</style>