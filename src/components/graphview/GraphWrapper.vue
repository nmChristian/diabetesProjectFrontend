<template>
  <div>
    <nav>
      <router-link :to="{name: 'graphview.icontest'}">Icon Test</router-link>
      <router-link :to="{name: 'graphview.linetest'}">Line Test</router-link>
      <router-link :to="{name: 'graphview.quantiletest'}">Quantile Test</router-link>

    </nav>

    <div class="user-info">
      {{theUser}}
      <h2>Welcome {{user.name}} </h2>
      <p class="user-id"> with id {{user.id}}</p>
    </div>

    <router-view/>
  </div>
</template>

<script setup lang="ts">
import type {User} from "@/services/user";
import {computed} from "vue";
const props = defineProps<{
  user: User,
}>()

const theUser = computed(() => { console.log("Reloading user"); return props.user })
</script>


<style scoped>
.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>