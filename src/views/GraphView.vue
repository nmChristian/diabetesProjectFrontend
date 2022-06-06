<template>
  <div class="graphdiv">

    <GraphWrapper
      :user="user"
    />
  </div>
</template>

<script setup lang="ts">



import {User} from "@/services/user";

import GraphWrapper from "@/components/graphview/GraphWrapper.vue";


const user = new User(0, "Alexander", 66)



</script>

<style>

</style>