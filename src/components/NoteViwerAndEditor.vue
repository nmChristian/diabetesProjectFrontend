<!-- Author: Christian -->
<!-- Description: Provides a module where notes and goals can be entered and shown, it has two mode depending on
                  the state of the variable showAdvanced -->
<template>
  <div class="noterMain">
    <div :class="showAdvanced ? 'leftContainer' : 'leftContainerNormal'">
      <div class="nodesHeaderBar">
        <p v-if="isDoctor" class="nodesHeader">Notes and goals</p>
        <p v-else class="nodesHeader">Goals</p>
        <!-- TODO format button -->
        <button v-if="showAdvanced && isDoctor" @click="clearField()" class="newNoteButton">New</button>
      </div>

      <div class="noteList">
        <template v-if="data.length===0">
          <p v-if="isDoctor">No notes registered for patient</p>
          <p v-else>No goals registered</p>
        </template>


        <template v-for="(item, index) in data">
          <div :class="index === selected ? 'noteItemselected' : 'noteItem'" @click="noteClicked(index)">
            <p>{{ item.timestamp.$date.slice(0, 10) }}</p>
            <p>{{ item.text.slice(0, 20) + "..." }}</p>
          </div>
        </template>
      </div>
    </div>
    <div v-if="showAdvanced" class="noteEditor" id="noteTextField">
      <textarea v-model="noteText" class="textField" :readonly="!isDoctor"></textarea>
      <div v-if="isDoctor">
        <button @click="onSaveClicked()">{{ selected === -1 ? 'Save as new' : 'Save edit' }}</button>
        <button v-if="selected !== -1" @click="deleteNote()">Delete note</button>
        <input type="checkbox" v-model="canBeeSeenByPatient">
        <label
            style="padding: 5px">{{ canBeeSeenByPatient ? 'Note is visible to patient' : "Note is not visible to patient" }}</label>
      </div>
    </div>
    <div v-else style="width: 0px"></div>
  </div>
</template>

<script setup lang="ts">

import type {Note} from "@/services/db-types";
import {ref} from "vue";
import backend from "@/services/backend";


const props = defineProps<{
  data: Note[],
  isDoctor: boolean,
  id: string,
  showAdvanced: boolean
}>()

const emit = defineEmits<{
  (e: 'updateNotes'): void
}>()


const selected = ref(-1)

const noteText = ref("")

const canBeeSeenByPatient = ref(false)

function deleteNote() {
  backend.deleteNote(props.data[selected.value]._id.$oid).then(() => {
    emit("updateNotes")
  })
  clearField()
}

function clearField() {
  selected.value = -1
  noteText.value = ""
  canBeeSeenByPatient.value = false
}

function onSaveClicked() {
  if (noteText.value === "") {
    return
  }
  if (selected.value === -1) {
    backend.postNote(props.id, noteText.value, !canBeeSeenByPatient.value).then((result) => {
      emit("updateNotes")
      clearField()
    })
  } else {
    backend.updateNote(props.data[selected.value]._id.$oid, noteText.value, !canBeeSeenByPatient.value).then(() => {
      emit("updateNotes")
    })
  }
  emit("updateNotes")
}

function noteClicked(index: number) {

  noteText.value = props.data[index].text;
  canBeeSeenByPatient.value = !props.data[index].private
  selected.value = index;
}
</script>

<style scoped>
.noteEditor {
  width: 100%;
  height: 500px;
}

.nodesHeaderBar {
  border-bottom: 2px black solid;
  width: 100%;
}

.nodesHeader {
  font-size: 30px;
}

.newNoteButton {
  position: absolute;
  right: 10px;
  top: 15px;
}

.textField {
  height: 90%;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  text-align: start;
  resize: none;
}

.noterMain {
  display: grid;
  width: 100%;
  grid-template-columns: min-content auto;
}

.noteItem {
  width: 100%;
  border-bottom: 1px black solid;
  padding-bottom: 10px;
}

.noteItemselected {
  width: 100%;
  border-bottom: 1px black solid;
  padding-bottom: 10px;
  background-color: lightsteelblue;
}

.leftContainer {
  min-width: 300px;
  padding: 10px;
  height: 500px;
}

.leftContainerNormal {
  min-width: 300px;
  width: 100%;
  padding: 10px;
  height: 200px;
}

.noteList {
  min-width: 300px;
  margin: 10px 0 10px 10px;
  height: 100%;
  max-height: calc(100% - 55px);
  overflow: auto;
  border-right: 1px black solid;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: lightgray;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: grey;
}


</style>