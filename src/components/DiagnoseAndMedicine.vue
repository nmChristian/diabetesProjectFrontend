<template>
  <div class="diagnoseAndMedicine">
    <div class="diagnosesHeaderWithButon">
      <p class="diagnoseAndMedicinLabels">Diagnoses</p>

      <button
          v-if="isDoctor && showAdvanced"
          @click="oneAddNewDiag">+</button>
    </div>
    <p class="diagnoseAndMedicinLabels">Medicine</p>

    <template v-if="data && data.length !==0" v-for="(diag,mdecinIndex) in data">

      <div class="medicine-line" @mouseover="howeringElement(mdecinIndex,0)" >
        <p class="diagnoseAndMedicinItems">{{ diag.name }}</p>

        <div class="editButton"
                v-if="currentHowever.x=== mdecinIndex && currentHowever.y === 0 && isDoctor && showAdvanced">
          <button>Edit</button>
          <button @click="deleteDiagnose(mdecinIndex)">Delete {{mdecinIndex}}</button>
        </div>

      </div>

      <div @mouseover="howeringElement(mdecinIndex,1)" class="medicine-line">
        <template v-for="(item,index) in diag.medicine">
          <div>
            <p>{{item}}</p>
          </div>
          <p v-if="index !== diag.medicine.length-1" style="padding-right:5px;">, </p>
        </template>

        <button class="editButton"
                @click="alert('hej')"
                v-if="currentHowever.x=== mdecinIndex && currentHowever.y === 1 && isDoctor && showAdvanced">edit</button>

      </div>

    </template>
    <p v-else>No diagnoses registered for this patient</p>

    <input v-model="diagnoseInputText" v-if="addingNew" type="text" class="inputFieldForMedAndDia">

    <input v-model="medicineInputText"
           v-if="addingNew"
           type="text"
           placeholder="Seperate all medecin with a ','"
           class="inputFieldForMedAndDia">

    <button v-if="addingNew" @click="onSavePressed()" style="width: min-content;">Save</button>

  </div>

</template>

<script setup lang="ts">

import type {Diagnosis} from "@/services/core/dbtypes";
import {computed, ref} from "vue";
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

const currentHowever = ref({x:-1,y:-1})

function howeringElement(index : number, textType : textTypes){
  currentHowever.value = {x: index, y: textType}
}

const emit = defineEmits<{
  (e: 'updateDiagnose'): void}>()

const addingNew = ref(false)
const diagnoseInputText = ref("")
const medicineInputText =ref("")

function oneAddNewDiag(){
  addingNew.value = true
  diagnoseInputText.value = ""
  medicineInputText.value = ""
}

function deleteDiagnose(index: number){
  backend.deleteDiagnosis(props.data[index]._id.$oid).then((response) => {
    emit("updateDiagnose")
  })

}

function medecinToList(medecinAsString : string) : string[]{
  let re = medecinAsString.split(',')
  for(let i = 0; i < re.length; i++){
    re[i] = re[i].trim()
  }
  return re
}

function onSavePressed(){
  if(diagnoseInputText.value ==="") return
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
.diagnoseAndMedicine {
  width: 100%;
  margin: 10px;
  display: grid;
  grid-template-columns: auto auto;
  row-gap: 5px;
}
.editButton{
  position: absolute;
  right: 10px;
  margin-left: 10px
}
.diagnoseAndMedicine {
  display: grid;
  grid-template-columns: auto auto;
}
.medicine-line{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.diagnosesHeaderWithButon{
  display: grid;
  grid-template-columns: min-content min-content;
  column-gap: 10px;
}
.inputFieldForMedAndDia{
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