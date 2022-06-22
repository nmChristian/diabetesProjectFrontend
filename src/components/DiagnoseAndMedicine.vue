<!-- Author: Christian -->
<!-- Description: Provides a module where diagnoses and medicine can be entered and shown, it has two mode depending on
                  the state of the variable showAdvanced -->
<template>
  <div :class="showAdvanced ? 'diagnoseAndMedicineExtended' : 'diagnoseAndMedicine'">
    <div class="diagnosesHeaderWithButon">
      <p class="diagnoseAndMedicinLabels">Diagnoses</p>

      <button
          v-if="isDoctor && showAdvanced"
          @click="oneAddNewDiag">+
      </button>
    </div>
    <p class="diagnoseAndMedicinLabels">Medicine</p>

    <template v-if="data && data.length !==0" v-for="(diag,mdecinIndex) in data">

      <div class="medicine-line" @mouseover="howeringElement(mdecinIndex,0)">
        <p v-if="!(currentlyEdeting.x=== mdecinIndex && currentlyEdeting.y === 0 && isDoctor && showAdvanced)"
           class="diagnoseAndMedicinItems">{{ diag.name }}</p>
        <input v-else v-model="edetingValue" type="text" class="inputFieldForMedAndDia">

        <div class="editButton"
             v-if="currentHowever.x=== mdecinIndex && currentHowever.y === 0 && isDoctor && showAdvanced">
          <button v-if="currentlyEdeting.x !== mdecinIndex" @click="startEdeting(mdecinIndex,0)">Edit</button>
          <button
              @click="submitEdit(mdecinIndex,0)"
              v-else-if="currentlyEdeting.x=== mdecinIndex">Save
          </button>
          <button @click="deleteDiagnose(mdecinIndex)">Delete</button>
        </div>

      </div>

      <div @mouseover="howeringElement(mdecinIndex,1)" class="medicine-line">
        <template
            v-if="!(currentlyEdeting.x=== mdecinIndex && currentlyEdeting.y === 1 && isDoctor && showAdvanced)"
            v-for="(item,index) in diag.medicine">
          <div>
            <p>{{ item }}</p>
          </div>
          <p v-if="index !== diag.medicine.length-1" style="padding-right:5px;">, </p>
        </template>

        <input v-else v-model="edetingValue" type="text" class="inputFieldForMedAndDia">


        <button class="editButton"
                @click="startEdeting(mdecinIndex,1)"
                v-if="!(currentlyEdeting.x=== mdecinIndex) && currentHowever.x=== mdecinIndex && currentHowever.y === 1 && isDoctor && showAdvanced">
          edit
        </button>

        <button
            @click="submitEdit(mdecinIndex,1)"
            v-else-if="currentlyEdeting.x=== mdecinIndex && currentlyEdeting.y=== 1">Save
        </button>

      </div>

    </template>
    <p v-else-if="!addingNew || !showAdvanced">No diagnoses registered for this patient</p>

    <input v-model="diagnoseInputText" v-if="addingNew && showAdvanced" type="text" class="inputFieldForMedAndDia">

    <input v-model="medicineInputText"
           v-if="addingNew && showAdvanced"
           type="text"
           placeholder="Seperate all medecin with a ','"
           class="inputFieldForMedAndDia">

    <button v-if="addingNew && showAdvanced" @click="onSavePressed()" style="width: min-content;">Save</button>

  </div>

</template>

<script setup lang="ts">

import type {Diagnosis} from "@/services/db-types";
import {ref} from "vue";
import backend from "@/services/backend";

const props = defineProps<{
  data: Diagnosis[],
  isDoctor: boolean,
  id: string,
  showAdvanced: boolean
}>()

enum textTypes {
  diagnose,
  medicine
}

const currentHowever = ref({x: -1, y: -1})

function howeringElement(index: number, textType: textTypes) {
  currentHowever.value = {x: index, y: textType}
}

const emit = defineEmits<{
  (e: 'updateDiagnose'): void
}>()

const addingNew = ref(false)
const diagnoseInputText = ref("")
const medicineInputText = ref("")

const currentlyEdeting = ref({x: -1, y: -1})
const edetingValue = ref("")

function oneAddNewDiag() {
  addingNew.value = true
  diagnoseInputText.value = ""
  medicineInputText.value = ""
}

function deleteDiagnose(index: number) {
  backend.deleteDiagnosis(props.data[index]._id.$oid).then((response) => {
    emit("updateDiagnose")
  })
}

function startEdeting(index: number, textType: textTypes) {
  if (textType === textTypes.diagnose) {
    edetingValue.value = props.data[index].name
  } else if (textType === textTypes.medicine) {
    edetingValue.value = listToString(props.data[index].medicine)
  }
  currentlyEdeting.value = {x: index, y: textType}
}

function submitEdit(index: number, textType: textTypes) {
  if (textType === textTypes.diagnose && edetingValue.value === "") {
    return
  }
  let diagnose = ""
  let medecin = []
  if (textType == textTypes.diagnose) {
    medecin = props.data[index].medicine
    diagnose = edetingValue.value
  } else {
    medecin = medecinToList(edetingValue.value)
    diagnose = props.data[index].name
  }
  backend.editDiagnosis(props.data[index]._id.$oid, diagnose, medecin).then(() => {
    emit("updateDiagnose")
    edetingValue.value = ""
    currentlyEdeting.value = {x: -1, y: -1}
  })

}

function medecinToList(medecinAsString: string): string[] {
  let re = medecinAsString.split(',')
  for (let i = 0; i < re.length; i++) {
    re[i] = re[i].trim()
  }
  return re
}

function listToString(inListe: string | any[] | undefined) {
  let re = ""
  if (inListe === undefined) {
    return ""
  }
  for (let i = 0; i < inListe.length; i++) {
    re += String(inListe[i])
    if (i < inListe.length - 1) {
      re += ", "
    }
  }
  return re;
}

function onSavePressed() {
  if (diagnoseInputText.value === "") return
  backend.saveNewDiagnosis(
      props.id,
      diagnoseInputText.value,
      medecinToList(medicineInputText.value)).then(() => {
        emit("updateDiagnose")
        diagnoseInputText.value = ""
        medicineInputText.value = ""
        addingNew.value = false
      }
  )
}


</script>

<style scoped>
.diagnoseAndMedicineExtended {
  width: 100%;
  margin: 10px;
  display: grid;
  grid-template-columns: auto auto;
  row-gap: 5px;
}

.diagnoseAndMedicine {
  width: 100%;
  margin: 10px;
  display: grid;
  grid-template-columns: auto auto;
  row-gap: 5px;
  overflow: auto;
  max-height: calc(100% - 25px);
  max-width: calc(100% - 25px);
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

.editButton {
  position: absolute;
  right: 10px;
  margin-left: 10px
}

.diagnoseAndMedicine {
  display: grid;
  grid-template-columns: auto auto;
}

.medicine-line {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.diagnosesHeaderWithButon {
  display: grid;
  grid-template-columns: min-content min-content;
  column-gap: 10px;
}

.inputFieldForMedAndDia {
  width: 80%;
}

.diagnoseAndMedicinLabels {
  font-size: 30px;
  text-decoration: underline rgba(128, 128, 128, 0.62);
}

.diagnoseAndMedicinItems {
  font-size: 15px;

}

</style>