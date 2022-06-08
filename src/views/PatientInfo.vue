<template>
  <button onclick="this.isScrolled = (!this.isScrolled);alert('is sclorred is ' + this.isScrolled)">Skift + {{test()}}</button>
  <div class = holderInfo >

    <h1>This is patient info for: {{$route.params.id}} </h1>

    <div class="infoItem startInfoHolderLine">
        <info-element @showData="showElementData('HbALc')" title="HbALc:" :number= 0></info-element>
        <info-element @showData="showElementData('Hypos')" title="Hypos:" :number= 1></info-element>
        <info-element @showData="showElementData('Hypos')" title="Hypos:" :number= 2></info-element>
        <info-element @showData="showElementData('Hypos')" title="Hypos:" :number= 3></info-element>
        <info-element @showData="showElementData('Hypos')" title="Hypos:" :number= 4></info-element>
        <info-element @showData="showElementData('Hypos')" title="Hypos:" :number= 5></info-element>
    </div>

    <div class="infoItem diagnoseAndMedicin">
      <p class="diagnoseAndMedicinLabels">Diagnose</p>
      <p class="diagnoseAndMedicinLabels">Medecin</p>

      <template v-for="diag in diagnoser">
        <p class="diagnoseAndMedicinItems">{{diag.name}}</p>

        <p class="diagnoseAndMedicinItems">{{test(diag.medecin)}}</p>
      </template>
    </div>
 </div>


</template>

<script setup>

import {ref} from "vue";

function test(inListe){
  let re =""

  if(inListe ===undefined ){
    return ""
  }


  for (let i = 0 ; i < inListe.length; i++){
    re += String(inListe[i])
    if(i < inListe.length-1){
      re+= ", "
    }
  }


  return re;
}

const diagnoser = [
  {name: "Type 2 diabetis" , medecin: [
      "Insulin ting", "Andre insulin ting"
    ]},
  {name: "type 100 diaB", medecin: [
      "Ting 1" , "Ting 2", "ting 3"
    ]}
]

</script>


<style scoped>

.infoItem{
  padding: 10px;
  width:100%;
  border: solid 1px #555;
  background-color: #fcfcfc;
  box-shadow:  0 0 10px  rgba(0,0,0,0.6);
  -moz-box-shadow: 0 0 10px  rgba(0,0,0,0.6);
  -webkit-box-shadow: 0 0 10px  rgba(0,0,0,0.6);
  -o-box-shadow: 0 0 10px  rgba(0,0,0,0.6);
  border-radius:25px;
  margin: 10px;
}

.diagnoseAndMedicin{
  display: grid;
  grid-template-columns: auto auto;
}

.diagnoseAndMedicinLabels{
  font-size: 30px;
  text-decoration: underline rgba(128, 128, 128, 0.62);
}

.diagnoseAndMedicinItems{
  font-size: 15px;

}

.startInfoHolderLine{
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
}

.holderInfo{
  padding: 2rem;
  margin: auto;
 width: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>