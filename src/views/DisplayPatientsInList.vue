<template>
  <div :class="{holder: !sidebarHidden, holderWithHiddenList: sidebarHidden}">
    <PatientsFullList :class="{list : !sidebarHidden, hidden: sidebarHidden}">

    </PatientsFullList>

    <div class="info" :style="paddingElements">
      <RouterView class="routerInfo" @hideSidebar="hideSidebar"/>
      <!--<h1>{{$route.params.id}}</h1> -->
    </div>
  </div>
</template>

<script lang="ts" setup>

import {computed, ref} from "vue";

let sidebarHidden = ref(false)

function hideSidebar(){
  sidebarHidden.value = !sidebarHidden.value
}

const paddingElements = computed(() => {
  if (sidebarHidden.value){
    return {'--space-needed-for-ist' : '0x'}
  }else {
    return {'--space-needed-for-ist' : '106px'}
  }
})

</script>

<style scoped>
.routerInfo {
  height: 100%;
  width: 100%;
}

.hidden{
  display: none;
}

.holderWithHiddenList{
  width: 100%;
  height: 100%;
}

.holder {
  display: grid;
  grid-template-columns: min-content min-content;
  width: 100%;
  height: 100%;
}

.list {
  min-width: 300px;;
}

.info {
  height: 100%;
  width: calc(100% - var(--space-needed-for-ist));
}
</style>