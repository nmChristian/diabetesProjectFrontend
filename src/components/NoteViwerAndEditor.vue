<template>
  <div class="noterMain">
    <div class="noteList">
      <template v-for="(item, index) in data">
        <div class="noteItem" @click="noteClicked(index)">
          <p>{{item.timestamp.$date.slice(0,10)}}</p>
          <p>{{item.text.slice(0,20) + "..."}}</p>
        </div>
      </template>
    </div>
    <div class="noteEditor" id="noteTextField">
      <textarea  v-model="noteText" class="textField" :readonly="!isDoctor"></textarea>
      <button @click="onSaveClicked()">Save</button>
      <input type="checkbox" v-model="canBeeSeenByPatient">
    </div>
  </div>
</template>

<script setup lang="ts">

import type {Note} from "@/services/core/dbtypes";
import {ref} from "vue";
import backend from "@/services/backend";


const props = defineProps<{
      data: Note[],
      isDoctor: boolean,
      id: string
}>()

const selected = ref(-1)

const noteText = ref("")

const canBeeSeenByPatient = ref(false)

function onSaveClicked(){
  backend.postNote(props.id,noteText.value,canBeeSeenByPatient.value)
}

function noteClicked(index : number){

  noteText.value = props.data[index].text;
  selected.value = index;
}

console.log(props.data)
</script>

<style scoped>
.noteEditor{
  width: 100%;
  height: 500px;
}
.textField{
  height: 80%;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  text-align: start;
}
.noterMain{
  display: grid;
  width: 100%;
  grid-template-columns: min-content auto;
}
.noteItem{
  width: 100%;
  border-bottom: 1px black solid;
}
.noteList{
  min-width: 300px;
  padding: 10px;
  margin: 10px;
  border-right: 1px black solid;
}


</style>