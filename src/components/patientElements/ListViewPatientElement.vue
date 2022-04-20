<template>
  <div
      class="outerHolder"
      v-bind:class ="{outerHolderSelected:selected}" >
    <div class="icon">
      <IconGraph
          :median-data="this.$props.data"
          :status="status"></IconGraph>
      <!--<img src="@/assets/logo.svg" class="icon"> -->
    </div>
    <div class="generalInfo">
      <p class="name">{{name}}</p>
      <p v-if="doctor" class="cprNumber">{{cpr}}</p>
      <p v-else class="age">alder: {{age.toString()}} år</p>
    </div>
  </div>
</template>

<script setup lang = "ts">
import {computed} from 'vue'
import cgm from "@/assets/demo/cgm.json";
import {CGMData} from "@/services/graphs/graphs";


</script>

<script lang = "ts">
  export default {
    name: "ListViewPatientElement",
    props: {
      id: Number,
      name: String,
      cpr: String,
      age: Number,
      data: {
        type: Object
      },
      doctor: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      },
      status: Number,

    }
  }
</script>

<style scoped>
  .outerHolder{
    width:300px;height:80px;
    border: solid 1px #555;
    flex: 1;
    display: flex;
    background-color: #ffffff;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    margin-bottom: 1px;
  }
  .outerHolder:hover{
    background-color: #ececec;
  }
  .outerHolderSelected{
    width:305px;height:80px;
    border: solid 1px #555;
    margin-top: 3px;
    margin-bottom: 3px;
    flex: 1;
    display: flex;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #ececec;
  }
  .generalInfo{
    padding: 10px;
  }
  .icon{
    width:90px;height:70px;
    padding: 5px;
    place-self: center;
    display: inline;
  }
  .name{
    display: block;
    color: #181818;
    font-size: 22px;
  }
  .cprNumber{
    font-size: 18px;
    color: #757474;
    display: block;
  }
  .age{
    font-size: 18px;
    color: #757474;
    display: block;
  }
</style>